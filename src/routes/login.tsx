import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLogin } from "@/features/auth/api";
import { useAuthStore } from "@/store/authStore";
import { getApiErrorMessage } from "@/lib/apiError";

const loginSchema = z.object({
	email: z.email("Invalid email address"),
	password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Route = createFileRoute("/login")({
	beforeLoad: () => {
		if (useAuthStore.getState().isAuthenticated()) {
			throw redirect({ to: "/events" });
		}
	},
	component: LoginPage,
});

function LoginPage() {
	const loginMutation = useLogin();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = (data: LoginFormData) => {
		loginMutation.mutate(data);
	};

	return (
		<div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
			<div className="w-full max-w-md rounded-xl border border-border bg-card p-8">
				<h1 className="mb-6 text-center text-2xl font-semibold text-foreground">
					Welcome back
				</h1>

				<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
					<div>
						<label
							className="mb-1.5 block text-sm font-medium text-foreground"
							htmlFor="email"
						>
							Email
						</label>
						<input
							id="email"
							type="email"
							{...register("email")}
							className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
							placeholder="you@example.com"
						/>
						{errors.email && (
							<p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
						)}
					</div>

					<div>
						<label
							className="mb-1.5 block text-sm font-medium text-foreground"
							htmlFor="password"
						>
							Password
						</label>
						<input
							id="password"
							type="password"
							{...register("password")}
							className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
							placeholder="••••••••"
						/>
						{errors.password && (
							<p className="mt-1 text-sm text-red-500">
								{errors.password.message}
							</p>
						)}
					</div>

					{loginMutation.isError && (
						<p className="text-sm text-red-500">
							{getApiErrorMessage(loginMutation.error)}
						</p>
					)}

					<button
						className="w-full rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
						disabled={loginMutation.isPending}
						type="submit"
					>
						{loginMutation.isPending ? "Signing in..." : "Sign in"}
					</button>
				</form>

				<p className="mt-6 text-center text-sm text-muted-foreground">
					Don&apos;t have an account?{" "}
					<Link
						className="font-medium text-foreground underline-offset-4 hover:underline"
						to="/register"
					>
						Sign up
					</Link>
				</p>
			</div>
		</div>
	);
}

