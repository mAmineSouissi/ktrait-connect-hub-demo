import { UserRole } from "./database.types";
import { User } from "./user.types";

export interface SignUpFormData {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
}

export interface SignInFormData {
  email: string;
  password: string;
}

export interface SignInResult {
  user: User;
  session: any;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  setUser: (user: User | null) => void;
  signIn: (data: SignInFormData) => Promise<SignInResult>;
  signUp: (data: SignUpFormData) => Promise<SignInResult>;
  signOut: () => Promise<void>;
}
