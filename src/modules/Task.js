export default class Task {
	#creationDate;

	constructor(taskInfo) {
		this.name = taskInfo.name;
		this.#creationDate = new Date();
		this.dueDate = taskInfo.dueDate;
		this.status = incomplete;
		this.priority = taskInfo.priority;
		this.description = taskInfo.description;
		this.starred = taskInfo.starred;
	}

	get creationDate() {
		return this.#creationDate;
	}
}
