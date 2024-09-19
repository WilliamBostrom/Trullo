export interface AppErrorTypes extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
  path?: string;
  value?: any;
  keyValue?: { [key: string]: any };
  errors?: any;
  code?: any;
  _message?: any;
}
