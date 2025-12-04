import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

let getToken: (() => string | null) | null = null;
let doLogout: (() => void) | null = null;

export const setAuthCallbacks = (
	tokenGetter: () => string | null,
	logoutFn: () => void,
): void => {
	getToken = tokenGetter;
	doLogout = logoutFn;
};

const apiClient = axios.create({
	baseURL: import.meta.env["VITE_API_BASE_URL"] as string,
	headers: {
		"Content-Type": "application/json",
	},
});

apiClient.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		const token = getToken?.();
		if (token) {
			config.headers.Authorization = token;
		}
		return config;
	},
	(error: AxiosError) => Promise.reject(error),
);

apiClient.interceptors.response.use(
	(response) => response,
	(error: AxiosError) => {
		if (error.response?.status === 401) {
			doLogout?.();
		}
		return Promise.reject(error);
	},
);

export default apiClient;
