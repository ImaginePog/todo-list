export default class Task {
	#creationDate;
	#completed;

	constructor(taskInfo) {
		this.name = taskInfo.name;
		this.#creationDate = new Date();
		this.dueDate = taskInfo.dueDate;
		this.#completed = false;
		this.priority = taskInfo.priority;
		this.description = taskInfo.description;
		this.starred = taskInfo.starred;
	}

	complete() {
		this.#completed = true;
	}

	get creationDate() {
		return this.#creationDate;
	}
}
