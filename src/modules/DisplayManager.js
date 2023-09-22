import ProjectManager from "./ProjectManager";
import DOM from "./DOM";
import { format } from "date-fns";

import trashIcon from "../assets/images/icons8-trash-32.png";
import editIcon from "../assets/images/icons8-edit-32.png";
import starUncheckedIcon from "../assets/images/icons8-star-32-outline.png";
import starCheckedIcon from "../assets/images/icons8-star-32-filled.png";

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

      const deleteProjBtn = DOM.createElement("span", {
        classList: ["delete-project-btn"],
      });

      const deleteBtnImg = DOM.createElement("img", {
        src: trashIcon,
        dataset: {
          action: "delete",
        },
      });
      deleteProjBtn.append(deleteBtnImg);

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
    const frag = DOM.getFragment();

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

    DOM.addProperties(DOM.getObject(".dynamic-display"), { innerText: "" });

    frag.append(list);
    DOM.getObject(".dynamic-display").append(frag);
  }

  function createTaskItems(tasks) {
    const frag = DOM.getFragment();
    tasks.forEach((task) => {
      const item = DOM.createElement("li", {
        classList: [task.priority, "task-container"],
        dataset: {
          taskId: task.id,
          projId: task.projectId,
        },
      });

      const checkBtn = DOM.createElement("button", {
        innerText: "check",
        dataset: {
          action: "complete",
        },
      });

      const taskTitle = DOM.createElement("div", {
        innerText: task.name,
        classList: ["task-title"],
      });

      let dueDate = "";
      if (task.dueDate) {
        dueDate = format(task.dueDate, "MMM do");
      } else {
        dueDate = "no due";
      }
      const taskDue = DOM.createElement("div", {
        innerText: dueDate,
        classList: ["task-duedate"],
      });

      const optionButtons = DOM.createElement("div", {
        classList: ["option-btns-container"],
      });

      const starBtn = DOM.createElement("button", {
        classList: ["task-star-btn", "icon-btn"],
      });
      let starIconSrc;
      if (task.starred) {
        starIconSrc = starCheckedIcon;
      } else {
        starIconSrc = starUncheckedIcon;
      }
      const starImg = DOM.createElement("img", {
        src: starIconSrc,
        classList: ["icon"],
        dataset: {
          action: "star",
        },
      });
      starBtn.append(starImg);

      const editBtn = DOM.createElement("button", {
        classList: ["task-edit-btn", "icon-btn"],
      });
      const editImg = DOM.createElement("img", {
        src: editIcon,
        classList: ["icon"],
        dataset: {
          action: "edit",
        },
      });
      editBtn.append(editImg);

      const deleteBtn = DOM.createElement("button", {
        classList: ["task-delete-btn", "icon-btn"],
      });
      const deleteImg = DOM.createElement("img", {
        src: trashIcon,
        classList: ["icon"],
        dataset: {
          action: "delete",
        },
      });
      deleteBtn.append(deleteImg);

      optionButtons.append(starBtn, editBtn, deleteBtn);

      item.append(checkBtn, taskTitle, taskDue, optionButtons);
      frag.append(item);
    });
    return frag;
  }

  function createTaskList(tasks) {
    const frag = DOM.getFragment();

    const list = DOM.createElement("ul", { classList: ["task-list"] });
    list.append(createTaskItems(tasks));

    frag.append(list);
    return frag;
  }

  function renderProjectTab(projId) {
    DOM.addProperties(DOM.getObject(".dynamic-display"), { innerText: "" });

    const selectedProj = ProjectManager.getProject(projId);

    const list = createTaskList(selectedProj.getIncompleteTasks());

    DOM.getObject(".dynamic-display").append(list);
  }

  function renderTodayTab() {
    DOM.addProperties(DOM.getObject(".dynamic-display"), { innerText: "" }); //CLEAR DISPLAY

    let todayTasks = [];
    ProjectManager.getAllProjects().forEach((project) => {
      const tasks = project.getTasksDueToday();
      todayTasks = [...todayTasks, ...tasks];
    });
    const list = createTaskList(todayTasks);

    DOM.getObject(".dynamic-display").append(list);
  }

  function renderThisWeekTab() {
    DOM.addProperties(DOM.getObject(".dynamic-display"), { innerText: "" });
    let weekTasks = [];

    ProjectManager.getAllProjects().forEach((project) => {
      const tasks = project.getTasksDueThisWeek();
      weekTasks = [...weekTasks, ...tasks];
    });

    const list = createTaskList(weekTasks);

    DOM.getObject(".dynamic-display").append(list);
  }

  function renderStarredTab() {
    DOM.addProperties(DOM.getObject(".dynamic-display"), { innerText: "" });
    let starredTasks = [];

    ProjectManager.getAllProjects().forEach((project) => {
      const tasks = project.getStarredTasks();
      starredTasks = [...starredTasks, ...tasks];
    });

    const list = createTaskList(starredTasks);

    DOM.getObject(".dynamic-display").append(list);
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
