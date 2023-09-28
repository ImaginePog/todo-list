import { isSameWeek, isToday } from "date-fns";
import Task from "./Task";

export default class Project {
  constructor(projName, id) {
    this.name = projName;
    this.tasks = [];
    this.id = id;
  }

  addTask(taskInfo) {
    this.tasks.push(new Task(taskInfo, this.tasks.length, this.id));
  }

  removeTask(taskId) {
    this.tasks = this.tasks.filter((task) => task.id != taskId);
    this.tasks.forEach((task, index) => {
      task.id = index;
    });
  }

  editTask(taskId, newTaskInfo) {
    newTaskInfo.creationDate = this.tasks[taskId].creationDate;
    newTaskInfo.starred = this.tasks[taskId].starred;
    this.tasks[taskId] = new Task(newTaskInfo, taskId, this.id);
  }

  getTasksDueToday() {
    const tasks = this.getPendingTasks();
    return tasks.filter((task) => {
      if (task.dueDate) return isToday(task.dueDate);
    });
  }

  getTasksDueThisWeek() {
    const tasks = this.getPendingTasks();

    return tasks.filter((task) => {
      if (task.dueDate && !task.overdue) {
        return isSameWeek(Date.now(), task.dueDate);
      }
    });
  }

  getPendingTasks() {
    return this.tasks.filter((task) => !task.completed && !task.overdue);
  }

  getCompleteTasks() {
    return this.tasks.filter((task) => task.completed);
  }

  getOverdueTasks() {
    return this.tasks.filter((task) => task.overdue);
  }

  getStarredTasks() {
    return this.tasks.filter((task) => task.starred);
  }

  toggleTaskStatus(taskId) {
    this.tasks[taskId].toggleStatus();
  }

  toggleTaskStar(taskId) {
    this.tasks[taskId].toggleStar();
  }
}
