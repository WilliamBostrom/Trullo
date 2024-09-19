export interface AppError extends Error {
  statusCode?: number;
  status?: string;
}
