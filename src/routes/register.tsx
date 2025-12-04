import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRegister } from "@/features/auth/api";
import { useAuthStore } from "@/store/authStore";
import { getApiErrorMessage } from "@/lib/apiError";

const registerSchema = z
	.object({
		email: z.email("Invalid email address"),
		first_name: z.string().min(1, "First name is required"),
		last_name: z.string().min(1, "Last name is required"),
		password: z.string().min(4, "Password must be at least 4 characters"),
		passwordConfirm: z.string().min(1, "Please confirm your password"),
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: "Passwords do not match",
		path: ["passwordConfirm"],
	});

type RegisterFormData = z.infer<typeof registerSchema>;

export const Route = createFileRoute("/register")({
	beforeLoad: () => {
		if (useAuthStore.getState().isAuthenticated()) {
			throw redirect({ to: "/events" });
		}
	},
	component: RegisterPage,
});

function RegisterPage() {
	const registerMutation = useRegister();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
	});

	const onSubmit = (data: RegisterFormData) => {
		registerMutation.mutate(data);
	};

	return (
		<div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
			<div className="w-full max-w-md rounded-xl border border-border bg-card p-8">
				<h1 className="mb-6 text-center text-2xl font-semibold text-foreground">
					Create an account
				</h1>

				<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label
								className="mb-1.5 block text-sm font-medium text-foreground"
								htmlFor="first_name"
							>
								First name
							</label>
							<input
								id="first_name"
								type="text"
								{...register("first_name")}
								className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
								placeholder="John"
							/>
							{errors.first_name && (
								<p className="mt-1 text-sm text-red-500">
									{errors.first_name.message}
								</p>
							)}
						</div>
						<div>
							<label
								className="mb-1.5 block text-sm font-medium text-foreground"
								htmlFor="last_name"
							>
								Last name
							</label>
							<input
								id="last_name"
								type="text"
								{...register("last_name")}
								className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
								placeholder="Doe"
							/>
							{errors.last_name && (
								<p className="mt-1 text-sm text-red-500">
									{errors.last_name.message}
								</p>
							)}
						</div>
					</div>

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

					<div>
						<label
							className="mb-1.5 block text-sm font-medium text-foreground"
							htmlFor="passwordConfirm"
						>
							Confirm password
						</label>
						<input
							id="passwordConfirm"
							type="password"
							{...register("passwordConfirm")}
							className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
							placeholder="••••••••"
						/>
						{errors.passwordConfirm && (
							<p className="mt-1 text-sm text-red-500">
								{errors.passwordConfirm.message}
							</p>
						)}
					</div>

					{registerMutation.isError && (
						<p className="text-sm text-red-500">
							{getApiErrorMessage(registerMutation.error)}
						</p>
					)}

					<button
						className="w-full rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
						disabled={registerMutation.isPending}
						type="submit"
					>
						{registerMutation.isPending ? "Creating account..." : "Create account"}
					</button>
				</form>

				<p className="mt-6 text-center text-sm text-muted-foreground">
					Already have an account?{" "}
					<Link
						className="font-medium text-foreground underline-offset-4 hover:underline"
						to="/login"
					>
						Sign in
					</Link>
				</p>
			</div>
		</div>
	);
}

