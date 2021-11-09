import {
  LOADER_ID,
  LOADER_SHOW,
  TEAMS_ID,
  TEAMS_MODULE_ID
} from "../../../../constants/app.constants";

export function fetchTechnologies(props) {
  const { requestData, updateComponentState } = props;
  updateComponentState(LOADER_ID, LOADER_SHOW, {
    showLoader: true
  });

  let BodyParams = new FormData();
  const Payload = {};

  BodyParams.append("params", JSON.stringify(Payload));
  BodyParams.append("type", "getData");
  BodyParams.append("command", "getTechnologies");

  const Params = {
    id: TEAMS_ID,
    api: {
      body: BodyParams
    }
  };

  requestData(Params).then(response => {
    if (response.apiData && response.apiData.isFetching === false) {
      updateComponentState(LOADER_ID, LOADER_SHOW, {
        showLoader: false
      });
    }
  });
}

export function fetchSingleTechnologyDataFromUtils(props, entryID) {
  const { requestData, updateComponentState } = props;
  updateComponentState(LOADER_ID, LOADER_SHOW, {
    showLoader: true
  });

  let BodyParams = new FormData();
  const Payload = {
    tech_id: entryID
  };

  BodyParams.append("params", JSON.stringify(Payload));
  BodyParams.append("type", "getData");
  BodyParams.append("command", "getSingleTechnologyData");

  const Params = {
    id: TEAMS_MODULE_ID,
    api: {
      body: BodyParams
    }
  };

  requestData(Params).then(response => {
    if (response.apiData && response.apiData.isFetching === false) {
      updateComponentState(LOADER_ID, LOADER_SHOW, {
        showLoader: false
      });
    }
  });
}
export function addNewTechnology(props, name) {
  const { requestData } = props;

  let BodyParams = new FormData();
  const Payload = {
    name: name.trim()
  };

  BodyParams.append("params", JSON.stringify(Payload));
  BodyParams.append("type", "addData");
  BodyParams.append("command", "addTechnology");

  const Params = {
    id: TEAMS_ID,
    api: {
      body: BodyParams
    }
  };

  return requestData(Params).then(response => {
    if (response.apiData && response.apiData.apiData === true) {
      fetchTechnologies(props);

      return true;
    } else if (response.apiData && response.apiData.apiData === "duplicate") {
      return "duplicate";
    } else {
      return false;
    }
  });
}
export function updateTechnology(props, state) {
  const { requestData } = props;
  const { name, status_flag, idToEdit } = state;
  let BodyParams = new FormData();
  const Payload = {
    tech_id: idToEdit,
    name: name,
    status_flag: status_flag
  };

  BodyParams.append("params", JSON.stringify(Payload));
  BodyParams.append("type", "updateData");
  BodyParams.append("command", "updateTechnology");

  const Params = {
    id: TEAMS_ID,
    api: {
      body: BodyParams
    }
  };

  return requestData(Params).then(response => {
    if (response.apiData && response.apiData.apiData === true) {
      fetchTechnologies(props);
      return true;
    } else if (response.apiData && response.apiData.apiData === "duplicate") {
      return "duplicate";
    } else {
      return false;
    }
  });
}
