import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import BaoMatPhanQuyenQuanTriVien from "./pages/Admin/BaoMatPhanQuyenQuanTriVien";
import CaiAtHeThongQuanTriVien from "./pages/Admin/CaiAtHeThongQuanTriVien";
import DashboardQuanTriVienDhdedu from "./pages/Admin/DashboardQuanTriVienDhdedu";
import DashboardQuanTriVienDhdeduVietHoaFontMoi from "./pages/Admin/DashboardQuanTriVienDhdeduVietHoaFontMoi";
import QuanLyNguoiDungQuanTriVien from "./pages/Admin/QuanLyNguoiDungQuanTriVien";
import BaoCaoChiTietLopHocGiaoVien from "./pages/Teacher/BaoCaoChiTietLopHocGiaoVien";
import BaoCaoThongKeGiaoVien from "./pages/Teacher/BaoCaoThongKeGiaoVien";
import CauHinhMaTranEThiGiangVien from "./pages/Teacher/CauHinhMaTranEThiGiangVien";
import ChamBaiGiaoVienMoRongKhungBaiLam from "./pages/Teacher/ChamBaiGiaoVienMoRongKhungBaiLam";
import ChiTietLopHocGiaoVien from "./pages/Teacher/ChiTietLopHocGiaoVien";
import DanhSachMaTranEThiGiangVien from "./pages/Teacher/DanhSachMaTranEThiGiangVien";
import DashboardGiaoVienDhdedu from "./pages/Teacher/DashboardGiaoVienDhdedu";
import DashboardGiaoVienDhdeduOngBoAzota from "./pages/Teacher/DashboardGiaoVienDhdeduOngBoAzota";
import DashboardGiaoVienDhdeduVietHoaFontMoi from "./pages/Teacher/DashboardGiaoVienDhdeduVietHoaFontMoi";
import DashboardGiaoVienOngBoUi from "./pages/Teacher/DashboardGiaoVienOngBoUi";
import KhoNoiDungGiangVien from "./pages/Teacher/KhoNoiDungGiangVien";
import NganHangCauHoiGiaoVien from "./pages/Teacher/NganHangCauHoiGiaoVien";
import NganHangEThiGiangVien from "./pages/Teacher/NganHangEThiGiangVien";
import NganHangEThiGiaoVienVietHoa from "./pages/Teacher/NganHangEThiGiaoVienVietHoa";
import QuanLyEThiGiaoVien from "./pages/Teacher/QuanLyEThiGiaoVien";
import TongHopKetQuaLopHocGiaoVien from "./pages/Teacher/TongHopKetQuaLopHocGiaoVien";
import ChiTietLopHocSinhVienVietHoaFontMoi from "./pages/Student/ChiTietLopHocSinhVienVietHoaFontMoi";
import DashboardSinhVienDhdeduAzotaStyle from "./pages/Student/DashboardSinhVienDhdeduAzotaStyle";
import HocFlashcardDhdedu from "./pages/Student/HocFlashcardDhdedu";
import HocFlashcardDhdeduVietHoa from "./pages/Student/HocFlashcardDhdeduVietHoa";
import LamBaiTrucTuyenDhdeduVietHoa from "./pages/Student/LamBaiTrucTuyenDhdeduVietHoa";
import LamBaiTrucTuyenSinhVien from "./pages/Student/LamBaiTrucTuyenSinhVien";
import LichSuLamBaiChiTietSinhVien from "./pages/Student/LichSuLamBaiChiTietSinhVien";
import LuyenTapTracNghiemSinhVien from "./pages/Student/LuyenTapTracNghiemSinhVien";
import NganHangBaiThiThuSinhVien from "./pages/Student/NganHangBaiThiThuSinhVien";
import ThongKeHocTapChiTietSinhVien from "./pages/Student/ThongKeHocTapChiTietSinhVien";
import TongQuanNguoiHocDhdeduVietHoaFontMoi from "./pages/Student/TongQuanNguoiHocDhdeduVietHoaFontMoi";
import TongQuanNguoiHocVietHoa from "./pages/Student/TongQuanNguoiHocVietHoa";
import XemLaiBaiLamChiTietSinhVien from "./pages/Student/XemLaiBaiLamChiTietSinhVien";
import XemLaiBaiLamSinhVienVietHoaFontMoi from "./pages/Student/XemLaiBaiLamSinhVienVietHoaFontMoi";
import XemTruocBaiThiSinhVien from "./pages/Student/XemTruocBaiThiSinhVien";
import BaoMatPhanQuyenDhdeduVietHoa from "./pages/Common/BaoMatPhanQuyenDhdeduVietHoa";
import CaiAtBaoMat2LopDhdedu from "./pages/Common/CaiAtBaoMat2LopDhdedu";
import ChiTietLopHocDhdeduAzotaStyle from "./pages/Common/ChiTietLopHocDhdeduAzotaStyle";
import ChiTietLopHocVietHoa from "./pages/Common/ChiTietLopHocVietHoa";
import HoSoCaNhanDhdedu from "./pages/Common/HoSoCaNhanDhdedu";
import HoSoCaNhanDhdeduVietHoa from "./pages/Common/HoSoCaNhanDhdeduVietHoa";
import LuyenTapTracNghiemDhdeduVietHoa from "./pages/Common/LuyenTapTracNghiemDhdeduVietHoa";
import PhanTichVaKeHoachTaiTaoGiaoDienDhdedu from "./pages/Common/PhanTichVaKeHoachTaiTaoGiaoDienDhdedu";
import QuanLyNguoiDungDhdeduVietHoa from "./pages/Common/QuanLyNguoiDungDhdeduVietHoa";
import XemTruocBaiThiDhdeduVietHoa from "./pages/Common/XemTruocBaiThiDhdeduVietHoa";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" />} />
        <Route
          path="/admin/securityadmin"
          element={<BaoMatPhanQuyenQuanTriVien />}
        />
        <Route
          path="/admin/system-settingsadmin"
          element={<CaiAtHeThongQuanTriVien />}
        />
        <Route
          path="/admin/dashboardadmin-dhdedu"
          element={<DashboardQuanTriVienDhdedu />}
        />
        <Route
          path="/admin/dashboardadmin-dhdedu-viet-hoa-font-moi"
          element={<DashboardQuanTriVienDhdeduVietHoaFontMoi />}
        />
        <Route
          path="/admin/usersadmin"
          element={<QuanLyNguoiDungQuanTriVien />}
        />
        <Route
          path="/teacher/bao-caoclass-detailsteacher"
          element={<BaoCaoChiTietLopHocGiaoVien />}
        />
        <Route
          path="/teacher/reportsteacher"
          element={<BaoCaoThongKeGiaoVien />}
        />
        <Route
          path="/teacher/exam-matrix-configteacher"
          element={<CauHinhMaTranEThiGiangVien />}
        />
        <Route
          path="/teacher/gradingteacher-mo-rong-khung-bai-lam"
          element={<ChamBaiGiaoVienMoRongKhungBaiLam />}
        />
        <Route
          path="/teacher/class-detailsteacher"
          element={<ChiTietLopHocGiaoVien />}
        />
        <Route
          path="/teacher/exam-matrixteacher"
          element={<DanhSachMaTranEThiGiangVien />}
        />
        <Route
          path="/teacher/dashboardteacher-dhdedu"
          element={<DashboardGiaoVienDhdedu />}
        />
        <Route
          path="/teacher/dashboardteacher-dhdedu-ong-bo-azota"
          element={<DashboardGiaoVienDhdeduOngBoAzota />}
        />
        <Route
          path="/teacher/dashboardteacher-dhdedu-viet-hoa-font-moi"
          element={<DashboardGiaoVienDhdeduVietHoaFontMoi />}
        />
        <Route
          path="/teacher/dashboardteacher-ong-bo-ui"
          element={<DashboardGiaoVienOngBoUi />}
        />
        <Route
          path="/teacher/content-libraryteacher"
          element={<KhoNoiDungGiangVien />}
        />
        <Route
          path="/teacher/question-bankteacher"
          element={<NganHangCauHoiGiaoVien />}
        />
        <Route
          path="/teacher/exam-bankteacher"
          element={<NganHangEThiGiangVien />}
        />
        <Route
          path="/teacher/exam-bankteacher-viet-hoa"
          element={<NganHangEThiGiaoVienVietHoa />}
        />
        <Route path="/teacher/examsteacher" element={<QuanLyEThiGiaoVien />} />
        <Route
          path="/teacher/reports-lop-hocteacher"
          element={<TongHopKetQuaLopHocGiaoVien />}
        />
        <Route
          path="/student/class-detailsstudent-viet-hoa-font-moi"
          element={<ChiTietLopHocSinhVienVietHoaFontMoi />}
        />
        <Route
          path="/student/dashboardstudent-dhdedu-azota-style"
          element={<DashboardSinhVienDhdeduAzotaStyle />}
        />
        <Route
          path="/student/flashcards-dhdedu"
          element={<HocFlashcardDhdedu />}
        />
        <Route
          path="/student/flashcards-dhdedu-viet-hoa"
          element={<HocFlashcardDhdeduVietHoa />}
        />
        <Route
          path="/student/online-exam-dhdedu-viet-hoa"
          element={<LamBaiTrucTuyenDhdeduVietHoa />}
        />
        <Route
          path="/student/online-examstudent"
          element={<LamBaiTrucTuyenSinhVien />}
        />
        <Route
          path="/student/history-chi-tietstudent"
          element={<LichSuLamBaiChiTietSinhVien />}
        />
        <Route
          path="/student/practicestudent"
          element={<LuyenTapTracNghiemSinhVien />}
        />
        <Route
          path="/student/mock-examsstudent"
          element={<NganHangBaiThiThuSinhVien />}
        />
        <Route
          path="/student/statistics-chi-tietstudent"
          element={<ThongKeHocTapChiTietSinhVien />}
        />
        <Route
          path="/student/overviewstudent-dhdedu-viet-hoa-font-moi"
          element={<TongQuanNguoiHocDhdeduVietHoaFontMoi />}
        />
        <Route
          path="/student/overviewstudent-viet-hoa"
          element={<TongQuanNguoiHocVietHoa />}
        />
        <Route
          path="/student/review-chi-tietstudent"
          element={<XemLaiBaiLamChiTietSinhVien />}
        />
        <Route
          path="/student/reviewstudent-viet-hoa-font-moi"
          element={<XemLaiBaiLamSinhVienVietHoaFontMoi />}
        />
        <Route
          path="/student/previewstudent"
          element={<XemTruocBaiThiSinhVien />}
        />
        <Route
          path="/common/security-dhdedu-viet-hoa"
          element={<BaoMatPhanQuyenDhdeduVietHoa />}
        />
        <Route path="/common/2fa-dhdedu" element={<CaiAtBaoMat2LopDhdedu />} />
        <Route
          path="/common/class-details-dhdedu-azota-style"
          element={<ChiTietLopHocDhdeduAzotaStyle />}
        />
        <Route
          path="/common/class-details-viet-hoa"
          element={<ChiTietLopHocVietHoa />}
        />
        <Route path="/common/profile-dhdedu" element={<HoSoCaNhanDhdedu />} />
        <Route
          path="/common/profile-dhdedu-viet-hoa"
          element={<HoSoCaNhanDhdeduVietHoa />}
        />
        <Route
          path="/common/practice-dhdedu-viet-hoa"
          element={<LuyenTapTracNghiemDhdeduVietHoa />}
        />
        <Route
          path="/common/phan-tich-va-ke-hoach-tai-tao-giao-dien-dhdedu"
          element={<PhanTichVaKeHoachTaiTaoGiaoDienDhdedu />}
        />
        <Route
          path="/common/users-dhdedu-viet-hoa"
          element={<QuanLyNguoiDungDhdeduVietHoa />}
        />
        <Route
          path="/common/preview-dhdedu-viet-hoa"
          element={<XemTruocBaiThiDhdeduVietHoa />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
