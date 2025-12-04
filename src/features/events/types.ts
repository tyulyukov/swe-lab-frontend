export type User = {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	role: string;
	avatarUrl: string | null;
	position: string | null;
	shortDescription: string | null;
};

export type Event = {
	id: string;
	name: string;
	isOnline: boolean;
	eventDate: string;
	location: string | null;
	link: string | null;
	description: string | null;
	imageUrls: string[] | null;
	tags: string[] | null;
	limitParticipants: number | null;
	createdAt: string;
	speaker: User | null;
	registrations?: EventRegistration[];
};

export type EventRegistration = {
	eventId: string;
	userId: string;
	comment: string | null;
	createdAt: string;
	event?: Event;
	user?: User;
};

export type CreateEventPayload = {
	name: string;
	is_online: boolean;
	event_date: string;
	location?: string | null;
	link?: string | null;
	description?: string | null;
	image_urls?: string[] | null;
	tags?: string[] | null;
	limit_participants?: number | null;
};

export type UpdateEventPayload = Partial<CreateEventPayload>;

export type CreateRegistrationPayload = {
	event_id: string;
	comment?: string | null;
};

export type UpdateRegistrationPayload = {
	comment?: string | null;
};

