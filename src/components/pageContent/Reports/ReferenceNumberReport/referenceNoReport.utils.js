import colors from "../../../common/colors";
import "../reports.css";
import "../../Dashboard/dashboard.css";
import moment from "moment";
import { dateFormatter } from "../../../utils/calender.utils";
import { getDataFromCookie } from "../../../utils/CheckLoginDetails";
import {
  REPORT_SUBMENU_ID,
  PROJECT_ID,
  REPORT_SUBMIT_BUTTON_TITLE,
  LOADER_ID,
  LOADER_SHOW,
  DEFAULT_OPTION,
} from "../../../../constants/app.constants";
import Colors from "../../../common/colors";

let fdate = dateFormatter(moment().subtract(6, "days"), "yyyy-MM-dd");
let tdate = dateFormatter(moment(), "yyyy-MM-dd");
let pro_id = "";
let selected_pro_id = "";
let pro_name = "All";
let emp_id = "";
let currentProps;
let reference_number = "";
let emp_name = "All";
let counter1 = 0;
let counter2 = 0;
let counter3 = 0;

export function clearDataFromUtils() {
  fdate = dateFormatter(moment().subtract(6, "days"), "yyyy-MM-dd");
  tdate = dateFormatter(moment(), "yyyy-MM-dd");
  pro_id = "";
  selected_pro_id = "";
  pro_name = "All";
  emp_id = "";
  currentProps = "";
  reference_number = "";
  emp_name = "All";
  counter1 = 0;
  counter2 = 0;
  counter3 = 0;
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

export function getComponentPropsRefReport(
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
      if (
        props.projectsDataState &&
        props.projectsDataState.apiData &&
        props.projectsDataState.apiData.length > 0
      ) {
        selected_pro_id = props.projectsDataState.apiData[0].id;
        if (pro_name === "All") {
          pro_name = props.projectsDataState.apiData[0].name;
        }
      }
      let componentProps = {
        id: "pro_id",
        dropDownData: props.projectsDataState,
        className: "report-dropDownList",
        selectedID: selected_pro_id,
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
      selected_pro_id = updatedValue;
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
  } else if (id === "reference_number") {
    reference_number = updatedValue;
  }
}

function submitReport(props, state) {
  let reportPayload;
  const { fetchReport, updateComponentState } = props;
  updateComponentState(LOADER_ID, LOADER_SHOW, {
    showLoader: true,
  });
  let reportBodyParams = new FormData();

  let final_pro_id;
  if (pro_id === "") {
    final_pro_id = selected_pro_id;
  } else {
    final_pro_id = pro_id;
  }

  if (getDataFromCookie() && getDataFromCookie().role === "employee") {
    emp_id = getDataFromCookie().empID; //from redux state
  }

  reportPayload = {
    fdate,
    tdate,
    pro_id: final_pro_id,
    emp_id,
    reference_number,
    loggedIn_user: state.LoggedInUser,
  };
  reportBodyParams.append("command", "getReferenceNoReport");
  reportBodyParams.append("params", JSON.stringify(reportPayload));
  reportBodyParams.append("type", "getReport");

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

export function fetchSubReport(id, data, props, LoggedInUser) {
  const { requestData, updateComponentState } = props;

  updateComponentState(LOADER_ID, LOADER_SHOW, {
    showLoader: true,
  });

  let final_pro_id;
  if (pro_id === "") {
    final_pro_id = selected_pro_id;
  } else {
    final_pro_id = pro_id;
  }

  // console.log("data in utils ref no = ", data);

  let ref_no = data["Main Reference Number"];
  let final_ref_no;
  if (ref_no === "Unknown") {
    final_ref_no = "";
  } else {
    final_ref_no = ref_no;
  }

  let sub_ref_no = data["Sub Reference Number"];

  let final_sub_ref_no;
  if (sub_ref_no === "_") {
    final_sub_ref_no = "";
    final_ref_no = data["Main Reference Number"];
  } else {
    final_sub_ref_no = sub_ref_no;
  }

  const payload = {
    fdate,
    tdate,
    pro_id: final_pro_id,
    emp_id,
    ref_no: final_ref_no,
    sub_ref_no: final_sub_ref_no,
    loggedIn_user: LoggedInUser,
  };

  // console.log("payload in fetchSubReport ", payload);

  let parameters = new FormData();
  parameters.append("params", JSON.stringify(payload));
  parameters.append("type", "getReport");
  parameters.append("command", "getSubReferenceNoReport");

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

export function fetchSubRefNoReport(id, data, props, LoggedInUser) {
  const { requestData, updateComponentState } = props;

  updateComponentState(LOADER_ID, LOADER_SHOW, {
    showLoader: true,
  });

  let final_pro_id;
  if (pro_id === "") {
    final_pro_id = selected_pro_id;
  } else {
    final_pro_id = pro_id;
  }

  // console.log("data in utils ref no = ", data);

  let ref_no = data["Main Reference Number"];
  let final_ref_no;
  if (ref_no === "Unknown") {
    final_ref_no = "";
  } else {
    final_ref_no = ref_no;
  }

  let sub_ref_no = data["Sub Reference Number"];

  let final_sub_ref_no;
  if (sub_ref_no === "_") {
    final_sub_ref_no = "";
    final_ref_no = data["Main Reference Number"];
  } else {
    final_sub_ref_no = sub_ref_no;
  }

  const payload = {
    fdate,
    tdate,
    pro_id: final_pro_id,
    emp_id,
    ref_no: final_ref_no,
    sub_ref_no: final_sub_ref_no,
    loggedIn_user: LoggedInUser,
  };

  // console.log("payload in fetchSubReport ", payload);

  let parameters = new FormData();
  parameters.append("params", JSON.stringify(payload));
  parameters.append("type", "getReport");
  parameters.append("command", "getSubReferenceNoReport");

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
