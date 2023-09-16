import Project from "./Project";

const Handle = (() => {
  const main = document.querySelector("#main");
  const projectListSide = document.querySelector(".sidebar-project-list");

  const addForm = document.querySelector("add-form");
  const projectSelect = addForm.querySelector("#project-select");

  let projects = [];
  projects.push(new Project("Home", 0));
  projects.push(new Project("TestProj", 1));

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
      list.appendChild(item);
    });

    frag.append(h1, list);

    main.innerText = "";
    main.append(frag);
  }

  const sidebar = document.querySelector("#aside");
  sidebar.addEventListener("click", (e) => {
    if (!e.target.dataset.action) {
      return;
    }
    // console.log("confirmed tab");

    switch (e.target.dataset.action) {
      case "allproj":
        DisplayAllProjects();
        break;
      case "project":
        DisplayProject(e.target.dataset.projId);
        break;
      default:
    }
  });

  main.addEventListener("click", (e) => {
    if (!e.target.dataset.action) {
      return;
    }

    const pressedTask = e.target.closest(".task-container").dataset.taskId;
    const parentProject = e.target.closest(".task-container").dataset.projectId;

    switch (e.target.dataset.action) {
      case "Edit":
        break;
      case "Delete":
        projects[parentProject].removeTask(pressedTask);
        break;
    }
    DisplayProject(parentProject);
  });

  function DisplayProject(projId) {
    const frag = document.createDocumentFragment();

    const selectedProj = projects[projId];

    const h1 = document.createElement("h1");
    h1.innerText = selectedProj.name + " tasks:";

    const list = document.createElement("list");
    selectedProj.tasks.forEach((task, index) => {
      const item = document.createElement("item");
      item.innerText =
        "Task name: " +
        task.name +
        " priority: " +
        task.priority +
        " creation date " +
        task.creationDate;
      item.classList.add("task-container");
      item.dataset.taskId = index;
      item.dataset.projectId = selectedProj.id;

      const editBtn = document.createElement("button");
      editBtn.innerText = editBtn.dataset.action = "Edit";
      const deleteBtn = document.createElement("button");
      deleteBtn.innerText = deleteBtn.dataset.action = "Delete";

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
      projectListSide.append(item);
    });
  }

  function AddTaskToProject(projId, taskinfo) {
    projects[projId].addTask(taskinfo);
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

  AddTaskToProject(0, { name: "mytask", priority: "very fucking high" });
  AddTaskToProject(0, { name: "someothetask", priority: "low bruv" });
  AddTaskToProject(1, { name: "besttask rbuv", priority: "high bruv" });

  RenderSidebarProjects();
  PopulateProjectSelect();
})();

export default Handle;
