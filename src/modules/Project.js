import { isToday } from "date-fns";
import Task from "./Task";

export default class Project {
	#tasks;

	constructor(projName, id) {
		this.name = projName;
		this.#tasks = [];
		this.id = id;
	}

	addTask(taskInfo) {
		this.#tasks.push(new Task(taskInfo, this.#tasks.length, this.id));
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
		const tasks = this.getIncompleteTasks();
		return tasks.filter((task) => {
			if (task.dueDate) return isToday(task.dueDate);
		});
	}

	getIncompleteTasks() {
		return this.#tasks.filter((task) => !task.completed);
	}

	getCompleteTasks() {
		return this.#tasks.filter((task) => task.completed);
	}

	toggleTaskStatus(taskId) {
		this.#tasks[taskId].toggleStatus();
	}

	get tasks() {
		return this.#tasks;
	}
}
