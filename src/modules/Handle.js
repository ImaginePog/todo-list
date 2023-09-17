import { format } from "date-fns";
import Project from "./Project";

const Handle = (() => {
  const main = document.querySelector("#main");
  const projectListSide = document.querySelector(".sidebar-project-list");

  const addTaskForm = document.querySelector(".add-task-form");
  const projectSelect = addTaskForm.querySelector("#project-select");

  const addProjectForm = document.querySelector(".add-project-form");

  const editTaskForm = document.querySelector(".edit-task-form");

  let projects = [];

  function AddProject(projName) {
    projects.push(new Project(projName, projects.length));

    UpdateStorage();
  }

  function RemoveProject(projId) {
    projects = projects.filter((project) => project.id != projId);
    projects.forEach((project, index) => {
      project.id = index;
    });
    UpdateStorage();
  }

  function AddTaskToProject(projId, taskInfo) {
    projects[projId].addTask(taskInfo);
    UpdateStorage();
  }

  function RemoveTaskFromProject(projId, taskId) {
    projects[projId].removeTask(taskId);
    UpdateStorage();
  }

  function EditTaskFromProject(projId, taskId, taskInfo) {
    projects[projId].editTask(taskId, taskInfo);
    UpdateStorage();
  }

  function ToggleTaskCompletion(projId, taskId) {
    projects[projId].toggleTaskStatus(taskId);
    UpdateStorage();
  }

  function UpdateStorage() {
    localStorage.setItem("projectList", JSON.stringify(projects));

    if (JSON.parse(localStorage.getItem("projectList")).length == 0) {
      localStorage.removeItem("projectList");
    }
  }

  function OpenEditModal(projId, taskId) {
    const task = projects[projId].tasks[taskId];
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
    projects.forEach((project) => {
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

      RemoveProject(projId);

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
          RemoveTaskFromProject(projId, taskId);
          break;
        case "complete":
          ToggleTaskCompletion(projId, taskId);
          break;
      }
      DisplayProject(projId);
    } else if (e.target.dataset.tabber) {
      ChangeView(e.target.dataset.tabber, e.target.dataset.projId);
    }
  });

  function DisplayProject(projId) {
    const frag = document.createDocumentFragment();

    const selectedProj = projects[projId];

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
    projects.forEach((project, index) => {
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

    projects.forEach((project) => {
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

    AddTaskToProject(form["projectSelect"].value, taskInfo);
    DisplayProject(form["projectSelect"].value);
    form.reset();
  });

  addProjectForm.addEventListener("click", (e) => {
    if (!e.target.dataset.action) {
      return;
    }
    e.preventDefault();
    const form = e.currentTarget;

    AddProject(form["projectName"].value);

    form.reset();

    ChangeView("project", projects.length - 1);
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

    EditTaskFromProject(
      e.target.dataset.projId,
      e.target.dataset.taskId,
      taskInfo
    );

    CloseEditTaskModal();

    ChangeView("project", projects.length - 1);
  });

  function PopulateProjects() {
    if (!localStorage.getItem("projectList")) {
      AddProject("Home");
      return;
    }

    const projectData = JSON.parse(localStorage.getItem("projectList"));

    projectData.forEach((data) => {
      AddProject(data.name);
      data.tasks.forEach((task) => {
        AddTaskToProject(data.id, task);
      });
    });
  }

  PopulateProjects();
  RenderSidebarProjects();
  PopulateProjectSelect();
  ChangeView("allproj");
})();

export default Handle;
