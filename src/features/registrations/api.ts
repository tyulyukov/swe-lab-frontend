import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import type {
	EventRegistration,
	CreateRegistrationPayload,
	UpdateRegistrationPayload,
} from "@/features/events/types";

type ApiResponse<T> = {
	httpCode: number;
	message: string;
	data: T;
};

const getMyRegistrations = async (): Promise<EventRegistration[]> => {
	const response =
		await apiClient.get<ApiResponse<EventRegistration[]>>(
			"/event-registrations",
		);
	return response.data.data;
};

const getRegistrationByEventId = async (
	eventId: string,
): Promise<EventRegistration> => {
	const response = await apiClient.get<ApiResponse<EventRegistration>>(
		`/event-registrations/${eventId}`,
	);
	return response.data.data;
};

const createRegistration = async (
	payload: CreateRegistrationPayload,
): Promise<EventRegistration> => {
	const response = await apiClient.post<ApiResponse<EventRegistration>>(
		"/event-registrations",
		payload,
	);
	return response.data.data;
};

const updateRegistration = async ({
	eventId,
	data,
}: {
	eventId: string;
	data: UpdateRegistrationPayload;
}): Promise<EventRegistration> => {
	const response = await apiClient.patch<ApiResponse<EventRegistration>>(
		`/event-registrations/${eventId}`,
		data,
	);
	return response.data.data;
};

const deleteRegistration = async (eventId: string): Promise<void> => {
	await apiClient.delete(`/event-registrations/${eventId}`);
};

export const useMyRegistrations = () =>
	useQuery<EventRegistration[]>({
		queryKey: ["registrations"],
		queryFn: getMyRegistrations,
	});

export const useRegistration = (eventId: string) =>
	useQuery<EventRegistration>({
		queryKey: ["registrations", eventId],
		queryFn: () => getRegistrationByEventId(eventId),
		enabled: !!eventId,
	});

export const useRegisterForEvent = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createRegistration,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["registrations"] });
			queryClient.invalidateQueries({ queryKey: ["events"] });
		},
	});
};

export const useUpdateRegistration = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateRegistration,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["registrations"] });
		},
	});
};

export const useUnregister = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteRegistration,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["registrations"] });
			queryClient.invalidateQueries({ queryKey: ["events"] });
		},
	});
};

