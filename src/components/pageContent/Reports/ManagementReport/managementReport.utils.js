import colors from "../../../common/colors";
import "../reports.css";
import "../../Dashboard/dashboard.css";
import moment from "moment";
import { dateFormatter } from "../../../utils/calender.utils";
import {
  REPORT_SUBMENU_ID,
  PROJECT_ID,
  SORT_BY,
  CATEGORY,
  REPORT_TEMP_BOOL,
  REPORT_SUBMIT_BUTTON_TITLE,
  LOADER_ID,
  LOADER_SHOW,
  DEFAULT_OPTION,
  REPORT_OBJECT,
  EMP_ID,
  DASHBOARD_NAVIGATE_ID,
} from "../../../../constants/app.constants";
import { isEmpty } from "../../../utils/common.utils";
import Colors from "../../../common/colors";

let sort_by = "project";
let sort_by_selected_id = "1";
let fdate = dateFormatter(moment().startOf("month"), "yyyy-MM-dd");
let tdate = dateFormatter(moment(), "yyyy-MM-dd");
let pro_id = "";
let emp_id = "";
let support = 0;
let category = 1;
let currentProps;
let pro_name = "All";
let emp_name = "All";
let counter1 = 0;
let counter2 = 0;
let counter3 = 0;
let categoryBool_managementReport = true;
let supportBool_managementReport = false;

export function clearDataFromUtils() {
  sort_by = "project";
  sort_by_selected_id = "1";
  fdate = dateFormatter(moment().startOf("month"), "yyyy-MM-dd");
  tdate = dateFormatter(moment(), "yyyy-MM-dd");
  pro_id = "";
  emp_id = "";
  support = 0;
  category = 1;
  currentProps = "";
  emp_name = "All";
  pro_name = "All";
  counter1 = 0;
  counter2 = 0;
  counter3 = 0;
  categoryBool_managementReport = true;
  supportBool_managementReport = false;
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
  };

  return dataObject;
}

export function setCurrentProps(props, states) {
  sort_by = "project";
  sort_by_selected_id = "1";
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
    props.updateComponentState(REPORT_SUBMENU_ID, CATEGORY, "1");
    counter3++;
  }
}

export function fetchProjectList(props) {
  if (counter1 === 0) {
    const { fetchProjectsDashboard } = props;
    const projectParameters = {
      id: REPORT_SUBMENU_ID,
      from: "noSupport",
    };

    fetchProjectsDashboard(projectParameters);
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

export function getComponentPropsManReport(
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
    if (componentLabel === "Category") {
      let componentProps = {
        id: "category_management_report",
        isCheck: categoryBool_managementReport,
        onClick: onClickCheckBoxes,
      };
      return componentProps;
    }
    if (componentLabel === "Support") {
      let componentProps = {
        id: "support_management_report",
        isCheck: supportBool_managementReport,
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
            name: "Project",
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

  if (id === "support_management_report") {
    if (updatedValue === true) {
      support = 1;
      supportBool_managementReport = true;

      const { fetchProjectsDashboard } = currentProps;
      const projectParameters = {
        id: REPORT_SUBMENU_ID,
        from: "allActiveInactive",
      };
      fetchProjectsDashboard(projectParameters);
    } else {
      support = 0;
      supportBool_managementReport = false;

      const { fetchProjectsDashboard } = currentProps;
      const projectParameters = {
        id: REPORT_SUBMENU_ID,
        from: "noSupport",
      };
      fetchProjectsDashboard(projectParameters);
    }

    currentProps.updateComponentState(
      REPORT_SUBMENU_ID,
      REPORT_TEMP_BOOL,
      supportBool_managementReport
    );
  } else if (id === "category_management_report") {
    let categoryStringValue;

    if (updatedValue === true) {
      category = 1;
      categoryStringValue = "1";
      categoryBool_managementReport = true;
    } else {
      category = 0;
      categoryStringValue = "0";
      categoryBool_managementReport = false;
    }
    // console.log("category before updating", category);
    currentProps.updateComponentState(
      REPORT_SUBMENU_ID,
      CATEGORY,
      categoryStringValue
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
    currentProps.updateComponentState(REPORT_SUBMENU_ID, PROJECT_ID, pro_id);
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
      sort_by = "project";
      sort_by_selected_id = "1";
    } else if (updatedValue === "2") {
      sort_by = "employee";
      sort_by_selected_id = "2";
    }

    currentProps.updateComponentState(REPORT_SUBMENU_ID, SORT_BY, sort_by);
  }
}

function submitReport(props, state) {
  let reportPayload;
  console.log("reportPayload", reportPayload);
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
    emp_id,
    support,
    sort_by,
    category,
    loggedIn_user: state.LoggedInUser,
  };
  reportBodyParams.append("command", "getManagementReport");
  reportBodyParams.append("params", JSON.stringify(reportPayload));
  reportBodyParams.append("type", "getReport");

  const reportParams = {
    id: REPORT_SUBMENU_ID,
    api: {
      body: reportBodyParams,
    },
  };
  fetchReport(reportParams).then((response) => {
    console.log("response", response);
    if (response.apiData && response.apiData.isFetching === false) {
      updateComponentState(LOADER_ID, LOADER_SHOW, {
        showLoader: false,
      });
    }
  });
}
