export interface StudentListItem {
  studentId: string;
  fullname: string;
  isAttendant: boolean;
}

export interface AddStudentFromSchedule {
  classId: string;
  studentList: StudentListItem[];
}
