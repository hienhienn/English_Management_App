export interface EmployeeQuery {
  keyword: string;
  role: string;
  field: string;
  pageNumber?: number | null; // optional parameter, default value is 1. If not assign value
  pageSize?: number;
}
