/**
 * @packageDocumentation
 * @module api.functional.users
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
//================================================================
import type { IConnection, Primitive } from '@nestia/fetcher';
import { PlainFetcher } from '@nestia/fetcher/lib/PlainFetcher';

import type { CheckEmail } from '../../dto/user/checkExist';
import type { LoginTest } from '../../dto/user/login-test';
import type { CreateUser, UpdateUser } from '../../dto/user/user.dto';

export * as all from './all';
export * as query from './query';
export * as reset_password from './reset_password';
export * as change_password from './change_password';

/**
 * @controller UsersController.getUser
 * @path GET /users/:id
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function getUser(
  connection: IConnection,
  id: string,
): Promise<getUser.Output> {
  return PlainFetcher.fetch(connection, {
    ...getUser.METADATA,
    path: getUser.path(id),
  } as const);
}
export namespace getUser {
  export type Output = Primitive<any>;

  export const METADATA = {
    method: 'GET',
    path: '/users/:id',
    request: null,
    response: {
      type: 'application/json',
      encrypted: false,
    },
    status: null,
  } as const;

  export const path = (id: string): string => {
    return `/users/${encodeURIComponent(id ?? 'null')}`;
  };
}

/**
 * @controller UsersController.register
 * @path POST /users/register
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function register(
  connection: IConnection,
  createUser: register.Input,
): Promise<register.Output> {
  return PlainFetcher.fetch(
    {
      ...connection,
      headers: {
        ...(connection.headers ?? {}),
        'Content-Type': 'application/json',
      },
    },
    {
      ...register.METADATA,
      path: register.path(),
    } as const,
    createUser,
  );
}
export namespace register {
  export type Input = Primitive<CreateUser>;
  export type Output = Primitive<any>;

  export const METADATA = {
    method: 'POST',
    path: '/users/register',
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

  export const path = (): string => {
    return '/users/register';
  };
}

/**
 * @controller UsersController.login
 * @path POST /users/login
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function login(
  connection: IConnection,
  user: login.Input,
): Promise<login.Output> {
  return PlainFetcher.fetch(
    {
      ...connection,
      headers: {
        ...(connection.headers ?? {}),
        'Content-Type': 'application/json',
      },
    },
    {
      ...login.METADATA,
      path: login.path(),
    } as const,
    user,
  );
}
export namespace login {
  export type Input = Primitive<LoginTest.login>;
  export type Output = Primitive<any>;

  export const METADATA = {
    method: 'POST',
    path: '/users/login',
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

  export const path = (): string => {
    return '/users/login';
  };
}

/**
 * @controller UsersController.sendEmail
 * @path POST /users/sendEmail
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function sendEmail(
  connection: IConnection,
  body: sendEmail.Input,
): Promise<sendEmail.Output> {
  return PlainFetcher.fetch(
    {
      ...connection,
      headers: {
        ...(connection.headers ?? {}),
        'Content-Type': 'application/json',
      },
    },
    {
      ...sendEmail.METADATA,
      path: sendEmail.path(),
    } as const,
    body,
  );
}
export namespace sendEmail {
  export type Input = Primitive<CheckEmail>;
  export type Output = Primitive<any>;

  export const METADATA = {
    method: 'POST',
    path: '/users/sendEmail',
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

  export const path = (): string => {
    return '/users/sendEmail';
  };
}

/**
 * @controller UsersController.updateUser
 * @path PUT /users/:id
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function updateUser(
  connection: IConnection,
  id: string,
  update: updateUser.Input,
): Promise<updateUser.Output> {
  return PlainFetcher.fetch(
    {
      ...connection,
      headers: {
        ...(connection.headers ?? {}),
        'Content-Type': 'application/json',
      },
    },
    {
      ...updateUser.METADATA,
      path: updateUser.path(id),
    } as const,
    update,
  );
}
export namespace updateUser {
  export type Input = Primitive<UpdateUser>;
  export type Output = Primitive<any>;

  export const METADATA = {
    method: 'PUT',
    path: '/users/:id',
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
    return `/users/${encodeURIComponent(id ?? 'null')}`;
  };
}

/**
 * @controller UsersController.deleteUser
 * @path DELETE /users/:id
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function deleteUser(
  connection: IConnection,
  id: string,
): Promise<deleteUser.Output> {
  return PlainFetcher.fetch(connection, {
    ...deleteUser.METADATA,
    path: deleteUser.path(id),
  } as const);
}
export namespace deleteUser {
  export type Output = Primitive<any>;

  export const METADATA = {
    method: 'DELETE',
    path: '/users/:id',
    request: null,
    response: {
      type: 'application/json',
      encrypted: false,
    },
    status: null,
  } as const;

  export const path = (id: string): string => {
    return `/users/${encodeURIComponent(id ?? 'null')}`;
  };
}