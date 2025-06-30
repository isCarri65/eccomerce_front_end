export interface IUpdateUserAdmin {
  name: string;
  lastName: string;
  birthDate: string; // ISO string
  phoneNumber: string;
  deleted: boolean;
  enabled: boolean;
  role: string;
}
