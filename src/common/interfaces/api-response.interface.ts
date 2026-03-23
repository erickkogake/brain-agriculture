export interface IApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export interface IApiErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  error: string;
  message: string | string[];
}

export interface IPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
