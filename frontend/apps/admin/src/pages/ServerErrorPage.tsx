import React from "react";
import { Motorbike } from "lucide-react";

export const ServerErrorPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 font-sans p-6 text-center select-none">
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

      <div className="relative w-64 h-48 mb-8 flex items-end justify-center">
        <div className="absolute left-[35%] bottom-[35%] w-6 h-6 bg-gray-400 rounded-full blur-sm smoke-1"></div>
        <div className="absolute left-[30%] bottom-[45%] w-8 h-8 bg-gray-300 rounded-full blur-md smoke-2"></div>
        <div className="absolute left-[40%] bottom-[50%] w-5 h-5 bg-gray-400 rounded-full blur-sm smoke-3"></div>

        <div className="animate-shake text-slate-700">
          <Motorbike className="w-20 h-20" />
        </div>

        <div className="absolute right-0 bottom-4 bg-red-100 text-red-600 border border-red-300 text-xs font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1 animate-bounce">
          <span>⚠️ Server Offline</span>
        </div>
      </div>

      <h1 className="text-6xl font-black text-red-500 tracking-wide mb-2">
        500
      </h1>
      <h2 className="text-2xl font-bold text-slate-800 mb-3">
        Oops! Server Error!
      </h2>
      <p className="text-slate-500 max-w-md mb-8 text-sm leading-relaxed">
        It looks like there's an issue with the server. System will
        automatically bring you back once the connection is online.
      </p>

      <button
        onClick={() => window.location.reload()}
        className="px-6 py-3 font-semibold text-white bg-red-500 hover:bg-red-600 active:scale-95 transition-all rounded-xl shadow-lg shadow-red-200 flex items-center gap-2"
      >
        Reload Page
      </button>
    </div>
  );
};
