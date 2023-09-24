import ProjectManager from "./ProjectManager";
import DOM from "./DOM";
import { format } from "date-fns";

import trashIcon from "../assets/images/icons8-trash-32.png";
import editIcon from "../assets/images/icons8-edit-32.png";
import starUncheckedIcon from "../assets/images/icons8-star-32-outline.png";
import starCheckedIcon from "../assets/images/icons8-star-32-filled.png";
import closeIcon from "../assets/images/icons8-close-48.png";
import uncheckedBox from "../assets/images/icons8-unchecked-checkbox-32.png";
import checkedBox from "../assets/images/icons8-checked-checkbox-32.png";

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
      if (project.id == currentView) {
        DOM.addProperties(opt, {
          attributes: {
            selected: true,
          },
        });
      }
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
          action: "details",
        },
      });

      const completeBtn = DOM.createElement("button", {
        classList: ["task-complete-btn", "icon-btn"],
      });
      let checkBtnSrc;
      if (task.completed) {
        checkBtnSrc = checkedBox;
      } else {
        checkBtnSrc = uncheckedBox;
      }
      const checkImg = DOM.createElement("img", {
        src: checkBtnSrc,
        classList: ["icon"],
        dataset: {
          action: "complete",
        },
      });
      completeBtn.append(checkImg);

      const taskTitle = DOM.createElement("div", {
        innerText: task.name,
        classList: ["task-title"],
        dataset: {
          action: "details",
        },
      });
      if (task.completed) {
        DOM.addProperties(taskTitle, { classList: ["completed-task"] });
        DOM.addProperties(item, { classList: ["completed-task-container"] });
      }

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

      item.append(completeBtn, taskTitle, taskDue, optionButtons);
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

    const tasks = [
      ...selectedProj.getIncompleteTasks(),
      ...selectedProj.getCompleteTasks(),
    ];
    const list = createTaskList(tasks);

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

  function openDetailsModal(projId, taskId) {
    const modal = DOM.getObject(".details-modal");
    const project = ProjectManager.getProject(projId);
    const taskInfo = project.tasks[taskId];

    const container = DOM.createElement("div", {
      classList: ["details-container"],
    });

    const head = DOM.createElement("div", {
      classList: ["details-header"],
    });
    const taskDetailsTitle = DOM.createElement("h3", {
      innerText: taskInfo.name,
      classList: ["task-details-title"],
    });
    const closeBtn = DOM.createElement("button", {
      classList: ["close-details-btn", "icon-btn"],
    });
    const closeBtnImg = DOM.createElement("img", {
      src: closeIcon,
      classList: ["icon"],
      dataset: {
        action: "close",
      },
    });
    closeBtn.append(closeBtnImg);

    head.append(taskDetailsTitle, closeBtn);

    const body = DOM.createElement("div", {
      classList: ["details-body"],
    });

    const taskParent = DOM.createElement("div", {
      innerText: "Project: " + project.name,
    });

    let statusText = "";
    let dueDate = null;
    if (taskInfo.completed) {
      statusText = "Completed";
    } else {
      statusText = "Incomplete";
      let dueText = "";
      if (taskInfo.dueDate) {
        dueText = format(taskInfo.dueDate, "MMMM-do,yyyy");
        if (taskInfo.overdue) {
          dueText += " (overdue)";
        }
      } else {
        dueText = "No due";
      }
      dueDate = DOM.createElement("div", {
        innerText: "Due On: " + dueText,
      });
    }
    const status = DOM.createElement("div", {
      innerText: "Status: " + statusText,
    });
    body.append(taskParent, status);
    if (dueDate) {
      body.append(dueDate);
    }

    const priority = DOM.createElement("div", {
      innerText: "Priority: " + taskInfo.priority,
    });

    let descriptionText = "No description";
    if (taskInfo.description) {
      descriptionText = description;
    }
    const description = DOM.createElement("div", {
      innerText: "Description: " + descriptionText,
    });

    const creationDate = DOM.createElement("div", {
      innerText: "Created on: " + format(taskInfo.creationDate, "MMMM-do,yyyy"),
    });

    body.append(priority, description, creationDate);

    container.append(head, body);
    modal.append(container);

    DOM.removeProperties(modal, { classList: ["hide"] });
  }

  function closeDetailsModal() {
    const modal = DOM.getObject(".details-modal");
    DOM.addProperties(modal, { classList: ["hide"], innerText: "" });
  }

  function changeSelectedPriority(activeBtn) {
    const btns = DOM.getObject(".priority-btn");
    btns.forEach((btn) => {
      if (btn.classList.contains("selected-priority")) {
        btn.classList.remove("selected-priority");
        switch (btn.dataset.value) {
          case "high":
            DOM.removeProperties(btn, {
              classList: ["high-selected"],
            });
            break;
          case "none":
            DOM.removeProperties(btn, {
              classList: ["none-selected"],
            });
            break;
          case "low":
            DOM.removeProperties(btn, {
              classList: ["low-selected"],
            });
            break;
        }
        return;
      }
    });

    activeBtn.classList.add("selected-priority");
    switch (activeBtn.dataset.value) {
      case "high":
        DOM.addProperties(activeBtn, {
          classList: ["high-selected"],
        });
        break;
      case "none":
        DOM.addProperties(activeBtn, {
          classList: ["none-selected"],
        });
        break;
      case "low":
        activeBtn.classList.add("low-selected");
        DOM.addProperties(activeBtn, {
          classList: ["low-selected"],
        });
        break;
    }
  }

  function openAddModal(modal) {}

  function closeAddModals() {}

  return {
    refreshDisplay,
    editTaskModal: { open: openEditTaskModal, close: closeEditTaskModal },
    detailsModal: { open: openDetailsModal, close: closeDetailsModal },
    addModal: {
      open: openAddModal,
      close: closeAddModals,
      changeSelectedPriority,
    },
    changeView,
  };
})();

export default DisplayManager;
