import { isAfter, parseISO } from "date-fns";

export default class Task {
  constructor(taskInfo, id, projectId) {
    this.name = taskInfo.name;
    if (taskInfo.creationDate) {
      this.creationDate = taskInfo.creationDate;
    } else {
      this.creationDate = new Date();
    }

    if (taskInfo.dueDate) {
      taskInfo.dueDate = parseISO(taskInfo.dueDate);

      let now = new Date();
      now = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      this.overdue = isAfter(now, taskInfo.dueDate);
      this.dueDate = taskInfo.dueDate;
    } else {
      this.overdue = false;
      this.dueDate = "";
    }

    if (taskInfo.completed) {
      this.completed = true;
    } else {
      this.completed = false;
    }
    this.priority = taskInfo.priority;
    this.description = taskInfo.description;
    this.starred = taskInfo.starred;
    this.projectId = projectId;
    this.id = id;
  }

  toggleStatus() {
    if (this.completed) {
      this.completed = false;

      let now = new Date();
      now = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      this.overdue = isAfter(now, parseISO(this.dueDate));
    } else {
      this.completed = true;
      this.overdue = false;
    }
  }
}
