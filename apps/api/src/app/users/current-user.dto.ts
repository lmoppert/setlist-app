import type { UserRole, Category } from '@setlist-app/shared-types'

export class CurrentUserDto {
  id!: string;
  username!: string;
  displayName!: string | null;
  role!: UserRole | null;
  categoryPref!: Category | null;
  memberPref!: string | null;
}