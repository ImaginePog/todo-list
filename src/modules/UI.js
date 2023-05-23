import DisplayController from "./DisplayController";
import ProjectManager from "./ProjectManager";

const UI = (() => {
	const nav = document.querySelector(".nav");
	const main = document.querySelector("#main");
	const taskForm = document.querySelector(".add-task-form");

	function handleMainClick(e) {
		if (e.target.dataset.action === "openTaskModal") {
			DisplayController.openTaskModal();
		}
	}

	function handleNavClick(e) {
		const navId = e.target.dataset.navId;

		if (!navId) {
			return;
		}

		switch (navId) {
			case "inbox":
				console.log("display inbox");
				break;
			case "today":
				console.log("display today");
				break;
			case "projects":
				console.log("display projects");
				break;
			default:
				console.log(`display ${navId} project`);
		}
	}

	function handleTaskFormClick(e) {
		if (e.target.dataset.action === "closeForm") {
			e.currentTarget.reset();
			DisplayController.closeTaskModal();
		}
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

		let projectId = form.elements.project.value;

		ProjectManager.addTaskToProject(projectId, taskInfo);

		form.reset();
		DisplayController.closeTaskModal();
	}

	main.addEventListener("click", handleMainClick);

	nav.addEventListener("click", handleNavClick);

	taskForm.addEventListener("click", handleTaskFormClick);
	taskForm.addEventListener("submit", handleTaskFormSubmit);

	return {};
})();

export default UI;
