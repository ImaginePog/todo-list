import { format } from "date-fns";
import ProjectManager from "./ProjectManager";

const Handle = (() => {
  const main = document.querySelector("#main");
  const projectListSide = document.querySelector(".sidebar-project-list");

  const addTaskForm = document.querySelector(".add-task-form");
  const projectSelect = addTaskForm.querySelector("#project-select");

  const addProjectForm = document.querySelector(".add-project-form");

  const editTaskForm = document.querySelector(".edit-task-form");

  function OpenEditModal(projId, taskId) {
    const task = ProjectManager.getProject(projId).tasks[taskId];
    editTaskForm["taskName"].value = task.name;
    editTaskForm["taskPriority"].value = task.priority;
    if (task.dueDate) {
      editTaskForm["duedate"].value = format(task.dueDate, "yyyy-MM-dd");
    }
    editTaskForm["editbtn"].dataset.projId = projId;
    editTaskForm["editbtn"].dataset.taskId = taskId;

    editTaskForm.classList.remove("hide");
  }

  function CloseEditTaskModal() {
    editTaskForm.classList.add("hide");
    editTaskForm.reset();
  }

  function DisplayAllProjects() {
    const frag = document.createDocumentFragment();

    const h1 = document.createElement("h1");
    h1.innerText = "All projects: ";

    const list = document.createElement("list");
    ProjectManager.getAllProjects().forEach((project) => {
      const item = document.createElement("item");
      item.innerText =
        "Name: " + project.name + " No. of tasks: " + project.tasks.length;
      item.classList.add("project-container");
      item.dataset.projId = project.id;
      item.dataset.tabber = "project";
      list.appendChild(item);
    });

    frag.append(h1, list);

    main.innerText = "";
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

  const sidebar = document.querySelector("#aside");
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
    const frag = document.createDocumentFragment();

    const selectedProj = ProjectManager.getProject(projId);

    const h1 = document.createElement("h1");
    h1.innerText = selectedProj.name + " tasks:";

    const list = document.createElement("list");
    selectedProj.getIncompleteTasks().forEach((task, index) => {
      const item = document.createElement("item");
      item.innerText =
        "Task name: " +
        task.name +
        " creation date " +
        task.creationDate +
        "due date: " +
        task.dueDate;
      item.classList.add(task.priority, "task-container");
      item.dataset.taskId = index;
      item.dataset.projId = selectedProj.id;
      item.dataset.action = "complete";

      const editBtn = document.createElement("button");
      editBtn.innerText = editBtn.dataset.action = "edit";
      const deleteBtn = document.createElement("button");
      deleteBtn.innerText = deleteBtn.dataset.action = "delete";

      item.append(editBtn, deleteBtn);
      list.append(item);
    });

    frag.append(h1, list);

    main.innerText = "";
    main.append(frag);
  }

  function RenderSidebarProjects() {
    projectListSide.innerText = "";
    ProjectManager.getAllProjects().forEach((project, index) => {
      const item = document.createElement("item");
      item.innerText = project.name;
      item.classList.add("tab", "sidebar-project-item");
      item.dataset.action = "project";
      item.dataset.projId = index;

      if (index != 0) {
        const deleteProjBtn = document.createElement("button");
        deleteProjBtn.innerText = "Delete";
        deleteProjBtn.dataset.action = "delete";
        deleteProjBtn.classList.add(".delete-project-btn");
        item.append(deleteProjBtn);
      }

      projectListSide.append(item);
    });
  }

  function PopulateProjectSelect() {
    const frag = document.createDocumentFragment();

    ProjectManager.getAllProjects().forEach((project) => {
      const opt = document.createElement("option");
      opt.value = project.id;
      opt.innerText = project.name;
      frag.append(opt);
    });

    projectSelect.innerText = "";
    projectSelect.append(frag);
  }

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
