/**
 * @packageDocumentation
 * @module api.functional.vat_management.advanced_query
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
//================================================================
import type { IConnection, Primitive } from '@nestia/fetcher';
import { PlainFetcher } from '@nestia/fetcher/lib/PlainFetcher';

import type { QueryOption } from '../../../dto/vat-management/query-option-VAT-management.dto';

/**
 * @controller VatManagementController.advancedQuery
 * @path POST /vat-management/advanced-query
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function advancedQuery(
  connection: IConnection,
  advanceQuery: advancedQuery.Input,
): Promise<advancedQuery.Output> {
  return PlainFetcher.fetch(
    {
      ...connection,
      headers: {
        ...(connection.headers ?? {}),
        'Content-Type': 'application/json',
      },
    },
    {
      ...advancedQuery.METADATA,
      path: advancedQuery.path(),
    } as const,
    advanceQuery,
  );
}
export namespace advancedQuery {
  export type Input = Primitive<QueryOption>;
  export type Output = Primitive<any>;

  export const METADATA = {
    method: 'POST',
    path: '/vat-management/advanced-query',
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
    return '/vat-management/advanced-query';
  };
}
