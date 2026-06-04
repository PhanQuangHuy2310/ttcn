// src/features/authentication/authenticationSlice.ts
// Redux Slice quản lý trạng thái Đăng nhập/Đăng ký của người dùng trong ứng dụng.

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';

// ── Định nghĩa kiểu dữ liệu (Types) ─────────────────────────────

/**
 * Định nghĩa cấu trúc thông tin người dùng (Profile).
 */
interface Profile {
  id:           string; // ID định danh duy nhất của Supabase Auth
  email:        string; // Địa chỉ email đăng nhập
  full_name:    string | null; // Họ và tên đầy đủ
  role:         'ADMIN' | 'TEACHER' | 'STUDENT'; // Vai trò phân quyền trong hệ thống
  student_id:   string | null; // Mã số học sinh (chỉ áp dụng cho học sinh)
  teacher_code: string | null; // Mã số giáo viên (chỉ áp dụng cho giáo viên)
  created_at:   string; // Ngày tạo tài khoản
}

/**
 * Định nghĩa trạng thái lưu trữ của Authentication (AuthState) trong Redux Store.
 */
interface AuthState {
  isAuthenticated: boolean; // Trạng thái đã đăng nhập hay chưa (true/false)
  profile:         Profile | null; // Lưu trữ hồ sơ người dùng nếu đã đăng nhập thành công
  loading:         boolean; // Biến trạng thái để hiển thị Spinner khi đang gọi API
  error:           string | null; // Chứa thông điệp báo lỗi từ server nếu xảy ra lỗi
}

// Trạng thái khởi tạo mặc định khi ứng dụng mới chạy
const initialState: AuthState = {
  isAuthenticated: false,
  profile:         null,
  loading:         false,
  error:           null,
};

// ── Tác vụ bất đồng bộ Thunks (Async Thunks) ───────────────────

/**
 * Thunk xử lý đăng nhập bằng Email và Mật khẩu.
 * 
 * GIẢI THÍCH CHO NGƯỜI MỚI HỌC:
 * - createAsyncThunk dùng để thực hiện các thao tác bất đồng bộ (gọi API qua mạng).
 * - Đầu vào: tham số email, password và object rejectWithValue (dùng để trả lỗi tùy chỉnh khi thất bại).
 * - Hàm này sẽ gửi yêu cầu xác thực sang Supabase Auth. Nếu đăng nhập thành công, tiếp tục truy vấn bảng `users`
 *   để lấy đầy đủ thông tin phân vai trò (role) của tài khoản đó.
 */
export const loginThunk = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    // 1. Xác thực tài khoản qua Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    
    // Nếu có lỗi từ Supabase, chuyển tiếp thông báo lỗi về reducer xử lý
    if (authError || !authData.user) {
      return rejectWithValue(authError?.message ?? 'Đăng nhập thất bại');
    }

    // 2. Truy vấn dữ liệu người dùng tương ứng từ bảng 'users' (chứa thông tin vai trò, tên đầy đủ)
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('id, email, full_name, role, student_id, teacher_code, created_at, is_active, status')
      .eq('id', authData.user.id)
      .single(); // Lấy duy nhất 1 bản ghi

    if (profileError || !profile) {
      return rejectWithValue('Không tìm thấy thông tin hồ sơ. Vui lòng liên hệ quản trị viên.');
    }

    // Kiểm tra trạng thái kích hoạt của tài khoản
    if (profile.is_active === false || profile.status === 'INACTIVE') {
      await supabase.auth.signOut(); // Xóa phiên đăng nhập trên client để tránh tự động khôi phục
      return rejectWithValue('Tài khoản đã bị vô hiệu hóa, vui lòng liên hệ admin để biết thêm chi tiết');
    }
    
    // Trả về dữ liệu profile để tự động cập nhật vào Redux State (fulfilled)
    return profile as Profile;
  }
);

/**
 * Thunk phục hồi phiên làm việc (Session) của người dùng mỗi khi tải lại trang web.
 * GIẢI THÍCH: Tránh việc người dùng F5 trình duyệt sẽ bị thoát đăng nhập. 
 * Hàm này đọc JWT Token tự động được lưu trong LocalStorage của trình duyệt và gửi lên Supabase kiểm tra tính hợp lệ.
 */
export const restoreSessionThunk = createAsyncThunk(
  'auth/restoreSession',
  async (_, { rejectWithValue }) => {
    // Lấy phiên làm việc hiện tại
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
      return rejectWithValue('Phiên làm việc không tồn tại hoặc đã hết hạn.');
    }

    // Tải thông tin cá nhân từ bảng users
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('id, email, full_name, role, student_id, teacher_code, created_at, is_active, status')
      .eq('id', session.user.id)
      .single();

    if (profileError || !profile) {
      return rejectWithValue('Hồ sơ người dùng không tìm thấy');
    }

    // Kiểm tra trạng thái kích hoạt của tài khoản
    if (profile.is_active === false || profile.status === 'INACTIVE') {
      await supabase.auth.signOut(); // Đăng xuất để xóa session hiện tại
      return rejectWithValue('Tài khoản đã bị vô hiệu hóa, vui lòng liên hệ admin để biết thêm chi tiết');
    }
    return profile as Profile;
  }
);

/**
 * Thunk xử lý đăng xuất (Logout).
 * Gửi yêu cầu đăng xuất lên Supabase để thu hồi token hiện tại.
 */
export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async () => {
    await supabase.auth.signOut();
  }
);

// ── Định nghĩa Slice (Reducers & Actions) ─────────────────────
const authenticationSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Cho phép cập nhật hồ sơ người dùng cục bộ (Ví dụ: Khi học sinh sửa tên trong trang Profile)
    // mà không cần phải truy vấn lại API từ đầu.
    setProfile: (state, action: PayloadAction<Profile>) => {
      state.profile = action.payload;
    },
    // Xóa thông điệp báo lỗi hiện tại
    clearError: (state) => {
      state.error = null;
    },
  },
  
  // extraReducers chịu trách nhiệm lắng nghe kết quả trả về của các Async Thunk phía trên
  extraReducers: (builder) => {
    // 1. Theo dõi tiến trình đăng nhập (loginThunk)
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true; // Bật màn hình chờ
        state.error   = null; // Xóa lỗi cũ
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading         = false; // Tắt màn hình chờ
        state.isAuthenticated = true;  // Đánh dấu đã xác thực thành công
        state.profile         = action.payload; // Gán hồ sơ người dùng
        state.error           = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload as string; // Lưu lại lỗi thất bại
      });

    // 2. Theo dõi tiến trình phục hồi phiên làm việc (restoreSessionThunk)
    builder
      .addCase(restoreSessionThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(restoreSessionThunk.fulfilled, (state, action) => {
        state.loading         = false;
        state.isAuthenticated = true;
        state.profile         = action.payload;
      })
      .addCase(restoreSessionThunk.rejected, (state) => {
        state.loading         = false;
        state.isAuthenticated = false;
        state.profile         = null;
      });

    // 3. Theo dõi tiến trình Đăng xuất (logoutThunk)
    builder
      .addCase(logoutThunk.fulfilled, (state) => {
        // Reset toàn bộ state về trạng thái chưa đăng nhập
        state.isAuthenticated = false;
        state.profile         = null;
        state.error           = null;
      });
  },
});

// Xuất các Actions thông thường
export const { setProfile, clearError } = authenticationSlice.actions;

// ── Khai báo các Selectors giúp các React Components dễ dàng lấy thông tin từ Redux Store
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectProfile         = (state: { auth: AuthState }) => state.auth.profile;
export const selectAuthLoading     = (state: { auth: AuthState }) => state.auth.loading;
export const selectAuthError       = (state: { auth: AuthState }) => state.auth.error;

// Xuất reducer để khai báo trong store.ts
export default authenticationSlice.reducer;
