import { UserRole } from "../enums/UserRol";

export interface IUser {
  id: number;
  name?: string;
  lastName?: string;
  email: string;
  role: UserRole;
  phoneNumber?: string;
  birthDate?: string;
}
