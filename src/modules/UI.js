import DisplayController from "./DisplayController";
import ProjectManager from "./ProjectManager";

const UI = (() => {
	const nav = document.querySelector(".nav");

	const main = document.querySelector("#main");
	const taskForm = document.querySelector(".add-task-form");
	const projectForm = document.querySelector(".add-project-form");

	function handleMainClick(e) {
		if (e.target.dataset.action === "openTaskModal") {
			DisplayController.openTaskModal(taskForm);
		}
	}

	function handleNavClick(e) {
		const action = e.target.dataset.action;

		if (!action) {
			return;
		}

		switch (action) {
			case "inbox":
				ProjectManager.changeCurrentProject("Inbox");
				DisplayController.changeCurrentTab("project");
				break;
			case "today":
				DisplayController.changeCurrentTab("today");
				return;
			case "projects":
				DisplayController.changeCurrentTab("projects");
				return;
			case "openProjectModal":
				DisplayController.openProjectModal();
				return;
			default:
				ProjectManager.changeCurrentProject(action);
				DisplayController.changeCurrentTab("project");
		}
	}

	function handleTaskFormClick(e) {
		if (e.target.dataset.action === "closeForm") {
			e.currentTarget.reset();
			DisplayController.closeTaskModal();
		}
	}

	function handleProjectFormClick(e) {
		if (e.target.dataset.action === "closeForm") {
			e.currentTarget.reset();
			DisplayController.closeProjectModal();
		}
	}

	function handleProjectFormSubmit(e) {
		e.preventDefault();

		ProjectManager.addProject(e.currentTarget.elements.title.value);

		e.currentTarget.reset();
		DisplayController.closeProjectModal();
		DisplayController.renderProjectTabs();
		DisplayController.changeCurrentTab("project");
	}

	function handleTaskFormSubmit(e) {
		e.preventDefault();

		const form = e.currentTarget;

		let taskInfo = {
			name: form.elements.title.value,
			description: form.elements.description.value,
			dueDate: form.elements.dueDate.value,
			priority: form.elements.priority.value,
		};

		if (!taskInfo.name) {
			alert("Please enter a title");
			return;
		}

		let projectId = form.elements.project.value;

		ProjectManager.addTaskToProject(projectId, taskInfo);

		form.reset();
		DisplayController.closeTaskModal();
		DisplayController.renderCurrentTab();
	}

	main.addEventListener("click", handleMainClick);

	nav.addEventListener("click", handleNavClick);

	taskForm.addEventListener("click", handleTaskFormClick);
	taskForm.addEventListener("submit", handleTaskFormSubmit);

	projectForm.addEventListener("click", handleProjectFormClick);
	projectForm.addEventListener("submit", handleProjectFormSubmit);

	return {};
})();

export default UI;
