export default class Project {
	#tasks;

	constructor(projName) {
		this.name = projName;
		this.#tasks = [];
	}

	addTask(task) {
		this.#tasks.push(task);
	}

	removeTask(index) {
		if (index >= 0 && index < this.#tasks.length) {
			this.#tasks.splice(index, 1);
		}
	}

	get tasks() {
		return this.#tasks;
	}
}
