/**
 * @packageDocumentation
 * @module api.functional.student
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
//================================================================
import type { IConnection, Primitive, Resolved } from '@nestia/fetcher';
import { PlainFetcher } from '@nestia/fetcher/lib/PlainFetcher';

import type { Payment } from '../../dto/student/payment.dto';
import type { QueryWithRole } from '../../dto/student/queryRole.dto';
import type { Student } from '../../dto/student/student.dto';

export * as all from './all';
export * as list from './list';

/**
 * @controller StudentController.payment
 * @path POST /student/payment
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function payment(
  connection: IConnection,
  paymentbody: payment.Input,
): Promise<payment.Output> {
  return PlainFetcher.fetch(
    {
      ...connection,
      headers: {
        ...(connection.headers ?? {}),
        'Content-Type': 'application/json',
      },
    },
    {
      ...payment.METADATA,
      path: payment.path(),
    } as const,
    paymentbody,
  );
}
export namespace payment {
  export type Input = Primitive<Payment>;
  export type Output = Primitive<any>;

  export const METADATA = {
    method: 'POST',
    path: '/student/payment',
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
    return '/student/payment';
  };
}

/**
 * @controller StudentController.getOne
 * @path GET /student/:id
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function getOne(
  connection: IConnection,
  id: string,
): Promise<getOne.Output> {
  return PlainFetcher.fetch(connection, {
    ...getOne.METADATA,
    path: getOne.path(id),
  } as const);
}
export namespace getOne {
  export type Output = Primitive<any>;

  export const METADATA = {
    method: 'GET',
    path: '/student/:id',
    request: null,
    response: {
      type: 'application/json',
      encrypted: false,
    },
    status: null,
  } as const;

  export const path = (id: string): string => {
    return `/student/${encodeURIComponent(id ?? 'null')}`;
  };
}

/**
 * @controller StudentController.create
 * @path POST /student
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function create(
  connection: IConnection,
  createStudent: create.Input,
): Promise<create.Output> {
  return PlainFetcher.fetch(
    {
      ...connection,
      headers: {
        ...(connection.headers ?? {}),
        'Content-Type': 'application/json',
      },
    },
    {
      ...create.METADATA,
      path: create.path(),
    } as const,
    createStudent,
  );
}
export namespace create {
  export type Input = Primitive<Student.create>;
  export type Output = Primitive<any>;

  export const METADATA = {
    method: 'POST',
    path: '/student',
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
    return '/student';
  };
}

/**
 * @controller StudentController.search
 * @path GET /student/search
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function search(
  connection: IConnection,
  query: search.Query,
): Promise<search.Output> {
  return PlainFetcher.fetch(connection, {
    ...search.METADATA,
    path: search.path(query),
  } as const);
}
export namespace search {
  export type Query = Resolved<QueryWithRole>;
  export type Output = Primitive<any>;

  export const METADATA = {
    method: 'GET',
    path: '/student/search',
    request: null,
    response: {
      type: 'application/json',
      encrypted: false,
    },
    status: null,
  } as const;

  export const path = (query: search.Query): string => {
    const variables: Record<any, any> = query as any;
    const search: URLSearchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(variables))
      if (value === undefined) continue;
      else if (Array.isArray(value))
        value.forEach((elem) => search.append(key, String(elem)));
      else search.set(key, String(value));
    const encoded: string = search.toString();
    return `/student/search${encoded.length ? `?${encoded}` : ''}`;
  };
}

/**
 * @controller StudentController.updateStudent
 * @path PUT /student/:id
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function updateStudent(
  connection: IConnection,
  id: string,
  update: updateStudent.Input,
): Promise<updateStudent.Output> {
  return PlainFetcher.fetch(
    {
      ...connection,
      headers: {
        ...(connection.headers ?? {}),
        'Content-Type': 'application/json',
      },
    },
    {
      ...updateStudent.METADATA,
      path: updateStudent.path(id),
    } as const,
    update,
  );
}
export namespace updateStudent {
  export type Input = Primitive<Student.update>;
  export type Output = Primitive<any>;

  export const METADATA = {
    method: 'PUT',
    path: '/student/:id',
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
    return `/student/${encodeURIComponent(id ?? 'null')}`;
  };
}

/**
 * @controller StudentController.deleteStudent
 * @path DELETE /student/:id
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function deleteStudent(
  connection: IConnection,
  id: string,
): Promise<deleteStudent.Output> {
  return PlainFetcher.fetch(connection, {
    ...deleteStudent.METADATA,
    path: deleteStudent.path(id),
  } as const);
}
export namespace deleteStudent {
  export type Output = Primitive<any>;

  export const METADATA = {
    method: 'DELETE',
    path: '/student/:id',
    request: null,
    response: {
      type: 'application/json',
      encrypted: false,
    },
    status: null,
  } as const;

  export const path = (id: string): string => {
    return `/student/${encodeURIComponent(id ?? 'null')}`;
  };
}