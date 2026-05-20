export interface Permission {
  id?: string;
  name: string;
  description?: string;
}

export interface PermissionResponse {
  name: string;
  description?: string;
}

export interface Role {
  id?: string;
  name: string;
  description?: string;
  permissions?: Permission[];
}

export interface RoleResponse {
  name: string;
  description?: string;
  permissions?: PermissionResponse[];
}

export interface RoleRequest {
  name: string;
  description?: string;
  permissions?: string[];
}

export interface PermissionRequest {
  name: string;
  description?: string;
}
