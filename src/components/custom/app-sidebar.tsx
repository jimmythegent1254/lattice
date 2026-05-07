import { orpc } from "#/orpc/client";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import { Separator } from "../ui/separator";
import Logo from "./logo";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
	const {
		data: projects,
		isPending,
		error,
	} = useQuery(
		orpc.projects.list.queryOptions({
			input: { owner: "Murad" },
		}),
	);

	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<Logo />
				<Separator />
			</SidebarHeader>

			<SidebarContent className="gap-0">
				<Collapsible defaultOpen className="group/collapsible">
					<SidebarGroup>
						<SidebarGroupLabel
							asChild
							className="
								group/label
								text-sm
								text-sidebar-foreground
								hover:bg-sidebar-accent
								hover:text-sidebar-accent-foreground
							"
						>
							<CollapsibleTrigger>
								Projects
								<ChevronRight
									className="
										ml-auto transition-transform
										group-data-[state=open]/collapsible:rotate-90
									"
								/>
							</CollapsibleTrigger>
						</SidebarGroupLabel>

						<CollapsibleContent>
							<SidebarGroupContent>
								<SidebarMenu>
									{/* Loading */}
									{isPending && (
										<div className="px-2 py-1 text-xs text-muted-foreground">
											Loading projects...
										</div>
									)}

									{/* Error */}
									{error && (
										<div className="px-2 py-1 text-xs text-red-400">
											Failed to load projects
										</div>
									)}

									{/* Projects */}
									{projects?.map((project) => (
										<SidebarMenuItem key={project.id}>
											<SidebarMenuButton asChild>
												<Link
													to="/projects/$projectId"
													params={{
														projectId: project.id,
													}}
													className="
														text-sm
														transition-colors
														hover:text-blue-400
													"
												>
													{project.name}
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									))}
								</SidebarMenu>
							</SidebarGroupContent>
						</CollapsibleContent>
					</SidebarGroup>
				</Collapsible>
			</SidebarContent>

			<SidebarRail />
		</Sidebar>
	);
}
