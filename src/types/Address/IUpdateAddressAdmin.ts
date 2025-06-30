export interface IUpdateAddressAdmin {
  street: string;
  number: number;
  apartment?: string;
  aptNumberAndFloor?: string;
  province: string;
  locality: string;
  postal: string;
  userId: number;
  deleted: boolean;
}
