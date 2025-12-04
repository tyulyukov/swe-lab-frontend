import { createFileRoute, Link } from "@tanstack/react-router";
import { useEvents, useDeleteEvent } from "@/features/events/api";
import { useRegisterForEvent, useUnregister, useMyRegistrations } from "@/features/registrations/api";
import { useAuthStore, UserRole } from "@/store/authStore";
import { EventsGridSkeleton } from "@/components/ui/Skeleton";
import dayjs from "dayjs";
import { useState } from "react";

export const Route = createFileRoute("/events")({
	component: EventsListPage,
});

function EventsListPage() {
	const { data: events, isLoading, isError, error } = useEvents();
	const { data: myRegistrations } = useMyRegistrations();
	const deleteEventMutation = useDeleteEvent();
	const registerMutation = useRegisterForEvent();
	const unregisterMutation = useUnregister();
	const { user, isAuthenticated } = useAuthStore();
	const [registeringEventId, setRegisteringEventId] = useState<string | null>(null);
	const [commentInput, setCommentInput] = useState("");

	const handleDelete = (id: string) => {
		if (window.confirm("Are you sure you want to delete this event?")) {
			deleteEventMutation.mutate(id);
		}
	};

	const isRegistered = (eventId: string) => {
		return myRegistrations?.some((reg) => reg.eventId === eventId);
	};

	const handleRegister = (eventId: string) => {
		registerMutation.mutate(
			{ event_id: eventId, comment: commentInput || null },
			{
				onSuccess: () => {
					setRegisteringEventId(null);
					setCommentInput("");
				},
			},
		);
	};

	const handleUnregister = (eventId: string) => {
		if (window.confirm("Are you sure you want to cancel your registration?")) {
			unregisterMutation.mutate(eventId);
		}
	};

	if (isLoading) {
		return (
			<div>
				<div className="mb-8 flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold tracking-tight text-foreground">Events</h1>
						<p className="mt-1 text-muted-foreground">Discover and register for upcoming events</p>
					</div>
				</div>
				<EventsGridSkeleton />
			</div>
		);
	}

	if (isError) {
		return (
			<div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-center text-destructive-foreground">
				Error loading events: {error.message}
			</div>
		);
	}

	return (
		<div>
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight text-foreground">
						Events
					</h1>
					<p className="mt-1 text-muted-foreground">
						Discover and register for upcoming events
					</p>
				</div>
				{user?.role === UserRole.SPEAKER && (
					<Link
						className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
						to="/events/new"
					>
						Create Event
					</Link>
				)}
			</div>

			{events?.length === 0 ? (
				<div className="rounded-lg border border-border bg-card p-12 text-center">
					<p className="text-muted-foreground">No events found</p>
				</div>
			) : (
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{events?.map((event) => (
						<div
							key={event.id}
							className="flex flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-muted-foreground/50"
						>
							<div className="mb-4 flex items-start justify-between">
								<div className="flex flex-wrap gap-2">
									<span
										className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
											event.isOnline
												? "bg-blue-500/20 text-blue-400"
												: "bg-green-500/20 text-green-400"
										}`}
									>
										{event.isOnline ? "Online" : "In-person"}
									</span>
									{event.tags?.slice(0, 2).map((tag) => (
										<span
											key={tag}
											className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground"
										>
											{tag}
										</span>
									))}
								</div>
							</div>

							<h2 className="mb-2 text-lg font-semibold text-foreground">
								{event.name}
							</h2>

							{event.description && (
								<p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
									{event.description}
								</p>
							)}

							<div className="mt-auto space-y-2 text-sm text-muted-foreground">
								<div className="flex items-center gap-2">
									<svg
										className="h-4 w-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
										/>
									</svg>
									{dayjs(event.eventDate).format("MMM D, YYYY • h:mm A")}
								</div>
								{event.location && (
									<div className="flex items-center gap-2">
										<svg
											className="h-4 w-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
											/>
											<path
												d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
											/>
										</svg>
										{event.location}
									</div>
								)}
								{event.speaker && (
									<div className="flex items-center gap-2">
										<svg
											className="h-4 w-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
											/>
										</svg>
										{event.speaker.firstName} {event.speaker.lastName}
									</div>
								)}
								{event.limitParticipants && (
									<div className="flex items-center gap-2">
										<svg
											className="h-4 w-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
											/>
										</svg>
										{event.registrations?.length || 0} / {event.limitParticipants} registered
									</div>
								)}
							</div>

							<div className="mt-6 flex gap-2">
								{user?.role === UserRole.SPEAKER && user.id === event.speaker?.id && (
									<>
										<Link
											className="flex-1 rounded-md bg-secondary py-2 text-center text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
											params={{ eventId: event.id }}
											to="/events/$eventId"
										>
											Edit
										</Link>
										<button
											className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/80 disabled:opacity-50"
											disabled={deleteEventMutation.isPending}
											type="button"
											onClick={() => { handleDelete(event.id); }}
										>
											Delete
										</button>
									</>
								)}
								{isAuthenticated() && user?.id !== event.speaker?.id && (
									<>
										{isRegistered(event.id) ? (
											<button
												className="flex-1 rounded-md bg-destructive py-2 text-center text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/80 disabled:opacity-50"
												disabled={unregisterMutation.isPending}
												type="button"
												onClick={() => { handleUnregister(event.id); }}
											>
												Cancel Registration
											</button>
										) : registeringEventId === event.id ? (
											<div className="flex flex-1 flex-col gap-2">
												<input
													className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
													placeholder="Add a comment (optional)"
													type="text"
													value={commentInput}
													onChange={(e) => { setCommentInput(e.target.value); }}
												/>
												<div className="flex gap-2">
													<button
														className="flex-1 rounded-md bg-success py-2 text-center text-sm font-medium text-success-foreground transition-colors hover:bg-success/80 disabled:opacity-50"
														disabled={registerMutation.isPending}
														type="button"
														onClick={() => { handleRegister(event.id); }}
													>
														{registerMutation.isPending ? "..." : "Confirm"}
													</button>
													<button
														className="rounded-md bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
														type="button"
														onClick={() => {
															setRegisteringEventId(null);
															setCommentInput("");
														}}
													>
														Cancel
													</button>
												</div>
											</div>
										) : (
											<button
												className="flex-1 rounded-md bg-primary py-2 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
												type="button"
												onClick={() => { setRegisteringEventId(event.id); }}
											>
												Register
											</button>
										)}
									</>
								)}
								{!isAuthenticated() && (
									<Link
										className="flex-1 rounded-md bg-primary py-2 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
										to="/login"
									>
										Login to Register
									</Link>
								)}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

