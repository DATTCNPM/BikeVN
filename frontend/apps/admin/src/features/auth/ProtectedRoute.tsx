import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "./useAdminAuth";
import { useAdminProfile } from "./useAdminProfile";
import { Spinner } from "@repo/ui/components/ui/spinner";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdminLogin } = useAdminAuth();
  const { data: adminProfile } = useAdminProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdminLogin) {
      void navigate("/admin/login");
    }
  }, [isAdminLogin, navigate]);

  if (!adminProfile) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return <>{children}</>;
}
