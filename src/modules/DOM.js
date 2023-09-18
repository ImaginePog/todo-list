const DOM = (() => {
  let objects = {};

  //Private function of the module that queries the DOM
  //Queries 'document' object by default
  function queryObject(query, parent = document) {
    objects[query] = parent.querySelector(query);
    console.log(objects);
  }

  //Loads all the objects on the creation of DOM module
  function loadObjects() {
    queryObject("#main");
    queryObject("#aside");
    queryObject("#header"); //temp
    queryObject(".sidebar-project-list", objects["#aside"]);
    queryObject(".add-task-form");
    queryObject("#project-select", objects["#.add-task-form"]);
    queryObject(".add-project-form");
    queryObject(".edit-task-form");
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

    return objects[query];
  }

  //Returns given DOM element with added properties
  function addProperties(element, properties) {
    if (properties["innerText"]) {
      element.innerText = properties["innerText"];
    }

    if (properties["classList"]) {
      properties["classList"].forEach((className) => {
        element.classList.add(className);
      });
    }

    if (properties["attributes"]) {
      for (const [property, value] of Object.entries(
        properties["attributes"]
      )) {
        element.setAttribute(property, value);
      }
    }

    if (properties["dataset"]) {
      for (const [name, value] of Object.entries(properties["dataset"])) {
        element.dataset[name] = value;
      }
    }

    return element;
  }

  //Returns an element created based on the elementName and properties
  //properties object is handled based on the properites provided and
  //added to the element
  function createElement(elementName, properties) {
    const element = document.createElement(elementName);

    if (properties) {
      element = addProperties(element, properties);
    }

    return element;
  }

  loadObjects();
  return { getObject, createElement };
})();

export default DOM;
