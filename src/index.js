import "./styles/index.css";
import DOM from "./modules/DOM";
import ProjectManager from "./modules/ProjectManager";
import DisplayManager from "./modules/DisplayManager";
import Handle from "./modules/Handle.js";

DOM.loadObjects(); //Load all the document required document objects
ProjectManager.populateProjects(); //Load all the projects from the storage
DisplayManager.changeView("0"); //Change view to default page (Home)
Handle.initEventHandlers(); //Initialize all the event handlers and start taking input
