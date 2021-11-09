import {
  LOADER_ID,
  LOADER_SHOW,
  TEAMS_ID,
  TEAMS_ID_2,
  TEAMS_MODULE_ID,
  TEAM_EMP_ID,
  TEAM_TECH_ID
} from "../../../../constants/app.constants";

const dropDownStyle = {
  width: "92%"
};

const dropDown = {
  style: dropDownStyle
};
export function getPropsDropdown() {
  return dropDown;
}

export function fetchEmployeeList(props) {
  const { requestData } = props;
  const payload = {};
  let parameters = new FormData();
  parameters.append("params", JSON.stringify(payload));
  parameters.append("type", "getData");
  parameters.append("command", "getActiveEmployees");

  const employeeParams = {
    id: TEAM_EMP_ID,
    api: {
      body: parameters
    }
  };

  requestData(employeeParams);
}

export function fetchTeamsForTable(props) {
  const { requestData, updateComponentState } = props;
  updateComponentState(LOADER_ID, LOADER_SHOW, {
    showLoader: true
  });

  let BodyParams = new FormData();
  const Payload = {};

  BodyParams.append("params", JSON.stringify(Payload));
  BodyParams.append("type", "getData");
  BodyParams.append("command", "getTeams");

  const Params = {
    id: TEAMS_ID_2,
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

export function fetchTechnologies(props) {
  const { requestData, updateComponentState } = props;
  updateComponentState(LOADER_ID, LOADER_SHOW, {
    showLoader: true
  });

  let BodyParams = new FormData();
  const Payload = {};

  BodyParams.append("params", JSON.stringify(Payload));
  BodyParams.append("type", "getData");
  BodyParams.append("command", "getTechnologiesDropdown");

  const Params = {
    id: TEAM_TECH_ID,
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

export function fetchSingleTeamDataFromUtils(props, entryID) {
  const { requestData, updateComponentState } = props;
  updateComponentState(LOADER_ID, LOADER_SHOW, {
    showLoader: true
  });

  let BodyParams = new FormData();
  const Payload = {
    team_id: entryID
  };

  BodyParams.append("params", JSON.stringify(Payload));
  BodyParams.append("type", "getData");
  BodyParams.append("command", "getSingleTeamData");

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
export function addNewTeam(props, paraObj) {
  const { requestData } = props;

  let BodyParams = new FormData();
  const Payload = {
    team_name: paraObj.team_name.trim(),
    team_emp: paraObj.team_emp,
    tech_id: paraObj.tech_id
  };

  BodyParams.append("params", JSON.stringify(Payload));
  BodyParams.append("type", "addData");
  BodyParams.append("command", "addTeam");

  const Params = {
    id: TEAMS_ID,
    api: {
      body: BodyParams
    }
  };

  return requestData(Params).then(response => {
    if (response.apiData && response.apiData.apiData === true) {
      fetchTeamsForTable(props);

      return true;
    } else if (response.apiData && response.apiData.apiData === "duplicate") {
      return "duplicate";
    } else {
      return false;
    }
  });
}
export function updateTeam(props, paraObj) {
  const { requestData } = props;

  let BodyParams = new FormData();
  const Payload = {
    team_id: paraObj.idToEdit,
    team_name: paraObj.team_name.trim(),
    team_emp: paraObj.team_emp,
    tech_id: paraObj.tech_id
  };

  BodyParams.append("params", JSON.stringify(Payload));
  BodyParams.append("type", "updateData");
  BodyParams.append("command", "updateTeam");

  const Params = {
    id: TEAMS_ID,
    api: {
      body: BodyParams
    }
  };

  return requestData(Params).then(response => {
    if (response.apiData && response.apiData.apiData === true) {
      fetchTeamsForTable(props);
      return true;
    } else if (response.apiData && response.apiData.apiData === "duplicate") {
      return "duplicate";
    } else {
      return false;
    }
  });
}
