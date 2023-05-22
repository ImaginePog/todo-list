import ProjectManager from "./ProjectManager";

const DisplayController = (() => {
	const projectList = document.querySelector(".project-list");

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

		projNames.forEach((proj) => {
			const tab = createProjectTab(proj);
			frag.append(tab);
		});

		projectList.append(frag);
	}

	return { renderProjectTabs };
})();

export default DisplayController;
