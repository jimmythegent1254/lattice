import { db } from "#/db";
import { projects } from "#/db/schema";
import { os } from "@orpc/server";
import { eq } from "drizzle-orm";
import z from "zod";

export const listProjects = os
	.input(z.object({ owner: z.string() }))
	.handler(async ({ input }) => {
		return await db
			.select()
			.from(projects)
			.where(eq(projects.owner, input.owner));
	});

export const getProjectById = os
	.input(z.object({ projectId: z.string() }))
	.handler(async ({ input }) => {
		return await db.query.projects.findFirst({
			where: eq(projects.id, input.projectId),
		});
	});

export const createProject = os
	.input(
		z.object({
			name: z.string(),
			description: z.string().optional(),
			owner: z.string(),
			status: z.enum(["planned", "active", "completed"]).optional(),
		}),
	)
	.handler(async ({ input }) => {
		const [newProject] = await db
			.insert(projects)
			.values({
				id: `project_${Date.now()}`,
				name: input.name,
				description: input.description,
				owner: input.owner,
				status: input.status || "planned",
			})
			.returning();
		return newProject;
	});

export const updateProject = os
	.input(
		z.object({
			id: z.string(),
			name: z.string().optional(),
			description: z.string().optional(),
			status: z.enum(["planned", "active", "completed"]).optional(),
		}),
	)
	.handler(async ({ input }) => {
		const { id, ...updates } = input;
		const [updated] = await db
			.update(projects)
			.set(updates)
			.where(eq(projects.id, id))
			.returning();
		return updated;
	});

export const deleteProject = os
	.input(z.object({ id: z.string() }))
	.handler(async ({ input }) => {
		await db.delete(projects).where(eq(projects.id, input.id));
		return { success: true };
	});
