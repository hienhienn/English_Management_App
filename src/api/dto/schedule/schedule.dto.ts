export interface StudentAttendance {
  studentId: string;
  fullname: string;
  isAttendant: boolean;
}
export interface Schedule {
  id?: string;

  roomTitle: string;

  startTime: string;

  endTime: string;

  /**
   * @format date-time
   */
  date: string;

  classId: string;

  attendance: StudentAttendance[];
}

export interface UpdateSchedule {
  id?: string;

  roomTitle?: string;

  startTime?: string;

  endTime?: string;

  /**
   * @format date-time
   */
  date?: string;

  classId?: string;

  attendance?: StudentAttendance[];
}
