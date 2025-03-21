import { ResponseStatusType, ResponseStatusCode } from "../types";

export const successResponse = (
  statusCode: ResponseStatusCode,
  result: any
) => {
  return {
    status: ResponseStatusType.Success,
    statusCode,
    result,
  };
};
export const errorResponse = (statusCode: ResponseStatusCode, result: any) => {
  return {
    status: ResponseStatusType.Error,
    statusCode,
    result,
  };
};
