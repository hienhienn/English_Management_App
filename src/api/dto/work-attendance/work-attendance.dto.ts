export interface AttendanceRecords {
  date: string;
  checkIn: string;
  checkOut: string;
  convert: number;
}

export interface WorkAttendance {
  id: string;
  employeeId: string;
  attendance: AttendanceRecords[];
}
export interface CreateWorkAttendance {
  employeeId: string;
  date: string;
  checkIn: string; // format hh:mm
  checkOut: string; // format hh:mm
}

export interface UpdateWorkAttendance {
  employeeId?: string;
  attendance?: AttendanceRecords[];
}
