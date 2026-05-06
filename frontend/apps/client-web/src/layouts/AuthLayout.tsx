import { Outlet } from "react-router-dom";
import AuthBackground from "../components/auth/AuthBackground";
export default function AuthLayout() {
  return (
    <AuthBackground>
      <div className="min-w-md">
        <Outlet />
      </div>
    </AuthBackground>
  );
}
