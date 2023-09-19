import ProjectManager from "./ProjectManager";
import DOM from "./DOM";

const DisplayManager = (() => {
  let currentView = "";

  function renderSidebarProjects() {
    const projectListSide = DOM.getObject(".sidebar-project-list");
    DOM.addProperties(projectListSide, { innerText: "" });

    ProjectManager.getAllProjects().forEach((project) => {
      const item = DOM.createElement("li", {
        innerText: project.name,
        classList: ["tab", "sidebar-project-item"],
        dataset: {
          action: project.id,
        },
      });

      if (project.id != 0) {
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

  function renderProjectSelect() {
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

  function renderAllProjectsTab() {
    const main = DOM.getObject("#main");

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

  function renderProjectTab(projId) {
    const frag = DOM.getFragment();

    const selectedProj = ProjectManager.getProject(projId);

    const h1 = DOM.createElement("h1", {
      innerText: selectedProj.name + " tasks:",
    });

    const list = DOM.createElement("ul");
    selectedProj.getIncompleteTasks().forEach((task) => {
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
          taskId: task.id,
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

  function renderCurrentView() {
    switch (currentView) {
      case "allproj":
        renderAllProjectsTab();
        break;
      default:
        renderProjectTab(currentView);
    }
  }

  function changeView(newView) {
    currentView = newView;
    refreshDisplay();
  }

  function refreshDisplay() {
    renderSidebarProjects();
    renderProjectSelect();
    renderCurrentView();
  }

  function openEditTaskModal(projId, taskId) {
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

  function closeEditTaskModal() {
    const editTaskForm = DOM.getObject(".edit-task-form");
    DOM.addProperties(editTaskForm, { classList: ["hide"] });
    editTaskForm.reset();
  }

  return {
    refreshDisplay,
    editTaskModal: { open: openEditTaskModal, close: closeEditTaskModal },
    changeView,
  };
})();

export default DisplayManager;
