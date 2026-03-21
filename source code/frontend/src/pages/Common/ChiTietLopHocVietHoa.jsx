import React from "react";
import CommonSidebar from "../../components/CommonSidebar";
import CommonHeader from "../../components/CommonHeader";

const ChiTietLopHocVietHoa = () => {
  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <CommonHeader />
        <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col lg:flex-row">
          <CommonSidebar />

          <div className="flex-1 bg-background-light dark:bg-background-dark p-6 lg:p-10">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-8">
              <div>
                <nav className="mb-4 flex text-sm text-slate-500">
                  <a className="hover:text-primary" href="#">
                    Bảng điều khiển
                  </a>
                  <span className="mx-2">/</span>
                  <span className="text-slate-900 dark:text-white font-medium">
                    Chi tiết lớp học
                  </span>
                </nav>
                <h1 className="text-4xl font-black tracking-tight text-accent">
                  Trí tuệ nhân tạo nâng cao
                </h1>
                <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                  Khám phá mạng thần kinh, mô hình máy học và phát triển AI đạo
                  đức.
                </p>
                <div className="mt-4 flex items-center gap-4">
                  <span className="flex items-center gap-1 rounded-full bg-info/10 px-3 py-1 text-xs font-semibold text-info">
                    <span className="material-symbols-outlined text-sm">
                      room
                    </span>{" "}
                    Phòng 402
                  </span>
                  <span className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-accent">
                    <span className="material-symbols-outlined text-sm">
                      schedule
                    </span>{" "}
                    Thứ 2, Thứ 4 10:00 AM
                  </span>
                </div>
              </div>
              <button className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:brightness-110 transition-transform active:scale-95">
                <span className="material-symbols-outlined">video_call</span>
                Tham gia lớp học trực tuyến
              </button>
            </div>

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
              <section className="flex flex-col gap-6" id="announcements">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-accent flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">
                      campaign
                    </span>{" "}
                    Thông báo mới nhất
                  </h2>
                  <button className="text-sm font-medium text-primary hover:underline">
                    Xem tất cả
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="group rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="rounded-full bg-red-100 dark:bg-red-900/30 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                        Khẩn cấp
                      </span>
                      <span className="text-xs text-slate-500">
                        2 giờ trước
                      </span>
                    </div>
                    <h4 className="mb-2 text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                      Đã công bố hướng dẫn đ��� án cuối kỳ
                    </h4>
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      Bản tóm tắt chi tiết cho đồ án cuối kỳ về Đạo đức AI hiện
                      đã có trong phần Tài liệu học tập. Vui lòng xem lại trước
                      giờ thực hành thứ Sáu.
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <img
                        alt="Chân dung Giáo sư Sarah Jenkins"
                        className="h-6 w-6 rounded-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDObd6cc1s1u_2XKLhZlN5I-rg0lBV_Jh-B8dbjxSJnMAL0XRLTZ9sITw-lvDaVql5Okx6MNNztvIzxM48mfm56vTG2IDfCC8gv9qVil-nfdTvJAHtVHVVzGEyDy3eipvUwcpPu9MVT3i3IF6V21HASsJTLwH9R4YKSC8ypbPkV6KjBVbcutcOJEiVI3z4x5yhPduf4ttNqRUDqvgxxGu2aMxY4w1A-nNKZWk-FXwG5A9jsw6CIeI4HVWA13fNYxgQxNDqwrh6796E"
                      />
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        GS. Sarah Jenkins
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="rounded-full bg-info/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-info">
                        Cập nhật
                      </span>
                      <span className="text-xs text-slate-500">Hôm qua</span>
                    </div>
                    <h4 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                      Bài giảng khách mời: Đạo đức trong LLM
                    </h4>
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      Chúng tôi rất vui mừng được đón tiếp Tiến sĩ Alan Turing
                      (Trưởng nhóm An toàn AI) vào thứ Tư tới. Việc tham gia là
                      bắt buộc để được cộng điểm.
                    </p>
                  </div>
                </div>
              </section>

              <section className="flex flex-col gap-6" id="materials">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-accent flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">
                      auto_stories
                    </span>{" "}
                    Tài liệu học tập
                  </h2>
                  <button className="text-sm font-medium text-primary hover:underline">
                    Tải xuống tất cả (.zip)
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 hover:border-primary/50 transition-colors">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500">
                      <span className="material-symbols-outlined">
                        picture_as_pdf
                      </span>
                    </div>
                    <h5 className="font-bold text-slate-900 dark:text-white">
                      Giới thiệu về Transformers
                    </h5>
                    <p className="mb-4 text-xs text-slate-500">PDF • 12.4 MB</p>
                    <div className="mt-auto flex gap-2">
                      <button className="flex-1 rounded-lg bg-background-light dark:bg-slate-800 py-2 text-xs font-bold hover:bg-primary hover:text-white transition-all">
                        Xem
                      </button>
                      <button className="rounded-lg bg-background-light dark:bg-slate-800 p-2 hover:bg-primary hover:text-white transition-all">
                        <span className="material-symbols-outlined text-sm">
                          download
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 hover:border-primary/50 transition-colors">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-info/10 text-info">
                      <span className="material-symbols-outlined">movie</span>
                    </div>
                    <h5 className="font-bold text-slate-900 dark:text-white">
                      Video bài giảng Tuần 4
                    </h5>
                    <p className="mb-4 text-xs text-slate-500">
                      Video • 1.2 GB
                    </p>
                    <div className="mt-auto flex gap-2">
                      <button className="flex-1 rounded-lg bg-background-light dark:bg-slate-800 py-2 text-xs font-bold hover:bg-primary hover:text-white transition-all">
                        Phát
                      </button>
                      <button className="rounded-lg bg-background-light dark:bg-slate-800 p-2 hover:bg-primary hover:text-white transition-all">
                        <span className="material-symbols-outlined text-sm">
                          download
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 hover:border-primary/50 transition-colors">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-accent">
                      <span className="material-symbols-outlined">
                        description
                      </span>
                    </div>
                    <h5 className="font-bold text-slate-900 dark:text-white">
                      Thực hành Python: Cơ bản về PyTorch
                    </h5>
                    <p className="mb-4 text-xs text-slate-500">
                      Notebook • 450 KB
                    </p>
                    <div className="mt-auto flex gap-2">
                      <button className="flex-1 rounded-lg bg-background-light dark:bg-slate-800 py-2 text-xs font-bold hover:bg-primary hover:text-white transition-all">
                        Mở
                      </button>
                      <button className="rounded-lg bg-background-light dark:bg-slate-800 p-2 hover:bg-primary hover:text-white transition-all">
                        <span className="material-symbols-outlined text-sm">
                          download
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <section className="flex flex-col gap-6 xl:col-span-2" id="exams">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-accent flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">
                      assignment_turned_in
                    </span>{" "}
                    Kiểm tra &amp; Bài tập
                  </h2>
                  <div className="flex gap-2">
                    <button className="rounded-lg bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-bold border border-slate-200 dark:border-slate-800 text-accent">
                      Tất cả
                    </button>
                    <button className="rounded-lg bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-bold text-slate-500 border border-slate-200 dark:border-slate-800">
                      Đang chờ
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left">
                    <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                          Tên bài tập
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                          Hạn chót
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                          Trạng thái
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                          Điểm số
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded bg-info/10 text-info">
                              <span className="material-symbols-outlined text-sm">
                                quiz
                              </span>
                            </div>
                            <span className="font-medium text-slate-900 dark:text-white">
                              Trắc nghiệm Mạng thần kinh 1
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                          15 thg 3, 2024
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-2.5 py-0.5 text-xs font-bold text-green-600 dark:text-green-400">
                            Hoàn thành
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">
                          95/100
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-xs font-bold text-primary hover:underline">
                            Xem lại
                          </button>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded bg-secondary text-accent">
                              <span className="material-symbols-outlined text-sm">
                                edit_document
                              </span>
                            </div>
                            <span className="font-medium text-slate-900 dark:text-white">
                              Tiểu luận giữa kỳ: Chủ quyền AI
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                          22 thg 3, 2024
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center rounded-full bg-info/10 px-2.5 py-0.5 text-xs font-bold text-info">
                            Đang thực hiện
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-400">
                          —
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-white shadow-sm">
                            Tiếp tục
                          </button>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-100 dark:bg-slate-800 text-slate-400">
                              <span className="material-symbols-outlined text-sm">
                                warning
                              </span>
                            </div>
                            <span className="font-medium text-slate-900 dark:text-white">
                              Thực hành Chuẩn hóa tập dữ liệu
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                          05 thg 4, 2024
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-bold text-slate-500">
                            Đang chờ
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-400">
                          —
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-xs font-bold text-primary hover:underline">
                            Bắt đầu
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section
                className="flex flex-col gap-6 xl:col-span-2"
                id="teachers"
              >
                <h2 className="text-xl font-bold text-accent flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    groups
                  </span>{" "}
                  Thông tin lớp &amp; Giáo viên
                </h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="flex items-center gap-4 rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800">
                    <img
                      alt="Chân dung Giáo sư Sarah Jenkins"
                      className="h-16 w-16 rounded-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgrhR3JaTVILvJy54YdAQCoH73X18_xQ-0UXrB8_rNVQOm9hlT6zt_7ZD9kctjm2v12O-B0dpuoPa10K-FkeuXL6DAVWeQiqqZKXChO4x2XxcsPFfEGEs9QyZgZHbEAU-EYOiAb8Wa6K1C91610MQpyLQ4keRaCGQvTikv3X2ZhNUSAsnBKdJinKlJuknYwqfD1dMPZABrvtmomjsz3jyN-3C3gDQesfEF_LrAw_h6aD2tjjraMMVDXugqZtUCtATqAwDi1S2IZXg"
                    />
                    <div>
                      <h5 className="font-bold text-slate-900 dark:text-white leading-tight">
                        GS. Sarah Jenkins
                      </h5>
                      <p className="text-sm text-slate-500">Giảng viên chính</p>
                      <div className="mt-2 flex gap-2">
                        <button className="flex h-8 w-8 items-center justify-center rounded bg-background-light dark:bg-slate-800 text-primary hover:bg-primary hover:text-white">
                          <span className="material-symbols-outlined text-lg">
                            mail
                          </span>
                        </button>
                        <button className="flex h-8 w-8 items-center justify-center rounded bg-background-light dark:bg-slate-800 text-primary hover:bg-primary hover:text-white">
                          <span className="material-symbols-outlined text-lg">
                            chat
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800">
                    <img
                      alt="Chân dung Mark Chen, Trợ giảng"
                      className="h-16 w-16 rounded-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDh4xXBfqY8NDrGCCTmvmnyqo45mtRJauvFuUERau7SLe_vEU40SXObqbNA_VYbVx97MytSEZTI4nQoDqBJ7wJNf05rEiOWUv1cMbnQMpgetcuKlT0bmjpZeujqgadKC26Dw2VN1kH7Az_AlRlDGFDD9uk1jVK40BSJd6kTQficHB_zsVlqI6TqXTueyMicXiA19FMxYvEyn_SMo5ilP8hbiHqxqv0fX9QWogsh3CBr8Rn7Od1lrSx_DgVU7QUYbjbe-9QlMN9JKq0"
                    />
                    <div>
                      <h5 className="font-bold text-slate-900 dark:text-white leading-tight">
                        Mark Chen
                      </h5>
                      <p className="text-sm text-slate-500">
                        Trợ giảng cao học
                      </p>
                      <div className="mt-2 flex gap-2">
                        <button className="flex h-8 w-8 items-center justify-center rounded bg-background-light dark:bg-slate-800 text-primary hover:bg-primary hover:text-white">
                          <span className="material-symbols-outlined text-lg">
                            mail
                          </span>
                        </button>
                        <button className="flex h-8 w-8 items-center justify-center rounded bg-background-light dark:bg-slate-800 text-primary hover:bg-primary hover:text-white">
                          <span className="material-symbols-outlined text-lg">
                            chat
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-2xl bg-orange-accent/5 p-6 border border-orange-accent/20 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 text-orange-accent/10 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-8xl">
                        smart_toy
                      </span>
                    </div>
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-orange-accent text-white shadow-lg relative z-10">
                      <span className="material-symbols-outlined text-3xl">
                        smart_toy
                      </span>
                    </div>
                    <div className="relative z-10">
                      <h5 className="font-bold text-slate-900 dark:text-white leading-tight">
                        Gia sư <span>DHDedu</span>
                      </h5>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Hỗ trợ AI 24/7
                      </p>
                      <button className="mt-2 flex items-center gap-1 text-xs font-bold text-orange-accent hover:text-primary uppercase tracking-wider transition-colors">
                        Kết nối ngay
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>

        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark py-8 px-6 text-center text-sm text-slate-500">
          <p>
            © 2024 <span className="font-bold text-primary">DHD</span>
            <span className="font-bold">edu</span> Systems Inc. Mọi tài liệu học
            tập đều được bảo vệ bởi luật bản quyền.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ChiTietLopHocVietHoa;
