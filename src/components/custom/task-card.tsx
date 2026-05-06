import {
	AlertTriangle,
	ArrowDown,
	ArrowUp,
	CalendarDays,
	Equal,
	User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card } from "../ui/card";

type Task = {
	id: string;
	title: string;
	description?: string | null;
	status: "todo" | "in_progress" | "done";
	priority: "low" | "medium" | "high" | "urgent";
	projectId: string;
	assignee?: string | null;
	dueDate?: string | null;
};

const priorityClass = {
	low: "bg-green-500/10 text-green-500 border-green-500/30",
	medium: "bg-yellow-500/10 text-yellow-800 border-yellow-500/30",
	high: "bg-orange-500/10 text-orange-800 border-orange-500/30",
	urgent: "bg-red-500/10 text-red-500 border-red-500/30",
};

const priorityIcon = {
	low: ArrowDown,
	medium: Equal,
	high: ArrowUp,
	urgent: AlertTriangle,
};

function initials(name: string) {
	return name
		.split(" ")
		.map((p) => p[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();
}

export function TaskCard({ task }: { task: Task }) {
	const Icon = priorityIcon[task.priority];
	console.log(task);

	return (
		<Card
			className="group block bg-card border border-border rounded-md p-3 cursor-pointer transition-all duration-200 hover:border-blue-500/70 hover:bg-accent/60
  "
		>
			{" "}
			{/* Title + priority */}
			<div className="flex items-start justify-between gap-2">
				<p className="text-sm font-medium line-clamp-2 flex-1">{task.title}</p>

				<span
					className={`text-[10px] px-1.5 py-0.5 rounded border flex items-center gap-1 ${priorityClass[task.priority]}`}
				>
					<Icon className="h-3 w-3" />
					{task.priority}
				</span>
			</div>
			{/* Description */}
			{task.description && (
				<p className="text-xs text-muted-foreground mt-1 line-clamp-2">
					{task.description}
				</p>
			)}
			{/* Footer */}
			<div className="flex items-center justify-between mt-3">
				<div className="flex items-center gap-2">
					<span className="text-[10px] text-muted-foreground uppercase tracking-wider">
						{task.status}
					</span>
					<div className="flex items-center gap-1 text-[11px] text-white bg-orange-400 px-2 py-0.5 rounded-md border dark:border-white/10 py-1">
						<CalendarDays size={"15"} />
						<span>{task.dueDate?.toLocaleDateString()}</span>{" "}
					</div>
				</div>

				{task.assignee ? (
					<Avatar>
						<AvatarImage src="https://github.com/shadcn.png" />
						<AvatarFallback>{initials(task.assignee)}</AvatarFallback>
					</Avatar>
				) : (
					<div className="h-5 w-5 rounded-full border border-dashed flex items-center justify-center text-muted-foreground">
						<User className="h-2.5 w-2.5" />
					</div>
				)}
			</div>
		</Card>
	);
}
