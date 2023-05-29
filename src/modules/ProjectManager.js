import Project from "./Project";

const ProjectManager = (() => {
	let projects = [];
	let currentProject;

	function addProject(projName) {
		projects.push(new Project(projName));
		changeCurrentProject(projName);
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
		const proj = projects.find((proj) => proj.name === projName);

		if (!proj) {
			console.error("Could not find project");
			return;
		}

		return proj;
	}

	function addTaskToProject(projName, taskInfo) {
		const proj = getProjectByName(projName);
		proj.addTask(taskInfo);
	}

	function editProjectTask(projName, taskId, newTaskInfo) {
		const proj = getProjectByName(projName);
		proj.editTask(taskId, newTaskInfo);
	}

	function removeProjectTask(projName, taskId) {
		const proj = getProjectByName(projName);
		proj.removeTask(taskId);
	}

	function changeCurrentProject(newProjName) {
		currentProject = getProjectByName(newProjName);
	}

	function getCurrentProject() {
		return currentProject;
	}

	function getAllTasksDueToday() {
		const tasks = [];

		projects.forEach((proj) => {
			tasks.push(...proj.getTasksDueToday());
		});

		return tasks;
	}

	function toggleTaskStatus(projName, taskId) {
		const proj = getProjectByName(projName);
		proj.toggleTaskStatus(taskId);
	}

	return {
		addProject,
		removeProject,
		getAllProjectNames,
		getAllProjects,
		getAllTasksDueToday,
		getProjectByName,
		changeCurrentProject,
		getCurrentProject,
		addTaskToProject,
		editProjectTask,
		toggleTaskStatus,
		removeProjectTask,
		completeProjectTask,
	};
})();

export default ProjectManager;
