import { ClassStudent } from './classStudent.dto';

export interface Class {
  id?: string;
  courseTitle?: string;
  office?: string;
  state?: string;
  classSize?: number;
  teacherId?: string;
  /**
   * @format date-time
   */
  startDate?: string;
  /**
   * @format date-time
   */
  endDate?: string;
  level?: string;
  revenue?: number;
  debt?: number;
  courseId?: string;
  students?: ClassStudent[];
}

export interface CreateClass {
  courseTitle: string;
  office?: string;
  state?: string;
  classSize?: number;
  teacherId?: string;
  /**
   * @format date-time
   */
  startDate?: string;
  /**
   * @format date-time
   */
  endDate?: string;
  level?: string;
  revenue?: number;
  debt?: number;
  courseId?: string;
  students?: ClassStudent[];
}

export interface UpdateClass {
  courseTitle?: string;
  office?: string;
  state?: string;
  classSize?: number;
  teacherId?: string;
  /**
   * @format date-time
   */
  startDate?: string;
  /**
   * @format date-time
   */
  endDate?: string;
  level?: string;
  revenue?: number;
  debt?: number;
  courseId?: string;
  students?: ClassStudent[];
}
