const DOM = (() => {
  let objects = {};

  //Private function of the module that queries the DOM
  //Queries 'document' object by default
  //Selects one or multiple objects based on type
  function queryObject(query, parent = document, queryType = "single") {
    if (queryType == "single") {
      objects[query] = {
        object: parent.querySelector(query),
        queryType,
        parent,
      };
    } else {
      objects[query] = {
        object: parent.querySelectorAll(query),
        queryType,
        parent,
      };
    }
  }

  //Loads all the objects on the creation of DOM module
  function loadObjects() {
    queryObject("#main");
    queryObject(".dynamic-display", objects["#main"].object);
    queryObject("#aside");
    queryObject(".tab", document, "multiple");
    queryObject(".sidebar-project-list", objects["#aside"].object);
    queryObject(".add-task-form");
    queryObject("#project-select", objects[".add-task-form"].object);
    queryObject(".add-project-form");
    queryObject(".edit-task-form");
  }

  //Reload an object; only if it has been loaded
  function reloadObject(query) {
    if (!objects[query]) {
      console.error("FATAL EROOR WE AINT DEALING WITH THIS SHIT NAH");
      return null;
    }

    queryObject(query, objects[query].parent, objects[query].queryType);
  }

  // Returns objects that are already loaded based on the query
  // If the object doesnt exist then shit... its a dumb mistake probably
  // maybe add loading the document if the object is not loaded
  // dont wanna tho
  function getObject(query) {
    if (!objects[query]) {
      console.error("FATAL EROOR WE AINT DEALING WITH THIS SHIT NAH");
      return null;
    }

    return objects[query].object;
  }

  //Adds properties to a DOM element
  function addProperties(element, properties) {
    if (properties["innerText"] != undefined) {
      element.innerText = properties["innerText"];
    }

    if (properties["classList"] != undefined) {
      properties["classList"].forEach((className) => {
        element.classList.add(className);
      });
    }

    if (properties["attributes"] != undefined) {
      for (const [property, value] of Object.entries(
        properties["attributes"]
      )) {
        element.setAttribute(property, value);
      }
    }

    if (properties["dataset"] != undefined) {
      for (const [name, value] of Object.entries(properties["dataset"])) {
        element.dataset[name] = value;
      }
    }

    if (properties["value"] != undefined) {
      element.value = properties["value"];
    }

    if (properties["src"] != undefined) {
      element.src = properties["src"];
    }
  }

  //Removes properties from a DOM element
  function removeProperties(element, properties) {
    if (properties["classList"]) {
      properties["classList"].forEach((className) => {
        element.classList.remove(className);
      });
    }

    if (properties["attributes"]) {
      properties["attributes"].forEach((attr) => {
        element.removeAttribute(attr);
      });
    }

    if (properties["dataset"]) {
      properties["dataset"].forEach((data) => {
        delete element.dataset.data;
      });
    }
  }

  //Returns an element created based on the elementName and properties
  //properties object is handled based on the properites provided and
  //added to the element
  function createElement(elementName, properties) {
    const element = document.createElement(elementName);

    if (properties) {
      addProperties(element, properties);
    }

    return element;
  }

  //Returns a document fragment
  function getFragment() {
    const frag = document.createDocumentFragment();

    return frag;
  }

  loadObjects();
  return {
    getObject,
    createElement,
    addProperties,
    removeProperties,
    getFragment,
    reloadObject,
  };
})();

export default DOM;
