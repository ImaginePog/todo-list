import Storage from "./Storage";
import Project from "./Project";

//IIFE module that handles all the projects changes
//Responsible for adding, editing and deleting projects
//Responsible for loading saved projects from storage
const ProjectManager = (() => {
  let projects = [];
  const defaultProject = "Home";

  //Possible actions on projects
  const STATE_ACTIONS = Object.freeze({
    ADD_PROJ: "0",
    REMOVE_PROJ: "1",
    ADD_TASK: "2",
    EDIT_TASK: "3",
    TOGGLE_TASK_COMPLETE: "4",
    REMOVE_TASK: "5",
    STAR_TASK: "6",
  });

  //Updates the storage with current projects state
  function updateState() {
    Storage.updateStorage(projects);
  }

  //Adds a new project
  function addProject(projName) {
    projects.push(new Project(projName, projects.length));
  }

  //Deletes a project based on it's id and resets other projects' id
  function removeProject(projId) {
    projects = projects.filter((project) => project.id != projId);
    projects.forEach((project, index) => {
      project.id = index;
    });
  }

  //Adds a new task to based on the given task info to the given project id
  function addTaskToProject(projId, taskInfo) {
    projects[projId].addTask(taskInfo);
  }

  //Edits a task from a project based on the given project and task id
  function editTaskFromProject(projId, taskId, taskInfo) {
    projects[projId].editTask(taskId, taskInfo);
  }

  //Toggles the status of a task of a project
  function toggleTaskCompletion(projId, taskId) {
    projects[projId].toggleTaskStatus(taskId);
  }

  //Removes a task from a project
  function removeTaskFromProject(projId, taskId) {
    projects[projId].removeTask(taskId);
  }

  //Toggles the starred status of a task of a project
  function toggleTaskStar(projId, taskId) {
    projects[projId].toggleTaskStar(taskId);
  }

  //Handles all state changing actions then updates the state
  function changeState(action, data) {
    switch (action) {
      case STATE_ACTIONS.ADD_PROJ:
        addProject(data.projName);
        break;
      case STATE_ACTIONS.REMOVE_PROJ:
        removeProject(data.projId);
        break;
      case STATE_ACTIONS.ADD_TASK:
        addTaskToProject(data.projId, data.taskInfo);
        break;
      case STATE_ACTIONS.EDIT_TASK:
        editTaskFromProject(data.projId, data.taskId, data.taskInfo);
        break;
      case STATE_ACTIONS.TOGGLE_TASK_COMPLETE:
        toggleTaskCompletion(data.projId, data.taskId);
        break;
      case STATE_ACTIONS.REMOVE_TASK:
        removeTaskFromProject(data.projId, data.taskId);
        break;
      case STATE_ACTIONS.STAR_TASK:
        toggleTaskStar(data.projId, data.taskId);
        break;
      default:
        return;
    }

    updateState();
  }

  //Loads saved project state from the storage
  function populateProjects() {
    let storedState = Storage.getStoredState();

    if (!storedState) {
      addProject(defaultProject);
      return;
    }

    storedState.forEach((projectData) => {
      changeState(STATE_ACTIONS.ADD_PROJ, { projName: projectData.name });
      projectData.tasks.forEach((task) => {
        changeState(STATE_ACTIONS.ADD_TASK, {
          projId: projectData.id,
          taskInfo: task,
        });
      });
    });
  }

  //Returns a project based on the given id
  function getProject(projId) {
    return projects[projId];
  }

  //Returns the project id based on the name of the project
  function getProjectId(projName) {
    const found = projects.find((proj) => {
      return proj.name == projName;
    });
    if (found) {
      return found.id;
    } else return null;
  }

  //Returns all projects
  function getAllProjects() {
    return projects;
  }

  return {
    populateProjects,
    STATE_ACTIONS,
    changeState,
    getProject,
    getProjectId,
    getAllProjects,
  };
})();

export default ProjectManager;
