// components/custom/task-card-skeleton.tsx
import { Skeleton } from "#/components/ui/skeleton";

export function TaskCardSkeleton() {
	return (
		<div className="bg-card border border-border rounded-2xl p-4 space-y-3">
			<Skeleton className="h-5 w-4/5" />
			<Skeleton className="h-4 w-11/12" />
			<div className="flex justify-between pt-2">
				<Skeleton className="h-5 w-20" />
				<Skeleton className="h-7 w-7 rounded-full" />
			</div>
		</div>
	);
}
