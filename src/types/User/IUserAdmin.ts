export interface IUserAdmin {
  id: number;
  name: string;
  lastName: string;
  birthDate: string; // ISO string
  phoneNumber: string;
  deleted: boolean;
  email: string;
  enabled: boolean;
  role: string;
}
