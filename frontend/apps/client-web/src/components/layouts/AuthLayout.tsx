import { Outlet } from "react-router-dom";
import AuthBackground from "../../features/auth/components/AuthBackground";
export default function AuthLayout() {
  return (
    <AuthBackground>
      <div className="min-w-md">
        <Outlet />
      </div>
    </AuthBackground>
  );
}
