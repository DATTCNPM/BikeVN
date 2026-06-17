import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePortalAuth } from "./usePortalAuth";
import { usePortalProfile } from "./usePortalProfile";
import { Spinner } from "@repo/ui/components/ui/spinner";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isPortalLogin } = usePortalAuth();
  const { data: portalProfile } = usePortalProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPortalLogin) {
      void navigate("/login");
    }
  }, [isPortalLogin, navigate]);

  if (!portalProfile) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return <>{children}</>;
}
