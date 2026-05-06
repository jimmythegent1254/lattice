import { AppSidebar } from "#/components/custom/app-sidebar";
import { TaskCard } from "#/components/custom/task-card";
import { TaskCardSkeleton } from "#/components/custom/task-card-skeleton";
import { ModeToggle } from "#/components/mode-toggle";
import { Badge } from "#/components/ui/badge";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "#/components/ui/breadcrumb";
import { Separator } from "#/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "#/components/ui/sidebar";
import { Skeleton } from "#/components/ui/skeleton";
import { orpc } from "#/orpc/client";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/projects/$projectId")({
	component: RouteComponent,
});

type Task = {
	id: string;
	title: string;
	status: "todo" | "in_progress" | "done";
};

function Panel({
	type,
	tasks,
	isLoading,
}: {
	type: "Todo" | "In Progress" | "Done";
	tasks: Task[];
	isLoading: boolean;
}) {
	const statusMap = {
		Todo: "todo",
		"In Progress": "in_progress",
		Done: "done",
	} as const;

	const filteredTasks = tasks.filter((task) => task.status === statusMap[type]);

	const getBadgeColor = (type: string) => {
		if (type === "Todo") return "bg-red-500";
		if (type === "In Progress") return "bg-orange-500";
		return "bg-green-500";
	};

	return (
		<div className="w-4/12 h-[90vh] flex flex-col rounded-xl border border-border bg-card">
			<div className="p-4 flex items-center gap-3 border-b">
				<Badge className={`${getBadgeColor(type)} p-1 rounded-full`} />
				<span className="text-sm font-semibold">{type}</span>
				{!isLoading && (
					<span className="text-sm text-muted-foreground ml-auto font-mono">
						{filteredTasks.length}
					</span>
				)}
			</div>

			<div className="flex-1 p-3 space-y-3 overflow-auto">
				{isLoading ? (
					Array.from({ length: 4 }).map((_, i) => <TaskCardSkeleton key={i} />)
				) : filteredTasks.length > 0 ? (
					filteredTasks.map((task) => <TaskCard key={task.id} task={task} />)
				) : (
					<div className="h-32 flex items-center justify-center text-muted-foreground">
						No tasks in this column
					</div>
				)}
			</div>
		</div>
	);
}

function RouteComponent() {
	const { projectId } = useParams({ from: "/projects/$projectId" });

	const projectQuery = useQuery(
		orpc.projects.getProjectById.queryOptions({
			input: { projectId },
		}),
	);

	const tasksQuery = useQuery(
		orpc.tasks.list.queryOptions({
			input: { projectId },
		}),
	);

	const isLoading = projectQuery.isPending || tasksQuery.isPending;

	// Error handling
	if (projectQuery.error) {
		return (
			<div className="p-8">
				Error loading project: {projectQuery.error.message}
			</div>
		);
	}
	if (tasksQuery.error) {
		return (
			<div className="p-8">Error loading tasks: {tasksQuery.error.message}</div>
		);
	}

	return (
		<div className="flex w-full">
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset>
					{/* Header */}
					<header className="flex justify-between border-b items-center pr-3">
						<div className="flex h-16 shrink-0 items-center gap-2 px-4">
							<SidebarTrigger className="-ml-1" />
							<Separator
								orientation="vertical"
								className="mr-2 data-[orientation=vertical]:h-4"
							/>

							<Breadcrumb>
								<BreadcrumbList>
									<BreadcrumbItem className="hidden md:block">
										<BreadcrumbLink href="#">Projects</BreadcrumbLink>
									</BreadcrumbItem>
									<BreadcrumbSeparator className="hidden md:block" />
									<BreadcrumbItem>
										<BreadcrumbPage>
											{isLoading ? (
												<Skeleton className="h-6 w-64" />
											) : (
												projectQuery.data?.name || "Untitled Project"
											)}
										</BreadcrumbPage>
									</BreadcrumbItem>
								</BreadcrumbList>
							</Breadcrumb>
						</div>

						<ModeToggle />
					</header>

					{/* Kanban Board */}
					<div className="flex w-full gap-4 p-4">
						<Panel
							type="Todo"
							tasks={tasksQuery.data ?? []}
							isLoading={isLoading}
						/>
						<Panel
							type="In Progress"
							tasks={tasksQuery.data ?? []}
							isLoading={isLoading}
						/>
						<Panel
							type="Done"
							tasks={tasksQuery.data ?? []}
							isLoading={isLoading}
						/>
					</div>
				</SidebarInset>
			</SidebarProvider>
		</div>
	);
}
