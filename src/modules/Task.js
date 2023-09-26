import { isAfter, parseISO } from "date-fns";

export default class Task {
  constructor(taskInfo, id, projectId) {
    this.name = taskInfo.name;
    if (taskInfo.creationDate) {
      if (taskInfo.creationDate instanceof Date) {
        this.creationDate = taskInfo.creationDate;
      } else {
        this.creationDate = parseISO(taskInfo.creationDate);
      }
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

    if (taskInfo.completed != undefined) {
      this.completed = taskInfo.completed;
    } else {
      this.completed = false;
    }
    this.priority = taskInfo.priority;
    this.description = taskInfo.description;

    if (taskInfo.starred != undefined) {
      this.starred = taskInfo.starred;
    } else {
      this.starred = false;
    }
    this.projectId = projectId;
    this.id = id;
  }

  toggleStatus() {
    if (this.completed) {
      this.completed = false;

      let now = new Date();
      now = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      this.overdue = isAfter(now, this.dueDate);
    } else {
      this.completed = true;
      this.overdue = false;
    }
  }

  toggleStar() {
    if (this.starred != undefined) {
      this.starred = !this.starred;
    }
  }
}
