export default class Project {
	#tasks;

	constructor(projName) {
		this.name = projName;
		this.#tasks = [];
	}

	addTask(task) {
		this.#tasks.push(task);
	}

	removeTask(taskId) {
		if (taskId >= 0 && taskId < this.#tasks.length) {
			this.#tasks.splice(taskId, 1);
		}
	}

	editTask(taskId, newTask) {
		this.#tasks[taskId] = newTask;
	}

	get tasks() {
		return this.#tasks;
	}
}
