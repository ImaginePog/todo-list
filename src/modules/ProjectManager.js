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

	function addTaskToProject(projId, taskInfo) {
		projects[projId].addTask(taskInfo);
	}

	function editProjectTask(projId, taskId, newTaskInfo) {
		projects[projId].editTask(taskId, newTaskInfo);
	}

	function removeProjectTask(projId, taskId) {
		projects[projId].removeTask(taskId);
	}

	function changeCurrentProject(projId) {
		currentProject = projects[projId];
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

	function getAllCompletedTasks() {
		const tasks = [];

		projects.forEach((proj) => {
			tasks.push(...proj.getCompleteTasks());
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
		getAllCompletedTasks,
		changeCurrentProject,
		getCurrentProject,
		addTaskToProject,
		editProjectTask,
		toggleTaskStatus,
		removeProjectTask,
	};
})();

export default ProjectManager;
