import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useMyRegistrations, useUnregister, useUpdateRegistration } from "@/features/registrations/api";
import { useAuthStore } from "@/store/authStore";
import { RegistrationsListSkeleton } from "@/components/ui/Skeleton";
import dayjs from "dayjs";
import { useState } from "react";

export const Route = createFileRoute("/my-registrations")({
	beforeLoad: () => {
		if (!useAuthStore.getState().isAuthenticated()) {
			throw redirect({ to: "/login" });
		}
	},
	component: MyRegistrationsPage,
});

function MyRegistrationsPage() {
	const { data: registrations, isLoading, isError, error } = useMyRegistrations();
	const unregisterMutation = useUnregister();
	const updateMutation = useUpdateRegistration();
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editComment, setEditComment] = useState("");

	const handleUnregister = (eventId: string) => {
		if (window.confirm("Are you sure you want to cancel this registration?")) {
			unregisterMutation.mutate(eventId);
		}
	};

	const handleEditStart = (eventId: string, currentComment: string | null) => {
		setEditingId(eventId);
		setEditComment(currentComment || "");
	};

	const handleEditSave = (eventId: string) => {
		updateMutation.mutate(
			{ eventId, data: { comment: editComment || null } },
			{
				onSuccess: () => {
					setEditingId(null);
					setEditComment("");
				},
			},
		);
	};

	if (isLoading) {
		return (
			<div>
				<div className="mb-8">
					<h1 className="text-3xl font-bold tracking-tight text-foreground">My Registrations</h1>
					<p className="mt-1 text-muted-foreground">Manage your event registrations</p>
				</div>
				<RegistrationsListSkeleton />
			</div>
		);
	}

	if (isError) {
		return (
			<div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-center text-destructive-foreground">
				Error loading registrations: {error.message}
			</div>
		);
	}

	return (
		<div>
			<div className="mb-8">
				<h1 className="text-3xl font-bold tracking-tight text-foreground">
					My Registrations
				</h1>
				<p className="mt-1 text-muted-foreground">
					Manage your event registrations
				</p>
			</div>

			{registrations?.length === 0 ? (
				<div className="rounded-lg border border-border bg-card p-12 text-center">
					<p className="mb-4 text-muted-foreground">
						You haven&apos;t registered for any events yet
					</p>
					<Link
						to="/events"
						className="inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
					>
						Browse Events
					</Link>
				</div>
			) : (
				<div className="space-y-4">
					{registrations?.map((registration) => (
						<div
							key={registration.eventId}
							className="rounded-xl border border-border bg-card p-6"
						>
							<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
								<div className="flex-1">
									<div className="mb-2 flex items-center gap-3">
										<h2 className="text-lg font-semibold text-foreground">
											{registration.event?.name}
										</h2>
										<span
											className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
												registration.event?.isOnline
													? "bg-blue-500/20 text-blue-400"
													: "bg-green-500/20 text-green-400"
											}`}
										>
											{registration.event?.isOnline ? "Online" : "In-person"}
										</span>
									</div>

									<div className="space-y-1 text-sm text-muted-foreground">
										<div className="flex items-center gap-2">
											<svg
												className="h-4 w-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
												/>
											</svg>
											{dayjs(registration.event?.eventDate).format(
												"MMM D, YYYY • h:mm A",
											)}
										</div>
										{registration.event?.location && (
											<div className="flex items-center gap-2">
												<svg
													className="h-4 w-4"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
													/>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
													/>
												</svg>
												{registration.event.location}
											</div>
										)}
										<div className="flex items-center gap-2">
											<svg
												className="h-4 w-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
												/>
											</svg>
											Registered {dayjs(registration.createdAt).format("MMM D, YYYY")}
										</div>
									</div>

									{editingId === registration.eventId ? (
										<div className="mt-4 flex gap-2">
											<input
												type="text"
												value={editComment}
												onChange={(e) => setEditComment(e.target.value)}
												placeholder="Your comment"
												className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
											/>
											<button
												type="button"
												onClick={() => handleEditSave(registration.eventId)}
												disabled={updateMutation.isPending}
												className="rounded-md bg-success px-4 py-2 text-sm font-medium text-success-foreground transition-colors hover:bg-success/80 disabled:opacity-50"
											>
												Save
											</button>
											<button
												type="button"
												onClick={() => setEditingId(null)}
												className="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
											>
												Cancel
											</button>
										</div>
									) : (
										registration.comment && (
											<div className="mt-3 rounded-md bg-muted p-3">
												<p className="text-sm text-muted-foreground">
													<span className="font-medium text-foreground">
														Your comment:
													</span>{" "}
													{registration.comment}
												</p>
											</div>
										)
									)}
								</div>

								<div className="flex gap-2 sm:flex-col">
									<button
										type="button"
										onClick={() =>
											handleEditStart(registration.eventId, registration.comment)
										}
										className="flex-1 rounded-md bg-secondary px-4 py-2 text-center text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80 sm:flex-none"
									>
										Edit Comment
									</button>
									<button
										type="button"
										onClick={() => handleUnregister(registration.eventId)}
										disabled={unregisterMutation.isPending}
										className="flex-1 rounded-md bg-destructive px-4 py-2 text-center text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/80 disabled:opacity-50 sm:flex-none"
									>
										Cancel
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

