import ProjectManager from "./ProjectManager";

const DisplayController = (() => {
	const projectList = document.querySelector(".project-list");
	const taskModal = document.querySelector(".task-modal");
	const projectSelect = document.querySelector("#project-select");

	function createProjectTab(projectName) {
		const li = document.createElement("li");
		li.classList.add("nav-item");

		const btn = document.createElement("button");
		btn.classList.add("nav-btn");
		btn.dataset.navId = btn.textContent = projectName;

		li.append(btn);

		return li;
	}

	//Renders all the projects for nav
	function renderProjectTabs() {
		//clear list
		projectList.textContent = "";

		const projNames = ProjectManager.getAllProjectNames();
		console.log(projNames);
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

		return opt;
	}

	//Renders all the current projects for selection
	function renderProjectSelect() {
		projectSelect.textContent = "";

		const projNames = ProjectManager.getAllProjectNames();
		const frag = document.createDocumentFragment();

		for (let i = 0; i < projNames.length; ++i) {
			const opt = createProjectOption(projNames[i]);
			opt.value = i;

			frag.append(opt);
		}

		projectSelect.append(frag);
	}

	function openTaskModal() {
		taskModal.classList.remove("hide");
		renderProjectSelect();
	}

	function closeTaskModal() {
		taskModal.classList.add("hide");
	}

	return { renderProjectTabs, openTaskModal, closeTaskModal };
})();

export default DisplayController;
