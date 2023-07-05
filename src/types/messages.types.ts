import type { IUser } from './user.types';

export interface IMessage {
  readonly id: number;
  message: string;
  sender?: number;
  user?: IUser;
}
