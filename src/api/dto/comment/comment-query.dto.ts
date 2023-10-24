export interface CommentQuery {
  id: string;
  type: string; // ['class', 'student', teacher]
  pageNumber?: number;
  pageSize?: number;
}
