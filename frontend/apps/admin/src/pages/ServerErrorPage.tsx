import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Motorbike } from "lucide-react";
import { usePingQuery } from "@/features/auth/usePingQuery";
import { usePortalAuth } from "@/features/auth/usePortalAuth";
import { authStorageService, tokenService } from "@repo/services";
import { ROLES } from "@repo/constants";

export const ServerErrorPage: React.FC = () => {
  const navigate = useNavigate();
  const setIsServerDown = usePortalAuth((state) => state.setIsServerDown);
  const { isLoading, data, refetch } = usePingQuery();

  // ✨ ĐÃ SỬA: Hàm tự động nhận diện phân quyền và điều hướng trả về hợp lệ
  const handleRedirectBack = React.useCallback(() => {
    setIsServerDown(false);

    const token = authStorageService.getPortalToken();
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const roles = tokenService.getRoles(token);
    if (roles.includes(ROLES.ADMIN)) {
      navigate("/admin", { replace: true });
    } else if (roles.includes(ROLES.EMPLOYEE)) {
      navigate("/employee", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate, setIsServerDown]);

  // ✨ ĐÃ SỬA: Theo dõi kết quả trả về của usePingQuery để tự động kích hoạt hồi phục
  useEffect(() => {
    if (
      data &&
      (data.code === 1000 || (data as any).status === "success" || data)
    ) {
      handleRedirectBack();
    }
  }, [data, handleRedirectBack]);

  // ✨ ĐÃ SỬA: Thiết lập vòng lặp ping tự động cập nhật trạng thái liên tục
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 3500);
    return () => clearInterval(interval);
  }, [refetch]);

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
            I'm kick-starting it to try again....
          </>
        ) : (
          "Try Again"
        )}
      </button>
    </div>
  );
};
