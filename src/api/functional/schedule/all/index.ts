/**
 * @packageDocumentation
 * @module api.functional.schedule.all
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
//================================================================
import type { IConnection, Primitive } from '@nestia/fetcher';
import { PlainFetcher } from '@nestia/fetcher/lib/PlainFetcher';

/**
 * @controller ScheduleController.getAllScheduleByProgram
 * @path GET /schedule/all
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function getAllScheduleByProgram(
  connection: IConnection,
): Promise<getAllScheduleByProgram.Output> {
  return PlainFetcher.fetch(connection, {
    ...getAllScheduleByProgram.METADATA,
    path: getAllScheduleByProgram.path(),
  } as const);
}
export namespace getAllScheduleByProgram {
  export type Output = Primitive<any>;

  export const METADATA = {
    method: 'GET',
    path: '/schedule/all',
    request: null,
    response: {
      type: 'application/json',
      encrypted: false,
    },
    status: null,
  } as const;

  export const path = (): string => {
    return '/schedule/all';
  };
}
