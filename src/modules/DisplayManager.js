import ProjectManager from "./ProjectManager";
import DOM from "./DOM";
import { format } from "date-fns";

const DisplayManager = (() => {
  let currentView = "";

  function renderSidebarProjects() {
    const projectListSide = DOM.getObject(".sidebar-project-list");
    DOM.addProperties(projectListSide, { innerText: "" });

    ProjectManager.getAllProjects().forEach((project) => {
      if (project.id == 0) {
        return;
      }

      const item = DOM.createElement("li", {
        innerText: project.name,
        classList: ["tab", "sidebar-project-item"],
        dataset: {
          action: project.id,
        },
      });

      const deleteProjBtn = DOM.createElement("button", {
        innerText: "Delete",
        dataset: {
          action: "delete",
        },
        classList: [".delete-project-btn"],
      });
      item.append(deleteProjBtn);

      projectListSide.append(item);
    });
    DOM.reloadObject(".tab");
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

  function createTaskItems(tasks) {
    const frag = DOM.getFragment();
    tasks.forEach((task) => {
      const item = DOM.createElement("li", {
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
          projId: task.projectId,
          action: "complete",
        },
      });

      const starBtn = DOM.createElement("button", {
        innerText: "star",
        dataset: {
          action: "star",
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

      item.append(starBtn, editBtn, deleteBtn);
      frag.append(item);
    });
    return frag;
  }

  function createTaskList(listName, tasks) {
    const frag = DOM.getFragment();
    const h1 = DOM.createElement("h1", {
      innerText: listName,
    });

    const list = DOM.createElement("ul");
    list.append(createTaskItems(tasks));

    frag.append(h1, list);
    return frag;
  }

  function renderProjectTab(projId) {
    DOM.addProperties(main, { innerText: "" });

    const selectedProj = ProjectManager.getProject(projId);

    const list = createTaskList(
      selectedProj.name + " tasks",
      selectedProj.getIncompleteTasks()
    );

    main.append(list);
  }

  function renderTodayTab() {
    DOM.addProperties(main, { innerText: "" }); //CLEAR DISPLAY

    let todayTasks = [];
    ProjectManager.getAllProjects().forEach((project) => {
      const tasks = project.getTasksDueToday();
      todayTasks = [...todayTasks, ...tasks];
    });
    const list = createTaskList("Today", todayTasks);

    main.append(list);
  }

  function renderThisWeekTab() {
    DOM.addProperties(main, { innerText: "" });
    let weekTasks = [];

    ProjectManager.getAllProjects().forEach((project) => {
      const tasks = project.getTasksDueThisWeek();
      weekTasks = [...weekTasks, ...tasks];
    });

    const list = createTaskList("This week", weekTasks);

    main.append(list);
  }

  function renderStarredTab() {
    DOM.addProperties(main, { innerText: "" });
    let starredTasks = [];

    ProjectManager.getAllProjects().forEach((project) => {
      const tasks = project.getStarredTasks();
      starredTasks = [...starredTasks, ...tasks];
    });

    const list = createTaskList("Starred", starredTasks);

    main.append(list);
  }

  function renderTabSelection(currentView) {
    const tabList = DOM.getObject(".tab");

    for (let i = 0; i < tabList.length; ++i) {
      const tab = tabList[i];
      if (tab.classList.contains("tab-active")) {
        tab.classList.remove("tab-active");
      }

      if (tab.dataset.action == currentView) {
        tab.classList.add("tab-active");
      }
    }
  }

  function renderCurrentView() {
    switch (currentView) {
      case "allproj":
        renderAllProjectsTab();
        break;
      case "today":
        renderTodayTab();
        break;
      case "week":
        renderThisWeekTab();
        break;
      case "starred":
        renderStarredTab();
        break;
      default:
        renderProjectTab(currentView);
    }

    renderTabSelection(currentView);
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
