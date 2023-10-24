import { IConnection } from '@/api/IConnection';

export const connection: IConnection = {
  simulate: true,
  host: process.env.NEXT_PUBLIC_API_URL!,
};
