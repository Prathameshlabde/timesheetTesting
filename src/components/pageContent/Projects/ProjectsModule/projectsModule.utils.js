import colors from "../../../common/colors";
import {
  PROJECTS_MODULE_ID_2,
  PROJECTS_MODULE_ID,
  LOADER_ID,
  LOADER_SHOW,
} from "../../../../constants/app.constants";
import Colors from "../../../common/colors";

export const spanStyleHeader = {
  color: "#4a4a4a",
  fontWeight: "bold",
  fontSize: "20px",
};

const textAreaStyle = {
  width: "94%",
  boxShadow: `rgb(190, 190, 190) 0px 3px 10px -4px`,
  backgroundColor: "rgb(255, 255, 255)",
  border: `1px solid #E6EBED`,
  color: Colors.textColor,
  resize: "none",
  borderRadius: "3px",
  fontSize: "1em",
};

const textArea = {
  data: "",
  style: textAreaStyle,
  rows: "8",
  cols: "50",
};

export function getPropsTextArea() {
  return textArea;
}

const submitButton = {
  id: "btn",
  data: "Submit",
  className: "button-submitEntry",
};

export function getPropsButtonSubmit() {
  return submitButton;
}

const closeButton = {
  id: "btn",
  data: "Cancel",
  width: "100%",
  className: "button-cancel",
};

export function getPropsButtonClose() {
  return closeButton;
}

const todayDate =
  new Date().getFullYear() +
  "-" +
  ("0" + (new Date().getMonth() + 1)).slice(-2) +
  "-" +
  ("0" + new Date().getDate()).slice(-2);

const datePickerStyles = {
  width: "80%",
};

const datePicker = {
  currentDate: todayDate,
  style: datePickerStyles,
};

export function getPropsDatePicker() {
  return datePicker;
}

const spanLabel = {
  id: "lbl",
  maxFont: 14,
  minFont: 5.5,
  className: "span-label",
};

export function getPropsspanLabel() {
  return spanLabel;
}

const dropDownStyle = {
  width: "92%",
};

const multipleDropDownStyle = {
  width: "92%",
  textAlignLast: "left",
  boxShadow: `${colors.boxShadowTextfield} 0px 2px 2px 0px`,
  backgroundColor: colors.teftFieldBackground,
  border: `1px solid ${colors.grayColorBorder}`,
  color: Colors.textColor,
  height: "125px",
  fontSize: "12px",
  paddingleft: "3px",
};

const dropDown = {
  style: dropDownStyle,
};

const multipleDropDown = {
  style: multipleDropDownStyle,
};

export function getPropsDropdown() {
  return dropDown;
}
export function getPropsMultipleDropdown() {
  return multipleDropDown;
}

export const textFieldStyle = {
  textfieldSmall: {
    width: "90%",
  },
  textfieldPM: {
    width: "100%",
    boxShadow: `${colors.boxShadowTextfield} 0px 2px 2px 0px`,
    backgroundColor: colors.teftFieldBackground,
    border: `1px solid ${colors.grayColorBorder}`,
    color: Colors.textColor,
    height: "30%",
    fontSize: "12px",
    paddingleft: "3px",
  },
  textfieldLarge: {
    width: "80%",
    boxShadow: `${colors.boxShadowTextfield} 0px 2px 2px 0px`,
    backgroundColor: colors.teftFieldBackground,
    border: `1px solid ${colors.grayColorBorder}`,
    color: Colors.textColor,
    height: "25px",
    fontSize: "12px",
    paddingleft: "3px",
  },
};

export function fetchProjectsFromUtils(fetchProps) {
  const {
    fetchAllProjects,
    updateComponentState,
    dataLimit,
    dataOffset,
    searchParameterKey,
    sortBy,
    sortType,
    isNormalOrSort,
  } = fetchProps;

  updateComponentState(LOADER_ID, LOADER_SHOW, {
    showLoader: true,
  });
  let sortByLcl = "";
  let sortTypeLcl = "";

  if (!isNormalOrSort) {
    sortByLcl = sortBy;
    sortTypeLcl = sortType;
  }

  const projectParameters = {
    id: PROJECTS_MODULE_ID,
    dataLimit,
    dataOffset,
    searchParameterKey,
  };
  fetchAllProjects(projectParameters, sortByLcl, sortTypeLcl).then(
    (response) => {
      if (response.apiData && response.apiData.isFetching === false) {
        updateComponentState(LOADER_ID, LOADER_SHOW, {
          showLoader: false,
        });
      }
    }
  );
}

export function fetchEntryDataFromUtils(entryID, props) {
  const { requestData } = props;
  let BodyParams = new FormData();
  const Payload = {
    pro_id: entryID,
  };

  BodyParams.append("params", JSON.stringify(Payload));
  BodyParams.append("type", "getData");
  BodyParams.append("command", "getSingleProjectData");
  const Params = {
    id: PROJECTS_MODULE_ID_2,
    api: {
      body: BodyParams,
    },
  };

  requestData(Params);
}

export function fetchProjectManagerList(props) {
  const { id, requestData } = props;
  let BodyParams = new FormData();
  const Payload = {};
  BodyParams.append("params", JSON.stringify(Payload));
  BodyParams.append("type", "getData");
  BodyParams.append("command", "getProjectManagers");
  const Params = {
    id,
    api: {
      body: BodyParams,
    },
  };

  requestData(Params);
}

export function fetchClientList(props) {
  const { id, requestClients } = props;
  let BodyParams = new FormData();
  const Payload = {
    dataLimit: "all",
    dataOffset: "",
  };

  BodyParams.append("params", JSON.stringify(Payload));
  BodyParams.append("type", "getData");
  BodyParams.append("command", "getClients");
  const Params = {
    id,
    api: {
      body: BodyParams,
    },
  };

  requestClients(Params);
}

export function addNewProject(props, state) {
  let addDataParamters = new FormData();
  const {
    start_date,
    end_date,
    pname,
    description,
    client_id,
    estimated_hrs,
    team_id,
    is_billable,
    is_task_mandate,
    is_sprint_mandate,
    pm_assign,
    lock_date,
  } = state;

  const payload = {
    start_date,
    end_date,
    pname,
    description,
    client_id,
    estimated_hrs,
    team_id,
    is_billable,
    is_task_mandate,
    is_sprint_mandate,
    pm_assign,
    lock_date,
  };
  // console.log("Payload :-", payload);
  addDataParamters.append("params", JSON.stringify(payload));
  addDataParamters.append("type", "addData");
  addDataParamters.append("command", "addProject");

  const { id, requestData } = props;
  const newEntryParams = {
    id,
    api: {
      body: addDataParamters,
    },
  };

  return requestData(newEntryParams).then((response) => {
    // console.log("response from api :-", response);
    if (response.apiData && response.apiData.apiData === true) {
      fetchProjectsFromUtils(props);
      return true;
    } else if (response.apiData && response.apiData.apiData === "duplicate") {
      return "duplicate";
    } else {
      return false;
    }
  });
}
export function updateSelectedProjects(props, state) {
  const { id, updateData } = props;
  let updateDataParamters = new FormData();
  const { checkedProjects, updateFieldId, updated_value } = state;
  const payload = { checkedProjects, updateFieldId, updated_value };

  updateDataParamters.append("params", JSON.stringify(payload));
  updateDataParamters.append("type", "updateData");
  updateDataParamters.append("command", "updateSelectedProjects");

  const updateselectedProjectsParams = {
    id,
    api: {
      body: updateDataParamters
    },
  };

  return updateData(updateselectedProjectsParams).then((response) => {
    if (response.apiData && response.apiData.apiData === true) {
      return true;
    } else {
      return false;
    }
  });
}

export function updateProject(entryID, props, state) {
  let updateDataParamters = new FormData();
  const {
    start_date,
    end_date,
    pname,
    description,
    client_id,
    estimated_hrs,
    team_id,
    is_billable,
    is_task_mandate,
    is_sprint_mandate,
    pm_assign,
    lock_date,
  } = state;

  const payload = {
    start_date,
    end_date,
    pname,
    description,
    client_id,
    estimated_hrs,
    team_id,
    is_billable,
    is_task_mandate,
    is_sprint_mandate,
    pm_assign: pm_assign,
    pro_id: entryID,
    lock_date,
  };

  // console.log("payload = ", payload);

  updateDataParamters.append("params", JSON.stringify(payload));
  updateDataParamters.append("type", "updateData");
  updateDataParamters.append("command", "updateProject");
  const { id, updateData } = props;
  const newEntryParams = {
    id,
    api: {
      body: updateDataParamters,
    },
  };
  return updateData(newEntryParams).then((response) => {
    // console.log("response from api :-", response);
    if (response.apiData && response.apiData.apiData === true) {
      fetchProjectsFromUtils(props);
      return true;
    } else if (response.apiData && response.apiData.apiData === "duplicate") {
      return "duplicate";
    } else {
      return false;
    }
  });
}

export function deleteProject(projectID, props) {
  let deleteDataParamters = new FormData();
  const payload = {
    pro_id: projectID,
  };

  deleteDataParamters.append("params", JSON.stringify(payload));
  deleteDataParamters.append("type", "removeData");
  deleteDataParamters.append("command", "deleteProject");
  const { id, deleteData } = props;
  const deleteEntryParams = {
    id,
    api: {
      body: deleteDataParamters,
    },
  };
  // deleteData(deleteEntryParams);
  return deleteData(deleteEntryParams).then((response) => {
    if (response.apiData && response.apiData.apiData === true) {
      // fetchProjectsFromUtils(props, dataLimit, dataOffset, searchParameterKey);
      return true;
    } else {
      return false;
    }
  });
}
