import Project from "./Project";

const ProjectManager = (() => {
	let projects = [];
	let currentProject;

	function addProject(projName) {
		projects.push(new Project(projName, projects.length));
		changeCurrentProject(projects.length - 1);
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

	function addTaskToProject(projectId, taskInfo) {
		projects[projectId].addTask(taskInfo, projectId);
	}

	function editProjectTask(projectId, taskId, newTaskInfo) {
		projects[projectId].editTask(taskId, newTaskInfo);
	}

	function removeProjectTask(projectId, taskId) {
		projects[projectId].removeTask(taskId);
	}

	function changeCurrentProject(projectId) {
		currentProject = projects[projectId];
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

	function toggleTaskStatus(projectId, taskId) {
		projects[projectId].toggleTaskStatus(taskId);
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
