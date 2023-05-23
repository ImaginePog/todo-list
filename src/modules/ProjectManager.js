import { isToday } from "date-fns";
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
		let index = projects.findIndex((proj) => proj.name === projName);

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

	function changeCurrentProject(newProjName) {
		currentProject = getProjectByName(newProjName);
	}

	function getCurrentProject() {
		return currentProject;
	}

	function filterAllProjectsByToday() {
		const projs = getAllProjects();
		console.log(projs);

		let filteredProjs = [];
		projs.forEach((proj) => {
			let filteredProj = new Project(proj.name);
			let filteredTasks = proj.tasks.filter((task) => isToday(task.dueDate));

			filteredTasks.forEach((task) => {
				filteredProj.addTask(task);
			});

			filteredProjs.push(filteredProj);
		});
		return filteredProjs;
	}

	function getProjectsFiltered(filter) {
		let filtered;
		switch (filter) {
			case "today":
				filtered = filterAllProjectsByToday();
				break;
		}

		return filtered;
	}

	return {
		addProject,
		removeProject,
		getAllProjectNames,
		getAllProjects,
		getProjectByName,
		changeCurrentProject,
		getCurrentProject,
		addTaskToProject,
		editProjectTask,
		removeProjectTask,
		getProjectsFiltered,
	};
})();

export default ProjectManager;
