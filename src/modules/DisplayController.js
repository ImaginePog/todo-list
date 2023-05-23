import ProjectManager from "./ProjectManager";

const DisplayController = (() => {
	const projectList = document.querySelector(".project-list");
	const taskModal = document.querySelector(".task-modal");
	const projectModal = document.querySelector(".project-modal");
	const dynamicDisplay = document.querySelector(".dynamic-content");

	let currentTab;

	function createProjectTab(projectName) {
		const li = document.createElement("li");
		li.classList.add("nav-item");

		const btn = document.createElement("button");
		btn.classList.add("nav-btn");
		btn.dataset.action = btn.textContent = projectName;

		li.append(btn);

		return li;
	}

	//Renders all the projects for nav
	function renderProjectTabs() {
		//clear list
		projectList.textContent = "";

		const projNames = ProjectManager.getAllProjectNames();
		const frag = document.createDocumentFragment();

		for (let i = 1; i < projNames.length; ++i) {
			const tab = createProjectTab(projNames[i]);
			frag.append(tab);
		}

		projectList.append(frag);
	}

	function createProjectOption(proj) {
		const opt = document.createElement("option");
		opt.textContent = proj;
		const currProj = ProjectManager.getCurrentProject().name;
		if (currProj === proj) {
			opt.selected = true;
		}

		return opt;
	}

	//Renders all the current projects for selection
	function renderProjectSelect(taskForm) {
		taskForm.elements.project.textContent = "";

		const projNames = ProjectManager.getAllProjectNames();

		const frag = document.createDocumentFragment();

		for (let i = 0; i < projNames.length; ++i) {
			const opt = createProjectOption(projNames[i]);
			opt.value = i;

			frag.append(opt);
		}

		taskForm.elements.project.append(frag);
	}

	function clearDynamicDisplay() {
		dynamicDisplay.textContent = "";
	}

	function createDisplayTitle(title) {
		const displayTitle = document.createElement("h2");
		displayTitle.textContent = title;
		displayTitle.classList.add("display-title");

		return displayTitle;
	}

	function createTaskContainers(proj) {
		const frag = document.createDocumentFragment();
		for (let i = 0; i < proj.tasks.length; ++i) {
			const taskContainer = document.createElement("li");
			taskContainer.classList.add("task-container");

			const title = document.createElement("h3");
			title.classList.add("task-title");
			title.textContent = proj.tasks[i].name;

			taskContainer.append(title);
			frag.append(taskContainer);
		}

		return frag;
	}

	function createTaskList() {
		const list = document.createElement("ul");
		list.classList.add("task-list");

		return list;
	}

	function renderCurrentProject() {
		clearDynamicDisplay();
		const currProject = ProjectManager.getCurrentProject();
		const title = createDisplayTitle(currProject.name);

		const taskList = createTaskList();

		const tasks = createTaskContainers(currProject);
		taskList.append(tasks);

		dynamicDisplay.append(title, taskList);
	}

	function openTaskModal(taskForm) {
		taskModal.classList.remove("hide");
		renderProjectSelect(taskForm);

		if (currentTab === "today") {
			taskForm.elements.dueDate.valueAsDate = new Date();
		}
	}

	function closeTaskModal() {
		taskModal.classList.add("hide");
	}

	function renderToday() {
		clearDynamicDisplay();

		const title = createDisplayTitle("Today");

		const filteredProjs = ProjectManager.getProjectsFiltered("today");
		console.log(filteredProjs);

		const displayList = document.createElement("ul");

		filteredProjs.forEach((proj) => {
			const tasks = createTaskContainers(proj);
			displayList.append(tasks);
		});

		dynamicDisplay.append(title, displayList);
	}

	function renderCurrentTab() {
		clearDynamicDisplay();

		switch (currentTab) {
			case "project":
				renderCurrentProject();
				break;
			case "today":
				renderToday();
				break;
			case "projects":
				//renderprojects
				break;
			default:
			//handle default
		}
	}

	function changeCurrentTab(tab) {
		currentTab = tab;
		renderCurrentTab();
	}

	function openProjectModal() {
		projectModal.classList.remove("hide");
	}

	function closeProjectModal() {
		projectModal.classList.add("hide");
	}

	return {
		renderProjectTabs,
		openTaskModal,
		closeTaskModal,
		openProjectModal,
		closeProjectModal,
		renderToday,
		changeCurrentTab,
		renderCurrentTab,
	};
})();

export default DisplayController;
