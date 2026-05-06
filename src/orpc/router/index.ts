import {
	createProject,
	deleteProject,
	getProjectById,
	listProjects,
	updateProject,
} from "./projects";
import { createTask, deleteTask, listTasks, updateTask } from "./tasks";

export default {
	tasks: {
		list: listTasks,
		create: createTask,
		update: updateTask,
		delete: deleteTask,
	},
	projects: {
		list: listProjects,
		create: createProject,
		update: updateProject,
		delete: deleteProject,
		getProjectById: getProjectById,
	},
};
