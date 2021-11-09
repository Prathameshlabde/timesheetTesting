import colors from "../../../common/colors";
import "../reports.css";
import moment from "moment";
import { getSprintDataForReports } from "../Reports.utils";
import { dateFormatter } from "../../../utils/calender.utils";
import {
  REPORT_SUBMENU_ID,
  PROJECT_ID,
  REPORT_TEMP_BOOL,
  REPORT_TEMP_BOOL2,
  REPORT_SUBMIT_BUTTON_TITLE,
  LOADER_ID,
  LOADER_SHOW,
  REPORT_PROJECT_ID,
  SPRINT_ID,
  DEFAULT_OPTION,
  ERROR_STR,
} from "../../../../constants/app.constants";
import Colors from "../../../common/colors";
import { isEmpty } from "../../../utils/common.utils";

let fdate = dateFormatter(moment(), "yyyy-MM-dd");
let tdate = dateFormatter(moment(), "yyyy-MM-dd");
let pro_id = "";
let pro_name = "All";
let sprint_id = "";
let emp_id = "";
let task_status = "";
let task_status_selected_id = "";
let billable = 0;
let task_worked_on = "0";
let currentProps;
let emp_name = "All";
let counter1 = 0;
let counter2 = 0;
let counter3 = 0;
let counter4 = 0;
let billableBool_taskReport = false;
let taskWorkedOnBool_taskReport = true;

export function clearDataFromUtils() {
  fdate = dateFormatter(moment(), "yyyy-MM-dd");
  tdate = dateFormatter(moment(), "yyyy-MM-dd");
  pro_id = "";
  pro_name = "All";
  sprint_id = "";
  emp_id = "";
  task_status = "";
  task_status_selected_id = "";
  billable = 0;
  task_worked_on = "0";
  currentProps = "";
  emp_name = "All";
  counter1 = 0;
  counter2 = 0;
  counter3 = 0;
  counter4 = 0;
  billableBool_taskReport = false;
  taskWorkedOnBool_taskReport = true;
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
    emp_name: emp_name,
    pro_name: pro_name,
    billable: billableBool_taskReport,
    pro_id,
  };

  return dataObject;
}

export function setCurrentProps(props) {
  if (counter3 === 0) {
    currentProps = props;

    counter3++;
  }
}

export function fetchProjectList(props) {
  if (counter1 === 0) {
    const { fetchProjects } = props;

    const projectParameters = {
      id: REPORT_SUBMENU_ID,
      from: "allActiveInactive",
    };

    fetchProjects(projectParameters);
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
    parameters.append("type", "getData");
    parameters.append("command", "getEmployees");

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

export function getComponentPropsTaskReport(
  componentType,
  componentLabel,
  props,
  states
) {
  if (counter4 === 0) {
    if (
      props.projectsDataState &&
      props.projectsDataState.apiData &&
      props.projectsDataState.apiData[0]
    ) {
      pro_id = props.projectsDataState.apiData[0].id;
    }
  }

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
        id: "billableChk_task_report",
        isCheck: billableBool_taskReport, //false,
        onClick: onClickCheckBoxes,
      };
      return componentProps;
    }
    if (componentLabel === "Tasks Worked On") {
      let componentProps = {
        id: "task_worked_on_task_report",
        isCheck: taskWorkedOnBool_taskReport, //false,
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
    if (componentLabel === "Sprint") {
      let componentProps = {
        id: "sprint_id",
        dropDownData: props.sprintsDataState,
        className: "report-dropDownList",
        defaultOption: "Select Sprint",
        onChange: onChangeFieldValues,
      };
      return componentProps;
    }
    if (componentLabel === "Project") {
      if (
        props.projectsDataState &&
        props.projectsDataState.apiData &&
        !isEmpty(props.projectsDataState.apiData) //aditya 13 july
        // props.projectsDataState.apiData[0].id
      ) {
        if (pro_name === "All") {
          pro_name = props.projectsDataState.apiData[0].name;
        }
      }

      let componentProps = {
        id: "pro_id",
        dropDownData: props.projectsDataState,
        className: "report-dropDownList",
        onChange: onChangeFieldValues,
        defaultOption: "Select Project",
      };
      return componentProps;
    } else if (componentLabel === "Employee") {
      let componentProps = {
        id: "emp_id",
        dropDownData: props.employeeDataState,
        className: "report-dropDownList",
        defaultOption: "All",
        onChange: onChangeFieldValues,
      };
      return componentProps;
    } else if (componentLabel === "Task Status") {
      let componentProps = {
        id: "task_status",
        dropDownData: [
          {
            id: "1",
            name: "Open",
          },
          {
            id: "2",
            name: "Close",
          },
        ],
        className: "report-dropDownList",
        defaultOption: "All",
        selectedID: task_status_selected_id,
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
  }
}

function onClickCheckBoxes(id, updatedValue) {
  // console.log("id in onClickCheckBoxes", id);
  // console.log("updatedValue in onClickCheckBoxes", updatedValue);

  if (id === "billableChk_task_report") {
    if (updatedValue === true) {
      billable = 1;
      billableBool_taskReport = true;
    } else {
      billable = 0;
      billableBool_taskReport = false;
    }
    currentProps.updateComponentState(
      REPORT_SUBMENU_ID,
      REPORT_TEMP_BOOL,
      billableBool_taskReport
    );
  } else if (id === "task_worked_on_task_report") {
    if (updatedValue === true) {
      task_worked_on = "1";
      taskWorkedOnBool_taskReport = true;
    } else {
      task_worked_on = "0";
      taskWorkedOnBool_taskReport = false;
    }
    currentProps.updateComponentState(
      REPORT_SUBMENU_ID,
      REPORT_TEMP_BOOL2,
      taskWorkedOnBool_taskReport
    );
  }
}

function onChangeFieldValues(id, updatedValue, updatedBillable, updatedName) {
  // console.log("id in onChangeFieldValues", id);
  // console.log("updatedValue in onChangeFieldValues", updatedValue);
  // console.log("updatedName in onChangeFieldValues", updatedName);

  if (id === "pro_id") {
    if (updatedValue === DEFAULT_OPTION) {
      pro_id = "";
      pro_name = "Select Project";
    } else {
      pro_id = updatedValue;

      pro_name = updatedName;
    }
    currentProps.updateComponentState(REPORT_SUBMENU_ID, PROJECT_ID, pro_id);
  } else if (id === "sprint_id") {
    if (updatedValue === DEFAULT_OPTION) {
      sprint_id = "";
    } else {
      sprint_id = updatedValue;
    }
    currentProps.updateComponentState(REPORT_SUBMENU_ID, SPRINT_ID, sprint_id);
  } else if (id === "fdate") {
    fdate = dateFormatter(updatedValue, "yyyy-MM-dd");
  } else if (id === "tdate") {
    tdate = dateFormatter(updatedValue, "yyyy-MM-dd");
  } else if (id === "emp_id") {
    if (updatedValue === DEFAULT_OPTION) {
      emp_id = "";
      emp_name = "All";
    } else {
      emp_id = updatedValue;
      emp_name = updatedName;
    }
  } else if (id === "task_status") {
    if (updatedValue === DEFAULT_OPTION) {
      task_status_selected_id = "";
      task_status = "";
    } else if (updatedValue === "1") {
      task_status_selected_id = "1";
      task_status = updatedValue;
    } else if (updatedValue === "2") {
      task_status_selected_id = "2";
      task_status = updatedValue;
    }
  }
}

function submitReport(props, state) {
  let reportPayload;
  const { fetchReport, updateComponentState } = props;
  updateComponentState(LOADER_ID, LOADER_SHOW, {
    showLoader: true,
  });
  let reportBodyParams = new FormData();

  const { reportState } = props;
  const pro_id_updated = reportState.get(PROJECT_ID, ERROR_STR);

  let pro_id_onSubmit = "";

  if (pro_id_updated !== ERROR_STR) {
    pro_id_onSubmit = pro_id_updated;
  } else {
    pro_id_onSubmit = pro_id;
  }

  const sprint_id_updated = reportState.get(SPRINT_ID, ERROR_STR);
  let sprint_id_onSubmit = "";
  if (sprint_id_updated !== ERROR_STR) {
    sprint_id_onSubmit = sprint_id_updated;
  } else {
    sprint_id_onSubmit = sprint_id;
  }

  getProjectData(pro_id_onSubmit, props);

  // let projectData = [];
  // projectData = getProjectData(pro_id_onSubmit, props);

  // console.log("projectData", projectData);

  reportPayload = {
    fdate,
    tdate,
    pro_id: pro_id_onSubmit,
    sprint_id: sprint_id_onSubmit,
    emp_id,
    task_status,
    task_worked_on,
    loggedIn_user: state.LoggedInUser,
  };
  reportBodyParams.append("command", "getTaskReport");

  reportBodyParams.append("params", JSON.stringify(reportPayload));
  reportBodyParams.append("type", "getReport");
  reportBodyParams.append("billable_hours_only", billable);

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

function getProjectData(pro_id, props) {
  // console.log("pro_id", props);
  const { requestData } = props;
  let BodyParams = new FormData();
  const Payload = {
    pro_id: pro_id,
  };

  BodyParams.append("params", JSON.stringify(Payload));
  BodyParams.append("type", "getData");
  BodyParams.append("command", "getSingleProjectData");
  const Params = {
    id: REPORT_PROJECT_ID,
    api: {
      body: BodyParams,
    },
  };

  requestData(Params);
}

export function fetchSubTaskReport(id, data, props, LoggedInUser, reportState) {
  const { requestData, updateComponentState } = props;

  updateComponentState(LOADER_ID, LOADER_SHOW, {
    showLoader: true,
  });

  const pro_id_updated = reportState.get(PROJECT_ID, ERROR_STR);
  const sprint_id = reportState.get(SPRINT_ID, ERROR_STR);

  // console.log("data in task report utils ref no = ", data);
  let task_id = data["task_id"];
  let task_name = data["task_name"];

  let final_task_id;
  if (task_name === "Unknown Tasks") {
    final_task_id = "";
  } else {
    final_task_id = task_id;
  }

  const payload = {
    fdate,
    tdate,
    pro_id: pro_id_updated,
    emp_id,
    task_id: final_task_id,
    loggedIn_user: LoggedInUser,
    sprint_id,
  };

  let parameters = new FormData();
  parameters.append("params", JSON.stringify(payload));
  parameters.append("type", "getReport");
  parameters.append("command", "getTaskSubReport");

  const employeeParams = {
    id,
    api: {
      body: parameters,
    },
  };

  requestData(employeeParams).then((response) => {
    if (response.apiData && response.apiData.isFetching === false) {
      updateComponentState(LOADER_ID, LOADER_SHOW, {
        showLoader: false,
      });
    }
  });
}

export function fetchSprintsAndTasksList(pro_id_new, props) {
  // console.log("in fetchSprintsAndTasksList pro_id_new =", pro_id_new);

  getSprintDataForReports(pro_id_new, props);
}
