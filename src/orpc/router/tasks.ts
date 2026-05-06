import { db } from "#/db";
import { tasks } from "#/db/schema";
import { os } from "@orpc/server";
import { eq } from "drizzle-orm";
import * as z from "zod";

export const listTasks = os
	.input(z.object({ projectId: z.string() }))
	.handler(async ({ input }) => {
		return await db
			.select()
			.from(tasks)
			.where(eq(tasks.projectId, input.projectId));
	});

export const createTask = os
	.input(
		z.object({
			title: z.string(),
			description: z.string().optional(),
			projectId: z.string(),
			priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
			assignee: z.string().optional(),
			dueDate: z.date().optional(),
		}),
	)
	.handler(async ({ input }) => {
		const [newTask] = await db
			.insert(tasks)
			.values({
				id: `task_${Date.now()}`,
				title: input.title,
				description: input.description,
				projectId: input.projectId,
				priority: input.priority || "medium",
				assignee: input.assignee,
				dueDate: input.dueDate,
			})
			.returning();
		return newTask;
	});

export const updateTask = os
	.input(
		z.object({
			id: z.string(),
			title: z.string().optional(),
			description: z.string().optional(),
			status: z.enum(["todo", "in_progress", "done"]).optional(),
			priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
			assignee: z.string().optional(),
			dueDate: z.date().optional(),
		}),
	)
	.handler(async ({ input }) => {
		const { id, ...updates } = input;
		const [updated] = await db
			.update(tasks)
			.set(updates)
			.where(eq(tasks.id, id))
			.returning();
		return updated;
	});

export const deleteTask = os
	.input(z.object({ id: z.string() }))
	.handler(async ({ input }) => {
		await db.delete(tasks).where(eq(tasks.id, input.id));
		return { success: true };
	});
