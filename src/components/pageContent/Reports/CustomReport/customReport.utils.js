import colors from "../../../common/colors";
import "../reports.css";
import { getSprintDataForReports } from "../Reports.utils";
import moment from "moment";
import { dateFormatter } from "../../../utils/calender.utils";
import {
  REPORT_SUBMENU_ID,
  PROJECT_ID,
  TASK_ID,
  SORT_BY,
  REPORT_TEMP_BOOL,
  REPORT_TEMP_BOOL2,
  REPORT_SUBMIT_BUTTON_TITLE,
  LOADER_ID,
  LOADER_SHOW,
  SPRINT_ID,
  DEFAULT_OPTION,
  EMP_ID,
  REPORT_OBJECT,
  DASHBOARD_NAVIGATE_ID,
} from "../../../../constants/app.constants";
import { isEmpty } from "../../../utils/common.utils";
import Colors from "../../../common/colors";

let sort_by = "date";
let sort_by_selected_id = "1";
let fdate = dateFormatter(moment().subtract(6, "days"), "yyyy-MM-dd");
let tdate = dateFormatter(moment(), "yyyy-MM-dd");
let dateDifference = 6;
let hrsOfdateDifference = 48;
let pro_id = "";
let emp_id = "";
let sprint_id = "";
let task_id = "";
let sub_task_id = "";
let billable = 0;
let nonbillable = 0;
let currentProps;
let emp_name = "All";
let counter1 = 0;
let counter2 = 0;
let counter3 = 0;
let billableBool_customReport = false;
let nonbillableBool_customReport = false;
let pro_name = "All";
let sprint_name = "All";
let task_name = "All";
let subtask_name = "All";

export function clearDataFromUtils() {
  sort_by = "date";
  sort_by_selected_id = "1";
  fdate = dateFormatter(moment().subtract(6, "days"), "yyyy-MM-dd");
  tdate = dateFormatter(moment(), "yyyy-MM-dd");
  dateDifference = 6;
  hrsOfdateDifference = 48;
  pro_id = "";
  emp_id = "";
  sprint_id = "";
  task_id = "";
  sub_task_id = "";
  billable = 0;
  nonbillable = 0;
  currentProps = "";
  emp_name = "All";
  counter1 = 0;
  counter2 = 0;
  counter3 = 0;
  billableBool_customReport = false;
  nonbillableBool_customReport = false;
  pro_name = "All";
  sprint_name = "All";
  task_name = "All";
  subtask_name = "All";
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
    emp_name,
    dateDifference,
    hrsOfdateDifference,
    pro_name,
    sprint_name,
    task_name,
    subtask_name,
    billableBool_customReport,
    nonbillableBool_customReport,
  };

  return dataObject;
}

export function setCurrentProps(props, states) {
  if (counter3 === 0) {
    currentProps = props;
    const { pmDashboardState } = props;
    const dataObject = pmDashboardState.get(REPORT_OBJECT, {});
    if (!isEmpty(dataObject)) {
      // console.log("dataObject from pm dashboard = ", dataObject);
      // console.log("dataObject in setDashboardValues =", dataObject);
      if (dataObject.fdate) fdate = dataObject.fdate;
      if (dataObject.tdate) tdate = dataObject.tdate;
      if (dataObject.dataTitle === "emp_id") {
        emp_id = dataObject.id ? dataObject.id : "";
        emp_name = dataObject.name ? dataObject.name : "All";
        currentProps.updateComponentState(REPORT_SUBMENU_ID, EMP_ID, emp_id);
      }
      if (dataObject.dataTitle === "pro_id") {
        pro_id = dataObject.id ? dataObject.id : "";
        pro_name = dataObject.name ? dataObject.name : "All";
        // console.log("pro_name set = ", pro_name);
        currentProps.updateComponentState(
          REPORT_SUBMENU_ID,
          PROJECT_ID,
          pro_id
        );
      }
      submitReport(props, states);
    }
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

export function fetchSprintsAndTasksList(pro_id_new, props) {
  // console.log("in fetchSprintsAndTasksList pro_id_new =", pro_id_new);
  getSprintDataForReports(pro_id_new, props);

  let tasksBodyParams = new FormData();
  const tasksPayload = {
    projectId: pro_id_new,
  };

  tasksBodyParams.append("params", JSON.stringify(tasksPayload));
  tasksBodyParams.append("type", "getData");
  tasksBodyParams.append("command", "getProjectTask");
  const tasksParams = {
    id: REPORT_SUBMENU_ID,
    api: {
      body: tasksBodyParams,
    },
  };

  const { fetchTasks } = props;
  fetchTasks(tasksParams);
}

export function fetchSubTasksList(task_id_new, props) {
  let subTasksBodyParams = new FormData();
  const tasksPayload = {
    parent_task_id: task_id_new,
  };

  subTasksBodyParams.append("params", JSON.stringify(tasksPayload));
  subTasksBodyParams.append("type", "getData");
  subTasksBodyParams.append("command", "getSubTask");
  const subTasksParams = {
    id: REPORT_SUBMENU_ID,
    api: {
      body: subTasksBodyParams,
    },
  };

  const { fetchSubTasks } = props;
  fetchSubTasks(subTasksParams);
}

export function getComponentPropsCustomReport(
  componentType,
  componentLabel,
  props,
  states
) {
  // if (props.projectsDataState && props.projectsDataState.apiData[0]) {
  //   pro_id = props.projectsDataState.apiData[0].id;
  // }

  // console.log("pro id in get compo = ", pro_id);

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
        id: "billableChk_custom_report",
        isCheck: billableBool_customReport, //false,
        onClick: onClickCheckBoxes,
      };
      return componentProps;
    }
    if (componentLabel === "Non-Billable Hours Only") {
      let componentProps = {
        id: "nonbillableChk_custom_report",
        isCheck: nonbillableBool_customReport, //false,
        onClick: onClickCheckBoxes,
      };
      return componentProps;
    }
  } else if (componentType === "DatePicker") {
    if (componentLabel === "From Date") {
      let componentProps = {
        id: "fdate",
        value: fdate,
        className: "date-picker",
        onChange: onChangeFieldValues,
        isEnablePastDates: true,
      };
      return componentProps;
    } else if (componentLabel === "To Date") {
      let componentProps = {
        id: "tdate",
        value: tdate,
        className: "date-picker",
        onChange: onChangeFieldValues,
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
        selectedID: pro_id,
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
    } else if (componentLabel === "Sprint") {
      let componentProps = {
        id: "sprint_id",
        dropDownData: props.sprintsDataState,
        className: "report-dropDownList",
        defaultOption: "All",
        onChange: onChangeFieldValues,
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
    } else if (componentLabel === "Sub Task") {
      let componentProps = {
        id: "sub_task_id",
        dropDownData: props.subTasksDataState,
        className: "report-dropDownList",
        defaultOption: "All",
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
  } else if (componentType === "TextField") {
    if (componentLabel === "Main Reference Number") {
      let componentProps = {
        id: "reference_number",
        style: textFieldStyle.textfieldLarge,
        onChange: onChangeFieldValues,
      };
      return componentProps;
    }
  } else if (componentType === "TimePicker") {
    let componentProps = {};
    return componentProps;
  }
}

function onClickCheckBoxes(id, updatedValue) {
  // console.log("id in onClickCheckBoxes", id);
  // console.log("updatedValue in onClickCheckBoxes", updatedValue);

  if (id === "billableChk_custom_report") {
    if (updatedValue === true) {
      if (nonbillable === 0) {
        billable = 1;
        billableBool_customReport = true;
      } else {
        billable = 1;
        billableBool_customReport = true;
        nonbillable = 0;
        nonbillableBool_customReport = false;
      }
    } else {
      if (nonbillable === 0) {
        billable = 0;
        billableBool_customReport = false;
      } else {
        billable = 0;
        billableBool_customReport = false;
        nonbillable = 1;
        nonbillableBool_customReport = true;
      }
    }
    currentProps.updateComponentState(
      REPORT_SUBMENU_ID,
      REPORT_TEMP_BOOL,
      billableBool_customReport
    );

    currentProps.updateComponentState(
      REPORT_SUBMENU_ID,
      REPORT_TEMP_BOOL2,
      nonbillableBool_customReport
    );
  } else if (id === "nonbillableChk_custom_report") {
    if (updatedValue === true) {
      if (billable === 0) {
        nonbillable = 1;
        nonbillableBool_customReport = true;
      } else {
        nonbillable = 1;
        nonbillableBool_customReport = true;
        billable = 0;
        billableBool_customReport = false;
      }
    } else {
      if (billable === 0) {
        nonbillable = 0;
        nonbillableBool_customReport = false;
      } else {
        billable = 1;
        billableBool_customReport = true;
        nonbillable = 0;
        nonbillableBool_customReport = false;
      }
    }
    currentProps.updateComponentState(
      REPORT_SUBMENU_ID,
      REPORT_TEMP_BOOL2,
      nonbillableBool_customReport
    );

    currentProps.updateComponentState(
      REPORT_SUBMENU_ID,
      REPORT_TEMP_BOOL,
      billableBool_customReport
    );
  }
}

export function getDateDifference(fdate, tdate) {
  let now = moment(tdate); //todays date
  let end = moment(fdate); // another date
  let duration = moment.duration(now.diff(end));
  let diff = duration.asDays();
  // console.log(typeof diff);
  // console.log("difference = ", diff);
  dateDifference = diff;
  hrsOfdateDifference = diff * 8;
}

function onChangeFieldValues(id, updatedValue, updatedBillable, updatedName) {
  // console.log("id in onChangeFieldValues", id);
  // console.log("updatedValue in onChangeFieldValues", updatedValue);
  // console.log("updatedName in onChangeFieldValues", updatedName);
  if (id === "pro_id") {
    if (updatedValue === DEFAULT_OPTION) {
      pro_id = "";
      pro_name = "All";
    } else {
      pro_id = updatedValue;
      pro_name = updatedName;
    }
    // currentProps.sprintsDataState.apiData = [];
    // currentProps.tasksDataState.apiData = [];
    // currentProps.subTasksDataState.apiData = [];

    sprint_id = "";
    task_id = "";
    sub_task_id = "";
    sprint_name = "All";
    task_name = "All";
    subtask_name = "All";
    currentProps.updateComponentState(REPORT_SUBMENU_ID, PROJECT_ID, pro_id);
  } else if (id === "sprint_id") {
    if (updatedValue === DEFAULT_OPTION) {
      sprint_id = "";
      sprint_name = "All";
    } else {
      sprint_id = updatedValue;
      sprint_name = updatedName;
    }
    sub_task_id = "";
    subtask_name = "All";
    currentProps.updateComponentState(REPORT_SUBMENU_ID, SPRINT_ID, sprint_id);
    // currentProps.subTasksDataState = [];
  } else if (id === "task_id") {
    if (updatedValue === DEFAULT_OPTION) {
      task_id = "";
      task_name = "All";
    } else {
      task_id = updatedValue;
      task_name = updatedName;
    }
    sub_task_id = "";
    subtask_name = "All";
    // currentProps.subTasksDataState = [];
    currentProps.updateComponentState(REPORT_SUBMENU_ID, TASK_ID, task_id);
  } else if (id === "sub_task_id") {
    if (updatedValue === DEFAULT_OPTION) {
      sub_task_id = "";
      subtask_name = "All";
    } else {
      sub_task_id = updatedValue;
      subtask_name = updatedName;
    }
  } else if (id === "fdate") {
    fdate = dateFormatter(updatedValue, "yyyy-MM-dd");
    getDateDifference(fdate, tdate);
  } else if (id === "tdate") {
    tdate = dateFormatter(updatedValue, "yyyy-MM-dd");
    getDateDifference(fdate, tdate);
  } else if (id === "emp_id") {
    if (updatedValue === DEFAULT_OPTION) {
      emp_id = "";
      emp_name = "All";
    } else {
      emp_id = updatedValue;
      emp_name = updatedName;
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
  let reportPayload;
  const { fetchReport, updateComponentState, deleteComponentState } = props;
  deleteComponentState(DASHBOARD_NAVIGATE_ID);
  updateComponentState(LOADER_ID, LOADER_SHOW, {
    showLoader: true,
  });

  let reportBodyParams = new FormData();
  reportPayload = {
    fdate,
    tdate,
    pro_id,
    sort_by,
    emp_id,
    loggedIn_user: state.LoggedInUser,
    sprint_id,
    task_id,
    sub_task_id,
  };
  reportBodyParams.append("command", "getUserCustomReport");

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

export function fetchTasksListFromSprint(pro_id_new, sprint_id, props) {
  // console.log("in fetchSprintsAndTasksList pro_id_new =", pro_id_new);

  let tasksBodyParams = new FormData();
  const tasksPayload = {
    projectId: pro_id_new,
    sprint_id: sprint_id,
  };

  tasksBodyParams.append("params", JSON.stringify(tasksPayload));
  tasksBodyParams.append("type", "getData");
  tasksBodyParams.append("command", "getProjectTask");
  const tasksParams = {
    id: REPORT_SUBMENU_ID,
    api: {
      body: tasksBodyParams,
    },
  };

  const { fetchTasks } = props;
  fetchTasks(tasksParams);
}
