/**
 * @packageDocumentation
 * @module api.functional.schedule.list
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
//================================================================
import type { IConnection, Primitive, Resolved } from '@nestia/fetcher';
import { PlainFetcher } from '@nestia/fetcher/lib/PlainFetcher';

import type { ScheduleQuery } from '../../../dto/schedule/schedule-query.dto';

/**
 * @controller ScheduleController.getWithQuery
 * @path GET /schedule/list
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function getWithQuery(
  connection: IConnection,
  query: getWithQuery.Query,
): Promise<getWithQuery.Output> {
  return PlainFetcher.fetch(connection, {
    ...getWithQuery.METADATA,
    path: getWithQuery.path(query),
  } as const);
}
export namespace getWithQuery {
  export type Query = Resolved<ScheduleQuery>;
  export type Output = Primitive<any>;

  export const METADATA = {
    method: 'GET',
    path: '/schedule/list',
    request: null,
    response: {
      type: 'application/json',
      encrypted: false,
    },
    status: null,
  } as const;

  export const path = (query: getWithQuery.Query): string => {
    const variables: Record<any, any> = query as any;
    const search: URLSearchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(variables))
      if (value === undefined) continue;
      else if (Array.isArray(value))
        value.forEach((elem) => search.append(key, String(elem)));
      else search.set(key, String(value));
    const encoded: string = search.toString();
    return `/schedule/list${encoded.length ? `?${encoded}` : ''}`;
  };
}
