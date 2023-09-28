import DOM from "./DOM";
import ProjectManager from "./ProjectManager";
import DisplayManager from "./DisplayManager";

//IIFE module responsible for handling all the events from the user
//Calls all the suitable modules' functions based on the inputs from the user
const Handle = (() => {
  function handleSidebarClick(e) {
    if (!e.target.dataset.action) {
      return;
    }

    switch (e.target.dataset.action) {
      case "delete":
        const projId = e.target.closest(".sidebar-project-item").dataset.action;

        ProjectManager.changeState(ProjectManager.STATE_ACTIONS.REMOVE_PROJ, {
          projId,
        });

        DisplayManager.changeView("allproj");
        break;
      case "add":
        DisplayManager.modals.addModal.open(
          DOM.getObject(".add-project-modal")
        );

        break;
      default:
        DisplayManager.changeView(e.target.dataset.action);
    }
  }

  function handleMainClick(e) {
    if (e.target.dataset.action) {
      const taskId = e.target.closest(".task-container").dataset.taskId;
      const projId = e.target.closest(".task-container").dataset.projId;

      switch (e.target.dataset.action) {
        case "edit":
          DisplayManager.modals.editTaskModal.open(projId, taskId);
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
          DisplayManager.modals.detailsModal.open(projId, taskId);
          break;
      }
      DisplayManager.refreshDisplay();
    } else if (e.target.dataset.tabber) {
      DisplayManager.changeView(e.target.dataset.projId);
    }
  }

  function handleAddModalBtn(e) {
    DisplayManager.modals.addModal.open(DOM.getObject(".add-task-modal"));
  }

  function handleModalOverlayClick(e) {
    if (!e.target.dataset.action) {
      return;
    }

    if (e.target.dataset.action === "close") {
      DisplayManager.modals.close();
    }
  }

  function handleAddTaskFormClick(e) {
    if (!e.target.dataset.action) {
      return;
    }

    switch (e.target.dataset.action) {
      case "priorityChange":
        DisplayManager.modals.addModal.changeSelectedPriority(
          e.target.closest(".priority-btn")
        );
        break;
    }
  }

  function handleAddTaskFormSubmit(e) {
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

    DisplayManager.modals.close();
    DisplayManager.changeView(project);
  }

  function handleAddProjectFormSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    let name = form["projectName"].value;

    ProjectManager.changeState(ProjectManager.STATE_ACTIONS.ADD_PROJ, {
      projName: name,
    });

    DisplayManager.modals.close();
    DisplayManager.changeView(ProjectManager.getProjectId(name));
  }

  function handleEditTaskFormClick(e) {
    if (!e.target.dataset.action) {
      return;
    }

    switch (e.target.dataset.action) {
      case "priorityChange":
        DisplayManager.modals.editTaskModal.changeSelectedPriority(
          e.target.closest(".priority-btn")
        );
        break;
    }
  }

  function handleEditTaskFormSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;

    const taskInfo = {};
    taskInfo.name = form["taskName"].value;

    let priority = null;
    const priorityBtns = DOM.getObject(".priority-btn");
    priorityBtns.forEach((btn) => {
      if (btn.classList.contains("selected-priority")) {
        priority = btn.dataset.value;
      }
    });

    taskInfo.priority = priority;
    taskInfo.dueDate = form["duedate"].value;
    taskInfo.description = form[1].value;

    ProjectManager.changeState(ProjectManager.STATE_ACTIONS.EDIT_TASK, {
      projId: e.target.dataset.projId,
      taskId: e.target.dataset.taskId,
      taskInfo,
    });

    DisplayManager.modals.close();
    DisplayManager.refreshDisplay();
  }

  //Initializes all the even listeners to the respective objects
  function initEventHandlers() {
    const sidebar = DOM.getObject("#aside");
    const addModalBtn = DOM.getObject(".main-add-modal-btn");
    const modalOverlay = DOM.getObject(".modal-overlay");
    const addTaskForm = DOM.getObject(".add-task-form");
    const addProjectForm = DOM.getObject(".add-project-form");
    const editTaskForm = DOM.getObject(".edit-task-form");

    sidebar.addEventListener("click", handleSidebarClick);
    main.addEventListener("click", handleMainClick);
    addModalBtn.addEventListener("click", handleAddModalBtn);
    modalOverlay.addEventListener("click", handleModalOverlayClick);
    addTaskForm.addEventListener("click", handleAddTaskFormClick);
    addTaskForm.addEventListener("submit", handleAddTaskFormSubmit);
    addProjectForm.addEventListener("submit", handleAddProjectFormSubmit);
    editTaskForm.addEventListener("click", handleEditTaskFormClick);
    editTaskForm.addEventListener("submit", handleEditTaskFormSubmit);
  }

  return { initEventHandlers };
})();

export default Handle;
