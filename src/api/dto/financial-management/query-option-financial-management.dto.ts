export interface QueryObject {
  key: string;
  value: any;
}

export interface QueryOption {
  queryArray: QueryObject[] | null;
  pageSize?: number;
  pageNumber?: number;
}
