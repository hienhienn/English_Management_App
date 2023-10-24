export interface QueryClass {
  id: string;
  type: string; //['course', 'teacher', 'student']
  pageNumber?: number;
  pageSize?: number;
}
