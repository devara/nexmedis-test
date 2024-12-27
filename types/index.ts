export interface ApiErrorResponse {
  statusCode: number,
  message: string,
}

export interface ApiResponsePaging {
  page: number,
  per_page: number,
  total: number,
  total_page: number,
}
