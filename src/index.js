import DisplayController from "./modules/DisplayController";
import ProjectManager from "./modules/ProjectManager";
import UI from "./modules/UI";
import "./styles/index.css";

ProjectManager.addProject("Inbox");

const inTab = document.querySelector('button[data-action="inbox"]');
inTab.click();

DisplayController.renderProjectTabs();
