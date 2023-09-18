import DOM from "./DOM";
import { format } from "date-fns";
import ProjectManager from "./ProjectManager";

const Handle = (() => {
  function OpenEditModal(projId, taskId) {
    const editTaskForm = DOM.getObject(".edit-task-form");
    const task = ProjectManager.getProject(projId).tasks[taskId];

    DOM.addProperties(editTaskForm["taskName"], { value: task.name });
    DOM.addProperties(editTaskForm["taskPriority"], { value: task.priority });
    if (task.dueDate) {
      DOM.addProperties(editTaskForm["duedate"], {
        value: format(task.dueDate, "yyyy-MM-dd"),
      });
    }

    DOM.addProperties(editTaskForm["editbtn"], {
      dataset: {
        projId,
        taskId,
      },
    });
    DOM.removeProperties(editTaskForm, { classList: ["hide"] });
  }

  function CloseEditTaskModal() {
    DOM.addProperties(editTaskForm, { classList: "hide" });
    editTaskForm.reset();
  }

  function DisplayAllProjects() {
    const frag = DOM.getFragment();

    const h1 = DOM.createElement("h1", { innerText: "All projects" });

    const list = DOM.createElement("ul");
    ProjectManager.getAllProjects().forEach((project) => {
      const item = DOM.createElement("item", {
        innerText:
          "Name: " + project.name + " No. of tasks: " + project.tasks.length,
        classList: ["project-container"],
        dataset: {
          projId: project.id,
          tabber: "project",
        },
      });
      list.appendChild(item);
    });

    DOM.addProperties(main, { innerText: "" });

    frag.append(h1, list);
    main.append(frag);
  }

  function ChangeView(viewtype, viewid) {
    switch (viewtype) {
      case "allproj":
        DisplayAllProjects();
        break;
      case "project":
        DisplayProject(viewid);
        break;
      default:
    }
  }

  const sidebar = DOM.getObject("#aside");
  sidebar.addEventListener("click", (e) => {
    if (!e.target.dataset.action) {
      return;
    }
    if (e.target.dataset.action == "delete") {
      const projId = e.target.closest(".sidebar-project-item").dataset.projId;

      ProjectManager.changeState(ProjectManager.STATE_ACTIONS.REMOVE_PROJ, {
        projId,
      });

      RenderSidebarProjects();
      PopulateProjectSelect();

      ChangeView("allproj");

      return;
    }
    ChangeView(e.target.dataset.action, e.target.dataset.projId);
  });

  main.addEventListener("click", (e) => {
    if (e.target.dataset.action) {
      const taskId = e.target.closest(".task-container").dataset.taskId;
      const projId = e.target.closest(".task-container").dataset.projId;

      switch (e.target.dataset.action) {
        case "edit":
          OpenEditModal(projId, taskId);
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
      DisplayProject(projId);
    } else if (e.target.dataset.tabber) {
      ChangeView(e.target.dataset.tabber, e.target.dataset.projId);
    }
  });

  function DisplayProject(projId) {
    const frag = DOM.getFragment();

    const selectedProj = ProjectManager.getProject(projId);

    const h1 = DOM.createElement("h1", {
      innerText: selectedProj.name + " tasks:",
    });

    const list = DOM.createElement("ul");
    selectedProj.getIncompleteTasks().forEach((task, index) => {
      const item = DOM.createElement("li");
      DOM.addProperties(item, {
        innerText:
          "Task name: " +
          task.name +
          " creation date " +
          task.creationDate +
          "due date: " +
          task.dueDate,
        classList: [task.priority, "task-container"],
        dataset: {
          taskId: index,
          projId: selectedProj.id,
          action: "complete",
        },
      });

      const editBtn = DOM.createElement("button", {
        innerText: "edit",
        dataset: {
          action: "edit",
        },
      });

      const deleteBtn = DOM.createElement("button", {
        innerText: "delete",
        dataset: {
          action: "delete",
        },
      });

      item.append(editBtn, deleteBtn);
      list.append(item);
    });

    frag.append(h1, list);

    DOM.addProperties(main, { innerText: "" });
    main.append(frag);
  }

  function RenderSidebarProjects() {
    const projectListSide = DOM.getObject(".sidebar-project-list");
    DOM.addProperties(projectListSide, { innerText: "" });

    ProjectManager.getAllProjects().forEach((project, index) => {
      const item = DOM.createElement("li", {
        innerText: project.name,
        classList: ["tab", "sidebar-project-item"],
        dataset: {
          action: "project",
          projId: index,
        },
      });

      if (index != 0) {
        const deleteProjBtn = DOM.createElement("button", {
          innerText: "Delete",
          dataset: {
            action: "delete",
          },
          classList: [".delete-project-btn"],
        });
        item.append(deleteProjBtn);
      }

      projectListSide.append(item);
    });
  }

  function PopulateProjectSelect() {
    const projectSelect = DOM.getObject("#project-select");
    const frag = DOM.getFragment();

    ProjectManager.getAllProjects().forEach((project) => {
      const opt = DOM.createElement("option", {
        value: project.id,
        innerText: project.name,
      });
      frag.append(opt);
    });

    DOM.addProperties(projectSelect, { innerText: "" });
    projectSelect.append(frag);
  }

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

    DisplayProject(form["projectSelect"].value);
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

    form.reset();

    ChangeView("project", ProjectManager.getAllProjects().length - 1);
    RenderSidebarProjects();
    PopulateProjectSelect();
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

    CloseEditTaskModal();

    ChangeView("project", ProjectManager.getAllProjects().length - 1);
  });

  ProjectManager.populateProjects();
  RenderSidebarProjects();
  PopulateProjectSelect();
  ChangeView("allproj");
})();

export default Handle;
