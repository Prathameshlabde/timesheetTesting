import colors from "../common/colors";
import {
  getPropsCurrentTimeStamp,
  getPropsCalender,
} from "../utils/calender.utils";
import { dateFormatter } from "../utils/calender.utils";
import { readCookie } from "../utils/common.utils";
import moment from "moment";

import {
  UPDATE_DASHBOARD,
  DASHBOARD_SHOULD_UPDATE,
  UPDATE_REVIEWENTRIES,
  REVIEWENTRIES_SHOULD_UPDATE,
} from "../../constants/app.constants";

export const spanStyleHeader = {
  // color: colors.blueColor,
  fontWeight: "bold",
  fontSize: "20px",
  color: "#192028",
};
export const spanStyleLabel = {
  display: "block",
  width: "80%",
  paddingBottom: "5px",
  fontWeight: "bold",
  className: "span-label",
};

export const errorMessageStyle = {
  color: colors.redColor,
  padding: "5px",
};

export const textFieldStyle = {
  textfieldSmall: {
    width: "58%",
    backgroundColor: colors.teftFieldBackground,
    border: `1px solid ${colors.grayColorBorder}`,
    height: "23px",
  },
  textfieldLarge: {
    width: "80%",
    backgroundColor: colors.teftFieldBackground,
    border: `1px solid ${colors.grayColorBorder}`,
    height: "23px",
  },
};

const datePickerStyles = {
  width: "80%",
};

const todayDate =
  new Date().getFullYear() +
  "-" +
  ("0" + (new Date().getMonth() + 1)).slice(-2) +
  "-" +
  ("0" + new Date().getDate()).slice(-2);

const datePicker = {
  currentDate: todayDate,
  style: datePickerStyles,
};

const dropDownStyle = {
  width: "90%",
  backgroundColor: colors.teftFieldBackground,
  border: `1px solid ${colors.grayColorBorder}`,
  height: "27px",
};

const textAreaStyle = {
  width: "100%",
  backgroundColor: colors.whiteColor,
  resize: "none",
  borderRadius: "3px",
  boxShadow: "0px 3px 10px -4px #bebebe",
};

const dropDown = {
  style: dropDownStyle,
};

const spanLabel = {
  id: "lbl",
  maxFont: 14,
  minFont: 5.5,
  className: "span-label",
};

const closeButton = {
  id: "btn",
  data: "Cancel",
  width: "100%",
  className: "button-cancel",
};
const submitButton = {
  id: "btn",
  data: "Submit",
  className: "button-submitEntry",
};

const textField = {
  data: "",
};
const textArea = {
  data: "",
  style: textAreaStyle,
  rows: "6",
  cols: "50",
  fontSize: "12px",
};

export function getPropsDropdown() {
  return dropDown;
}
export function getPropsspanLabel() {
  return spanLabel;
}
export function getPropsButtonClose() {
  return closeButton;
}
export function getPropsButtonSubmit() {
  return submitButton;
}
export function getPropsTextField() {
  return textField;
}
export function getPropsDatePicker() {
  return datePicker;
}

export function getPropsTextArea() {
  return textArea;
}

export function capIT(start_time_param, end_time_param) {
  let starttime = start_time_param.toUpperCase();
  let endtime = end_time_param.toUpperCase();

  let expr = /:/; // no quotes here

  let s_str = expr.test(starttime);
  let e_str = expr.test(endtime);

  let tempStr = "";
  expr = /PM/;

  const capitalObj = {
    new_start_time: starttime,
    new_end_time: endtime,
    update: false,
  };

  if (s_str === false) {
    if (expr.test(starttime)) {
      tempStr = starttime.split("PM");
      capitalObj.new_start_time = tempStr[0].trim() + ":00 PM";
    } else {
      tempStr = starttime.split("AM");
      capitalObj.new_start_time = tempStr[0].trim() + ":00 AM";
    }
    capitalObj.update = true;
  } else {
    capitalObj.update = false;
  }

  if (e_str === false) {
    if (expr.test(endtime)) {
      tempStr = endtime.split("PM");
      capitalObj.new_end_time = tempStr[0].trim() + ":00 PM";
    } else {
      tempStr = endtime.split("AM");
      capitalObj.new_end_time = tempStr[0].trim() + ":00 AM";
    }
    capitalObj.update = true;
  } else {
    capitalObj.update = false;
  }

  // console.log("capitalObj in capit= ", capitalObj);

  return capitalObj;
}

export function get_time_diff(start_time_param, end_time_param) {
  let starttime = start_time_param;
  let endtime = end_time_param;

  const billableEstimatedObject = {
    billable_hrs: "",
    estimated_hrs: "",
  };

  let pdays = 0;

  let starttime_h = starttime.split(":");
  let starttime_m = starttime_h[1].split(" ");
  let endtime_h = endtime.split(":");
  let endtime_m = endtime_h[1].split(" ");

  let h1 = starttime_h[0];
  let h2 = endtime_h[0];
  let m1 = starttime_m[0];
  let m2 = endtime_m[0];

  let ph1 = parseInt(h1, 10);
  let ph2 = parseInt(h2, 10);
  let pm1 = parseInt(m1, 10);
  let pm2 = parseInt(m2, 10);

  // console.log("h1 in get time diff= ", h1);
  // console.log("h2 in get time diff= ", h2);
  // console.log("m1 in get time diff= ", m1);
  // console.log("m2 in get time diff= ", m2);
  // console.log("ph1 in get time diff= ", ph1);
  // console.log("ph2 in get time diff= ", ph2);
  // console.log("pm1 in get time diff= ", pm1);
  // console.log("pm2 in get time diff= ", pm2);

  let am1, am2;
  if (starttime_m[1] === "AM") {
    am1 = 1;
  } else {
    am1 = 2;
  }

  if (endtime_m[1] === "AM") {
    am2 = 1;
  } else {
    am2 = 2;
  }

  // console.log("am1 in get time diff= ", am1);
  // console.log("am2 in get time diff= ", am2);

  if ((am1 === 2) & (ph1 < 12)) ph1 = ph1 + 12;
  if ((am2 === 2) & (ph2 < 12)) ph2 = ph2 + 12;
  if ((am1 === 1) & (ph1 === 12)) ph1 = 24;
  if ((am2 === 1) & (ph2 === 12)) ph2 = 24;
  if ((am1 === 2) & (am2 === 1) & (ph2 < 24)) ph2 = ph2 + 24;
  if ((am1 === am2) & (ph1 > ph2)) ph2 = ph2 + 24;

  if (pm2 < pm1) {
    pm2 = pm2 + 60;
    ph2 = ph2 - 1;
  }

  let mdiff = pm2 - pm1;
  let hdiff = ph2 - ph1 + pdays * 24;

  // if (hdiff < 0) {
  //   hdiff = hdiff + 24; //Math.abs(hdiff);
  // }

  // console.log("mdiff in get time diff= ", mdiff);
  // console.log("hdiff in get time diff= ", hdiff);

  let Final_estimated_hrs =
    parseFloat(hdiff) + parseFloat((mdiff / 60).toFixed(2));
  let Final_bilable_hrs =
    parseFloat(hdiff) + parseFloat((mdiff / 60).toFixed(2));

  // console.log("Final_estimated_hrs in get time diff= ", Final_estimated_hrs);
  // console.log("Final_bilable_hrs in get time diff= ", Final_bilable_hrs);

  billableEstimatedObject.estimated_hrs = Final_estimated_hrs;
  billableEstimatedObject.billable_hrs = Final_bilable_hrs;

  return billableEstimatedObject;
}

export function fetchProjectList(props) {
  const { id, fetchProjectsDashboard } = props;
  const projectParameters = {
    id,
  };
  fetchProjectsDashboard(projectParameters);
}

export function fetchSprintsAndTasksList(pro_id, sprint_id, props) {
  const { id, fetchSprints, fetchTasks } = props;
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

  let tasksBodyParams = new FormData();
  const tasksPayload = {
    projectId: pro_id,
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

  fetchSprints(sprintParams);
  fetchTasks(tasksParams);
}

export function fetchSubTasksList(task_id, props) {
  const { id, fetchSubTasks } = props;
  let subTasksBodyParams = new FormData();
  const tasksPayload = {
    parent_task_id: task_id,
  };

  subTasksBodyParams.append("params", JSON.stringify(tasksPayload));
  subTasksBodyParams.append("type", "getData");
  subTasksBodyParams.append("command", "getSubTask");

  const subTasksParams = {
    id,
    api: {
      body: subTasksBodyParams,
    },
  };
  fetchSubTasks(subTasksParams);
}

export function fetchEntryDataFromUtils(props) {
  const { id, requestData, billingID } = props;
  let BodyParams = new FormData();
  const Payload = {
    bill_id: billingID,
  };

  BodyParams.append("params", JSON.stringify(Payload));
  BodyParams.append("type", "getData");
  BodyParams.append("command", "getSingleBillingEntryData");

  const Params = {
    id,
    api: {
      body: BodyParams,
    },
  };

  requestData(Params);
}

export function addNewEntry(props, state) {
  let empIDfromCookie = "";
  if (readCookie("empId")) {
    empIDfromCookie = readCookie("empId");
  }

  let addDataParamters = new FormData();
  const currentTimeStamp = getPropsCurrentTimeStamp();
  const {
    description,
    start_time,
    end_time,
    estimated_hrs,
    bilable_hrs,
    ref_no,
    sub_ref_no,
    pro_id,
    billing_date,
    task_id,
    sub_task_id,
    sprint_id,
    sprint_ref_no,
  } = state;

  let dateBillable = billing_date;
  if (typeof billing_date === "string") {
    dateBillable = moment(billing_date);
  }

  const payload = {
    description,
    start_time: start_time.trim(),
    end_time: end_time.trim(),
    estimated_hrs,
    bilable_hrs,
    ref_no,
    sub_ref_no,
    emp_id: empIDfromCookie,
    pro_id,
    billing_date: dateFormatter(dateBillable, "yyyy-MM-dd"),
    task_id,
    sub_task_id,
    start_time_for_query: currentTimeStamp,
    sprint_id,
    sprint_ref_no,
  };

  addDataParamters.append("params", JSON.stringify(payload));
  addDataParamters.append("type", "addData");
  addDataParamters.append("command", "addTimesheetEntry");

  // console.log("Parameters in Adding data:-", payload);

  const { id, requestData, updateComponentState } = props;
  const newEntryParams = {
    id,
    api: {
      body: addDataParamters,
    },
  };

  if (props.mainPage === "Reports") {
    return requestData(newEntryParams).then((response) => {
      if (response.apiData.apiData === true) {
        // console.log("setting yes new");
        updateComponentState(
          UPDATE_REVIEWENTRIES,
          REVIEWENTRIES_SHOULD_UPDATE,
          "YES"
        );
        return true;
      } else {
        return false;
      }
    });
  } else {
    return requestData(newEntryParams).then((response) => {
      if (response.apiData.apiData === true) {
        updateComponentState(UPDATE_DASHBOARD, DASHBOARD_SHOULD_UPDATE, "YES");
        return true;
      } else {
        return false;
      }
    });
  }
}

export function updateEntry(billingID, props, state) {
  let empIDfromCookie = "";
  if (readCookie("empId")) {
    empIDfromCookie = readCookie("empId");
  }
  let updateDataParamters = new FormData();

  let dateBillable = state.billing_date;
  if (typeof billing_date === "string") {
    dateBillable = moment(state.billing_date);
  }
  const payload = {
    bill_id: billingID,
    description: state.description,
    start_time: state.start_time.trim(),
    end_time: state.end_time.trim(),
    estimated_hrs: state.estimated_hrs,
    bilable_hrs: state.bilable_hrs,
    ref_no: state.ref_no,
    sub_ref_no: state.sub_ref_no,
    emp_id: empIDfromCookie,
    pro_id: state.pro_id,
    billing_date: dateFormatter(dateBillable, "yyyy-MM-dd"),
    task_id: state.task_id,
    sub_task_id: state.sub_task_id,
    start_time_for_query: state.start_time_for_query,
    sprint_id: state.sprint_id,
    sprint_ref_no: state.sprint_ref_no,
  };

  updateDataParamters.append("params", JSON.stringify(payload));
  updateDataParamters.append("type", "updateData");
  updateDataParamters.append("command", "updateTimesheetEntry");

  const { id, updateData, updateComponentState } = props;
  const newEntryParams = {
    id,
    api: {
      body: updateDataParamters,
    },
  };

  if (props.mainPage === "Reports") {
    return updateData(newEntryParams).then((response) => {
      if (response.apiData.apiData === true) {
        // console.log("setting yes update");
        updateComponentState(
          UPDATE_REVIEWENTRIES,
          REVIEWENTRIES_SHOULD_UPDATE,
          "YES"
        );
        return true;
      } else {
        return false;
      }
    });
  } else {
    return updateData(newEntryParams).then((response) => {
      if (response.apiData.apiData === true) {
        updateComponentState(UPDATE_DASHBOARD, DASHBOARD_SHOULD_UPDATE, "YES");
        return true;
      } else {
        return false;
      }
    });
  }
}

export function getnewEntryStr(selectedDate) {
  let newEntryStr = "";
  const calender = getPropsCalender(selectedDate);

  newEntryStr =
    calender.currentDay +
    ", " +
    calender.currentDate +
    calender.dateAbbrv +
    " " +
    calender.currentMonth +
    ", " +
    selectedDate.year();

  return newEntryStr;
}

export function validateTimePicker(selectedTime) {
  if (selectedTime.match(/^(0?[1-9]|1[012])(:[0-5]\d) [AP][M]$/i)) return true;
  else return false;
}

export function validateTimeBillableHrs(selectedTime) {
  if (selectedTime.match(/^((([0-9]?[0-9]|1[012])(.[0-9]?[0-9]))|0)$/i))
    return true;
  else return false;
}

export function getAllPropsForComponent() {
  const spanLabel = getPropsspanLabel();
  const dropDown = getPropsDropdown();
  const datePicker = getPropsDatePicker();
  const closeButton = getPropsButtonClose();
  const submitButton = getPropsButtonSubmit();
  const textArea = getPropsTextArea();
  return {
    textArea,
    dropDown,
    datePicker,
    closeButton,
    submitButton,
    spanLabel,
  };
}

export function getHeaderText(props) {
  const { isDuplicateEntry, isEditEntry } = props;
  if (isEditEntry === true) {
    return "Edit Entry";
  } else if (isDuplicateEntry === true) {
    return "Duplicate Entry";
  } else {
    return "New Entry";
  }
}
