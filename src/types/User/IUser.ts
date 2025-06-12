import { UserRole } from "../enums/UserRol";

export interface IUser {
  id: number;
  name: string;
  lastName?: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  birthDate?: string;
}
