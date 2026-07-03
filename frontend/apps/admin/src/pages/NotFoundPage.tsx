import React from "react";

export const NotFoundPage: React.FC = () => {
  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 font-sans p-6 text-center select-none overflow-hidden">
      {/* inject animation styles vào component */}
      <style>{`
        @keyframes drive {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }
        @keyframes wind {
          0% { transform: translateX(50px); opacity: 0; }
          50% { opacity: 0.4; }
          100% { transform: translateX(-150px); opacity: 0; }
        }
        .animate-drive { animation: drive 2.5s infinite ease-in-out; }
        .wind-line { animation: wind 1.5s infinite linear; }
      `}</style>

      {/* Khu vực minh họa hoạt ảnh chạy xe lạc đường */}
      <div className="relative w-80 h-40 mb-6 flex items-center justify-center">
        {/* Đường chân trời/vệt đường */}
        <div className="absolute bottom-6 w-64 h-[2px] bg-slate-300 rounded-full"></div>

        {/* Các vệt gió lướt qua thể hiện tốc độ "vít ga" */}
        <div className="absolute top-1/4 right-0 w-12 h-[2px] bg-slate-400 wind-line"></div>
        <div
          className="absolute top-1/2 right-4 w-8 h-[2px] bg-slate-400 wind-line"
          style={{ animationDelay: "0.5s" }}
        ></div>

        {/* Biển báo chỉ đường 404 hoang mang */}
        <div className="absolute left-4 bottom-6 flex flex-col items-center">
          <div className="bg-amber-400 border-2 border-slate-700 font-black text-slate-800 text-xs px-2 py-0.5 rounded transform -rotate-12 shadow-md">
            ĐƯỜNG CỤT 404
          </div>
          <div className="w-1 h-12 bg-slate-400"></div>
        </div>

        {/* Chiếc xe máy đang chạy bồng bềnh */}
        <div className="animate-drive text-emerald-600 ml-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-36 h-36"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18.75 19.5l-2.25-6m-1.5 6l1.5-6M6.75 19.5V18a2.25 2.25 0 012.25-2.25h1.5A2.25 2.25 0 0112.75 18v1.5m-6 0h6m-6 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm6 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zM5.25 6h3.375c.621 0 1.125.504 1.125 1.125v3.025M9.75 10.125h4.875c.621 0 1.125.504 1.125 1.125v3.025M9.75 10.125v5.625c0 .621.504 1.125 1.125 1.125h3.75c.621 0 1.125-.504 1.125-1.125v-5.625m-6 0h6"
            />
          </svg>
        </div>
      </div>

      {/* Nội dung thông báo */}
      <h1 className="text-6xl font-black text-emerald-500 tracking-wide mb-2">
        404
      </h1>
      <h2 className="text-2xl font-bold text-slate-800 mb-3">
        Úi, Lạc Đường Rồi Bạn Ơi!
      </h2>
      <p className="text-slate-500 max-w-sm mb-8 text-sm leading-relaxed">
        Hình như bạn vừa "vít ga" hơi quá tay nên đi lọt vào vùng không gian
        không tồn tại rồi. Quay xe lại thôi nào!
      </p>

      {/* Nút điều hướng quay lại trang chủ */}
      <button
        onClick={handleGoHome}
        className="px-6 py-3 font-semibold text-white bg-emerald-500 hover:bg-emerald-600 active:scale-95 transition-all rounded-xl shadow-lg shadow-emerald-200"
      >
        Quay xe về trang chủ
      </button>
    </div>
  );
};
