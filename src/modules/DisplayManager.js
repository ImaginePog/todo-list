import ProjectManager from "./ProjectManager";
import DOM from "./DOM";

const DisplayManager = (() => {
  function refreshDisplay() {
    renderSidebarProjects();
    renderProjectSelect();
  }

  function renderSidebarProjects() {
    const projectListSide = DOM.getObject(".sidebar-project-list");
    DOM.addProperties(projectListSide, { innerText: "" });

    ProjectManager.getAllProjects().forEach((project, index) => {
      const item = DOM.createElement("li", {
        innerText: project.name,
        classList: ["tab", "sidebar-project-item"],
        dataset: {
          action: "project",
          projId: index,
        },
      });

      if (index != 0) {
        const deleteProjBtn = DOM.createElement("button", {
          innerText: "Delete",
          dataset: {
            action: "delete",
          },
          classList: [".delete-project-btn"],
        });
        item.append(deleteProjBtn);
      }

      projectListSide.append(item);
    });
  }

  function renderProjectSelect() {
    const projectSelect = DOM.getObject("#project-select");
    const frag = DOM.getFragment();

    ProjectManager.getAllProjects().forEach((project) => {
      const opt = DOM.createElement("option", {
        value: project.id,
        innerText: project.name,
      });
      frag.append(opt);
    });

    DOM.addProperties(projectSelect, { innerText: "" });
    projectSelect.append(frag);
  }

  return { refreshDisplay };
})();

export default DisplayManager;
