import { create } from "zustand";
import { persist } from "zustand/middleware";

export enum UserRole {
	STANDARD = "standard",
	SPEAKER = "speaker",
}

export type AuthUser = {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	role: UserRole;
};

type JwtPayload = {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
	role: string;
};

type AuthState = {
	token: string | null;
	user: AuthUser | null;
	setAuth: (token: string, user: AuthUser) => void;
	logout: () => void;
	isAuthenticated: () => boolean;
	isSpeaker: () => boolean;
};

export function parseJwt(token: string): AuthUser | null {
	try {
		const parts = token.replace("Bearer ", "").split(".");
		const base64Url = parts[1];
		if (!base64Url) return null;
		const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split("")
				.map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
				.join(""),
		);
		const payload = JSON.parse(jsonPayload) as JwtPayload;
		return {
			id: payload.id,
			firstName: payload.first_name,
			lastName: payload.last_name,
			email: payload.email,
			role: payload.role as UserRole,
		};
	} catch {
		return null;
	}
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			token: null,
			user: null,
			setAuth: (token: string, user: AuthUser): void => {
				set({ token, user });
			},
			logout: (): void => {
				set({ token: null, user: null });
			},
			isAuthenticated: (): boolean => get().token !== null,
			isSpeaker: (): boolean => get().user?.role === UserRole.SPEAKER,
		}),
		{
			name: "auth-storage",
			partialize: (state) => ({ token: state.token, user: state.user }),
		},
	),
);
