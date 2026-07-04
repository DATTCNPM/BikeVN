import React from "react";
import { Motorbike } from "lucide-react";

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
            DEAD END 404
          </div>
          <div className="w-1 h-12 bg-slate-400"></div>
        </div>

        {/* Chiếc xe máy đang chạy bồng bềnh */}
        <div className="animate-drive text-emerald-600 ml-12">
          <Motorbike className="w-16 h-16" />
        </div>
      </div>

      {/* Nội dung thông báo */}
      <h1 className="text-6xl font-black text-emerald-500 tracking-wide mb-2">
        404
      </h1>
      <h2 className="text-2xl font-bold text-slate-800 mb-3">
        Oops! You're Lost!
      </h2>
      <p className="text-slate-500 max-w-sm mb-8 text-sm leading-relaxed">
        It looks like you've taken a wrong turn and ended up in a place that
        doesn't exist. Let's get you back on track!
      </p>

      {/* Nút điều hướng quay lại trang chủ */}
      <button
        onClick={handleGoHome}
        className="px-6 py-3 font-semibold text-white bg-emerald-500 hover:bg-emerald-600 active:scale-95 transition-all rounded-xl shadow-lg shadow-emerald-200"
      >
        Return to Home
      </button>
    </div>
  );
};
