import colors from "../../../common/colors";
import {
  TASKS_MODULE_ID_2,
  TASKS_MODULE_ID,
  LOADER_ID,
  LOADER_SHOW,
} from "../../../../constants/app.constants";
import { dateFormatter } from "../../../utils/calender.utils";
import moment from "moment";
import Colors from "../../../common/colors";

export const spanStyleHeader = {
  fontWeight: "bold",
  fontSize: "20px",
};

const textArea = {
  data: "",
  rows: "10",
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
  // textAlignLast: "center",
  // boxShadow: `${colors.boxShadowTextfield} 0px 2px 2px 0px`,
  // backgroundColor: colors.teftFieldBackground,
  // border: `1px solid ${colors.grayColorBorder}`,
  // height: "25px",
  // fontSize: "14px"
};

const multipleDropDownStyle = {
  width: "92%",
  textAlignLast: "center",
  boxShadow: `${colors.boxShadowTextfield} 0px 2px 2px 0px`,
  backgroundColor: colors.teftFieldBackground,
  border: `1px solid ${colors.grayColorBorder}`,
  color: Colors.textColor,
  height: "200px",
  fontSize: "14px",
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
    width: "80%",
    boxShadow: `${colors.boxShadowTextfield} 0px 2px 2px 0px`,
    backgroundColor: colors.teftFieldBackground,
    border: `1px solid ${colors.grayColorBorder}`,
    color: Colors.textColor,
    height: "25px",
    fontSize: "14px",
  },
  textfieldPM: {
    width: "100%",
    boxShadow: `${colors.boxShadowTextfield} 0px 2px 2px 0px`,
    backgroundColor: colors.teftFieldBackground,
    border: `1px solid ${colors.grayColorBorder}`,
    color: Colors.textColor,
    height: "30%",
    fontSize: "14px",
  },
  textfieldLarge: {
    width: "80%",
    boxShadow: `${colors.boxShadowTextfield} 0px 2px 2px 0px`,
    backgroundColor: colors.teftFieldBackground,
    border: `1px solid ${colors.grayColorBorder}`,
    color: Colors.textColor,
    height: "25px",
    fontSize: "14px",
  },
};

export function fetchTasksFromUtils(
  props,
  dataLimit,
  dataOffset,
  searchParameterKey,
  sortBy = "",
  sortType = "",
  selectedProjectId = ""
) {
  const { fetchAllTasks, updateComponentState } = props;
  // const { dataLimit, dataOffset, searchParameterKey } = state;
  // console.log("dataLimit :-", dataLimit, "dataOffset :-", dataOffset);

  updateComponentState(LOADER_ID, LOADER_SHOW, {
    showLoader: true,
  });

  const taskParameters = {
    id: TASKS_MODULE_ID,
    dataLimit,
    dataOffset,
    searchParameterKey,
    selectedProjectId,
  };
  fetchAllTasks(taskParameters, sortBy, sortType, selectedProjectId).then(
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
    task_id: entryID,
  };

  BodyParams.append("params", JSON.stringify(Payload));
  BodyParams.append("type", "getData");
  BodyParams.append("command", "getSingleTaskData");
  const Params = {
    id: TASKS_MODULE_ID_2,
    api: {
      body: BodyParams,
    },
  };

  requestData(Params);
}

export function fetchSprintsAndTasksList(pro_id, props) {
  // console.log("in fetchSprintsAndTasks pro_id = ", pro_id);

  const { id, fetchSprints } = props;
  let projectBodyParams = new FormData();
  const projectsPayload = {
    projectId: pro_id,
  };

  projectBodyParams.append("params", JSON.stringify(projectsPayload));
  projectBodyParams.append("type", "getData");
  projectBodyParams.append("command", "getProjectSprint");

  const sprintParams = {
    id,
    api: {
      body: projectBodyParams,
    },
  };

  fetchSprints(sprintParams);
}

export function fetchCategoriesFromUtils(props) {
  const { id, fetchCategories } = props;
  let BodyParams = new FormData();
  const Payload = {};
  BodyParams.append("params", JSON.stringify(Payload));
  BodyParams.append("type", "getData");
  BodyParams.append("command", "getTaskCategory");
  const Params = {
    id,
    api: {
      body: BodyParams,
    },
  };

  fetchCategories(Params);
}

export function validateDate(date) {
  let dateBillable = date;
  if (typeof date === "string") {
    dateBillable = moment(date);
  }
  return dateBillable;
}

export function addNewTask(props, state, dataOffset) {
  let addDataParamters = new FormData();
  const {
    category_id,
    sprint_id,
    task_title,
    short_description,
    estimated_hours,
    start_date,
    end_date,
    task_refno,
    task_status,
    project_id,
    is_billable,
  } = state;

  const payload = {
    category_id,
    sprint_id,
    task_title,
    short_description,
    estimated_hours,
    start_date: dateFormatter(validateDate(start_date), "yyyy-MM-dd"),
    end_date: dateFormatter(validateDate(end_date), "yyyy-MM-dd"),
    task_refno,
    task_status,
    project_id,
    is_billable,
  };

  addDataParamters.append("params", JSON.stringify(payload));
  addDataParamters.append("type", "addData");
  addDataParamters.append("command", "addTask");

  const { id, requestData } = props;
  const newEntryParams = {
    id,
    api: {
      body: addDataParamters,
    },
  };
  return requestData(newEntryParams).then((response) => {
    if (response.apiData && response.apiData.apiData === true) {
      fetchTasksFromUtils(
        props,
        dataOffset.dataLimit,
        dataOffset.dataOffset,
        dataOffset.searchParameterKey,
        dataOffset.sortBy,
        dataOffset.sortType,
        dataOffset.searchedProjectId
      );
      return true;
    } else if (response.apiData && response.apiData.apiData === "duplicate") {
      return "duplicate";
    } else {
      return false;
    }
  });
}

export function updateTask(entryID, props, state, dataOffset) {
  let updateDataParamters = new FormData();
  const {
    category_id,
    sprint_id,
    task_title,
    short_description,
    estimated_hours,
    start_date,
    end_date,
    task_refno,
    task_status,
    project_id,
    is_billable,
  } = state;

  const payload = {
    task_id: entryID,
    category_id,
    sprint_id,
    task_title,
    short_description,
    estimated_hours,
    start_date: dateFormatter(validateDate(start_date), "yyyy-MM-dd"),
    end_date: dateFormatter(validateDate(end_date), "yyyy-MM-dd"),
    task_refno,
    task_status,
    project_id,
    is_billable,
  };

  updateDataParamters.append("params", JSON.stringify(payload));
  updateDataParamters.append("type", "updateData");
  updateDataParamters.append("command", "updateTask");
  const { id, updateData } = props;
  const newEntryParams = {
    id,
    api: {
      body: updateDataParamters,
    },
  };

  // console.log("payload to update task = ", payload);
  // console.log("updateDataParamters = ", updateDataParamters);
  return updateData(newEntryParams).then((response) => {
    if (response.apiData && response.apiData.apiData === true) {
      fetchTasksFromUtils(
        props,
        dataOffset.dataLimit,
        dataOffset.dataOffset,
        dataOffset.searchParameterKey,
        dataOffset.sortBy,
        dataOffset.sortType,
        dataOffset.searchedProjectId
      );
      return true;
    } else if (response.apiData && response.apiData.apiData === "duplicate") {
      return "duplicate";
    } else {
      return false;
    }
  });
}

export function deleteTask(taskID, props) {
  // console.log("in delete entry");
  var deleteDataParamters = new FormData();
  const payload = {
    task_id: taskID,
  };

  deleteDataParamters.append("params", JSON.stringify(payload));
  deleteDataParamters.append("type", "removeData");
  deleteDataParamters.append("command", "deleteTask");
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
      // fetchTasksFromUtils(props, dataLimit, dataOffset, searchParameterKey);
      return true;
    } else {
      return false;
    }
  });
}
