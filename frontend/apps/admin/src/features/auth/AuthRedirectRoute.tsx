import { Navigate } from "react-router-dom";
import { authStorageService, tokenService } from "@repo/services";
import { ROLES } from "@repo/constants";

export default function AuthRedirectRoute() {
  const token = authStorageService.getPortalToken();

  console.log("AuthRedirectRoute token:", token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const roles = tokenService.getRoles(token);

  if (roles.includes(ROLES.ADMIN)) {
    return <Navigate to="/admin" replace />;
  }

  if (roles.includes(ROLES.EMPLOYEE)) {
    return <Navigate to="/employee" replace />;
  }

  return <Navigate to="/login" replace />;
}
