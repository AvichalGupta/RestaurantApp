export interface StandardSuccessResponse {
  statusCode: number;
  statusMessage: string;
  data: object;
}

export interface StandardFailureResponse {
  statuCode: number;
  errMessage: string;
}

export enum CommonErrorMessages {
  SE1 = 'Internal Server Error',
}
