enum ResponseStatusType {
  Success = "success",
  Error = "error",
}
type ResponseStatusCode = 200 | 201 | 400 | 401 | 403 | 404 | 500 | 429;

export { ResponseStatusType, ResponseStatusCode };
