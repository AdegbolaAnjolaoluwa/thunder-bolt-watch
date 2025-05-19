
export type UserRole = 'ceo' | 'accountant';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  photoURL?: string;
}
