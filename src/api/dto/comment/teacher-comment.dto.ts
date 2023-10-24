export interface TeacherComment {
  id?: string;

  teacherId?: string;

  classId?: string;

  classDate?: string;

  score?: number;

  reaction?: string;

  evaluation?: string;

  comment?: string;

  createAt?: string;

  studentId?: string;
}

export interface CreateTeacherComment {
  teacherId: string;

  classId: string;

  classDate: string;

  score: number;

  reaction: string;

  evaluation: string;

  comment: string;

  studentId: string;
}

export interface UpdateTeacherComment {
  teacherId?: string;

  classId?: string;

  classDate?: string;

  score?: number;

  reaction?: string;

  evaluation?: string;

  comment?: string;

  studentId?: string;
}
