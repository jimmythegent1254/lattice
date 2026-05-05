import { CreateProjectDialog } from "#/components/custom/create-project-dialog";
import Logo from "#/components/custom/logo";
import { ModeToggle } from "#/components/mode-toggle";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="bg-neutral-100 dark:bg-neutral-900">
			<header className="flex justify-between border-b items-center p-3">
				<Logo />

				<div className="flex items-center gap-2">
					<CreateProjectDialog />
					<ModeToggle />
				</div>
			</header>
			<div className="h-screen"></div>
		</div>
	);
}
