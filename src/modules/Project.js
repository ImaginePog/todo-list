import { isToday } from "date-fns";
import Task from "./Task";

export default class Project {
	#tasks;

	constructor(projName) {
		this.name = projName;
		this.#tasks = [];
	}

	addTask(taskInfo) {
		this.#tasks.push(new Task(taskInfo));
	}

	removeTask(taskId) {
		if (taskId >= 0 && taskId < this.#tasks.length) {
			this.#tasks.splice(taskId, 1);
		}
	}

	editTask(taskId, newTaskInfo) {
		this.#tasks[taskId] = new Task(newTaskInfo);
	}

	getTasksDueToday() {
		return this.#tasks.filter((task) => isToday(task.dueDate));
	}

	getIncompleteTasks() {
		return this.#tasks.filter((task) => task.completed);
	}

	get tasks() {
		return this.#tasks;
	}
}
