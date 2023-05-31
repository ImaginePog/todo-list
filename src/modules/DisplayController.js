import { format, formatDistance } from "date-fns";
import ProjectManager from "./ProjectManager";

const DisplayController = (() => {
	const projectList = document.querySelector(".project-list");
	const taskModal = document.querySelector(".task-modal");
	const projectModal = document.querySelector(".project-modal");
	const dynamicDisplay = document.querySelector(".dynamic-content");

	const taskDetailsModal = document.querySelector(".task-details-modal");
	const taskDetailTitle = taskDetailsModal.querySelector(".task-about-title");
	const taskDetailDescription = taskDetailsModal.querySelector(
		".task-about-description"
	);
	const taskDetailParent = taskDetailsModal.querySelector(
		".task-parent-project"
	);
	const taskDetailDue = taskDetailsModal.querySelector(".task-due-date");
	const taskDetailPriority = taskDetailsModal.querySelector(".task-priority");
	const taskDetailCreation =
		taskDetailsModal.querySelector(".task-created-date");

	let currentTab;

	function createProjectTab(projectName, projectId) {
		const li = document.createElement("li");
		li.classList.add("nav-item");

		const btn = document.createElement("button");
		btn.classList.add("nav-btn");
		btn.dataset.action = btn.textContent = projectName;
		btn.dataset.projectId = projectId;

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
			const tab = createProjectTab(projNames[i], i);
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

	function createTaskContainers(tasks) {
		const frag = document.createDocumentFragment();
		for (let i = 0; i < tasks.length; ++i) {
			const taskContainer = document.createElement("li");
			taskContainer.classList.add("task-container");
			taskContainer.dataset.projectId = tasks[i].projectId;
			taskContainer.dataset.taskId = tasks[i].id;
			taskContainer.dataset.action = "showTaskDetails";

			const completeBtn = document.createElement("button");
			completeBtn.classList.add("complete-btn");

			if (tasks[i].completed) {
				completeBtn.classList.add("complete-btn-on");
			}

			completeBtn.dataset.action = "toggleComplete";

			const title = document.createElement("h3");
			title.classList.add("task-title");
			title.textContent = tasks[i].name;

			taskContainer.append(completeBtn, title);
			frag.append(taskContainer);
		}

		return frag;
	}

	function createTaskList(tasks) {
		const list = document.createElement("ul");
		list.classList.add("task-list");

		const frag = createTaskContainers(tasks);
		list.append(frag);

		return list;
	}

	function renderCurrentProject() {
		clearDynamicDisplay();

		const currProject = ProjectManager.getCurrentProject();
		const title = createDisplayTitle(currProject.name);

		const taskList = createTaskList(currProject.getIncompleteTasks());

		dynamicDisplay.append(title, taskList);
	}

	function openTaskModal(taskForm) {
		renderProjectSelect(taskForm);

		if (currentTab === "today") {
			taskForm.elements.dueDate.valueAsDate = new Date();
		}

		taskModal.classList.remove("hide");
	}

	function closeTaskModal() {
		taskModal.classList.add("hide");
	}

	function renderToday() {
		clearDynamicDisplay();

		const title = createDisplayTitle("Today");
		const tasks = ProjectManager.getAllTasksDueToday();
		const taskList = createTaskList(tasks);

		dynamicDisplay.append(title, taskList);
	}

	function renderCompleted() {
		clearDynamicDisplay();

		const title = createDisplayTitle("Completed");
		const tasks = ProjectManager.getAllCompletedTasks();
		const taskList = createTaskList(tasks);

		dynamicDisplay.append(title, taskList);
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
			case "completed":
				renderCompleted();
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

	function showTaskDetails(projectId, taskId) {
		const proj = ProjectManager.getAllProjects()[projectId];
		const task = proj.tasks[taskId];

		taskDetailTitle.textContent = task.name;

		if (task.description) {
			taskDetailDescription.textContent = task.description;
		} else {
			taskDetailDescription.textContent = "No Description";
		}

		taskDetailParent.textContent = proj.name;

		if (task.dueDate) {
			taskDetailDue.textContent = format(task.dueDate, "MMM d, yyyy");
		} else {
			taskDetailDue.textContent = "No Due Set";
		}

		if (task.overdue) {
			taskDetailDue.classList.add("overdue-indicator");
			taskDetailDue.textContent += ` (overdue by ${formatDistance(
				task.dueDate,
				new Date()
			)})`;
		}

		taskDetailPriority.textContent = task.priority;

		taskDetailCreation.textContent = format(task.creationDate, "MMM d, yyyy");

		taskDetailsModal.classList.remove("hide");
	}

	return {
		renderProjectTabs,
		openTaskModal,
		closeTaskModal,
		openProjectModal,
		closeProjectModal,
		showTaskDetails,
		renderToday,
		changeCurrentTab,
		renderCurrentTab,
	};
})();

export default DisplayController;
