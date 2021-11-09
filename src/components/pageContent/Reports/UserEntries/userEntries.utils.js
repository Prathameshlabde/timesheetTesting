import colors from "../../../common/colors";
import "../reports.css";
import moment from "moment";
import { dateFormatter } from "../../../utils/calender.utils";
import { getDataFromCookie } from "../../../utils/CheckLoginDetails";
import { getSprintDataForReports } from "../Reports.utils";
import {
  REPORT_SUBMENU_ID,
  PROJECT_ID,
  TASK_ID,
  SORT_BY,
  REPORT_TEMP_BOOL,
  REPORT_SUBMIT_BUTTON_TITLE,
  LOADER_ID,
  LOADER_SHOW,
  SPRINT_ID,
  REPORT_TEMP_BOOL2,
  DEFAULT_OPTION,
} from "../../../../constants/app.constants";
import Colors from "../../../common/colors";

let sort_by = "date";
let sort_by_selected_id = "1";
let fdate = dateFormatter(moment().subtract(6, "days"), "yyyy-MM-dd");
let tdate = dateFormatter(moment(), "yyyy-MM-dd");
let pro_id = "";
let emp_id = "";
let sprint_id = "";
let task_id = "";
let sub_task_id = "";
let currentProps;
let emp_name = "All";
let pro_name = "All";
let sprint_name = "All";
let task_name = "All";
let subtask_name = "All";
let counter1 = 0;
let counter2 = 0;
let counter3 = 0;
let billable = 0;
let nonbillable = 0;
let billableBool_userEntries = false;
let nonbillableBool_userEntries = false;

export function clearDataFromUtils() {
  sort_by = "date";
  sort_by_selected_id = "1";
  fdate = dateFormatter(moment().subtract(6, "days"), "yyyy-MM-dd");
  tdate = dateFormatter(moment(), "yyyy-MM-dd");
  pro_id = "";
  emp_id = "";
  sprint_id = "";
  task_id = "";
  sub_task_id = "";
  currentProps = "";
  emp_name = "All";
  pro_name = "All";
  sprint_name = "All";
  task_name = "All";
  subtask_name = "All";
  counter1 = 0;
  counter2 = 0;
  counter3 = 0;
  billable = 0;
  billableBool_userEntries = false;
  nonbillable = 0;
  nonbillableBool_userEntries = false;
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
    pro_name,
    sprint_name,
    task_name,
    subtask_name,
    billableBool_userEntries,
    nonbillableBool_userEntries,
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

export function getComponentPropsUserEntries(
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
      onClick: (e) => submitReport(props, states), //this.submitReport()
    };
    return componentProps;
  } else if (componentType === "CheckBox") {
    if (componentLabel === "Billable Hours Only") {
      let componentProps = {
        id: "billableChk_user_entries",
        isCheck: billableBool_userEntries,
        onClick: onClickCheckBoxes,
      };
      return componentProps;
    }
    if (componentLabel === "Non-Billable Hours Only") {
      let componentProps = {
        id: "nonbillableChk_user_entries",
        isCheck: nonbillableBool_userEntries,
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
        isEnableFutureDates: false,
        isEnablePastDates: true,
        // isOpen={this.state.isDatePickerOpen}
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
    if (componentLabel === "Project") {
      let componentProps = {
        id: "pro_id",
        dropDownData: props.projectsDataState,
        className: "report-dropDownList",
        defaultOption: "All",
        onChange: onChangeFieldValues,
      };
      return componentProps;
      // }
    } else if (componentLabel === "Employee") {
      let componentProps = {
        id: "emp_id",
        dropDownData: props.employeeDataState,
        className: "report-dropDownList",
        defaultOption: "All",
        onChange: onChangeFieldValues,
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
  } else if (componentType === "Label") {
    let componentProps = {};
    return componentProps;
  } else if (componentType === "SpanLabel") {
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
  }
}

function onClickCheckBoxes(id, updatedValue) {
  // console.log("id in onClickCheckBoxes", id);
  // console.log("updatedValue in onClickCheckBoxes", updatedValue);

  if (id === "billableChk_user_entries") {
    if (updatedValue === true) {
      billable = 1;
      billableBool_userEntries = true;
      nonbillable = 0;
      nonbillableBool_userEntries = false;
    } else {
      billable = 0;
      billableBool_userEntries = false;
    }

    currentProps.updateComponentState(
      REPORT_SUBMENU_ID,
      REPORT_TEMP_BOOL,
      billableBool_userEntries
    );
  } else if (id === "nonbillableChk_user_entries") {
    if (updatedValue === true) {
      nonbillable = 1;
      nonbillableBool_userEntries = true;
      billable = 0;
      billableBool_userEntries = false;
    } else {
      nonbillable = 0;
      nonbillableBool_userEntries = false;
    }

    currentProps.updateComponentState(
      REPORT_SUBMENU_ID,
      REPORT_TEMP_BOOL2,
      nonbillableBool_userEntries
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
      pro_name = "All";
    } else {
      pro_id = updatedValue;
      pro_name = updatedName;
    }
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
    }
    sub_task_id = "";
    subtask_name = "All";
    currentProps.updateComponentState(REPORT_SUBMENU_ID, SPRINT_ID, sprint_id);
  } else if (id === "task_id") {
    if (updatedValue === DEFAULT_OPTION) {
      task_id = "";
    } else {
      task_id = updatedValue;
    }
    sub_task_id = "";
    subtask_name = "All";
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
  const { fetchReport, updateComponentState } = props;
  updateComponentState(LOADER_ID, LOADER_SHOW, {
    showLoader: true,
  });

  let reportBodyParams = new FormData();

  if (getDataFromCookie() && getDataFromCookie().role === "employee") {
    emp_id = getDataFromCookie().empID; //from redux state
  }

  reportPayload = {
    // fdate: dateFormatter(fdate, "yyyy-MM-dd"),
    // tdate: dateFormatter(tdate, "yyyy-MM-dd"),
    fdate,
    tdate,
    pro_id,
    sprint_id,
    task_id,
    sub_task_id,
    emp_id,
    sort_by,
    loggedIn_user: state.LoggedInUser,
  };
  reportBodyParams.append("command", "getUserEntriesReport");

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

export function fetchTasksListFromSPrint(pro_id_new, sprint_id, props) {
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
