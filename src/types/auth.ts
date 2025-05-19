
export type UserRole = 'staff' | 'ceo' | 'accountant';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  photoURL?: string;
}
