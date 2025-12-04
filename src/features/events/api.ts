import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import apiClient from "@/lib/axios";
import type {
	Event,
	CreateEventPayload,
	UpdateEventPayload,
} from "@/features/events/types";

type ApiResponse<T> = {
	httpCode: number;
	message: string;
	data: T;
};

const getEvents = async (): Promise<Array<Event>> => {
	const response = await apiClient.get<ApiResponse<Array<Event>>>("/events");
	return response.data.data;
};

const getEventById = async (id: string): Promise<Event> => {
	const response = await apiClient.get<ApiResponse<Event>>(`/events/${id}`);
	return response.data.data;
};

const createEvent = async (payload: CreateEventPayload): Promise<Event> => {
	const response = await apiClient.post<ApiResponse<Event>>(
		"/events",
		payload,
	);
	return response.data.data;
};

const updateEvent = async ({
	id,
	data,
}: {
	id: string;
	data: UpdateEventPayload;
}): Promise<Event> => {
	const response = await apiClient.patch<ApiResponse<Event>>(
		`/events/${id}`,
		data,
	);
	return response.data.data;
};

const deleteEvent = async (id: string): Promise<void> => {
	await apiClient.delete(`/events/${id}`);
};

export const useEvents = () =>
	useQuery<Array<Event>>({
		queryKey: ["events"],
		queryFn: getEvents,
	});

export const useEvent = (id: string) =>
	useQuery<Event>({
		queryKey: ["events", id],
		queryFn: () => getEventById(id),
		enabled: !!id,
	});

export const useCreateEvent = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: createEvent,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["events"] });
			navigate({ to: "/events" });
		},
	});
};

export const useUpdateEvent = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: updateEvent,
		onSuccess: (updatedEvent) => {
			queryClient.invalidateQueries({ queryKey: ["events"] });
			queryClient.setQueryData(["events", updatedEvent.id], updatedEvent);
			navigate({ to: "/events" });
		},
	});
};

export const useDeleteEvent = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteEvent,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["events"] });
		},
	});
};

