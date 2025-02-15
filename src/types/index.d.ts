interface ServerResponse<T> {
  data: T;
  message: string;
}

interface ErrorResponse extends ServerResponse<null> {
  super();
}

export type { ServerResponse, ErrorResponse };
