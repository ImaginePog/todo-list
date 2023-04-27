export default class Task {
	#creationDate;
	#starred;

	constructor(taskInfo) {
		taskInfo.status = "incomplete";
		taskInfo.creationDate = new Date();

		this.name = taskInfo.name;
		this.#creationDate = taskInfo.creationDate;
		this.dueDate = taskInfo.dueDate;
		this.status = taskInfo.status;
		this.priority = taskInfo.priority;
		this.description = taskInfo.description;
		this.#starred = taskInfo.starred;
	}

	star() {
		this.#starred = true;
	}

	unstar() {
		this.#starred = false;
	}

	get starred() {
		return this.#starred;
	}

	get creationDate() {
		return this.#creationDate;
	}
}
