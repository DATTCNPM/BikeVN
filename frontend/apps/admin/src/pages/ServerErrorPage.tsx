import React from "react";
import { usePingQuery } from "@/features/auth/usePingQuery"; // Hook React Query của bạn

export const ServerErrorPage: React.FC = () => {
  const { isLoading, refetch } = usePingQuery();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 font-sans p-6 text-center select-none">
      {/* inject animation styles vào component để không cần sửa tailwind.config.js */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          20% { transform: translateY(-2px) rotate(-1deg); }
          40% { transform: translateY(1px) rotate(1deg); }
          60% { transform: translateY(-1px) rotate(0deg); }
          80% { transform: translateY(2px) rotate(1deg); }
        }
        @keyframes smoke {
          0% { transform: translateY(0) scale(0.8); opacity: 0; }
          50% { opacity: 0.6; }
          100% { transform: translateY(-40px) scale(1.5); opacity: 0; }
        }
        .animate-shake { animation: shake 0.5s infinite linear; }
        .smoke-1 { animation: smoke 2s infinite ease-in-out; }
        .smoke-2 { animation: smoke 2s infinite ease-in-out 0.7s; }
        .smoke-3 { animation: smoke 2s infinite ease-in-out 1.4s; }
      `}</style>

      {/* Khu vực minh họa hoạt ảnh xe máy hỏng */}
      <div className="relative w-64 h-48 mb-8 flex items-end justify-center">
        {/* Khói bốc ra từ động cơ */}
        <div className="absolute left-[35%] bottom-[35%] w-6 h-6 bg-gray-400 rounded-full blur-sm smoke-1"></div>
        <div className="absolute left-[30%] bottom-[45%] w-8 h-8 bg-gray-300 rounded-full blur-md smoke-2"></div>
        <div className="absolute left-[40%] bottom-[50%] w-5 h-5 bg-gray-400 rounded-full blur-sm smoke-3"></div>

        {/* Icon xe máy đang bị rung lắc (dùng SVG) */}
        <div className="animate-shake text-slate-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-40 h-40"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18.75 19.5l-2.25-6m-1.5 6l1.5-6M6.75 19.5V18a2.25 2.25 0 012.25-2.25h1.5A2.25 2.25 0 0112.75 18v1.5m-6 0h6m-6 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm6 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zM5.25 6h3.375c.621 0 1.125.504 1.125 1.125v3.025M9.75 10.125h4.875c.621 0 1.125.504 1.125 1.125v3.025M9.75 10.125v5.625c0 .621.504 1.125 1.125 1.125h3.75c.621 0 1.125-.504 1.125-1.125v-5.625m-6 0h6"
            />
          </svg>
        </div>

        {/* Biển cảnh báo sửa chữa */}
        <div className="absolute right-0 bottom-4 bg-red-100 text-red-600 border border-red-300 text-xs font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1 animate-bounce">
          <span>⚠️ Server Offline</span>
        </div>
      </div>

      {/* Nội dung thông báo */}
      <h1 className="text-6xl font-black text-red-500 tracking-wide mb-2">
        500
      </h1>
      <h2 className="text-2xl font-bold text-slate-800 mb-3">
        Úi, Xe Hỏng Dọc Đường Rồi!
      </h2>
      <p className="text-slate-500 max-w-md mb-8 text-sm leading-relaxed">
        Kết nối tới máy chủ vừa bị đứt xích hoặc "bể bánh". Đội ngũ kỹ thuật
        đang vác cờ-lê ra sửa chữa để bạn sớm tiếp tục bon bon trên mọi nẻo
        đường!
      </p>

      {/* Nút bấm kiểm tra lại trạng thái */}
      <button
        onClick={() => refetch()}
        disabled={isLoading}
        className="px-6 py-3 font-semibold text-white bg-red-500 hover:bg-red-600 active:scale-95 transition-all rounded-xl shadow-lg shadow-red-200 disabled:bg-slate-300 disabled:shadow-none flex items-center gap-2"
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Đang đạp máy thử lại...
          </>
        ) : (
          "Nhấn để sửa xe (Thử lại)"
        )}
      </button>
    </div>
  );
};
