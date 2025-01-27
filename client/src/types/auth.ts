export type UserRole = 'user' | 'administrator' | 'company' | 'guest';

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}
