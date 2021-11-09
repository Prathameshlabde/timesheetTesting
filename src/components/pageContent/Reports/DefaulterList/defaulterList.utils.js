import colors from "../../../common/colors";
import "../reports.css";
import moment from "moment";
import { dateFormatter } from "../../../utils/calender.utils";
import {
  REPORT_SUBMENU_ID,
  REPORT_SUBMIT_BUTTON_TITLE,
  LOADER_ID,
  LOADER_SHOW,
  IS_RELOAD,
  SORT_BY,
  VIEW_BY,
  REPORT_SUBMENU_ID_DEF,
  ERROR_STR,
} from "../../../../constants/app.constants";
import Colors from "../../../common/colors";

let sort_by = "date";
let sort_by_selected_id = "1";
let view_by = "expanded";
let view_by_selected_id = "1";
let fdate = dateFormatter(moment().subtract(1, "days"), "yyyy-MM-dd");
let tdate = dateFormatter(moment().subtract(1, "days"), "yyyy-MM-dd");
let counter3 = 0;
let counter2 = 0;

export function clearDataFromUtils() {
  sort_by = "date";
  sort_by_selected_id = "1";
  view_by = "expanded";
  view_by_selected_id = "1";
  fdate = dateFormatter(moment().subtract(1, "days"), "yyyy-MM-dd");
  tdate = dateFormatter(moment().subtract(1, "days"), "yyyy-MM-dd");

  counter3 = 0;
  counter2 = 0;
}

export const textFieldStyle = {
  textfieldSmall: {
    width: "58%",
    boxShadow: `${colors.boxShadowTextfield} 0px 2px 2px 0px`,
    backgroundColor: colors.teftFieldBackground,
    border: `1px solid ${colors.grayColorBorder}`,
    height: "25px",
    fontSize: "14px",
    color: Colors.textColor,
  },
  textfieldLarge: {
    width: "80%",
    boxShadow: `${colors.boxShadowTextfield} 0px 2px 2px 0px`,
    backgroundColor: colors.teftFieldBackground,
    border: `1px solid ${colors.grayColorBorder}`,
    height: "25px",
    fontSize: "14px",
    color: Colors.textColor,
  },
};

export function getDataFromUtils() {
  const dataObject = {
    fromDate: fdate,
    toDate: tdate,
    sort_by: sort_by,
    view_by: view_by,
  };

  return dataObject;
}

export function setCurrentProps(props) {
  if (counter3 === 0) {
    counter3++;
  }
}

export function getComponentPropsDefaulterList(
  componentType,
  componentLabel,
  props,
  states
) {
  if (componentType === "Button") {
    let componentProps = {
      className: "report-submitButton",
      type: "submit",
      data: REPORT_SUBMIT_BUTTON_TITLE,
      id: "submitReport",
      onClick: (e) => submitReport(props, states),
    };
    return componentProps;
  } else if (componentType === "DatePicker") {
    if (componentLabel === "From Date") {
      let componentProps = {
        id: "fdate",
        value: fdate,
        className: "date-picker",
        onChange: onChangeFieldValues,
        isEnableFutureDates: false,
        isEnablePastDates: true,
      };
      return componentProps;
    } else if (componentLabel === "To Date") {
      let componentProps = {
        id: "tdate",
        value: tdate,
        className: "date-picker",
        onChange: onChangeFieldValues,
        isEnableFutureDates: false,
        isEnablePastDates: true,
      };
      return componentProps;
    }
  } else if (componentType === "DropdownList") {
    if (componentLabel === "Sort By") {
      let componentProps = {
        id: "sort_by",
        dropDownData: [
          {
            id: "1",
            name: "Date",
          },
          {
            id: "2",
            name: "Employee",
          },
        ],
        className: "report-dropDownList",
        defaultOption: "null",
        selectedID: sort_by_selected_id,
        onChange: onChangeFieldValues,
      };
      return componentProps;
    } else if (componentLabel === "View By") {
      let componentProps = {
        id: "view_by",
        dropDownData: [
          {
            id: "1",
            name: "Expanded",
          },
          {
            id: "2",
            name: "Collapsed",
          },
        ],
        className: "report-dropDownList",
        defaultOption: "null",
        selectedID: view_by_selected_id,
        onChange: onChangeFieldValues,
      };
      return componentProps;
    }
  } else if (componentType === "Label") {
    let componentProps = {};
    return componentProps;
  } else if (componentType === "SpanLabel") {
    let componentProps = {};
    return componentProps;
  } else if (componentType === "TextField") {
    let componentProps = {};
    return componentProps;
  }
}

function onChangeFieldValues(id, updatedValue, updatedBillable, updatedName) {
  if (id === "fdate") {
    fdate = dateFormatter(updatedValue, "yyyy-MM-dd");
  } else if (id === "tdate") {
    tdate = dateFormatter(updatedValue, "yyyy-MM-dd");
  } else if (id === "sort_by") {
    if (updatedValue === "1") {
      sort_by = "date";
      sort_by_selected_id = "1";
    } else if (updatedValue === "2") {
      sort_by = "employee";
      sort_by_selected_id = "2";
    }
    this.updateComponentState(REPORT_SUBMENU_ID, SORT_BY, sort_by);
  } else if (id === "view_by") {
    if (updatedValue === "1") {
      view_by = "expanded";
      view_by_selected_id = "1";
    } else if (updatedValue === "2") {
      view_by = "collapsed";
      view_by_selected_id = "2";
    }
  }
  this.updateComponentState(REPORT_SUBMENU_ID, VIEW_BY, view_by);
}

export function fetchEmployeeList(props) {
  if (counter2 === 0) {
    const { requestData } = props;
    const payload = {};
    let parameters = new FormData();

    parameters.append("params", JSON.stringify(payload));
    parameters.append("type", "getData");

    parameters.append("command", "getActiveEmployees");

    const employeeParams = {
      id: "DEFAULTER_LIST_TEMP_ID",
      api: {
        body: parameters,
      },
    };

    requestData(employeeParams);
    counter2++;
  }
}

function submitReport(props, state) {
  let reportPayload;
  const { requestData, updateComponentState, reportState } = props;

  const sort_by_prop = reportState.get(SORT_BY, ERROR_STR);
  const view_by_prop = reportState.get(VIEW_BY, ERROR_STR);

  let view_by = state.view_by;
  let sort_by = state.sort_by;

  if (sort_by_prop !== ERROR_STR) {
    sort_by = sort_by_prop;
  }

  if (view_by_prop !== ERROR_STR) {
    view_by = view_by_prop;
  }

  updateComponentState(LOADER_ID, LOADER_SHOW, {
    showLoader: true,
  });

  let reportBodyParams = new FormData();
  let strCommand = "";
  if (view_by === "collapsed") {
    reportPayload = {
      fdate,
      tdate,
      loggedIn_user: state.LoggedInUser,
    };
    strCommand = "getDatesFromTwoDates";
  } else {
    reportPayload = {
      fdate,
      tdate,
      loggedIn_user: state.LoggedInUser,
      sort_by,
      view_by,
    };
    strCommand = "getDefaulterListExpanded";
  }

  reportBodyParams.append("command", strCommand);
  reportBodyParams.append("params", JSON.stringify(reportPayload));
  reportBodyParams.append("type", "getReport");

  const reportParams = {
    id: REPORT_SUBMENU_ID_DEF,
    api: {
      body: reportBodyParams,
    },
  };
  requestData(reportParams).then((response) => {
    if (response.apiData && response.apiData.isFetching === false) {
      updateComponentState(LOADER_ID, LOADER_SHOW, {
        showLoader: false,
      });

      updateComponentState(REPORT_SUBMENU_ID, IS_RELOAD, true);
    }
  });
}

const submitButton = {
  id: "btn",
  data: "Send Reminder",
  className: "button-submitEntry",
  style: { width: "auto", margin: "0 10px 0 10px" },
};

export function getPropsButtonSubmit() {
  return submitButton;
}

export function sendReminderToEmp(props, weekSelected) {
  const { id, requestData } = props;
  let reminderBodyParams = new FormData();
  const reminderPayload = {
    weekSelected: weekSelected,
  };

  reminderBodyParams.append("params", JSON.stringify(reminderPayload));
  reminderBodyParams.append("type", "reminder");

  const reminderParams = {
    id,
    api: {
      body: reminderBodyParams,
    },
  };

  return requestData(reminderParams).then((response) => {
    if (response.apiData && response.apiData !== "") {
      // fetchProjectsFromUtils(props, dataLimit, dataOffset, searchParameterKey);
      return response.apiData;
    } else {
      return false;
    }
  });
}

export function getLastReminderData(props) {
  const { id, requestData } = props;
  let reminderBodyParams = new FormData();
  const reminderPayload = {};

  reminderBodyParams.append("command", "getReminderData");
  reminderBodyParams.append("params", JSON.stringify(reminderPayload));
  reminderBodyParams.append("type", "getLeaveManagement");

  const reminderParams = {
    id,
    api: {
      body: reminderBodyParams,
    },
  };

  return requestData(reminderParams).then((response) => {
    if (response.apiData && response.apiData !== "") {
      // fetchProjectsFromUtils(props, dataLimit, dataOffset, searchParameterKey);
      return response.apiData;
    } else {
      return false;
    }
  });
}
