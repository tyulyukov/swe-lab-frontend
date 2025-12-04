import { createFileRoute, redirect } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateEvent } from "@/features/events/api";
import { useAuthStore, UserRole } from "@/store/authStore";
import { getApiErrorMessage } from "@/lib/apiError";

const eventSchema = z.object({
	name: z.string().min(3, "Name must be at least 3 characters"),
	is_online: z.boolean(),
	event_date: z.string().min(1, "Event date is required"),
	location: z.string().optional(),
	link: z.string().optional(),
	description: z.string().optional(),
	limit_participants: z.string().optional(),
	tags: z.string().optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

export const Route = createFileRoute("/events_/new")({
	beforeLoad: () => {
		const { isAuthenticated, user } = useAuthStore.getState();
		if (!isAuthenticated()) {
			throw redirect({ to: "/login" });
		}
		if (user?.role !== UserRole.SPEAKER) {
			throw redirect({ to: "/events" });
		}
	},
	component: CreateEventPage,
});

function CreateEventPage() {
	const createEventMutation = useCreateEvent();
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<EventFormData>({
		resolver: zodResolver(eventSchema),
		defaultValues: {
			is_online: false,
		},
	})

	const isOnline = watch("is_online");

	const onSubmit = (data: EventFormData): void => {
		const limitNumber = data.limit_participants ? Number.parseInt(data.limit_participants, 10) : null;
		const payload = {
			name: data.name,
			is_online: data.is_online,
			event_date: new Date(data.event_date).toISOString(),
			location: data.location || null,
			link: data.link || null,
			description: data.description || null,
			limit_participants: limitNumber && !Number.isNaN(limitNumber) ? limitNumber : null,
			tags: data.tags ? data.tags.split(",").map((t) => t.trim()).filter(Boolean) : null,
		}
		createEventMutation.mutate(payload);
	}

	return (
		<div className="mx-auto max-w-2xl">
			<h1 className="mb-8 text-3xl font-bold tracking-tight text-foreground">
				Create New Event
			</h1>

			<form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
				<div>
					<label
						className="mb-1.5 block text-sm font-medium text-foreground"
						htmlFor="name"
					>
						Event Name *
					</label>
					<input
						id="name"
						type="text"
						{...register("name")}
						className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
						placeholder="Tech Conference 2024"
					/>
					{errors.name && (
						<p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
					)}
				</div>

				<div className="flex items-center gap-3">
					<input
						id="is_online"
						type="checkbox"
						{...register("is_online")}
						className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-ring"
					/>
					<label className="text-sm font-medium text-foreground" htmlFor="is_online">
						This is an online event
					</label>
				</div>

				<div>
					<label
						className="mb-1.5 block text-sm font-medium text-foreground"
						htmlFor="event_date"
					>
						Event Date & Time *
					</label>
					<input
						id="event_date"
						type="datetime-local"
						{...register("event_date")}
						className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
					/>
					{errors.event_date && (
						<p className="mt-1 text-sm text-red-500">{errors.event_date.message}</p>
					)}
				</div>

				{!isOnline && (
					<div>
						<label
							className="mb-1.5 block text-sm font-medium text-foreground"
							htmlFor="location"
						>
							Location
						</label>
						<input
							id="location"
							type="text"
							{...register("location")}
							className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
							placeholder="Conference Center, City"
						/>
					</div>
				)}

				{isOnline && (
					<div>
						<label
							className="mb-1.5 block text-sm font-medium text-foreground"
							htmlFor="link"
						>
							Event Link
						</label>
						<input
							id="link"
							type="url"
							{...register("link")}
							className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
							placeholder="https://zoom.us/j/..."
						/>
						{errors.link && (
							<p className="mt-1 text-sm text-red-500">{errors.link.message}</p>
						)}
					</div>
				)}

				<div>
					<label
						className="mb-1.5 block text-sm font-medium text-foreground"
						htmlFor="description"
					>
						Description
					</label>
					<textarea
						id="description"
						rows={4}
						{...register("description")}
						className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
						placeholder="Tell attendees what this event is about..."
					/>
				</div>

				<div>
					<label
						className="mb-1.5 block text-sm font-medium text-foreground"
						htmlFor="limit_participants"
					>
						Max Participants
					</label>
					<input
						id="limit_participants"
						min="1"
						type="number"
						{...register("limit_participants")}
						className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
						placeholder="Leave empty for unlimited"
					/>
				</div>

				<div>
					<label
						className="mb-1.5 block text-sm font-medium text-foreground"
						htmlFor="tags"
					>
						Tags
					</label>
					<input
						id="tags"
						type="text"
						{...register("tags")}
						className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
						placeholder="tech, conference, networking (comma separated)"
					/>
				</div>

				{createEventMutation.isError && (
					<p className="text-sm text-red-500">
						{getApiErrorMessage(createEventMutation.error)}
					</p>
				)}

				<button
					className="w-full rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
					disabled={createEventMutation.isPending}
					type="submit"
				>
					{createEventMutation.isPending ? "Creating..." : "Create Event"}
				</button>
			</form>
		</div>
	)
}

