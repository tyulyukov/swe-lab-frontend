import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import apiClient from "@/lib/axios";
import { useAuthStore, parseJwt, type AuthUser } from "@/store/authStore";

type LoginPayload = {
	email: string;
	password: string;
};

type RegisterPayload = {
	email: string;
	password: string;
	passwordConfirm: string;
	first_name: string;
	last_name: string;
};

type ApiResponse<T> = {
	httpCode: number;
	message: string;
	data: T;
};

const login = async (payload: LoginPayload): Promise<string> => {
	const response = await apiClient.post<ApiResponse<string>>(
		"/auth/login",
		payload,
	);
	return response.data.data;
};

const register = async (payload: RegisterPayload): Promise<void> => {
	await apiClient.post("/auth/register", payload);
};

export const useLogin = (): UseMutationResult<string, Error, LoginPayload> => {
	const setAuth = useAuthStore((state) => state.setAuth);
	const navigate = useNavigate();

	return useMutation({
		mutationFn: login,
		onSuccess: (token: string): void => {
			const user: AuthUser | null = parseJwt(token);
			if (user) {
				setAuth(token, user);
				void navigate({ to: "/events" });
			}
		},
	});
};

export const useRegister = (): UseMutationResult<void, Error, RegisterPayload> => {
	const navigate = useNavigate();

	return useMutation({
		mutationFn: register,
		onSuccess: (): void => {
			void navigate({ to: "/login" });
		},
	});
};
