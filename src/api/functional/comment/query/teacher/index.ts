/**
 * @packageDocumentation
 * @module api.functional.comment.query.teacher
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
//================================================================
import type { IConnection, Primitive, Resolved } from '@nestia/fetcher';
import { PlainFetcher } from '@nestia/fetcher/lib/PlainFetcher';

import type { CommentQuery } from '../../../../dto/comment/comment-query.dto';

/**
 * @controller CommentController.getTeacherCommentWithQuery
 * @path GET /comment/query/teacher
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function getTeacherCommentWithQuery(
  connection: IConnection,
  teacherQuery: getTeacherCommentWithQuery.Query,
): Promise<getTeacherCommentWithQuery.Output> {
  return PlainFetcher.fetch(connection, {
    ...getTeacherCommentWithQuery.METADATA,
    path: getTeacherCommentWithQuery.path(teacherQuery),
  } as const);
}
export namespace getTeacherCommentWithQuery {
  export type Query = Resolved<CommentQuery>;
  export type Output = Primitive<any>;

  export const METADATA = {
    method: 'GET',
    path: '/comment/query/teacher',
    request: null,
    response: {
      type: 'application/json',
      encrypted: false,
    },
    status: null,
  } as const;

  export const path = (
    teacherQuery: getTeacherCommentWithQuery.Query,
  ): string => {
    const variables: Record<any, any> = teacherQuery as any;
    const search: URLSearchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(variables))
      if (value === undefined) continue;
      else if (Array.isArray(value))
        value.forEach((elem) => search.append(key, String(elem)));
      else search.set(key, String(value));
    const encoded: string = search.toString();
    return `/comment/query/teacher${encoded.length ? `?${encoded}` : ''}`;
  };
}
