export interface QueryWithRole {
  keyword: string;
  field: string;
  role: string;
  pageNumber?: number | null; // optional parameter, default value is 1. If not assign value
  pageSize?: number;
}
