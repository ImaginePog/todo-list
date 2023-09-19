import DOM from "./DOM";
import { format } from "date-fns";
import ProjectManager from "./ProjectManager";
import DisplayManager from "./DisplayManager";

const Handle = (() => {
  const sidebar = DOM.getObject("#aside");
  sidebar.addEventListener("click", (e) => {
    if (!e.target.dataset.action) {
      return;
    }
    if (e.target.dataset.action == "delete") {
      const projId = e.target.closest(".sidebar-project-item").dataset.action;

      ProjectManager.changeState(ProjectManager.STATE_ACTIONS.REMOVE_PROJ, {
        projId,
      });

      DisplayManager.changeView("allproj");
      return;
    }
    DisplayManager.changeView(e.target.dataset.action);
  });

  main.addEventListener("click", (e) => {
    if (e.target.dataset.action) {
      const taskId = e.target.closest(".task-container").dataset.taskId;
      const projId = e.target.closest(".task-container").dataset.projId;

      switch (e.target.dataset.action) {
        case "edit":
          DisplayManager.editTaskModal.open(projId, taskId);
          break;
        case "delete":
          ProjectManager.changeState(ProjectManager.STATE_ACTIONS.REMOVE_TASK, {
            projId,
            taskId,
          });
          break;
        case "complete":
          ProjectManager.changeState(
            ProjectManager.STATE_ACTIONS.TOGGLE_TASK_COMPLETE,
            { projId, taskId }
          );
          break;
      }
      DisplayManager.refreshDisplay();
    } else if (e.target.dataset.tabber) {
      DisplayManager.changeView(e.target.dataset.projId);
    }
  });

  const addTaskForm = DOM.getObject(".add-task-form");
  addTaskForm.addEventListener("click", (e) => {
    if (!e.target.dataset.action) {
      return;
    }
    e.preventDefault();
    const form = e.currentTarget;

    const taskInfo = {};
    taskInfo.name = form["taskName"].value;
    taskInfo.priority = form["taskPriority"].value;
    taskInfo.dueDate = form["duedate"].value;

    ProjectManager.changeState(ProjectManager.STATE_ACTIONS.ADD_TASK, {
      projId: form["projectSelect"].value,
      taskInfo: taskInfo,
    });

    DisplayManager.changeView(form["projectSelect"].value);
    form.reset();
  });

  const addProjectForm = DOM.getObject(".add-project-form");
  addProjectForm.addEventListener("click", (e) => {
    if (!e.target.dataset.action) {
      return;
    }

    e.preventDefault();
    const form = e.currentTarget;

    ProjectManager.changeState(ProjectManager.STATE_ACTIONS.ADD_PROJ, {
      projName: form["projectName"].value,
    });

    DisplayManager.changeView(
      ProjectManager.getProjectId(form["projectName"].value)
    );
    form.reset();
  });

  const editTaskForm = DOM.getObject(".edit-task-form");
  editTaskForm.addEventListener("click", (e) => {
    if (!e.target.dataset.action) {
      return;
    }
    e.preventDefault();

    const form = e.currentTarget;

    const taskInfo = {};
    taskInfo.name = form["taskName"].value;
    taskInfo.priority = form["taskPriority"].value;
    taskInfo.dueDate = form["duedate"].value;

    ProjectManager.changeState(ProjectManager.STATE_ACTIONS.EDIT_TASK, {
      projId: e.target.dataset.projId,
      taskId: e.target.dataset.taskId,
      taskInfo,
    });

    DisplayManager.editTaskModal.close();
    DisplayManager.refreshDisplay();
  });

  ProjectManager.populateProjects();
  DisplayManager.changeView("0");
})();

export default Handle;
