import { pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// Enums
export const projectStatusEnum = pgEnum("project_status", [
	"planned",
	"active",
	"completed",
]);

export const taskStatusEnum = pgEnum("task_status", [
	"todo",
	"in_progress",
	"done",
]);

export const priorityEnum = pgEnum("priority", [
	"low",
	"medium",
	"high",
	"urgent",
]);

// Projects table
export const projects = pgTable("projects", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	description: text("description"),

	status: projectStatusEnum("status").notNull().default("planned"),
	owner: text("owner").notNull(),

	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

// Tasks table
export const tasks = pgTable("tasks", {
	id: text("id").primaryKey(),

	title: text("title").notNull(),
	description: text("description"),

	status: taskStatusEnum("status").notNull().default("todo"),
	priority: priorityEnum("priority").notNull().default("medium"),

	projectId: text("project_id")
		.notNull()
		.references(() => projects.id, { onDelete: "cascade" }),

	assignee: text("assignee"),

	order: serial("order"), // for ordering tasks in UI

	dueDate: timestamp("due_date"),

	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});
