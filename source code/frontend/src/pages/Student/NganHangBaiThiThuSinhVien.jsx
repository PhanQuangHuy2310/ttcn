import React from "react";
import StudentSidebar from "../../components/StudentSidebar";
import StudentHeader from "../../components/StudentHeader";

const NganHangBaiThiThuSinhVien = () => {
  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <StudentSidebar />

      <main className="md:ml-64 min-h-screen">
        <StudentHeader />

        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-10">
          <section className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-headline font-extrabold tracking-tight text-on-surface">
              Ngân hàng bài thi thử
            </h2>
            <p className="text-tertiary font-body">
              Hệ thống tổng hợp đề thi chất lượng cao, cá nhân hóa theo lộ trình
              học tập của bạn.
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-primary"
                  data-icon="auto_awesome"
                >
                  auto_awesome
                </span>
                <h3 className="text-xl font-headline font-bold">
                  Đề thi gợi ý bởi AI
                </h3>
              </div>
              <a
                className="text-primary text-sm font-semibold hover:underline"
                href="#"
              >
                Xem tất cả
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 relative group overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-container p-8 text-on-primary shadow-xl">
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="space-y-4">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider">
                      Lộ trình mục tiêu 9+
                    </span>
                    <h4 className="text-2xl font-headline font-extrabold leading-tight">
                      Cấu trúc dữ liệu &amp; Giải thuật: Ôn tập chương 3-5
                    </h4>
                    <p className="text-white/80 max-w-sm">
                      Dựa trên kết quả làm bài tuần trước, đây là bộ đề giúp bạn
                      khắc phục lỗ hổng về đồ thị và cây nhị phân.
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-8">
                    <div className="flex -space-x-2">
                      <div className="h-8 w-8 rounded-full border-2 border-primary-container bg-surface-container overflow-hidden">
                        <img
                          alt="User 1"
                          data-alt="Small avatar of a female student"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBX0ihTCFQBcCDOkQMq2M6SLOpg9RXBu19RvTV1t7c9ovzndt6VM14A_MkysEsGSAtOdiAHGhKvo3QuT257XyR9ec69xxULOd-q8R65Hz45dqKvuOjon-HOY1q_0fTzYsd4hragb9D5gIn8gKllPpssrTukCX0KHcUv92hn43FAegDlzBWDk9iNuYcLlvessh_i7b0K3iv79rcTIkEF91sHHpceXrHm2ACQmThvhwM-D619p4NVuNEUyZGMse8Dx8zl1WGPLQzdOhs"
                        />
                      </div>
                      <div className="h-8 w-8 rounded-full border-2 border-primary-container bg-surface-container overflow-hidden">
                        <img
                          alt="User 2"
                          data-alt="Small avatar of a male student"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqzhlk8bQKCngc4Q_76FzH5-z2Ns4LJ-51__0QZDPDyD03tjR6KMqRXMIcXJfC6toIDOzWVucMINInDx6NQmVbSMJVvQwJ9eFBhCKnTtBbTozzbl6bRmHEDnlDj_aieHle0J1kRVnnoiWYWjokeYoCIxh_ttIDT-jXlrHaEG6wMXBDMUjOJliek3J6EOdALWQIgHiYsTfWepEbfZml2ZBJxooRRdn8z1EFI-k0AFx4XCumk58-yWK8n1vJbDK6jMgZ2jnv40oivsc"
                        />
                      </div>
                      <div className="h-8 w-8 rounded-full border-2 border-primary-container bg-surface-container-high flex items-center justify-center text-[10px] font-bold">
                        +1.2k
                      </div>
                    </div>
                    <button className="px-6 py-2.5 bg-white text-primary rounded-xl font-bold text-sm shadow-lg hover:scale-105 transition-transform">
                      Làm bài ngay
                    </button>
                  </div>
                </div>

                <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute right-10 bottom-10 opacity-20 group-hover:scale-110 transition-transform duration-700">
                  <span
                    className="material-symbols-outlined text-[120px]"
                    data-icon="psychology"
                  >
                    psychology
                  </span>
                </div>
              </div>

              <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 flex flex-col justify-between border border-transparent shadow-sm">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center">
                    <span
                      className="material-symbols-outlined text-secondary"
                      data-icon="history_edu"
                    >
                      history_edu
                    </span>
                  </div>
                  <h4 className="text-lg font-headline font-bold">
                    Tiếng Anh chuyên ngành: Kỹ thuật phần mềm
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Độ khó:</span>
                      <span className="text-edu-orange font-bold">Khó</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Lượt làm:</span>
                      <span className="text-on-surface font-semibold">458</span>
                    </div>
                  </div>
                </div>
                <button className="mt-6 w-full py-2.5 bg-surface-container text-primary rounded-xl font-bold text-sm hover:bg-primary hover:text-white transition-all">
                  Chi tiết đề
                </button>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex bg-surface-container-low p-1 rounded-2xl w-fit">
                <button className="px-6 py-2 rounded-xl bg-white shadow-sm font-bold text-sm text-primary transition-all">
                  Đề thi của trường
                </button>
                <button className="px-6 py-2 rounded-xl font-medium text-sm text-slate-500 hover:text-primary transition-all">
                  Đề thi tự luyện
                </button>
                <button className="px-6 py-2 rounded-xl font-medium text-sm text-slate-500 hover:text-primary transition-all">
                  Đã hoàn thành
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span
                  className="material-symbols-outlined text-base"
                  data-icon="filter_list"
                >
                  filter_list
                </span>
                <span>Sắp xếp: Mới nhất</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col border border-transparent hover:border-primary/10">
                <div className="h-32 bg-slate-100 relative">
                  <img
                    alt="Math Exam"
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform"
                    data-alt="Abstract code and mathematics pattern"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCw4k-wTNBm-VGTmPVYZXb3RyDdl7WIHBUT0KN1lO21EpYeeCTtMB6wF5LRDlR10YGT00sg9IQqS-4VK0zfgdeBUh21QSe7JdU3DUi5sfagnL_K90S4bOHa47bvOcpfBWmDc4gW2e5emnr3cXE2SmrowitebnM9MnvCHqVZ3VWU_vYEA7S6nKi4wLtzV-bZeIH5s3y11tb-1POV21z4k8GdwfZfFwH9EhZyfgqIyCBgeyb9zVCj_vTMmAyHwy83Va7dA8lVIeVMdFg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <span className="absolute top-3 left-3 px-2 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-md">
                    CHÍNH QUY
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h5 className="font-headline font-bold text-on-surface line-clamp-2 mb-4">
                    Toán cao cấp A1 - Đề thi học kỳ 2023.2
                  </h5>
                  <div className="mt-auto space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center text-slate-500">
                        <span
                          className="material-symbols-outlined text-sm mr-1"
                          data-icon="group"
                        >
                          group
                        </span>
                        2.5k lượt
                      </div>
                      <div className="text-primary font-bold">
                        Điểm cao: 9.5
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full"></div>
                    </div>
                    <button className="w-full py-2 bg-primary/5 hover:bg-primary text-primary hover:text-white rounded-xl text-sm font-bold transition-all">
                      Bắt đầu thi
                    </button>
                  </div>
                </div>
              </div>

              <div className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col border border-transparent hover:border-primary/10">
                <div className="h-32 bg-slate-100 relative">
                  <img
                    alt="Programming Exam"
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform"
                    data-alt="Laptop screen showing lines of code"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDp1wSsJ5R2MQH1m5IQ5TbabUML8mhWsrhsdHSO9QlTnhycPZWXXrZoX5PCAtlWo9BP44-5uwaUBZCUEAPRPS2PFqpmN-mfQK-Iti_OF_6bBKb2oDeiCHUKDBjl3jeDHhtFVEa_Ox5ulvOTvHDk7Qg0xw-h-gtxYIsNDf1uW-0sE0dp75oF9o6b4HYN9b01FmS4HT-hUeEebTvQTKF2XJo8yLi0DRp-dl-oHOz7u0EqzZeTT86To3p_bUfpyevC6h-tIICMUsHvK7Y"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <span className="absolute top-3 left-3 px-2 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-md">
                    CHÍNH QUY
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h5 className="font-headline font-bold text-on-surface line-clamp-2 mb-4">
                    Nhập môn Lập trình Python - Final Test
                  </h5>
                  <div className="mt-auto space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center text-slate-500">
                        <span
                          className="material-symbols-outlined text-sm mr-1"
                          data-icon="group"
                        >
                          group
                        </span>
                        1.8k lượt
                      </div>
                      <div className="text-primary font-bold">
                        Điểm cao: 10.0
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full"></div>
                    </div>
                    <button className="w-full py-2 bg-primary/5 hover:bg-primary text-primary hover:text-white rounded-xl text-sm font-bold transition-all">
                      Bắt đầu thi
                    </button>
                  </div>
                </div>
              </div>

              <div className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col border border-transparent hover:border-primary/10">
                <div className="h-32 bg-slate-100 relative">
                  <img
                    alt="History Exam"
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform"
                    data-alt="Old book pages and glasses"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCicWyHrV5X8QskEfYNZl3TtzzHuIJhGmBtd7PZk5RhZbmSwJD8lpngSw8434K5orNRqFYv1S5uOJnpImRqPq-uoGJJ5afeU0BmOhMxuP0eoR2STFJPEuNaw6NKcNu5NaTFzEfrY0qdWvS-i0gRrWa6R1-5XFjTAQUlXqX6sgRlYTqTvHPJlJCg6aNJ_KPLzotg_qKs4DNx3jZVJVMxT2XI02vLmFcTNKuMPsShGN7jwrp5qAfgECEX8yB2xaJo3gpE_clqH-LM9gE"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <span className="absolute top-3 left-3 px-2 py-1 bg-tertiary text-white text-[10px] font-bold rounded-md">
                    TỰ LUYỆN
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h5 className="font-headline font-bold text-on-surface line-clamp-2 mb-4">
                    Kinh tế chính trị Mác-Lênin - Bộ 500 câu hỏi
                  </h5>
                  <div className="mt-auto space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center text-slate-500">
                        <span
                          className="material-symbols-outlined text-sm mr-1"
                          data-icon="group"
                        >
                          group
                        </span>
                        5.2k lượt
                      </div>
                      <div className="text-primary font-bold">
                        Điểm cao: 10.0
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full"></div>
                    </div>
                    <button className="w-full py-2 bg-primary/5 hover:bg-primary text-primary hover:text-white rounded-xl text-sm font-bold transition-all">
                      Bắt đầu thi
                    </button>
                  </div>
                </div>
              </div>

              <div className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col border border-transparent hover:border-primary/10">
                <div className="h-32 bg-slate-100 relative">
                  <img
                    alt="Physics Exam"
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform"
                    data-alt="Physics formulas on a blackboard"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9Eo39SWCcYd7FttDfvE0mW6bGf-4VRBEU4ch9BaauVOS8GrrCwI2Ux7NZNBusgXo3-_lEM3cplSbNkt56hg-a5sDCMVD1jPl98Lbahd61BZGwujfhZGc4iZGQv-wyCSgPpevBJmmrAmzIxRPipx8HR7oVLJr28Uxke3taN5fPTkCdS5RvYsmh4Zo6QoyLnzshKhSiC4cZ3hFpPux1y2xHrkiLvCRP9_-7XUL-kgv2-5CU9pPeDBCSEgJuiDefQKORW91Aql8Zjvs"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <span className="absolute top-3 left-3 px-2 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-md">
                    CHÍNH QUY
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h5 className="font-headline font-bold text-on-surface line-clamp-2 mb-4">
                    Vật lý đại cương 1 - Đề cương ôn tập số 4
                  </h5>
                  <div className="mt-auto space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center text-slate-500">
                        <span
                          className="material-symbols-outlined text-sm mr-1"
                          data-icon="group"
                        >
                          group
                        </span>
                        940 lượt
                      </div>
                      <div className="text-primary font-bold">
                        Điểm cao: 8.5
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full"></div>
                    </div>
                    <button className="w-full py-2 bg-primary/5 hover:bg-primary text-primary hover:text-white rounded-xl text-sm font-bold transition-all">
                      Bắt đầu thi
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-surface-container overflow-hidden p-8 md:p-12 relative">
            <div className="max-w-2xl relative z-10 space-y-6">
              <h3 className="text-2xl md:text-3xl font-headline font-bold">
                Không tìm thấy môn học bạn cần?
              </h3>
              <p className="text-tertiary">
                Bạn có thể tự tải lên tài liệu học tập của mình, AI của DHDedu
                sẽ giúp bạn tạo bộ đề thi thử sát với kiến thức nhất.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-3 bg-primary text-on-primary rounded-xl font-bold shadow-lg hover:shadow-primary/30 transition-all flex items-center">
                  <span
                    className="material-symbols-outlined mr-2"
                    data-icon="upload_file"
                  >
                    upload_file
                  </span>
                  Tải tài liệu lên
                </button>
                <button className="px-8 py-3 bg-white text-primary border border-primary/20 rounded-xl font-bold hover:bg-primary/5 transition-all">
                  Xem hướng dẫn
                </button>
              </div>
            </div>

            <div className="absolute right-0 top-0 h-full w-1/3 bg-primary/5 skew-x-12 transform translate-x-20"></div>
            <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-20 hidden md:block">
              <span
                className="material-symbols-outlined text-[180px] text-primary"
                data-icon="library_books"
              >
                library_books
              </span>
            </div>
          </section>
        </div>

        <div className="h-20 md:hidden"></div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 flex justify-around items-center h-16 px-2 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <button className="flex flex-col items-center text-slate-400">
          <span className="material-symbols-outlined" data-icon="dashboard">
            dashboard
          </span>
          <span className="text-[10px] mt-1">Dashboard</span>
        </button>
        <button className="flex flex-col items-center text-slate-400">
          <span className="material-symbols-outlined" data-icon="folder_shared">
            folder_shared
          </span>
          <span className="text-[10px] mt-1">Kho</span>
        </button>
        <button className="flex flex-col items-center text-primary font-bold">
          <span className="material-symbols-outlined" data-icon="quiz">
            quiz
          </span>
          <span className="text-[10px] mt-1">Thi thử</span>
        </button>
        <button className="flex flex-col items-center text-slate-400">
          <span className="material-symbols-outlined" data-icon="insights">
            insights
          </span>
          <span className="text-[10px] mt-1">Thống kê</span>
        </button>
        <button className="flex flex-col items-center text-slate-400">
          <span className="material-symbols-outlined" data-icon="person">
            person
          </span>
          <span className="text-[10px] mt-1">Cá nhân</span>
        </button>
      </nav>

      <button className="fixed bottom-20 right-6 md:bottom-10 md:right-10 w-14 h-14 bg-gradient-to-tr from-primary to-primary-container text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform z-40">
        <span className="material-symbols-outlined text-3xl" data-icon="add">
          add
        </span>
      </button>
    </div>
  );
};

export default NganHangBaiThiThuSinhVien;
