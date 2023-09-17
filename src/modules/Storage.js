//Storage IIFE module provides interface to the localStorage
//For now only stores everything in "state" maybe change later dunno
const Storage = (() => {
  //Updates the state stored in the localStorage
  //If the state is empty removes the key from localStorage
  function updateStorage(state) {
    localStorage.setItem("state", JSON.stringify(state));

    if (JSON.parse(localStorage.getItem("state")).length == 0) {
      localStorage.removeItem("state");
    }
  }

  //Returns the parsed state from the storage if it exists, returns false otherwise
  function getStoredState() {
    if (!localStorage.getItem("state")) {
      return false;
    }

    const storedState = JSON.parse(localStorage.getItem("state"));
    return storedState;
  }

  return { updateStorage, getStoredState };
})();

export default Storage;
