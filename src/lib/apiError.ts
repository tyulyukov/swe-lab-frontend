import { AxiosError } from "axios";

type ApiErrorResponse = {
	errorType: string;
	errorMessage: string;
	errors: string[] | null;
	errorsValidation: Record<string, string>[] | null;
};

export function getApiErrorMessage(error: unknown): string {
	if (error instanceof AxiosError && error.response?.data) {
		const data = error.response.data as ApiErrorResponse;
		if (data.errors && data.errors.length > 0) {
			return data.errors.join(", ");
		}
		if (data.errorsValidation && data.errorsValidation.length > 0) {
			return data.errorsValidation
				.map((err) => Object.values(err).join(", "))
				.join(", ");
		}
		if (data.errorMessage) {
			return data.errorMessage;
		}
	}
	if (error instanceof Error) {
		return error.message;
	}
	return "An unexpected error occurred";
}

