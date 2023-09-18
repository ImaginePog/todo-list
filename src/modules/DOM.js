const DOM = (() => {
  let objects = {};

  function queryObject(query, parent = document) {
    objects[query] = parent.querySelector(query);
    console.log(objects);
  }

  function loadObjects() {
    queryObject("#main");
    queryObject("#aside");
    queryObject(".sidebar-project-list", objects["#aside"]);
    queryObject(".add-task-form");
    queryObject("#project-select", objects["#.add-task-form"]);
    queryObject(".add-project-form");
    queryObject(".edit-task-form");
  }

  function getObject(query) {
    if (!objects[query]) {
      console.error("FATAL EROOR WE AINT DEALING WITH THIS SHIT NAH");
      return null;
    }

    return objects[query];
  }

  loadObjects();
  return { getObject };
})();

export default DOM;
