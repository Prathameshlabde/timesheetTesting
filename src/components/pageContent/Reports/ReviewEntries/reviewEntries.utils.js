import colors from "../../../common/colors";
import "../reports.css";
import "../../Dashboard/dashboard.css";
import moment from "moment";
import { dateFormatter } from "../../../utils/calender.utils";
import {
  REPORT_SUBMENU_ID,
  PROJECT_ID,
  TASK_ID,
  REPORT_TEMP_BOOL,
  REPORT_TEMP_BOOL2,
  REPORT_TEMP_BOOL3,
  REPORT_SUBMIT_BUTTON_TITLE,
  LOADER_ID,
  LOADER_SHOW,
  SORT_BY,
  DEFAULT_OPTION,
  EMP_ID,
  REPORT_OBJECT,
  DASHBOARD_NAVIGATE_ID,
} from "../../../../constants/app.constants";
import { getDateDifferencesFromUtils } from "../Reports.utils";
import { isEmpty } from "../../../utils/common.utils";
import Colors from "../../../common/colors";

let sort_by = "date";
let sort_by_selected_id = "1";
let fdate = dateFormatter(moment(), "yyyy-MM-dd");
let tdate = dateFormatter(moment(), "yyyy-MM-dd");
let pro_id = "";
let pro_name = "All";
let selected_pro_id = "";
let task_id = "";
let task_name = "All";
let emp_id = "";
let billable = 0;
let nonbillable = 0;
let support = 0;
let currentProps;
let emp_name = "All";
let counter1 = 0;
let counter2 = 0;
let counter3 = 0;
let billableBool_reviewEntries = false;
let nonbillableBool_reviewEntries = false;
let supportBool_reviewEntries = false;

export function clearDataFromUtils() {
  sort_by = "date";
  sort_by_selected_id = "1";
  fdate = dateFormatter(moment(), "yyyy-MM-dd");
  tdate = dateFormatter(moment(), "yyyy-MM-dd");
  pro_id = "";
  pro_name = "All";
  selected_pro_id = "";
  task_id = "";
  task_name = "All";
  emp_id = "";
  billable = 0;
  nonbillable = 0;
  support = 0;
  currentProps = "";
  emp_name = "All";
  counter1 = 0;
  counter2 = 0;
  counter3 = 0;
  billableBool_reviewEntries = false;
  nonbillableBool_reviewEntries = false;
  supportBool_reviewEntries = false;
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

export function deleteEntryFromUtils(selectedProps, billingID, state, props) {
  // console.log("in delete entry");
  var deleteDataParamters = new FormData();
  const payload = {
    bill_id: billingID,
  };

  deleteDataParamters.append("params", JSON.stringify(payload));
  deleteDataParamters.append("type", "removeData");
  deleteDataParamters.append("command", "deleteTimesheetEntry");

  const { id, deleteData } = selectedProps;

  const deleteEntryParams = {
    id,
    api: {
      body: deleteDataParamters,
    },
  };
  deleteData(deleteEntryParams).then((apiData) => {
    let reportPayload;
    const { fetchReport } = props;
    let reportBodyParams = new FormData();
    reportPayload = {
      fdate,
      tdate,
      pro_id,
      emp_id,
      loggedIn_user: state.LoggedInUser,
      sort_by,
    };
    reportBodyParams.append("command", "getReviewEntriesReport");
    reportBodyParams.append("support", support); //change this accrding to php
    reportBodyParams.append("params", JSON.stringify(reportPayload));
    reportBodyParams.append("type", "getReport");
    reportBodyParams.append("billable_hours_only", billable);
    reportBodyParams.append("nonbillable_hours_only", nonbillable);

    const reportParams = {
      id: REPORT_SUBMENU_ID,
      api: {
        body: reportBodyParams,
      },
    };
    fetchReport(reportParams);
  });
}

export function getDataFromUtils() {
  const dataObject = {
    fromDate: fdate,
    toDate: tdate,
    emp_name,
    pro_name,
    task_name,
    billableBool_reviewEntries: billableBool_reviewEntries,
    nonbillableBool_reviewEntries: nonbillableBool_reviewEntries,
  };

  return dataObject;
}

export function setCurrentProps(props, states) {
  if (counter3 === 0) {
    currentProps = props;
    const { pmDashboardState } = props;
    const dataObject = pmDashboardState.get(REPORT_OBJECT, {});
    // console.log("dataObject from pm dashboard = ", dataObject);
    if (!isEmpty(dataObject)) {
      if (dataObject.fdate) fdate = dataObject.fdate;
      if (dataObject.tdate) tdate = dataObject.tdate;
      if (dataObject.dataTitle === "emp_id") {
        emp_id = dataObject.id ? dataObject.id : "";
        emp_name = dataObject.name ? dataObject.name : "All";
        currentProps.updateComponentState(REPORT_SUBMENU_ID, EMP_ID, emp_id);
      }
      if (dataObject.dataTitle === "pro_id") {
        pro_id = dataObject.id ? dataObject.id : "";
        selected_pro_id = pro_id;
        pro_name = dataObject.name ? dataObject.name : "All";
        // console.log("pro_name set = ", pro_name);
        currentProps.updateComponentState(
          REPORT_SUBMENU_ID,
          PROJECT_ID,
          pro_id
        );
      }
      // setTimeout(() => {
      submitReport(props, states);
      // }, 1000);
    }
    counter3++;
  }
}

export function fetchProjectList(props, eid = "") {
  if (counter1 === 0) {
    const { fetchProjects } = props;
    const payload = {
      from: "allActiveInactive",
      emp_id: eid,
    };
    let parameters = new FormData();
    parameters.append("params", JSON.stringify(payload));
    parameters.append("type", "getData");
    parameters.append("command", "getActiveProjects");

    const employeeParams = {
      id: REPORT_SUBMENU_ID,
      api: {
        body: parameters,
      },
    };
    fetchProjects(employeeParams);
    counter1++;
  }
}

export function fetchEmployeeList(props) {
  if (counter2 === 0) {
    // console.log("fetch employee list");

    const { requestData } = props;
    const payload = {};
    let parameters = new FormData();
    parameters.append("params", JSON.stringify(payload));
    parameters.append("type", "getReport");
    parameters.append("command", "getEmployees_ReviewReport");

    const employeeParams = {
      id: REPORT_SUBMENU_ID,
      api: {
        body: parameters,
      },
    };

    requestData(employeeParams);
    counter2++;
  }
}

export function fetchTasksList(props) {
  const { projectId, fetchTasks } = props;
  let tasksBodyParams = new FormData();
  const tasksPayload = { projectId };
  tasksBodyParams.append("params", JSON.stringify(tasksPayload));
  tasksBodyParams.append("type", "getData");
  tasksBodyParams.append("command", "getProjectTask");
  const tasksParams = {
    id: REPORT_SUBMENU_ID,
    api: {
      body: tasksBodyParams,
    },
  };

  fetchTasks(tasksParams);
}

export function getComponentPropsReviewEntries(
  componentType,
  componentLabel,
  props,
  states
) {
  // if (props.projectsDataState && props.projectsDataState.apiData[0]) {
  //   pro_id = props.projectsDataState.apiData[0].id;
  // }

  if (componentType === "Button") {
    let componentProps = {
      className: "report-submitButton",
      type: "submit",
      data: REPORT_SUBMIT_BUTTON_TITLE,
      id: "submitReport",
      onClick: (e) => submitReport(props, states), //this.submitReport()
    };
    return componentProps;
  } else if (componentType === "CheckBox") {
    if (componentLabel === "Billable Hours Only") {
      let componentProps = {
        id: "billableChk_review_entries",
        isCheck: billableBool_reviewEntries, //false,
        onClick: onClickCheckBoxes,
      };
      return componentProps;
    }
    if (componentLabel === "Non-Billable Hours Only") {
      let componentProps = {
        id: "nonbillableChk_review_entries",
        isCheck: nonbillableBool_reviewEntries, //false,
        onClick: onClickCheckBoxes,
      };
      return componentProps;
    }
    if (componentLabel === "Support") {
      let componentProps = {
        id: "support_review_entries",
        isCheck: supportBool_reviewEntries, //false,
        onClick: onClickCheckBoxes,
      };
      return componentProps;
    }
  } else if (componentType === "DatePicker") {
    if (componentLabel === "From Date") {
      let componentProps = {
        id: "fdate",
        className: "date-picker",
        value: fdate,
        onChange: onChangeFieldValues,
        isEnableFutureDates: false,
        isEnablePastDates: true,
      };
      return componentProps;
    } else if (componentLabel === "To Date") {
      let componentProps = {
        id: "tdate",
        className: "date-picker",
        value: tdate,
        onChange: onChangeFieldValues,
        isEnableFutureDates: false,
        isEnablePastDates: true,
      };
      return componentProps;
    }
  } else if (componentType === "DropdownList") {
    if (componentLabel === "Project") {
      let componentProps = {
        id: "pro_id",
        dropDownData: props.projectsDataState,
        className: "report-dropDownList",
        defaultOption: "All",
        onChange: onChangeFieldValues,
        selectedID: selected_pro_id,
      };
      return componentProps;
    } else if (componentLabel === "Task") {
      let componentProps = {
        id: "task_id",
        dropDownData: props.tasksDataState,
        className: "report-dropDownList",
        defaultOption: "All",
        onChange: onChangeFieldValues,
      };
      return componentProps;
    } else if (componentLabel === "Employee") {
      let componentProps = {
        id: "emp_id",
        dropDownData: props.employeeDataState,
        className: "report-dropDownList",
        defaultOption: "All",
        onChange: onChangeFieldValues,
        selectedID: emp_id,
      };
      return componentProps;
    } else if (componentLabel === "Sort By") {
      let componentProps = {
        id: "sort_by",
        dropDownData: [
          {
            id: "1",
            name: "Date",
          },
          {
            id: "2",
            name: "Project",
          },
          {
            id: "3",
            name: "Employee",
          },
        ],
        className: "report-dropDownList",
        defaultOption: "null",
        selectedID: sort_by_selected_id,
        onChange: onChangeFieldValues,
      };
      return componentProps;
    }
  } else if (componentType === "Icon") {
    let componentProps = {};
    return componentProps;
  } else if (componentType === "Label") {
    let componentProps = {};
    return componentProps;
  } else if (componentType === "SpanLabel") {
    let componentProps = {};
    return componentProps;
  } else if (componentType === "TextArea") {
    let componentProps = {};
    return componentProps;
  }
}

function onClickCheckBoxes(id, updatedValue) {
  // console.log("id in onClickCheckBoxes", id);
  // console.log("updatedValue in onClickCheckBoxes", updatedValue);

  if (id === "billableChk_review_entries") {
    if (updatedValue === true) {
      billable = 1;
      billableBool_reviewEntries = true;
      nonbillable = 0;
      nonbillableBool_reviewEntries = false;
      currentProps.updateComponentState(
        REPORT_SUBMENU_ID,
        REPORT_TEMP_BOOL2,
        nonbillableBool_reviewEntries
      );
    } else {
      billable = 0;
      billableBool_reviewEntries = false;
    }
    currentProps.updateComponentState(
      REPORT_SUBMENU_ID,
      REPORT_TEMP_BOOL,
      billableBool_reviewEntries
    );
  } else if (id === "nonbillableChk_review_entries") {
    if (updatedValue === true) {
      nonbillable = 1;
      nonbillableBool_reviewEntries = true;
      billable = 0;
      billableBool_reviewEntries = false;
      currentProps.updateComponentState(
        REPORT_SUBMENU_ID,
        REPORT_TEMP_BOOL,
        billableBool_reviewEntries
      );
    } else {
      nonbillable = 0;
      nonbillableBool_reviewEntries = false;
    }
    currentProps.updateComponentState(
      REPORT_SUBMENU_ID,
      REPORT_TEMP_BOOL2,
      nonbillableBool_reviewEntries
    );
  } else if (id === "support_review_entries") {
    if (updatedValue === true) {
      support = 1;
      supportBool_reviewEntries = true;
    } else {
      support = 0;
      supportBool_reviewEntries = false;
    }
    currentProps.updateComponentState(
      REPORT_SUBMENU_ID,
      REPORT_TEMP_BOOL3,
      supportBool_reviewEntries
    );
  }
}

function onChangeFieldValues(id, updatedValue, updatedBillable, updatedName) {
  if (id === "pro_id") {
    if (updatedValue === DEFAULT_OPTION) {
      pro_id = "";
      pro_name = "All";
      selected_pro_id = "";
    } else {
      pro_id = updatedValue;
      pro_name = updatedName;
      selected_pro_id = updatedValue;
    }
    task_id = "";
    task_name = "All";
    currentProps.updateComponentState(REPORT_SUBMENU_ID, PROJECT_ID, pro_id);
  } else if (id === "task_id") {
    if (updatedValue === DEFAULT_OPTION) {
      task_id = "";
    } else {
      task_id = updatedValue;
    }
    currentProps.updateComponentState(REPORT_SUBMENU_ID, TASK_ID, task_id);
  } else if (id === "fdate") {
    fdate = dateFormatter(updatedValue, "yyyy-MM-dd");
  } else if (id === "tdate") {
    tdate = dateFormatter(updatedValue, "yyyy-MM-dd");
  } else if (id === "emp_id") {
    currentProps.updateComponentState(REPORT_SUBMENU_ID, PROJECT_ID, "");

    if (updatedValue === DEFAULT_OPTION) {
      emp_id = "";
      emp_name = "All";

      pro_id = "";
      pro_name = "All";
      selected_pro_id = "";
      // selectedID: selected_pro_id,

      counter1 = 0;
      fetchProjectList(currentProps, emp_id);
    } else {
      pro_id = "";
      pro_name = "All";
      selected_pro_id = "";

      emp_id = updatedValue;
      emp_name = updatedName;
      counter1 = 0;
      fetchProjectList(currentProps, emp_id);
    }
  } else if (id === "sort_by") {
    if (updatedValue === "1") {
      sort_by = "date";
      sort_by_selected_id = "1";
    } else if (updatedValue === "2") {
      sort_by = "project";
      sort_by_selected_id = "2";
    } else if (updatedValue === "3") {
      sort_by = "employee";
      sort_by_selected_id = "3";
    }
    currentProps.updateComponentState(REPORT_SUBMENU_ID, SORT_BY, sort_by);
  }
}

function submitReport(props, state) {
  const DifferenceOfDate = getDateDifferencesFromUtils(fdate, tdate);
  const { fetchReport, updateComponentState, deleteComponentState } = props;
  deleteComponentState(DASHBOARD_NAVIGATE_ID);
  let reportBodyParams = new FormData();
  if (DifferenceOfDate <= 31) {
    let reportPayload;

    updateComponentState(LOADER_ID, LOADER_SHOW, {
      showLoader: true,
    });

    reportPayload = {
      fdate,
      tdate,
      pro_id,
      task_id,
      emp_id,
      loggedIn_user: state.LoggedInUser,
      sort_by,
    };
    reportBodyParams.append("command", "getReviewEntriesReport");
    reportBodyParams.append("support", support);
    reportBodyParams.append("params", JSON.stringify(reportPayload));
    reportBodyParams.append("type", "getReport");
    reportBodyParams.append("billable_hours_only", billable);
    reportBodyParams.append("nonbillable_hours_only", nonbillable);
    const reportParams = {
      id: REPORT_SUBMENU_ID,
      api: {
        body: reportBodyParams,
      },
    };
    fetchReport(reportParams).then((response) => {
      if (response.apiData && response.apiData.isFetching === false) {
        updateComponentState(LOADER_ID, LOADER_SHOW, {
          showLoader: false,
        });
      }
    });
  } else {
    // updateComponentState(REPORT_SUBMENU_ID, "temp", "");

    const reportPayload = {
      emp_id,
      loggedIn_user: state.LoggedInUser,
    };

    reportBodyParams.append("params", JSON.stringify(reportPayload));
    const reportParams = {
      id: REPORT_SUBMENU_ID,
      api: {
        body: reportBodyParams,
      },
    };
    fetchReport(reportParams).then((response) => {
      if (response.apiData && response.apiData.isFetching === false) {
        updateComponentState(LOADER_ID, LOADER_SHOW, {
          showLoader: false,
        });
      }
    });
  }
}
//////////13 jan 2020 ///////////////////

export function fetchReportFromUtils(props, state) {
  let reportPayload;
  const { fetchReport, updateComponentState } = props;
  updateComponentState(LOADER_ID, LOADER_SHOW, {
    showLoader: true,
  });
  let reportBodyParams = new FormData();
  reportPayload = {
    fdate,
    tdate,
    pro_id,
    task_id,
    emp_id,
    loggedIn_user: state.LoggedInUser,
    sort_by,
  };
  reportBodyParams.append("command", "getReviewEntriesReport");
  reportBodyParams.append("support", support); //change this accrding to php

  reportBodyParams.append("params", JSON.stringify(reportPayload));
  reportBodyParams.append("type", "getReport");
  reportBodyParams.append("billable_hours_only", billable);
  reportBodyParams.append("nonbillable_hours_only", nonbillable);

  const reportParams = {
    id: REPORT_SUBMENU_ID,
    api: {
      body: reportBodyParams,
    },
  };
  fetchReport(reportParams).then((response) => {
    if (response.apiData && response.apiData.isFetching === false) {
      updateComponentState(LOADER_ID, LOADER_SHOW, {
        showLoader: false,
      });
    }
  });
}
