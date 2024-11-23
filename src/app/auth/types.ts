// lib/auth/types.ts
export const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  EDITOR: "editor",
  VIEWER: "viewer",
} as const;

export type Roles = keyof typeof ROLES;
export type RoleValues = (typeof ROLES)[Roles];

export const PERMISSIONS = {
  CREATE_ENTRY: "create_entry",
  EDIT_ENTRY: "edit_entry",
  DELETE_ENTRY: "delete_entry",
  APPROVE_ENTRY: "approve_entry",
  MANAGE_USERS: "manage_users",
  VIEW_ANALYTICS: "view_analytics",
} as const;

export type PermissionKeys = keyof typeof PERMISSIONS;
export type Permission = (typeof PERMISSIONS)[PermissionKeys];

export const ROLE_PERMISSIONS: Record<RoleValues, Permission[]> = {
  super_admin: Object.values(PERMISSIONS),
  admin: [
    PERMISSIONS.CREATE_ENTRY,
    PERMISSIONS.EDIT_ENTRY,
    PERMISSIONS.DELETE_ENTRY,
    PERMISSIONS.APPROVE_ENTRY,
    PERMISSIONS.VIEW_ANALYTICS,
  ],
  editor: [
    PERMISSIONS.CREATE_ENTRY,
    PERMISSIONS.EDIT_ENTRY,
    PERMISSIONS.VIEW_ANALYTICS,
  ],
  viewer: [],
};

// Utility type for getting role from metadata
export type UserRole = {
  role: RoleValues;
};
