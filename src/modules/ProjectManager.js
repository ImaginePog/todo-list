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

	function getProjectByName(projName) {
		let index = projects.findIndex((proj) => {
			proj.name === projName;
		});

		if (index < 0) {
			console.error("Could not find project");
			return;
		}

		return projects[index];
	}

	function addTaskToProject(projectId, taskInfo) {
		projects[projectId].addTask(taskInfo);
	}

	function editProjectTask(projectId, taskId, newTaskInfo) {
		projects[projectId].editTask(taskId, newTaskInfo);
	}

	function removeProjectTask(projectId, taskId) {
		projects[projectId].removeTask(taskId);
	}

	return {
		addProject,
		removeProject,
		getAllProjectNames,
		getAllProjects,
		getProjectByName,
		addTaskToProject,
		editProjectTask,
		removeProjectTask,
	};
})();

export default ProjectManager;
