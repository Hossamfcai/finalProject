// Normalizes an axios error into a readable message.
// Backend errors follow: { success: false, error: { message, details } }
export function getErrorMessage(error, fallback = "Something went wrong.") {
  if (!error) return fallback;
  if (error.message?.includes("Network Error")) {
    return "Unreachable to the server.";
  }
  const apiError = error.response?.data?.error;
  if (apiError?.details?.length) {
    return apiError.details
      .map((detail) => `${detail.path ? `${detail.path}: ` : ""}${detail.message}`)
      .join(", ");
  }
  return apiError?.message || fallback;
}

// Value passed to rejectWithValue so reducers can read both message and status.
export function toRejectValue(error, fallback) {
  return {
    message: getErrorMessage(error, fallback),
    status: error?.response?.status ?? null,
  };
}
