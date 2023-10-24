/**
 * @packageDocumentation
 * @module api.functional.schedule.getAttendanceForStudent
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
//================================================================
import type { IConnection, Primitive } from '@nestia/fetcher';
import { PlainFetcher } from '@nestia/fetcher/lib/PlainFetcher';

import type { QueryAttendance } from '../../../dto/schedule/query-attendance.dto';

/**
 * @controller ScheduleController.getAttendance
 * @path POST /schedule/getAttendanceForStudent
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function getAttendance(
  connection: IConnection,
  queryBody: getAttendance.Input,
): Promise<getAttendance.Output> {
  return PlainFetcher.fetch(
    {
      ...connection,
      headers: {
        ...(connection.headers ?? {}),
        'Content-Type': 'application/json',
      },
    },
    {
      ...getAttendance.METADATA,
      path: getAttendance.path(),
    } as const,
    queryBody,
  );
}
export namespace getAttendance {
  export type Input = Primitive<QueryAttendance>;
  export type Output = Primitive<any>;

  export const METADATA = {
    method: 'POST',
    path: '/schedule/getAttendanceForStudent',
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
    return '/schedule/getAttendanceForStudent';
  };
}
