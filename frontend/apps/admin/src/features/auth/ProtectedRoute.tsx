import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "./useAdminAuth";
import { Spinner } from "@repo/ui/components/ui/spinner";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAdminLogin, loading, fetchAdminProfile, adminProfile } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdminProfile();
  }, [fetchAdminProfile]);

  useEffect(() => {
    if (!loading && !isAdminLogin) {
      navigate("/admin/login");
    }
  }, [loading, isAdminLogin, navigate]);

  if (loading || !adminProfile) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return <>{children}</>;
}
