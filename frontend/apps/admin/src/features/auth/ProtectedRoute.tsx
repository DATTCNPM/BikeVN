import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePortalAuth } from "./hooks/usePortalAuth";
import { usePortalProfile } from "./hooks/usePortalProfile";
import { Spinner } from "@repo/ui/components/ui/spinner";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isPortalLogin } = usePortalAuth();
  const { data: portalProfile, isLoading: isProfileLoading } =
    usePortalProfile();
  const navigate = useNavigate();

  useEffect(() => {
    // Chỉ điều hướng ra ngoài khi chắc chắn hệ thống đã kiểm tra xong (không còn loading profile) và trạng thái là false
    if (!isProfileLoading && !isPortalLogin) {
      void navigate("/login", { replace: true });
    }
  }, [isPortalLogin, isProfileLoading, navigate]);

  // Đang kiểm tra thông tin hoặc chưa có profile thì hiện Spinner
  if (isProfileLoading || !portalProfile) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return <>{children}</>;
}
