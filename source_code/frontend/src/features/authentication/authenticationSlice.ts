// src/features/authentication/authenticationSlice.ts
// Extended original slice with setProfile action for local profile updates.

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';

// ── Types ─────────────────────────────────────────────────────
interface Profile {
  id:           string;
  email:        string;
  full_name:    string | null;
  role:         'ADMIN' | 'TEACHER' | 'STUDENT';
  student_id:   string | null;
  teacher_code: string | null;
  created_at:   string;
}

interface AuthState {
  isAuthenticated: boolean;
  profile:         Profile | null;
  loading:         boolean;
  error:           string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  profile:         null,
  loading:         false,
  error:           null,
};

// ── Thunks ────────────────────────────────────────────────────

// Login with email + password
export const loginThunk = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError || !authData.user) return rejectWithValue(authError?.message ?? 'Login failed');

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('id, email, full_name, role, student_id, teacher_code, created_at')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !profile) return rejectWithValue('Profile not found. Contact administrator.');
    return profile as Profile;
  }
);

// Restore session on app load
export const restoreSessionThunk = createAsyncThunk(
  'auth/restoreSession',
  async (_, { rejectWithValue }) => {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) return rejectWithValue('No session');

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('id, email, full_name, role, student_id, teacher_code, created_at')
      .eq('id', session.user.id)
      .single();

    if (profileError || !profile) return rejectWithValue('Profile not found');
    return profile as Profile;
  }
);

// Logout
export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async () => {
    await supabase.auth.signOut();
  }
);

// ── Slice ─────────────────────────────────────────────────────
const authenticationSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Allows Profile.jsx to update name/student_id/teacher_code without re-fetching
    setProfile: (state, action: PayloadAction<Profile>) => {
      state.profile = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading         = false;
        state.isAuthenticated = true;
        state.profile         = action.payload;
        state.error           = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload as string;
      });

    // Restore session
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

    // Logout
    builder
      .addCase(logoutThunk.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.profile         = null;
        state.error           = null;
      });
  },
});

// ── Exports ───────────────────────────────────────────────────
export const { setProfile, clearError } = authenticationSlice.actions;

// Selectors
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectProfile         = (state: { auth: AuthState }) => state.auth.profile;
export const selectAuthLoading     = (state: { auth: AuthState }) => state.auth.loading;
export const selectAuthError       = (state: { auth: AuthState }) => state.auth.error;

export default authenticationSlice.reducer;
