import report_userEntries from "../../json/reports/user entries/report_userEntries.json";
import report_customReports from "../../json/reports/custom report/report_customReports.json";
import report_reviewEntries from "../../json/reports/review entries/report_reviewEntries.json";
import report_referenceNo from "../../json/reports/referenceno report/report_referenceNo.json";
import report_taskReport from "../../json/reports/task report/report_taskReport.json";
import report_managementReport from "../../json/reports/management report/report_managementReport.json";
import report_summaryReport from "../../json/reports/summary report/report_summaryReport.json";
import report_defaulterList from "../../json/reports/defaulter list/report_defaulterList.json";
import { firstLetterSmall, isEmpty } from "../../utils/common.utils";
import {
  REPORT_SUBMENU_ID,
  REPORT_SUBMENU_ID2,
  REPORT_TEMP_ENTRY_ID,
  REPORT_BUSINESS_DURATION_ID,
  EXPAND_LESS_ICON_NAME,
  ICON_TITLE_COLLAPSE,
  ENTER_SEARCH_CRITERIA,
  FOR_HIDE1,
  EXPAND_MORE_ICON_NAME,
  ICON_TITLE_EXPAND,
  SHOW_SEARCH_CRITERIA,
  FOR_HIDE2
} from "../../../constants/app.constants";
import { getDataFromCookie } from "../../utils/CheckLoginDetails.js";
const spanLabel = {
  id: "lbl",
  maxFont: 14,
  minFont: 5.5,
  className: "span-label"
};

export function getPropsspanLabel() {
  return spanLabel;
}

const submitButton = {
  id: "btn",
  data: "Submit",
  className: "button-submitEntry"
};

export function getPropsButtonSubmit() {
  return submitButton;
}

export function getAllPropsForComponent() {
  const spanLabel = getPropsspanLabel();
  const submitButton = getPropsButtonSubmit();
  return {
    spanLabel,
    submitButton
  };
}

export function setRespectiveJsonFileForReport(reportName) {
  let jsonFile;
  if (reportName === "UserEntries") {
    jsonFile = report_userEntries;
  } else if (reportName === "CustomReport") {
    jsonFile = report_customReports;
  } else if (reportName === "ReviewEntries") {
    jsonFile = report_reviewEntries;
  } else if (reportName === "ReferenceNumberReport") {
    jsonFile = report_referenceNo;
  } else if (reportName === "TaskReport") {
    jsonFile = report_taskReport;
  } else if (reportName === "ManagementReport") {
    jsonFile = report_managementReport;
  } else if (reportName === "SummaryReport") {
    jsonFile = report_summaryReport;
  } else if (reportName === "DefaulterList") {
    jsonFile = report_defaulterList;
  }

  return jsonFile;
}

export function createEmployeesProjectsForBoxes(
  team_names,
  TeamData,
  empOrProj
) {
  let finalArray = [];
  for (let i = 0; i < TeamData.length; i++) {
    for (let j = 0; j < team_names.length; j++) {
      if (team_names[j] === TeamData[i].id) {
        let teamObj;
        if (empOrProj === "emp") {
          teamObj = {
            team_name: TeamData[i].name,
            team_id: TeamData[i].indexValue,
            selectedArr: firstLetterSmall(TeamData[i].name) + "emp",
            allActiveId: firstLetterSmall(TeamData[i].name) + "emp_id"
          };
        } else {
          teamObj = {
            team_name: TeamData[i].name,
            team_id: TeamData[i].indexValue,
            selectedArr: firstLetterSmall(TeamData[i].name) + "pro",
            allActiveId: firstLetterSmall(TeamData[i].name) + "pro_id"
          };
        }

        finalArray.push(teamObj);
      }
    }
  }
  return finalArray;
}
export function getDateDifferencesFromUtils(fdate, tdate) {
  //////////13 jan 2020///////////
  const one_day = 1000 * 60 * 60 * 24;
  const x = fdate.split("-");
  const y = tdate.split("-");

  const date1 = new Date(x[0], x[1] - 1, x[2]);
  const date2 = new Date(y[0], y[1] - 1, y[2]);

  const DifferenceOfDate = Math.ceil(
    (date2.getTime() - date1.getTime()) / one_day
  );
  return DifferenceOfDate;
}

export function fetchTeams(props, id) {
  const { requestData } = props;
  let BodyParams = new FormData();
  const Payload = {};
  BodyParams.append("params", JSON.stringify(Payload));
  BodyParams.append("type", "getData");
  BodyParams.append("command", "getTeamDropdown");
  const Params = {
    id: id,
    api: {
      body: BodyParams
    }
  };

  requestData(Params);
}

export function fetchAllEmployeesAndProjects(props) {
  const { requestData } = props;
  let BodyParams = new FormData();
  const Payload = {};
  BodyParams.append("params", JSON.stringify(Payload));
  BodyParams.append("type", "getData");
  BodyParams.append("command", "getAllProjectsAndEmployees");
  const Params = {
    id: REPORT_SUBMENU_ID2,
    api: {
      body: BodyParams
    }
  };

  requestData(Params);
}

export function deleteReportEntry(props) {
  const { deleteData } = props;
  var deleteDataParamters = new FormData();
  let emp_id = getDataFromCookie().empID;
  const payload = {
    emp_id: emp_id
  };

  deleteDataParamters.append("params", JSON.stringify(payload));
  deleteDataParamters.append("type", "removeData");
  deleteDataParamters.append("command", "deleteTempReportEntry");
  const deleteEntryParams = {
    id: REPORT_TEMP_ENTRY_ID,
    api: {
      body: deleteDataParamters
    }
  };
  // return deleteData(deleteEntryParams).then(response => {
  //   if (response.apiData && response.apiData.apiData === true) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // });
  deleteData(deleteEntryParams);
}

export function addReportEntry(props, querystring) {
  const { requestData } = props;
  var addDataParamters = new FormData();
  let emp_id = getDataFromCookie().empID;
  const payload = {
    emp_id: emp_id,
    querystring: querystring
  };

  addDataParamters.append("params", JSON.stringify(payload));
  addDataParamters.append("type", "addData");
  addDataParamters.append("command", "addTempReportEntry");
  const addEntryParams = {
    id: REPORT_TEMP_ENTRY_ID,
    api: {
      body: addDataParamters
    }
  };

  return requestData(addEntryParams).then(response => {
    if (response.apiData && response.apiData.apiData !== false) {
      // console.log(
      //   "response.apiData.apiData in add temp rep = ",
      //   response.apiData.apiData
      // );
      let latestRowId = response.apiData.apiData;
      return latestRowId;
    } else {
      return false;
    }
  });

  // requestData(addEntryParams);
}

//team report, custom report new, monthly rolling report
export function validateRequiredStates(
  projectsRequiredStates = [],
  employeesRequiredStates = []
) {
  let isEmployeeSelected = false;
  let isProjectSelected = false;
  if (projectsRequiredStates && projectsRequiredStates.length > 0) {
    for (let i = 0; i < projectsRequiredStates.length; i++) {
      for (let key in projectsRequiredStates[i]) {
        let isEmpty1 = isEmpty(projectsRequiredStates[i][key]);
        if (isEmpty1 === false) {
          isProjectSelected = true;
          break;
        }
      }
    }
  }

  if (employeesRequiredStates && employeesRequiredStates.length > 0) {
    for (let i = 0; i < employeesRequiredStates.length; i++) {
      for (let key in employeesRequiredStates[i]) {
        let isEmpty1 = isEmpty(employeesRequiredStates[i][key]);
        if (isEmpty1 === false) {
          isEmployeeSelected = true;
          break;
        }
      }
    }
  }

  let obj = {
    isEmployeeSelected: isEmployeeSelected,
    isProjectSelected: isProjectSelected
  };

  return obj;
}

export function removeAllSelectedEmpAndProjects(
  updatedValue2,
  localProStates,
  localEmpStates
) {
  let blankArr = [];
  let proArrName = firstLetterSmall(updatedValue2.name) + "pro";
  let proArrNameTemp = proArrName + "temp";
  let empArrName = firstLetterSmall(updatedValue2.name) + "emp";
  let empArrNameTemp = empArrName + "temp";

  if (localProStates) {
    for (let i = 0; i < localProStates.length; i++) {
      for (let key in localProStates[i]) {
        if (key === proArrName) {
          let indexToDelete = i;
          localProStates[indexToDelete][proArrName] = blankArr;
          localProStates[indexToDelete][proArrNameTemp] = blankArr;
          localEmpStates[indexToDelete][empArrName] = blankArr;
          localEmpStates[indexToDelete][empArrNameTemp] = blankArr;
        }
      }
    }
  } else {
    localProStates = [];
  }

  return {
    localProStates: localProStates,
    localEmpStates: localEmpStates
  };
}

export function fetchBusinessDuration(reportPayload, props) {
  let reportBodyParams = new FormData();
  const { requestData } = props;
  reportBodyParams.append("command", "getBusinessDuration");
  reportBodyParams.append("params", JSON.stringify(reportPayload));
  reportBodyParams.append("type", "getData");

  const reportParams = {
    id: REPORT_BUSINESS_DURATION_ID,
    api: {
      body: reportBodyParams
    }
  };

  return requestData(reportParams).then(response => {
    if (response.apiData && response.apiData.apiData !== false) {
      // console.log(
      //   "response.apiData.apiData in fetchBusinessDuration = ",
      //   response.apiData.apiData
      // );

      return response.apiData.apiData;
    } else {
      return false;
    }
  });
}

export function getBusinessDays(hours) {
  if (hours && hours !== 0) {
    return hours / 8;
  } else {
    return 0;
  }
}

export function getSprintDataForReports(pro_id_new, props) {
  let projectBodyParams = new FormData();
  const projectsPayload = {
    status: "all",
    projectId: pro_id_new
  };

  projectBodyParams.append("params", JSON.stringify(projectsPayload));
  projectBodyParams.append("type", "getData");
  projectBodyParams.append("command", "getProjectSprint");
  const sprintParams = {
    id: REPORT_SUBMENU_ID,
    api: {
      body: projectBodyParams
    }
  };

  const { fetchSprints } = props;
  fetchSprints(sprintParams);
}

export function getDownArrowObj() {
  return {
    name: EXPAND_LESS_ICON_NAME,
    title: ICON_TITLE_COLLAPSE,
    message: ENTER_SEARCH_CRITERIA,
    div: FOR_HIDE1
  };
}

export function getUpArrowObj() {
  return {
    name: EXPAND_MORE_ICON_NAME,
    title: ICON_TITLE_EXPAND,
    message: SHOW_SEARCH_CRITERIA,
    div: FOR_HIDE2
  };
}
