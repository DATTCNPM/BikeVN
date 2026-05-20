import { tokenService } from "./tokenService";

export const permissionService = {
  hasRole(token: string | null, requiredRoles: string[]): boolean {
    if (!token || tokenService.isExpired(token)) return false;
    const userRoles = tokenService.getRoles(token);
    return requiredRoles.some((role) => userRoles.includes(role.toLowerCase()));
  },

  hasPermission(
    token: string | null,
    requiredPermission: string,
    rolePermissionsMap?: Record<string, string[]>
  ): boolean {
    if (!token || tokenService.isExpired(token)) return false;
    const userRoles = tokenService.getRoles(token);
    
    if (userRoles.includes("admin")) return true;

    if (!rolePermissionsMap) return false;

    return userRoles.some((role) => {
      const permissions = rolePermissionsMap[role] || [];
      return permissions.includes(requiredPermission);
    });
  },
};
