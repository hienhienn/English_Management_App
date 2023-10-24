export interface CreateSchedule {
  classId: string;

  roomTitle: string;

  startDate: string;

  endDate: string;

  daysOfWeek: any[];

  startTime: string;

  endTime: string;
}
