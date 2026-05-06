import { AppSidebar } from "#/components/custom/app-sidebar";
import { TaskCard } from "#/components/custom/task-card";
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

function initials(name: string) {
	return name
		.split(" ")
		.map((p) => p[0])
		.filter(Boolean)
		.slice(0, 2)
		.join("")
		.toUpperCase();
}

function Panel({
	type,
	tasks,
}: {
	type: "Todo" | "In Progress" | "Done";
	tasks: Task[];
}) {
	const statusMap = {
		Todo: "todo",
		"In Progress": "in_progress",
		Done: "done",
	} as const;
	const filteredTasks = tasks?.filter(
		(task) => task.status === statusMap[type],
	);
	const typeAllocator = (type: string) => {
		console.log(type);
		if (type === "Todo") {
			console.log("read");
			return "bg-red-500";
		} else if (type === "In Progress") {
			return "bg-orange-500";
		} else {
			return "bg-green-500";
		}
	};
	console.log(tasks);
	return (
		<div className="w-4/12 h-[90vh] rounded-md border border-border">
			<div className="p-4 flex items-center gap-2">
				<Badge className={`${typeAllocator(type)} p-1 rounded-full`} />
				<span className="text-sm font-semibold">{type}</span>
				<span className="text-sm text-slate-400">
					{filteredTasks?.length ?? 0}
				</span>
			</div>

			<Separator />

			<div className="p-2 space-y-2">
				{filteredTasks?.map((task) => (
					<TaskCard key={task.id} task={task} />
				))}
			</div>
		</div>
	);
}
function RouteComponent() {
	const { projectId } = useParams({ from: "/projects/$projectId" });

	const {
		data: project,
		isPending,
		error,
	} = useQuery(
		orpc.projects.getProjectById.queryOptions({
			input: { projectId },
		}),
	);

	const {
		data: tasks,
		isPending: tasksPending,
		error: tasksError,
	} = useQuery(orpc.tasks.list.queryOptions({ input: { projectId } }));

	if (isPending) return <div>Loading...</div>;
	if (error) return <div>Error: {error.message}</div>;
	if (!project) return <div>Project not found</div>;

	console.log("Name: ", project);
	console.log("Tasks", tasks);

	return (
		<div className="flex w-full">
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset>
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
										<BreadcrumbPage>{project.name}</BreadcrumbPage>
									</BreadcrumbItem>
								</BreadcrumbList>
							</Breadcrumb>
						</div>

						<ModeToggle />
					</header>

					<div className="flex w-full gap-4 p-4">
						<Panel tasks={tasks ? tasks : []} type="Todo" />
						<Panel tasks={tasks ? tasks : []} type="In Progress" />
						<Panel tasks={tasks ? tasks : []} type="Done" />
					</div>
				</SidebarInset>
			</SidebarProvider>
		</div>
	);
}
