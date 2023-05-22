import Project from "./Project";

const ProjectManager = (() => {
	let projects = [];

	function addProject(projName) {
		projects.push(new Project(projName));
	}

	function removeProject(projectId) {
		projects.splice(projectId, 1);
	}

	function getAllProjectNames() {
		let names = [];

		projects.forEach((proj) => {
			names.push(proj.name);
		});

		return names;
	}

	function getAllProjects() {
		return projects;
	}

	function addTaskToProject(projectId, task) {
		projects[projectId].addTask(task);
	}

	function editProjectTask(projectId, taskId, newTask) {
		projects[projectId].editTask(taskId, newTask);
	}

	function removeProjectTask(projectId, taskId) {
		projects[projectId].removeTask(taskId);
	}

	return {
		addProject,
		removeProject,
		getAllProjectNames,
		getAllProjects,
		addTaskToProject,
		editProjectTask,
		removeProjectTask,
	};
})();

export default ProjectManager;
