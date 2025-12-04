export function Skeleton({ className = "" }: { className?: string }) {
	return (
		<div
			className={`animate-pulse rounded-md bg-muted ${className}`}
		/>
	);
}

export function EventCardSkeleton() {
	return (
		<div className="flex flex-col rounded-xl border border-border bg-card p-6">
			<div className="mb-4 flex gap-2">
				<Skeleton className="h-5 w-16" />
				<Skeleton className="h-5 w-12" />
			</div>
			<Skeleton className="mb-2 h-6 w-3/4" />
			<Skeleton className="mb-4 h-4 w-full" />
			<Skeleton className="mb-2 h-4 w-full" />
			<div className="mt-auto space-y-2">
				<Skeleton className="h-4 w-48" />
				<Skeleton className="h-4 w-36" />
				<Skeleton className="h-4 w-40" />
			</div>
			<div className="mt-6 flex gap-2">
				<Skeleton className="h-10 flex-1" />
			</div>
		</div>
	);
}

export function EventsGridSkeleton() {
	return (
		<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{Array.from({ length: 6 }).map((_, i) => (
				<EventCardSkeleton key={i} />
			))}
		</div>
	);
}

export function EventFormSkeleton() {
	return (
		<div className="mx-auto max-w-2xl space-y-6">
			<Skeleton className="h-9 w-48" />
			<div className="space-y-6">
				<div>
					<Skeleton className="mb-1.5 h-4 w-24" />
					<Skeleton className="h-10 w-full" />
				</div>
				<Skeleton className="h-5 w-40" />
				<div>
					<Skeleton className="mb-1.5 h-4 w-32" />
					<Skeleton className="h-10 w-full" />
				</div>
				<div>
					<Skeleton className="mb-1.5 h-4 w-20" />
					<Skeleton className="h-10 w-full" />
				</div>
				<div>
					<Skeleton className="mb-1.5 h-4 w-24" />
					<Skeleton className="h-24 w-full" />
				</div>
				<div>
					<Skeleton className="mb-1.5 h-4 w-32" />
					<Skeleton className="h-10 w-full" />
				</div>
				<div>
					<Skeleton className="mb-1.5 h-4 w-12" />
					<Skeleton className="h-10 w-full" />
				</div>
				<Skeleton className="h-11 w-full" />
			</div>
		</div>
	);
}

export function RegistrationCardSkeleton() {
	return (
		<div className="rounded-xl border border-border bg-card p-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div className="flex-1">
					<div className="mb-2 flex items-center gap-3">
						<Skeleton className="h-6 w-48" />
						<Skeleton className="h-5 w-16" />
					</div>
					<div className="space-y-2">
						<Skeleton className="h-4 w-44" />
						<Skeleton className="h-4 w-36" />
						<Skeleton className="h-4 w-40" />
					</div>
				</div>
				<div className="flex gap-2 sm:flex-col">
					<Skeleton className="h-10 w-28" />
					<Skeleton className="h-10 w-20" />
				</div>
			</div>
		</div>
	);
}

export function RegistrationsListSkeleton() {
	return (
		<div className="space-y-4">
			{Array.from({ length: 3 }).map((_, i) => (
				<RegistrationCardSkeleton key={i} />
			))}
		</div>
	);
}

