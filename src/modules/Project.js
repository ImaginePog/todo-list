import { isSameWeek, isToday } from "date-fns";
import Task from "./Task";

//Class to represent a todo project
//Contains all the information for the project and contains its tasks
//Responsible for returning filtered tasks
export default class Project {
  constructor(projName, id) {
    this.name = projName;
    this.tasks = [];
    this.id = id;
  }

  //Add new task based on the task info
  addTask(taskInfo) {
    this.tasks.push(new Task(taskInfo, this.tasks.length, this.id));
  }

  //Removes a task based on the given id and reset other tasks id
  removeTask(taskId) {
    this.tasks = this.tasks.filter((task) => task.id != taskId);
    this.tasks.forEach((task, index) => {
      task.id = index;
    });
  }

  //Edits the task with the given task id
  editTask(taskId, newTaskInfo) {
    newTaskInfo.creationDate = this.tasks[taskId].creationDate;
    newTaskInfo.starred = this.tasks[taskId].starred;
    this.tasks[taskId] = new Task(newTaskInfo, taskId, this.id);
  }

  //Returns filtered tasks due "today"
  getTasksDueToday() {
    const tasks = this.getPendingTasks();
    return tasks.filter((task) => {
      if (task.dueDate) return isToday(task.dueDate);
    });
  }

  //Returns filtered tasks due "this week"
  getTasksDueThisWeek() {
    const tasks = this.getPendingTasks();

    return tasks.filter((task) => {
      if (task.dueDate && !task.overdue) {
        return isSameWeek(Date.now(), task.dueDate);
      }
    });
  }

  //Returns filtered tasks that are pending(not complete and not overdue)
  getPendingTasks() {
    return this.tasks.filter((task) => !task.completed && !task.overdue);
  }

  //Returns all completed tasks
  getCompleteTasks() {
    return this.tasks.filter((task) => task.completed);
  }

  //Returns all overdue tasks
  getOverdueTasks() {
    return this.tasks.filter((task) => task.overdue);
  }

  //Returns tasks that are starred
  getStarredTasks() {
    return this.tasks.filter((task) => task.starred);
  }

  //Toggles completion of the task with the given id
  toggleTaskStatus(taskId) {
    this.tasks[taskId].toggleStatus();
  }

  //Toggles starred status of the task with the given id
  toggleTaskStar(taskId) {
    this.tasks[taskId].toggleStar();
  }
}
