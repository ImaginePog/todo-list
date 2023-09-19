import Storage from "./Storage";
import Project from "./Project";

const ProjectManager = (() => {
  let projects = [];
  const defaultProject = "Home"; //For now this variable is a constant maybe allow users to change it?? idk

  const STATE_ACTIONS = Object.freeze({
    ADD_PROJ: "0",
    REMOVE_PROJ: "1",
    ADD_TASK: "2",
    EDIT_TASK: "3",
    TOGGLE_TASK_COMPLETE: "4",
    REMOVE_TASK: "5",
  });

  function updateState() {
    console.log("Updating state");
    Storage.updateStorage(projects);
  }

  function addProject(projName) {
    projects.push(new Project(projName, projects.length));
    console.log("new project was added");
  }

  function removeProject(projId) {
    projects = projects.filter((project) => project.id != projId);
    projects.forEach((project, index) => {
      project.id = index;
    });
  }

  function addTaskToProject(projId, taskInfo) {
    projects[projId].addTask(taskInfo);
  }

  function editTaskFromProject(projId, taskId, taskInfo) {
    projects[projId].editTask(taskId, taskInfo);
  }

  function toggleTaskCompletion(projId, taskId) {
    projects[projId].toggleTaskStatus(taskId);
  }

  function removeTaskFromProject(projId, taskId) {
    projects[projId].removeTask(taskId);
  }

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
      default:
        console.log("FATAL ERROR: DONT KNOW WHATS GOING ON THIS IS BAD!");
        return;
    }

    updateState();
  }

  function populateProjects() {
    let storedState = Storage.getStoredState();
    console.log("AFTER RELOADING: ");
    console.log(storedState);

    if (!storedState) {
      addProject(defaultProject);
      return;
    }

    storedState.forEach((projectData) => {
      console.log(projectData);
      changeState(STATE_ACTIONS.ADD_PROJ, { projName: projectData.name });
      projectData.tasks.forEach((task) => {
        changeState(STATE_ACTIONS.ADD_TASK, {
          projId: projectData.id,
          taskInfo: task,
        });
      });
    });
  }

  function getProject(projId) {
    return projects[projId];
  }

  function getProjectId(projName) {
    const found = projects.find((proj) => {
      return proj.name == projName;
    });
    return found.id;
  }

  function getAllProjects() {
    return projects;
  }

  return {
    populateProjects,
    STATE_ACTIONS,
    changeState,
    getAllProjects,
    getProject,
    getProjectId,
  };
})();

export default ProjectManager;
