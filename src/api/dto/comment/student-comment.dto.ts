export interface StudentComment {
  id?: string;

  teacherId?: string;

  classId?: string;

  classDate?: string;

  score?: number;

  reaction?: string;

  evaluation?: string;

  comment?: string;

  /**
   * @format date-time
   */
  createAt?: string;

  studentId?: string;
}

export interface CreateStudentComment {
  teacherId: string;

  classId: string;

  classDate: string;

  score: number;

  reaction: string;

  evaluation: string;

  comment: string;

  studentId: string;
}

export interface UpdateStudentComment {
  teacherId?: string;

  classId?: string;

  classDate?: string;

  score?: number;

  reaction?: string;

  evaluation?: string;

  comment?: string;

  studentId?: string;
}
