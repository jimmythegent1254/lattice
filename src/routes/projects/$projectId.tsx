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
import type { DropResult } from "@hello-pangea/dnd";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";

type Task = {
	id: string;
	title: string;
	description: string | null;
	status: "todo" | "in_progress" | "done";
	priority: "low" | "medium" | "high" | "urgent";
	projectId: string;
	assignee: string | null;
	order: number;
	dueDate: Date | null;
	createdAt: Date | null;
	updatedAt: Date | null;
};

function Panel({
	type,
	tasks,
	isLoading,
	droppableId,
}: {
	type: "Todo" | "In Progress" | "Done";
	tasks: Task[];
	isLoading: boolean;
	droppableId: string;
}) {
	const statusMap = {
		Todo: "todo",
		"In Progress": "in_progress",
		Done: "done",
	} as const;

	const filteredTasks = tasks.filter((task) => task.status === statusMap[type]);

	const sortedTasks = filteredTasks.sort((a, b) => a.order - b.order);

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
						{sortedTasks.length}
					</span>
				)}
			</div>

			<Droppable droppableId={droppableId}>
				{(provided, snapshot) => {
					return (
						<div
							ref={provided.innerRef}
							{...provided.droppableProps}
							className={`flex-1 p-3 space-y-3 overflow-auto transition-colors min-h-0 ${
								snapshot.isDraggingOver ? "bg-muted/50" : ""
							}`}
						>
							{isLoading ? (
								Array.from({ length: 4 }).map((_, i) => (
									<TaskCardSkeleton key={`key_${i}`} />
								))
							) : sortedTasks.length > 0 ? (
								sortedTasks.map((task, index) => (
									<Draggable key={task.id} draggableId={task.id} index={index}>
										{(provided, snapshot) => {
											return (
												<div
													ref={provided.innerRef}
													{...provided.draggableProps}
													{...provided.dragHandleProps}
													className={snapshot.isDragging ? "opacity-75" : ""}
												>
													<TaskCard task={task} />
												</div>
											);
										}}
									</Draggable>
								))
							) : (
								<div className="h-32 flex items-center justify-center text-muted-foreground text-sm">
									No tasks in this column
								</div>
							)}
							{provided.placeholder}
						</div>
					);
				}}
			</Droppable>
		</div>
	);
}

export const Route = createFileRoute("/projects/$projectId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { projectId } = useParams({ from: "/projects/$projectId" });
	const queryClient = useQueryClient();

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

	const [localTasks, setLocalTasks] = useState<Task[]>([]);

	useEffect(() => {
		setLocalTasks(tasksQuery.data ?? []);
	}, [tasksQuery.data]);

	// Mutation to update task status
	const updateTaskStatus = useMutation(
		orpc.tasks.update.mutationOptions({
			onSuccess: (updatedTask) => {
				queryClient.setQueryData(
					orpc.tasks.list.queryKey({ input: { projectId } }),
					(old: Task[] | undefined) =>
						old?.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
				);
			},
		}),
	);

	const isLoading = projectQuery.isPending || tasksQuery.isPending;

	const onDragEnd = (result: DropResult) => {
		const { destination, source, draggableId } = result;

		if (!destination) return;
		if (
			destination.droppableId === source.droppableId &&
			destination.index === source.index
		) {
			return;
		}

		const newStatus = destination.droppableId as Task["status"];
		const tasks = localTasks;
		let newOrder: number | undefined;

		if (destination.droppableId !== source.droppableId) {
			// Moving to new status, set order to last
			const destTasks = tasks.filter((t) => t.status === newStatus);
			const maxOrder = destTasks.length > 0 ? Math.max(...destTasks.map((t) => t.order)) : 0;
			newOrder = maxOrder + 1;
		}

		// Optimistic update
		setLocalTasks((old) =>
			old.map((task) =>
				task.id === draggableId
					? { ...task, status: newStatus, ...(newOrder !== undefined && { order: newOrder }) }
					: task,
			),
		);

		// Send update to backend
		updateTaskStatus.mutate({
			id: draggableId,
			status: newStatus,
			...(newOrder !== undefined && { order: newOrder }),
		});
	};

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
					<DragDropContext onDragEnd={onDragEnd}>
						<div className="flex w-full gap-4 p-4">
							<Panel
								type="Todo"
								tasks={localTasks}
								isLoading={isLoading}
								droppableId="todo"
							/>
							<Panel
								type="In Progress"
								tasks={localTasks}
								isLoading={isLoading}
								droppableId="in_progress"
							/>
							<Panel
								type="Done"
								tasks={localTasks}
								isLoading={isLoading}
								droppableId="done"
							/>
						</div>
					</DragDropContext>
				</SidebarInset>
			</SidebarProvider>
		</div>
	);
}

