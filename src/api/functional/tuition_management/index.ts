/**
 * @packageDocumentation
 * @module api.functional.tuition_management
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
//================================================================
import type { IConnection, Primitive } from '@nestia/fetcher';
import { PlainFetcher } from '@nestia/fetcher/lib/PlainFetcher';

import type {
  CreateTuitionManagement,
  UpdateTuitionManagement,
} from '../../dto/tuition-management/tuition-management.dto';

export * as all from './all';
export * as list from './list';

/**
 * @controller TuitionManagementController.getTuitionManagement
 * @path GET /tuition-management/:id
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function getTuitionManagement(
  connection: IConnection,
  id: string,
): Promise<getTuitionManagement.Output> {
  return PlainFetcher.fetch(connection, {
    ...getTuitionManagement.METADATA,
    path: getTuitionManagement.path(id),
  } as const);
}
export namespace getTuitionManagement {
  export type Output = Primitive<any>;

  export const METADATA = {
    method: 'GET',
    path: '/tuition-management/:id',
    request: null,
    response: {
      type: 'application/json',
      encrypted: false,
    },
    status: null,
  } as const;

  export const path = (id: string): string => {
    return `/tuition-management/${encodeURIComponent(id ?? 'null')}`;
  };
}

/**
 * @controller TuitionManagementController.create
 * @path POST /tuition-management
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function create(
  connection: IConnection,
  createTuitionManagement: create.Input,
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
    createTuitionManagement,
  );
}
export namespace create {
  export type Input = Primitive<CreateTuitionManagement>;
  export type Output = Primitive<any>;

  export const METADATA = {
    method: 'POST',
    path: '/tuition-management',
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
    return '/tuition-management';
  };
}

/**
 * @controller TuitionManagementController.updateTuitionManagement
 * @path PUT /tuition-management/:id
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function updateTuitionManagement(
  connection: IConnection,
  id: string,
  update: updateTuitionManagement.Input,
): Promise<updateTuitionManagement.Output> {
  return PlainFetcher.fetch(
    {
      ...connection,
      headers: {
        ...(connection.headers ?? {}),
        'Content-Type': 'application/json',
      },
    },
    {
      ...updateTuitionManagement.METADATA,
      path: updateTuitionManagement.path(id),
    } as const,
    update,
  );
}
export namespace updateTuitionManagement {
  export type Input = Primitive<UpdateTuitionManagement>;
  export type Output = Primitive<any>;

  export const METADATA = {
    method: 'PUT',
    path: '/tuition-management/:id',
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
    return `/tuition-management/${encodeURIComponent(id ?? 'null')}`;
  };
}

/**
 * @controller TuitionManagementController.deleteTuitionManagement
 * @path DELETE /tuition-management/:id
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function deleteTuitionManagement(
  connection: IConnection,
  id: string,
): Promise<deleteTuitionManagement.Output> {
  return PlainFetcher.fetch(connection, {
    ...deleteTuitionManagement.METADATA,
    path: deleteTuitionManagement.path(id),
  } as const);
}
export namespace deleteTuitionManagement {
  export type Output = Primitive<any>;

  export const METADATA = {
    method: 'DELETE',
    path: '/tuition-management/:id',
    request: null,
    response: {
      type: 'application/json',
      encrypted: false,
    },
    status: null,
  } as const;

  export const path = (id: string): string => {
    return `/tuition-management/${encodeURIComponent(id ?? 'null')}`;
  };
}
