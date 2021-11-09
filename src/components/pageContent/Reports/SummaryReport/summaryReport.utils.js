import colors from "../../../common/colors";
import "../reports.css";
import "../../Dashboard/dashboard.css";
import moment from "moment";

import {
  REPORT_SUBMENU_ID,
  SUMMARY_BY,
  CATEGORY,
  REPORT_TEMP_BOOL,
  REPORT_SUBMIT_BUTTON_TITLE,
  LOADER_ID,
  LOADER_SHOW,
  DATE_FORMAT,
  REPORT_IS_DATE_RANGE_BOOL,
  // PROJECT_ID,
  EMP_ID,
  REPORT_OBJECT,
  DASHBOARD_NAVIGATE_ID,
} from "../../../../constants/app.constants";
import { isEmpty, stringDateToMoment } from "../../../utils/common.utils";
import { summaryReportStyle } from "./SummaryReportStyle.utils.js";
import { dateFormatter } from "../../../utils/calender.utils";
import Colors from "../../../common/colors";

let fdate = moment().format(DATE_FORMAT);
let tdate = moment().format(DATE_FORMAT);

let newfdate = dateFormatter(moment(), "yyyy-MM-dd");
let newtdate = dateFormatter(moment(), "yyyy-MM-dd");

let emp_id = "";
let support = 0;
let category = 1;
let currentProps;
let counter3 = 0;
let summary = "project";
let summary_selected_id = "1";
let categoryBool_summaryReport = true;
let supportBool_summaryReport = false;
let isDateRangeBool_summaryReport = false;
let allMonthsData = [];
let totalDuration = 0;
let totalBillable = 0;
let tooolTipDates = [];
let apiDataLength = 0;

export function clearDataFromUtils() {
  fdate = moment().format(DATE_FORMAT);
  tdate = moment().format(DATE_FORMAT);

  newfdate = dateFormatter(moment(), "yyyy-MM-dd");
  newtdate = dateFormatter(moment(), "yyyy-MM-dd");

  emp_id = "";
  support = 0;
  category = 1;
  currentProps = "";
  counter3 = 0;
  summary = "project";
  summary_selected_id = "1";
  categoryBool_summaryReport = true;
  supportBool_summaryReport = false;
  isDateRangeBool_summaryReport = false;
  allMonthsData = [];
  totalDuration = 0;
  totalBillable = 0;
  tooolTipDates = [];
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
    fromDate: isDateRangeBool_summaryReport ? newfdate : fdate,
    toDate: isDateRangeBool_summaryReport ? newtdate : tdate,
    isDateRangeBool_summaryReport,
  };

  return dataObject;
}

export function setCurrentProps(props, states) {
  category = 1;
  if (counter3 === 0) {
    currentProps = props;
    const { pmDashboardState } = props;
    const dataObject = pmDashboardState.get(REPORT_OBJECT, {});
    if (!isEmpty(dataObject)) {
      // console.log("dataObject from pm dashboard = ", dataObject);
      // console.log("dataObject in setDashboardValues =", dataObject);
      if (dataObject.fdate) {
        // fdate = dataObject.fdate;
        fdate = moment(dataObject.fdate).format(DATE_FORMAT);
        newfdate = dataObject.fdate;
      }

      if (dataObject.tdate) {
        tdate = moment(dataObject.tdate).format(DATE_FORMAT);
        newtdate = dataObject.tdate;
      }

      if (dataObject.dataTitle === "emp_id") {
        emp_id = dataObject.id ? dataObject.id : "";
        currentProps.updateComponentState(REPORT_SUBMENU_ID, EMP_ID, emp_id);
      }

      isDateRangeBool_summaryReport = true;
      submitReport(props, states);
    }

    props.updateComponentState(REPORT_SUBMENU_ID, CATEGORY, "1");
    counter3++;
  }
}

export function getComponentPropsSummaryReport(
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
    if (componentLabel === "Is custom Date Range?") {
      let componentProps = {
        id: "isDateRange_summaryReport",
        isCheck: isDateRangeBool_summaryReport, // true,
        className: "task-check",
        onClick: onClickCheckBoxes,
      };
      return componentProps;
    }

    if (componentLabel === "Category") {
      let componentProps = {
        id: "category_summary_reports",
        isCheck: categoryBool_summaryReport, // true,
        className: "task-check",
        onClick: onClickCheckBoxes,
      };
      return componentProps;
    }

    if (componentLabel === "Support") {
      let componentProps = {
        id: "support_summary_reports",
        isCheck: supportBool_summaryReport, //false,
        className: "task-check",
        onClick: onClickCheckBoxes,
      };
      return componentProps;
    }
  } else if (componentType === "DatePicker") {
    if (componentLabel === "From Date") {
      let componentProps = {
        id: "fdate",
        className: "date-picker",
        value: isDateRangeBool_summaryReport
          ? newfdate
          : stringDateToMoment(fdate),
        onChange: onChangeFieldValues,
        isEnableFutureDates: false,
        isEnablePastDates: true,
      };
      if (isDateRangeBool_summaryReport) {
        componentProps.viewMode = "days";
        return componentProps;
      } else {
        componentProps.dateFormat = "MMM-YYYY";
        componentProps.showMonthYearPicker = true;
        componentProps.viewMode = "months";
        return componentProps;
      }
    } else if (componentLabel === "To Date") {
      let componentProps = {
        id: "tdate",
        className: "date-picker",
        value: isDateRangeBool_summaryReport
          ? newtdate
          : stringDateToMoment(tdate),
        onChange: onChangeFieldValues,
        isEnableFutureDates: false,
        isEnablePastDates: true,
      };
      if (isDateRangeBool_summaryReport) {
        componentProps.viewMode = "days";
        return componentProps;
      } else {
        componentProps.dateFormat = "MMM-YYYY";
        componentProps.showMonthYearPicker = true;
        componentProps.viewMode = "months";
        return componentProps;
      }
    }
  } else if (componentType === "DropdownList") {
    if (componentLabel === "Summary By") {
      let componentProps = {
        id: "summary",
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
        selectedID: summary_selected_id,
        onChange: onChangeFieldValues,
      };
      return componentProps;
    }
  }
}

function onClickCheckBoxes(id, updatedValue) {
  if (id === "isDateRange_summaryReport") {
    if (updatedValue === true) {
      isDateRangeBool_summaryReport = true;

      fdate = moment().format(DATE_FORMAT);
      tdate = moment().format(DATE_FORMAT);
    } else {
      isDateRangeBool_summaryReport = false;

      newfdate = dateFormatter(moment(), "yyyy-MM-dd");
      newtdate = dateFormatter(moment(), "yyyy-MM-dd");
    }

    currentProps.updateComponentState(
      REPORT_SUBMENU_ID,
      REPORT_IS_DATE_RANGE_BOOL,
      isDateRangeBool_summaryReport
    );
  } else if (id === "support_summary_reports") {
    if (updatedValue === true) {
      support = 1;
      supportBool_summaryReport = true;
    } else {
      support = 0;
      supportBool_summaryReport = false;
    }

    currentProps.updateComponentState(
      REPORT_SUBMENU_ID,
      REPORT_TEMP_BOOL,
      supportBool_summaryReport
    );
  } else if (id === "category_summary_reports") {
    let categoryStringValue;

    if (updatedValue === true) {
      category = 1;
      categoryBool_summaryReport = true;
      categoryStringValue = "1";
    } else {
      category = 0;
      categoryBool_summaryReport = false;
      categoryStringValue = "0";
    }
    currentProps.updateComponentState(
      REPORT_SUBMENU_ID,
      CATEGORY,
      categoryStringValue
    );
  }
}

function onChangeFieldValues(id, updatedValue, updatedBillable, updatedName) {
  if (id === "fdate") {
    if (isDateRangeBool_summaryReport === true) {
      newfdate = dateFormatter(updatedValue, "yyyy-MM-dd");
    } else {
      fdate = updatedValue.startOf("month").format(DATE_FORMAT);
    }
  } else if (id === "tdate") {
    if (isDateRangeBool_summaryReport === true) {
      newtdate = dateFormatter(updatedValue, "yyyy-MM-dd");
    } else {
      // tdate = updatedValue.endOf("month").format(DATE_FORMAT);
      if (stringDateToMoment(updatedValue).isSame(new Date(), "month")) {
        tdate = moment().format(DATE_FORMAT);
      } else {
        tdate = updatedValue.endOf("month").format(DATE_FORMAT);
      }
    }
  } else if (id === "summary") {
    if (updatedName === "Project") {
      summary = "project";
      summary_selected_id = "1";
    } else if (updatedName === "Employee") {
      summary = "employee";
      summary_selected_id = "2";
    }

    if (currentProps.updateComponentState) {
      currentProps.updateComponentState(
        REPORT_SUBMENU_ID,
        SUMMARY_BY,
        updatedName
      );
    }
  }
}

function submitReport(props, state) {
  // console.log("props in submit report = ", props);
  const { onDateError, deleteComponentState } = props;
  deleteComponentState(DASHBOARD_NAVIGATE_ID);
  if (isDateRangeBool_summaryReport) {
    const { fetchReport, updateComponentState } = props;
    updateComponentState(LOADER_ID, LOADER_SHOW, {
      showLoader: true,
    });

    //pr validation for date selection

    if (moment(newtdate).diff(moment(newfdate), "days") < 0) {
      onDateError(false, newfdate, newtdate);
      updateComponentState(LOADER_ID, LOADER_SHOW, {
        showLoader: false,
      });
      return false;
    } else {
      if (moment(newtdate).diff(moment(newfdate), "months") > 12) {
        onDateError(true, newfdate, newtdate);
        updateComponentState(LOADER_ID, LOADER_SHOW, {
          showLoader: false,
        });
        return false;
      } else {
        onDateError(true, newfdate, newtdate);
      }
    }

    const reportPayload = {
      fdate: newfdate,
      tdate: newtdate,
      support,
      emp_id,
      summary,
      category,
      loggedIn_user: state.LoggedInUser,
      isDateRangeBool_summaryReport,
    };
    let reportBodyParams = new FormData();

    reportBodyParams.append("command", "getSummaryReportOld");
    reportBodyParams.append("params", JSON.stringify(reportPayload));
    reportBodyParams.append("type", "getReport");

    const reportParams = {
      id: "REPORT_SUBMENU_ID_NEW_SR",
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
    // console.log(" in else of submit report dhinchak")
    allMonthsData = [];
    totalDuration = 0;
    totalBillable = 0;
    tooolTipDates = [];
    calculateMonthAndFetch(props, state, fdate);
  }
}

function calculateMonthAndFetch(props, state, firstDate) {
  const { onDateError } = props;
  const fromDate = stringDateToMoment(firstDate)
    .startOf("month")
    .format(DATE_FORMAT);

  let toDate;

  toDate = stringDateToMoment(firstDate)
    .endOf("month")
    .format(DATE_FORMAT);

  // if (stringDateToMoment(firstDate).isSame(new Date(), "month")) {
  //   toDate = moment().format(DATE_FORMAT);
  // } else {
  //   toDate = stringDateToMoment(firstDate)
  //     .endOf("month")
  //     .format(DATE_FORMAT);
  // }

  const iscorretDateSelected =
    stringDateToMoment(tdate) >= stringDateToMoment(fdate);
  const dateRangeIsLessThenYear =
    stringDateToMoment(tdate).diff(stringDateToMoment(fdate), "months") <= 12;

  let mfdate = dateFormatter(stringDateToMoment(fdate), "yyyy-MM-dd");
  let mtdate = dateFormatter(stringDateToMoment(tdate), "yyyy-MM-dd");
  onDateError(iscorretDateSelected, mfdate, mtdate);

  if (iscorretDateSelected && dateRangeIsLessThenYear) {
    fetchReportsByMonth(props, state, fromDate, toDate, tdate);
  }
}

function checkIfProjectExist(projectList, rtype_name) {
  let isProjectExist = false;

  projectList.forEach((singleProject) => {
    if (singleProject.rtype_name === rtype_name) {
      isProjectExist = true;
    }
  });

  return isProjectExist;
}

function getProjectList(allMonthsData) {
  let projectList = [];
  allMonthsData.forEach((mainRow) => {
    mainRow.forEach((singleRecord) => {
      if (!singleRecord.isNull) {
        const projectObj = {
          rtype_name: singleRecord.rtype_name,
          team_name: singleRecord.team_name,
        };

        if (!checkIfProjectExist(projectList, singleRecord.rtype_name)) {
          projectList.push(projectObj);
        }
      }
    });
  });

  return projectList;
}

function getProjectDataByMonth(monthData, rtype_name) {
  let dataArryToReturn =
    summary_selected_id === "1"
      ? ["", 0, 0, 0, 0, 0] // = > estimated_hrs, bilable_hrs, non_bilable_hrs, bilable_hrs_perc, non_bilable_hrs_perc
      : ["", 0, 0, 0, 0, 0, 0]; // = >available_hrs, estimated_hrs, bilable_hrs, non_bilable_hrs, bilable_hrs_perc, non_bilable_hrs_perc

  monthData.forEach((monthProject) => {
    if (!monthProject.isNull && monthProject.rtype_name === rtype_name) {
      if (summary_selected_id === "1") {
        dataArryToReturn = [
          "",
          parseFloat(monthProject.estimated_hrs),
          parseFloat(monthProject.bilable_hrs),
          parseFloat(monthProject.non_bilable_hrs),
          parseFloat(monthProject.bilable_hrs_perc),
          parseFloat(monthProject.non_bilable_hrs_perc),
        ];
      } else {
        dataArryToReturn = [
          "",
          parseFloat(monthProject.available_hrs),
          parseFloat(monthProject.estimated_hrs),
          parseFloat(monthProject.bilable_hrs),
          parseFloat(monthProject.non_bilable_hrs),
          parseFloat(monthProject.bilable_hrs_perc),
          parseFloat(monthProject.non_bilable_hrs_perc),
        ];
      }
    }
  });

  return dataArryToReturn;
}

function getTableHeader(index, totalHeader) {
  let newFromdate =
    index === 0
      ? stringDateToMoment(fdate)
          .startOf("month")
          .format(DATE_FORMAT)
      : stringDateToMoment(fdate)
          .add(index, "M")
          .startOf("month")
          .format(DATE_FORMAT);
  let newTodate =
    index === 0
      ? stringDateToMoment(fdate)
          .endOf("month")
          .format(DATE_FORMAT)
      : stringDateToMoment(fdate)
          .add(index, "M")
          .endOf("month")
          .format(DATE_FORMAT);

  if (totalHeader) {
    newFromdate = stringDateToMoment(fdate)
      .startOf("month")
      .format(DATE_FORMAT);

    newTodate = stringDateToMoment(tdate)
      .endOf("month")
      .format(DATE_FORMAT);
  }

  const toolTipDate = {
    fromDate: newFromdate,
    toDate: newTodate,
  };

  if (summary_selected_id === "1") {
    const dataToReturn = ["", "From :", newFromdate, "To :", newTodate, ""];

    dataToReturn.forEach(() => {
      tooolTipDates.push(toolTipDate);
    });

    return dataToReturn;
  } else {
    const dataToReturn = ["", "", "From :", newFromdate, "To :", newTodate, ""];

    dataToReturn.forEach(() => {
      tooolTipDates.push(toolTipDate);
    });
    return dataToReturn;
  }
}

function getDefaultColumns(columnType) {
  let defaultColumnList;
  if (summary_selected_id === "1") {
    if (category === 1) {
      defaultColumnList = {
        title: ["Sr.No.", "Project", "Category"],
        total: ["Total", "", ""],
        dateRange: ["", "", ""],
      };
    } else {
      defaultColumnList = {
        title: ["Sr.No.", "Project"],
        total: ["Total", ""],
        dateRange: ["", ""],
      };
    }
  } else {
    if (category === 1) {
      defaultColumnList = {
        title: ["Sr.No.", "Employee", "Category"],
        total: ["Total", "", ""],
        dateRange: ["", "", ""],
      };
    } else {
      defaultColumnList = {
        title: ["Sr.No.", "Employee"],
        total: ["Total", ""],
        dateRange: ["", ""],
      };
    }
  }
  return defaultColumnList[columnType];
}

function getTitleRow() {
  if (summary_selected_id === "1") {
    return [
      "",
      "Duration",
      "Billable",
      "Non Billable",
      "Billable %",
      "Non Billable %",
    ];
  } else {
    return [
      "",
      "Available Hrs",
      "Duration",
      "Billable",
      "Non Billable",
      "Billable %",
      "Non Billable %",
    ];
  }
}

function getLastCalculatedRow(monthData, index) {
  let totalEstimatedHrs = 0.0;
  let totalBillableHrs = 0.0;
  let totalNonBillableHrs = 0.0;
  let totalBillablePerc = 0.0;
  let totalNonBillablePerc = 0.0;

  monthData.forEach((singleProject) => {
    if (!singleProject.isNull) {
      totalEstimatedHrs =
        totalEstimatedHrs + parseFloat(singleProject.estimated_hrs);
      totalBillableHrs =
        totalBillableHrs + parseFloat(singleProject.bilable_hrs);
      totalNonBillableHrs =
        totalNonBillableHrs + parseFloat(singleProject.non_bilable_hrs);
    }
  });

  if (totalEstimatedHrs > 0) {
    totalBillablePerc = (totalBillableHrs * 100) / totalEstimatedHrs;
    totalNonBillablePerc = (totalNonBillableHrs * 100) / totalEstimatedHrs;
  }

  if (apiDataLength > 1) {
    if (index < apiDataLength - 1) {
      totalDuration = totalDuration + totalEstimatedHrs;
      totalBillable = totalBillable + totalBillableHrs;
    }
  } else {
    totalDuration = totalDuration + totalEstimatedHrs;
    totalBillable = totalBillable + totalBillableHrs;
  }

  if (summary_selected_id === "1") {
    return [
      "",
      parseFloat(totalEstimatedHrs.toFixed(2)),
      parseFloat(totalBillableHrs.toFixed(2)),
      parseFloat(totalNonBillableHrs.toFixed(2)),
      parseFloat(totalBillablePerc.toFixed(2)),
      parseFloat(totalNonBillablePerc.toFixed(2)),
    ];
  } else {
    return [
      "",
      "",
      parseFloat(totalEstimatedHrs.toFixed(2)),
      parseFloat(totalBillableHrs.toFixed(2)),
      parseFloat(totalNonBillableHrs.toFixed(2)),
      parseFloat(totalBillablePerc.toFixed(2)),
      parseFloat(totalNonBillablePerc.toFixed(2)),
    ];
  }
}

function getColumnStyle(titleRow) {
  const defaultWidth = 100;
  let styleList = [];

  titleRow.forEach((title, index) => {
    if (title in summaryReportStyle) {
      styleList.push(summaryReportStyle[title]);
    } else {
      styleList.push({ width: defaultWidth });
    }
  });

  return styleList;
}

function getExcelColumnsRow(columns, data) {
  return { columns, data };
}

const highlightedRowStyle = {
  fill: { patternType: "solid", fgColor: { rgb: "d3d3d3" } },
};

const boldRowStyle = {
  font: { bold: true, sz: 13, wpx: "100" },
};

function getExcelValuesArr(tableRow, rowStyle = {}) {
  const valyesArray = [];
  tableRow.forEach((column) => {
    const columns = {
      value: column,
      style: rowStyle,
    };
    valyesArray.push(columns);
  });

  return valyesArray;
}

function getExcelTitle(tableHeader) {
  let excelColumns = [];
  tableHeader.forEach((column) => {
    const columns = {
      title: column,
      width: { wpx: "100" },
    };
    excelColumns.push(columns);
  });
  return excelColumns;
}

function generateExcelData(tableDataAll) {
  let excelData = [];

  let excelColumns = [];
  let excelSingleData = [];

  const excelTitle = `Summary Report From : ${stringDateToMoment(fdate).format(
    DATE_FORMAT
  )} to ${stringDateToMoment(tdate).format(DATE_FORMAT)}`;

  const excelReportData = `Total Duration:  ${totalDuration
    .toFixed(2)
    .toString()} Total Billable:  ${totalBillable.toFixed(2).toString()}`;

  const totalField = getExcelValuesArr([excelReportData], boldRowStyle);

  excelData.push(getExcelColumnsRow([excelTitle], [totalField, ""])); //default data column
  excelColumns = getExcelTitle(tableDataAll.tableHeader); //adding first column as title
  excelSingleData.push(
    getExcelValuesArr(tableDataAll.titleRow, highlightedRowStyle)
  ); //adding first column as subtitle
  tableDataAll.tableRows.forEach((dataRow) => {
    excelSingleData.push(getExcelValuesArr(dataRow)); //adding data rows to the table
  });
  excelSingleData.push(
    getExcelValuesArr(tableDataAll.monthTotalCalculation, highlightedRowStyle)
  ); // Adding last row to excel file

  //final data
  excelData.push(getExcelColumnsRow(excelColumns, excelSingleData));

  return excelData;
}

function generateDataRows(allMonthsData, projectList) {
  let getColumnStyleList = [];
  let tableHeader = [];
  let titleRow = [];
  let tableRows = [];
  let monthTotalCalculation = [];
  projectList.forEach((project, index) => {
    let singleProjectRow = [];
    singleProjectRow.push(`${index + 1}`);
    singleProjectRow.push(project.rtype_name);

    if (category === 1) {
      singleProjectRow.push(project.team_name);
    }

    allMonthsData.forEach((monthData) => {
      singleProjectRow.push(
        ...getProjectDataByMonth(monthData, project.rtype_name)
      );
    });
    tableRows.push(singleProjectRow);
  });

  tableHeader.push(...getDefaultColumns("dateRange"));
  titleRow.push(...getDefaultColumns("title"));
  monthTotalCalculation.push(...getDefaultColumns("total"));

  titleRow.forEach(() => {
    tooolTipDates.push(""); //Adding default toottips for the first three column
  });

  let totalHeader = false;
  apiDataLength = allMonthsData.length;
  allMonthsData.forEach((monthData, index) => {
    if (allMonthsData.length > 1 && index === allMonthsData.length - 1) {
      totalHeader = true;
    }

    tableHeader.push(...getTableHeader(index, totalHeader));
    titleRow.push(...getTitleRow());
    monthTotalCalculation.push(...getLastCalculatedRow(monthData, index));
  });

  getColumnStyleList.push(...getColumnStyle(titleRow));

  const tableDataAll = {
    tableHeader,
    titleRow,
    tableRows,
    monthTotalCalculation,
    getColumnStyleList,
    tooolTipDates,
    excelData: [],
    dataObject: getDefaultDetailsData(),
  };

  tableDataAll.excelData = generateExcelData(tableDataAll);

  return tableDataAll;
}

function onFetchComplete(allMonthsData, props) {
  // console.log("onFetchComplete = ", onFetchComplete)
  const { onFetchingComplete } = props;
  const projectList = getProjectList(allMonthsData);
  const tableObj = generateDataRows(allMonthsData, projectList);

  onFetchingComplete(tableObj);
}

function fetchReportsByMonth(props, state, fromDate, toDate, lastDate) {
  const { fetchReport, updateComponentState } = props;
  updateComponentState(LOADER_ID, LOADER_SHOW, {
    showLoader: true,
  });

  const reportPayload = {
    fdate: fromDate,
    tdate: toDate,
    support,
    emp_id,
    summary,
    category,
    loggedIn_user: state.LoggedInUser,
    isDateRangeBool_summaryReport,
  };
  let reportBodyParams = new FormData();

  reportBodyParams.append("command", "getSummaryReport");
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
      if (isEmpty(response.apiData.apiData)) {
        const noDataObj = [
          {
            isNull: true,
            fromDate,
            toDate,
          },
        ];
        allMonthsData.push(noDataObj);
      } else {
        allMonthsData.push(response.apiData.apiData);
      }
      if (
        !stringDateToMoment(fromDate).isSame(
          stringDateToMoment(lastDate),
          "month"
        )
      ) {
        const nextMonthToCall = stringDateToMoment(fromDate)
          .add(1, "M")
          .format(DATE_FORMAT);
        calculateMonthAndFetch(props, state, nextMonthToCall);
      } else {
        if (allMonthsData.length > 1) {
          // code for adding total columns for summary report

          const actualFdate = stringDateToMoment(fdate)
            .startOf("month")
            .format(DATE_FORMAT);

          const reportPayloadTotal = {
            fdate: actualFdate,
            tdate: toDate,
            support,
            emp_id,
            summary,
            category,
            loggedIn_user: state.LoggedInUser,
            isDateRangeBool_summaryReport,
          };
          let reportBodyParams = new FormData();

          reportBodyParams.append("command", "getSummaryReport");
          reportBodyParams.append("params", JSON.stringify(reportPayloadTotal));
          reportBodyParams.append("type", "getReport");

          const reportParams = {
            id: REPORT_SUBMENU_ID,
            api: {
              body: reportBodyParams,
            },
          };

          fetchReport(reportParams).then((response) => {
            if (response.apiData && response.apiData.isFetching === false) {
              allMonthsData.push(response.apiData.apiData);
              onFetchComplete(allMonthsData, props, state, fromDate, toDate);
            }
          });
          // end code for adding total columns for summary report
        } else {
          onFetchComplete(allMonthsData, props, state, fromDate, toDate);
        }
      }
    }
  });
}

export function getDefaultDetailsData(monthDataObj = {}) {
  let actualFdate = stringDateToMoment(fdate)
  .startOf("month")
  .format(DATE_FORMAT); /// ajaychawda
  let actualtdate = stringDateToMoment(tdate)
    .endOf("month")
    .format(DATE_FORMAT);

  const objForNull = {
    fromDate: stringDateToMoment(actualFdate),
    toDate: stringDateToMoment(actualtdate),
    reportTitle: "Summary Report",
    totalDuration: totalDuration.toFixed(2).toString(),
    bilable_hrs: totalBillable.toFixed(2).toString(),
    isDataNull: true,
  };
  return objForNull;
}
