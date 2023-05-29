import { parseISO } from "date-fns";

export default class Task {
	#creationDate;
	#completed;

	constructor(taskInfo, id, projectId) {
		this.name = taskInfo.name;
		this.#creationDate = new Date();
		this.dueDate = parseISO(taskInfo.dueDate);
		this.#completed = false;
		this.priority = taskInfo.priority;
		this.description = taskInfo.description;
		this.starred = taskInfo.starred;
		this.projectId = projectId;
		this.id = id;
	}

	toggleStatus() {
		if (this.#completed) {
			this.#completed = false;
		} else {
			this.#completed = true;
		}
	}

	get completed() {
		return this.#completed;
	}

	get creationDate() {
		return this.#creationDate;
	}
}
