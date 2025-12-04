import { Link, Outlet, useRouter } from "@tanstack/react-router";
import { useAuthStore, UserRole } from "@/store/authStore";

export function RootLayout() {
	const { user, logout, isAuthenticated } = useAuthStore();
	const router = useRouter();

	const handleLogout = () => {
		logout();
		router.navigate({ to: "/login" });
	};

	return (
		<div className="min-h-screen bg-background text-foreground">
			<header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
				<nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
					<div className="flex items-center gap-8">
						<Link
							className="text-xl font-semibold tracking-tight text-foreground"
							to="/events"
						>
							EventHub
						</Link>
						<div className="hidden items-center gap-6 md:flex">
							<Link
								className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground"
								to="/events"
							>
								Events
							</Link>
							{isAuthenticated() && (
								<Link
									className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground"
									to="/my-registrations"
								>
									My Registrations
								</Link>
							)}
							{user?.role === UserRole.SPEAKER && (
								<Link
									className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground"
									to="/events/new"
								>
									Create Event
								</Link>
							)}
						</div>
					</div>
					<div className="flex items-center gap-4">
						{isAuthenticated() ? (
							<>
								<span className="hidden text-sm text-muted-foreground sm:inline">
									{user?.firstName} {user?.lastName}
									<span className="ml-2 rounded-md bg-secondary px-2 py-0.5 text-xs uppercase">
										{user?.role}
									</span>
								</span>
								<button
									className="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
									type="button"
									onClick={handleLogout}
								>
									Logout
								</button>
							</>
						) : (
							<>
								<Link
									className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
									to="/login"
								>
									Login
								</Link>
								<Link
									className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
									to="/register"
								>
									Sign Up
								</Link>
							</>
						)}
					</div>
				</nav>
			</header>
			<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<Outlet />
			</main>
		</div>
	);
}

