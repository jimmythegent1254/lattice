import { CreateProjectDialog } from "#/components/custom/create-project-dialog";
import Logo from "#/components/custom/logo";
import { ModeToggle } from "#/components/mode-toggle";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { client } from "#/orpc/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgePlus, Box, Trash } from "lucide-react";
import { useState } from "react";

function capitalize(str: string) {
	if (!str) return "";
	return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

export const Route = createFileRoute("/")({ component: Home });

// Fetch projects
const projects = await client.projects.list({ owner: "Murad" });

function Home() {
	const [dialogOpen, setDialogOpen] = useState<boolean>(false);

	return (
		<div className="bg-neutral-100 dark:bg-neutral-900">
			<header className="flex justify-between border-b items-center p-3">
				<Logo />

				<div className="flex items-center gap-2">
					<CreateProjectDialog
						// setProjects={setProjects}
						open={dialogOpen}
						setOpen={setDialogOpen}
					/>
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
					<ScrollArea className="h-[70vh] pr-5">
						<div className="grid grid-cols-3 gap-4 pt-5">
							{projects.map((project) => {
								return (
									<Link
										key={project.id}
										to="/projects/$projectId"
										params={{ projectId: project.id }}
									>
										<Card
											key={project.name}
											className="group relative flex flex-col h-52 overflow-hidden bg-linear-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 border border-border/80 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/10 dark:hover:shadow-black/50 rounded-2xl cursor-pointer"
										>
											{/* Subtle accent glow on hover */}
											<div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-blue-500 via-purple-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-all duration-500" />

											<CardHeader className="pb-3">
												<div className="flex items-start justify-between">
													<CardTitle className="flex items-center gap-3 text-lg font-semibold tracking-tight transition-transform group-hover:translate-x-1">
														<div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 transition-colors group-hover:bg-blue-500 group-hover:text-white">
															<Box size={20} strokeWidth={2.5} />
														</div>
														{project.name}
													</CardTitle>

													{/* Delete button - more refined */}
													<Button
														variant="ghost"
														size="icon"
														className="opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-all duration-200"
														onClick={(e) => {
															e.stopPropagation(); /* delete logic */
														}}
													>
														<Trash size={18} />
													</Button>
												</div>

												<CardDescription className="text-sm text-muted-foreground line-clamp-3 mt-1 leading-snug">
													{project.description}
												</CardDescription>
											</CardHeader>

											<CardFooter className="mt-auto flex flex-col gap-3 pb-5">
												{/* Progress bar with soul */}
												<div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
													<div
														className="h-full bg-linear-to-r from-blue-500 to-violet-500 rounded-full transition-all duration-500"
														style={{ width: "33%" }} // Replace with real progress
													/>
												</div>

												<div className="flex justify-between items-center text-xs w-full">
													<div className="flex items-center gap-1.5 text-muted-foreground">
														<span className="font-medium text-foreground">
															3 tasks
														</span>
														<span className="text-emerald-500 font-medium">
															• 1 done
														</span>
													</div>

													<div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
														<span>UPDATED</span>
														<span className="text-foreground">2d ago</span>
													</div>
												</div>
											</CardFooter>

											{/* Optional: subtle floating badge */}
											<div className="absolute -top-1 -right-1 bg-linear-to-br from-violet-500 to-fuchsia-500 text-white text-[10px] font-semibold px-3 py-0.5 rounded-bl-xl rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-all">
												{capitalize(project.status)}
											</div>
										</Card>
									</Link>
								);
							})}
							<Card
								onClick={() => setDialogOpen(true)}
								className="dark:bg-neutral-900 h-48 group flex items-center justify-center border-2 border-dashed border-border cursor-pointer transition-all hover:border-blue-400 hover:shadow-md"
							>
								<div className="flex items-center gap-2 text-muted-foreground group-hover:text-blue-400 transition-colors">
									<BadgePlus size={"18"} />
									<span className="font-semibold">Create project</span>
								</div>
							</Card>
						</div>
					</ScrollArea>
				</div>
			</div>
		</div>
	);
}
