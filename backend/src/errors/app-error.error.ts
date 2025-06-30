export interface AppErrorDetail {
  field?: string;
  message: string;
  code?: string;
}

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode = 500,
    public errors: AppErrorDetail[] = []
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
