export interface IUser {
  readonly id?: number;
  username: string;
  authenticated?: boolean;
  did?: string;
}
