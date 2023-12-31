/**
 * @packageDocumentation
 * @module api.functional.users.reset_password
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
//================================================================
import type { IConnection, Primitive } from '@nestia/fetcher';
import { PlainFetcher } from '@nestia/fetcher/lib/PlainFetcher';

import type { ResetPasswordDTO } from '../../../dto/user/token.dto';

/**
 * @controller UsersController.resetPassword
 * @path POST /users/reset-password/:id
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function resetPassword(
  connection: IConnection,
  id: string,
  body: resetPassword.Input,
): Promise<resetPassword.Output> {
  return PlainFetcher.fetch(
    {
      ...connection,
      headers: {
        ...(connection.headers ?? {}),
        'Content-Type': 'application/json',
      },
    },
    {
      ...resetPassword.METADATA,
      path: resetPassword.path(id),
    } as const,
    body,
  );
}
export namespace resetPassword {
  export type Input = Primitive<ResetPasswordDTO>;
  export type Output = Primitive<any>;

  export const METADATA = {
    method: 'POST',
    path: '/users/reset-password/:id',
    request: {
      type: 'application/json',
      encrypted: false,
    },
    response: {
      type: 'application/json',
      encrypted: false,
    },
    status: null,
  } as const;

  export const path = (id: string): string => {
    return `/users/reset-password/${encodeURIComponent(id ?? 'null')}`;
  };
}
