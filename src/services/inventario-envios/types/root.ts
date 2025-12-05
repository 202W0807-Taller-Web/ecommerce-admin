export interface Root<T = any> {
  success: boolean;
  data: T[];
  pagination?: Pagination;
}

export interface RootSingleData<T = any> {
  sucess: boolean;
  data: T;
  message?: string;
}

export interface Pagination {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}
