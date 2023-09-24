import DOM from "./DOM";
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
        case "star":
          ProjectManager.changeState(ProjectManager.STATE_ACTIONS.STAR_TASK, {
            projId,
            taskId,
          });
          break;
        case "details":
          DisplayManager.detailsModal.open(projId, taskId);
          break;
      }
      DisplayManager.refreshDisplay();
    } else if (e.target.dataset.tabber) {
      DisplayManager.changeView(e.target.dataset.projId);
    }
  });

  const addModalBtn = DOM.getObject(".main-add-modal-btn");
  addModalBtn.addEventListener("click", (e) => {
    DisplayManager.addModal.open(DOM.getObject(".add-task-modal"));
  });

  // const addProjectForm = DOM.getObject(".add-project-form");
  // addProjectForm.addEventListener("click", (e) => {
  //   if (!e.target.dataset.action) {
  //     return;
  //   }

  //   e.preventDefault();
  //   const form = e.currentTarget;

  //   ProjectManager.changeState(ProjectManager.STATE_ACTIONS.ADD_PROJ, {
  //     projName: form["projectName"].value,
  //   });

  //   DisplayManager.changeView(
  //     ProjectManager.getProjectId(form["projectName"].value)
  //   );
  //   form.reset();
  // });

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

  const detailsModal = DOM.getObject(".details-modal");
  detailsModal.addEventListener("click", (e) => {
    if (!e.target.dataset.action) {
      return;
    }
    DisplayManager.detailsModal.close();
  });

  const modalOverlay = DOM.getObject(".modal-overlay");
  modalOverlay.addEventListener("click", (e) => {
    if (!e.target.dataset.action) {
      return;
    }

    if (e.target.dataset.action === "close") {
      DisplayManager.addModal.close();
      DisplayManager.detailsModal.close();
      DisplayManager.editTaskModal.close();
    }
  });

  const addTaskForm = DOM.getObject(".add-task-form");
  addTaskForm.addEventListener("click", (e) => {
    if (!e.target.dataset.action) {
      return;
    }

    switch (e.target.dataset.action) {
      case "priorityChange":
        DisplayManager.addModal.changeSelectedPriority(
          e.target.closest(".priority-btn")
        );
        break;
    }
  });

  addTaskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    const taskInfo = {};
    taskInfo.name = form["taskName"].value;
    taskInfo.description = form[1].value;
    taskInfo.dueDate = form["duedate"].value;
    let priority = null;

    const priorityBtns = DOM.getObject(".priority-btn");
    priorityBtns.forEach((btn) => {
      if (btn.classList.contains("selected-priority")) {
        priority = btn.dataset.value;
      }
    });

    taskInfo.priority = priority;

    const project = form["parentProject"].value;

    ProjectManager.changeState(ProjectManager.STATE_ACTIONS.ADD_TASK, {
      projId: project,
      taskInfo: taskInfo,
    });

    DisplayManager.addModal.close();
    DisplayManager.changeView(project);
  });

  ProjectManager.populateProjects();
  DisplayManager.changeView("0");
})();

export default Handle;
