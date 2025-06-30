export interface ICreateAddressAdmin {
  street: string;
  number: number;
  apartment?: string;
  aptNumberAndFloor?: string;
  province: string;
  locality: string;
  postal: string;
  userId: number;
}
