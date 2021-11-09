import colors from "../../../common/colors";
import {
  SUBTASKS_MODULE_ID_2,
  SUBTASKS_MODULE_ID,
  LOADER_ID,
  LOADER_SHOW,
} from "../../../../constants/app.constants";
import { dateFormatter } from "../../../utils/calender.utils";
import moment from "moment";
import Colors from "../../../common/colors";
export const spanStyleHeader = {
  color: colors.blueColor,
  fontWeight: "bold",
  fontSize: "20px",
};

const textArea = {
  data: "",
  // style: textAreaStyle,
  rows: "5",
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
  width: "95%",
  // textAlignLast: "center",
  // boxShadow: `${colors.boxShadowTextfield} 0px 2px 2px 0px`,
  // backgroundColor: colors.teftFieldBackground,
  // border: `1px solid ${colors.grayColorBorder}`,
  // height: "25px",
  // fontSize: "14px"
};

const multipleDropDownStyle = {
  width: "80%",
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

export function fetchTasksListFromUtils(project_id, props) {
  // console.log("in fetchSprintsAndTasks project_id = ", project_id);
  const { id, fetchTasks } = props;
  let tasksBodyParams = new FormData();
  const tasksPayload = {
    projectId: project_id,
  };
  tasksBodyParams.append("params", JSON.stringify(tasksPayload));
  tasksBodyParams.append("type", "getData");
  tasksBodyParams.append("command", "getProjectTask");
  const tasksParams = {
    id,
    api: {
      body: tasksBodyParams,
    },
  };
  return fetchTasks(tasksParams);
}

export function fetchSprintList(pro_id, props) {
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
  BodyParams.append("command", "getCategories");
  const Params = {
    id,
    api: {
      body: BodyParams,
    },
  };

  fetchCategories(Params);
}

export function fetchSubTasksFromUtils(
  props,
  dataLimit,
  dataOffset,
  searchParameterKey,
  sortBy = "",
  sortType = "",
  selectedProjectId = ""
) {
  const { fetchAllSubTasks, updateComponentState } = props;
  // const { dataLimit, dataOffset, searchParameterKey } = state;
  updateComponentState(LOADER_ID, LOADER_SHOW, {
    showLoader: true,
  });

  const subTaskParameters = {
    id: SUBTASKS_MODULE_ID,
    dataLimit,
    dataOffset,
    searchParameterKey,
  };
  fetchAllSubTasks(subTaskParameters, sortBy, sortType, selectedProjectId).then(
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
  BodyParams.append("command", "getSingleSubTaskData");
  const Params = {
    id: SUBTASKS_MODULE_ID_2,
    api: {
      body: BodyParams,
    },
  };

  requestData(Params);
}

export function validateDate(date) {
  let dateBillable = date;
  if (typeof date === "string") {
    dateBillable = moment(date);
  }
  return dateBillable;
}

export function addNewSubTask(props, state, dataOffset) {
  let addDataParamters = new FormData();
  const {
    category_id,
    task_title,
    short_description,
    estimated_hours,
    start_date,
    end_date,
    task_refno,
    task_status,
    project_id,
    parent_task_id,
    is_billable,
    sprint_id,
  } = state;

  const payload = {
    category_id,
    task_title,
    short_description,
    estimated_hours,
    start_date: dateFormatter(validateDate(start_date), "yyyy-MM-dd"),
    end_date: dateFormatter(validateDate(end_date), "yyyy-MM-dd"),
    task_refno,
    task_status,
    project_id,
    parent_task_id,
    is_billable,
    sprint_id,
  };

  addDataParamters.append("params", JSON.stringify(payload));
  addDataParamters.append("type", "addData");
  addDataParamters.append("command", "addSubTask");

  // console.log("payload in add subtask = ", payload);

  const { id, requestData } = props;
  const newEntryParams = {
    id,
    api: {
      body: addDataParamters,
    },
  };
  return requestData(newEntryParams).then((response) => {
    if (response.apiData && response.apiData.apiData === true) {
      fetchSubTasksFromUtils(
        props,
        dataOffset.dataLimit,
        dataOffset.dataOffset,
        dataOffset.searchParameterKey,
        dataOffset.sortBy,
        dataOffset.sortType,
        dataOffset.searchedProjectId
      );
      return true;
    } else if (
      response.apiData &&
      (response.apiData.apiData === "titleduplicate" ||
        response.apiData.apiData === "refduplicate" ||
        response.apiData.apiData === "titlerefduplicate")
    ) {
      return response.apiData.apiData;
    } else {
      return false;
    }
  });
}

export function updateSubTask(entryID, props, state, dataOffset) {
  let updateDataParamters = new FormData();
  const {
    category_id,
    task_title,
    short_description,
    estimated_hours,
    start_date,
    end_date,
    task_refno,
    task_status,
    project_id,
    parent_task_id,
    is_billable,
    sprint_id,
  } = state;

  const payload = {
    task_id: entryID,
    category_id,
    task_title,
    short_description,
    estimated_hours,
    start_date: dateFormatter(validateDate(start_date), "yyyy-MM-dd"),
    end_date: dateFormatter(validateDate(end_date), "yyyy-MM-dd"),
    task_refno,
    task_status,
    project_id,
    parent_task_id,
    is_billable,
    sprint_id,
  };

  // console.log("payload = ", payload);

  updateDataParamters.append("params", JSON.stringify(payload));
  updateDataParamters.append("type", "updateData");
  updateDataParamters.append("command", "updateSubTask");
  const { id, updateData } = props;
  const newEntryParams = {
    id,
    api: {
      body: updateDataParamters,
    },
  };

  return updateData(newEntryParams).then((response) => {
    if (response.apiData && response.apiData.apiData === true) {
      fetchSubTasksFromUtils(
        props,
        dataOffset.dataLimit,
        dataOffset.dataOffset,
        dataOffset.searchParameterKey,
        dataOffset.sortBy,
        dataOffset.sortType,
        dataOffset.searchedProjectId
      );
      return true;
    } else if (
      response.apiData &&
      (response.apiData.apiData === "titleduplicate" ||
        response.apiData.apiData === "refduplicate" ||
        response.apiData.apiData === "titlerefduplicate")
    ) {
      return response.apiData.apiData;
    } else {
      return false;
    }
  });
}

export function deleteSubTask(subTaskID, props) {
  // console.log("in delete entry");
  var deleteDataParamters = new FormData();
  const payload = {
    task_id: subTaskID,
  };

  deleteDataParamters.append("params", JSON.stringify(payload));
  deleteDataParamters.append("type", "removeData");
  deleteDataParamters.append("command", "deleteSubTask");
  const { id, deleteData } = props;
  const deleteEntryParams = {
    id,
    api: {
      body: deleteDataParamters,
    },
  };
  return deleteData(deleteEntryParams).then((response) => {
    if (response.apiData && response.apiData.apiData === true) {
      // fetchSubTasksFromUtils(props, dataLimit, dataOffset, searchParameterKey);
      return true;
    } else {
      return false;
    }
  });
}

export function fetchTasksListFromSprint(pro_id_new, sprint_id, props) {
  // console.log("in fetchSprintsAndTasksList pro_id_new =", pro_id_new);
  const { id, fetchTasks } = props;

  let tasksBodyParams = new FormData();
  const tasksPayload = {
    projectId: pro_id_new,
    sprint_id: sprint_id,
  };

  tasksBodyParams.append("params", JSON.stringify(tasksPayload));
  tasksBodyParams.append("type", "getData");
  tasksBodyParams.append("command", "getProjectTask");
  const tasksParams = {
    id,
    api: {
      body: tasksBodyParams,
    },
  };

  fetchTasks(tasksParams);
}
