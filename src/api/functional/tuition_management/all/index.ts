/**
 * @packageDocumentation
 * @module api.functional.tuition_management.all
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
//================================================================
import type { IConnection, Primitive } from '@nestia/fetcher';
import { PlainFetcher } from '@nestia/fetcher/lib/PlainFetcher';

/**
 * @controller TuitionManagementController.getAll
 * @path GET /tuition-management/all
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function getAll(connection: IConnection): Promise<getAll.Output> {
  return PlainFetcher.fetch(connection, {
    ...getAll.METADATA,
    path: getAll.path(),
  } as const);
}
export namespace getAll {
  export type Output = Primitive<any>;

  export const METADATA = {
    method: 'GET',
    path: '/tuition-management/all',
    request: null,
    response: {
      type: 'application/json',
      encrypted: false,
    },
    status: null,
  } as const;

  export const path = (): string => {
    return '/tuition-management/all';
  };
}
