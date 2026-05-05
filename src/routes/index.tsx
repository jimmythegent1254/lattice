import { AppSidebar } from "#/components/custom/app-sidebar";
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
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: Home });

function Panel({ type }: { type: string }) {
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
	return (
		<div className="w-4/12 h-[90vh] rounded-md border border-border">
			<div className="p-4 flex items-center gap-2">
				<Badge className={`${typeAllocator(type)} p-1 rounded-full`}></Badge>
				<span className="text-sm font-semibold">{type}</span>
				<span className="text-sm text-slate-400">1</span>
			</div>
			<Separator />
		</div>
	);
}

function Home() {
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
										<BreadcrumbPage>Web</BreadcrumbPage>
									</BreadcrumbItem>
								</BreadcrumbList>
							</Breadcrumb>
						</div>
						<ModeToggle />
					</header>
					<div className="flex w-full gap-4 p-4">
						<Panel type="Todo" />
						<Panel type="In Progress" />
						<Panel type="Done" />
					</div>
				</SidebarInset>
			</SidebarProvider>
		</div>
	);
}
