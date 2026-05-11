import type { Category } from "./resource";

export interface IUser {
  id: string;
  username: string;
  displayName?: string;
  role?: UserRole;
  categoryPref?:  Category;
  memberPref?: string;
}

export const USER_ROLES = ['ADMIN', 'MEMBER']
export type UserRole = typeof USER_ROLES [number];