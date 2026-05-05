import type { Project } from "#/components/custom/create-project-dialog";
import { CreateProjectDialog } from "#/components/custom/create-project-dialog";
import Logo from "#/components/custom/logo";
import { ModeToggle } from "#/components/mode-toggle";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import { Box, Trash } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	const [projects, setProjects] = useState<Project[]>([
		{
			projectName: "Dashboard Redesign",
			projectDescription:
				"Improve layout, spacing, and visual hierarchy of the main dashboard.",
			projectStatus: "planned",
			projectOwner: "jimmythegent",
		},
		{
			projectName: "Auth System Revamp",
			projectDescription:
				"Replace legacy auth with a more secure session-based system.",
			projectStatus: "in_progress",
			projectOwner: "jimmythegent",
		},
		{
			projectName: "Task Management Core",
			projectDescription:
				"Build core task creation, editing, and status tracking features.",
			projectStatus: "in_progress",
			projectOwner: "jimmythegent",
		},
		{
			projectName: "Dark Mode Polish",
			projectDescription:
				"Fix inconsistent theming across pages and improve contrast ratios.",
			projectStatus: "planned",
			projectOwner: "jimmythegent",
		},
		{
			projectName: "API Integration Layer",
			projectDescription:
				"Standardize API calls and introduce caching layer for performance.",
			projectStatus: "planned",
			projectOwner: "jimmythegent",
		},
		{
			projectName: "Kanban Board UI",
			projectDescription:
				"Implement drag-and-drop Kanban board for task organization.",
			projectStatus: "in_progress",
			projectOwner: "jimmythegent",
		},
		{
			projectName: "Project Analytics",
			projectDescription:
				"Add basic analytics for project progress and task completion rates.",
			projectStatus: "planned",
			projectOwner: "jimmythegent",
		},
	]);
	return (
		<div className="bg-neutral-100 dark:bg-neutral-900">
			<header className="flex justify-between border-b items-center p-3">
				<Logo />

				<div className="flex items-center gap-2">
					<CreateProjectDialog setProjects={setProjects} />
					<ModeToggle />
				</div>
			</header>
			<div className="h-screen flex justify-center pt-16">
				<div className="w-7/12">
					<div className="flex flex-col gap-1">
						<span className="text-2xl font-bold">Projects</span>
						<span className="text-sm text-gray-400">
							{projects.length} projects
						</span>
					</div>
					<div className="grid grid-cols-3 gap-4 pt-5">
						{projects.map((project) => {
							return (
								<Card
									key={project.projectName}
									className="dark:bg-neutral-800 bg-neutral-200 group cursor-pointer border border-border transition-colors hover:border-blue-400"
								>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<div className="rounded-md bg-slate-300 dark:bg-slate-700 p-2 border border-border">
												<Box size={"16"} />
											</div>
											{project.projectName}
										</CardTitle>
										<CardDescription className="whitespace-normal wrap-break-word text-sm">
											{project.projectDescription}
										</CardDescription>
										<CardAction>
											<Button
												variant="link"
												className="opacity-0 group-hover:opacity-100 hover:text-white hover:bg-red-500"
											>
												<Trash />
											</Button>
										</CardAction>
									</CardHeader>
									<CardContent className="flex justify-between text-sm text-slate-800">
										<span>3 tasks</span>
										<span>1 done</span>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}
