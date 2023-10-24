/**
 * @packageDocumentation
 * @module api.functional.level.query
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
//================================================================
import type { IConnection, Primitive, Resolved } from '@nestia/fetcher';
import { PlainFetcher } from '@nestia/fetcher/lib/PlainFetcher';

import type { SearchQuery } from '../../../dto/search-query.dto';

/**
 * @controller LevelController.getQuery
 * @path GET /level/query
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function getQuery(
  connection: IConnection,
  query: getQuery.Query,
): Promise<getQuery.Output> {
  return PlainFetcher.fetch(connection, {
    ...getQuery.METADATA,
    path: getQuery.path(query),
  } as const);
}
export namespace getQuery {
  export type Query = Resolved<SearchQuery>;
  export type Output = Primitive<any>;

  export const METADATA = {
    method: 'GET',
    path: '/level/query',
    request: null,
    response: {
      type: 'application/json',
      encrypted: false,
    },
    status: null,
  } as const;

  export const path = (query: getQuery.Query): string => {
    const variables: Record<any, any> = query as any;
    const search: URLSearchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(variables))
      if (value === undefined) continue;
      else if (Array.isArray(value))
        value.forEach((elem) => search.append(key, String(elem)));
      else search.set(key, String(value));
    const encoded: string = search.toString();
    return `/level/query${encoded.length ? `?${encoded}` : ''}`;
  };
}
