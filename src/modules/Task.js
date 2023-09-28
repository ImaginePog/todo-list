import { isAfter, parseISO } from "date-fns";

//Class to represent a todo task
//Contains all the information for the todo task and its parent project's id
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

    this.completed = Boolean(taskInfo.completed);

    if (taskInfo.dueDate) {
      taskInfo.dueDate = parseISO(taskInfo.dueDate);

      let now = new Date();
      now = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      this.overdue = isAfter(now, taskInfo.dueDate) && !this.completed;
      this.dueDate = taskInfo.dueDate;
    } else {
      this.overdue = false;
      this.dueDate = "";
    }

    this.priority = taskInfo.priority;
    this.description = taskInfo.description;

    this.starred = Boolean(taskInfo.starred);
    this.projectId = projectId;
    this.id = id;
  }

  //Toggles completion of a task, also changes overdue status based on its due date
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

  //Toggles task's starred status
  toggleStar() {
    if (this.starred != undefined) {
      this.starred = !this.starred;
    }
  }
}
