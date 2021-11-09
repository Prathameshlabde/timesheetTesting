import colors from "../../common/colors";

import {
  REPORT_DEFAULTERLIST_ID,
  REPORT_DEFAULTERLIST_ID2,
  DEFAULTERLIST_TAB1,
  DEFAULTERLIST_TAB2,
  DEFAULTERLIST_TAB3,
} from "../../../constants/app.constants";
import defaulterList_subTable_employee_date from "../../json/reports/defaulter list/defaulterList_subTable_employee_date.json";
import report_defaulterList_employee_date_table from "../../json/reports/defaulter list/report_defaulterList_employee_date_table.json";
import { dataAbstraction } from "../../utils/dataAbstraction.utils";
import moment from "moment";
import { isEmpty } from "../../utils/common.utils";

export const ReportStyles = {
  styleTitle: {
    display: "flex",
    textTransform: "capitalize",
    fontWeight: "bold",
  },
  styleSubtitle: {
    display: "flex",
    fontSize: "18px",
  },
  styleBody: {
    display: "flex",
    fontSize: "12px",
  },
  table: { display: "block" },
  tableHeaderRow: {},
  tableRow: {
    display: "flex",
    padding: "0px 2px",
    borderBottom: `1px solid #E6EBED`,
  },
  ColStyle: {
    display: "table-column",
    width: "7.5%",
    padding: "5px",
  },
  buttonDiv: {
    cursor: "pointer",
  },
  spanLabel: {
    display: "block",
  },
  spanLabelNumber: {
    display: "block",
    textAlign: "right",
  },
  spanLabelBold: {
    display: "block",
    fontWeight: "bold",
  },
  spanLabelBoldNumber: {
    display: "block",
    fontWeight: "bold",
    textAlign: "right",
  },
  headerBoldLabel: {
    fontWeight: "bold",
  },
  tableRowDescription: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: colors.whiteColor,
    borderBottom: `1px solid #E6EBED`,
  },

  ColStyleDescription: {
    display: "table-column",
    width: "100%",
    padding: "6px 10px 6px 10px",
    // height: "50px",
    backgroundColor: "rgba(246, 246, 246, 0.48)",
    borderRadius: "3%",
  },

  descriptionBotom: {
    // fontWeight: "bold",
  },
};

export function getDefaulterList(props, selectedDate, LoggedInUser) {
  let reportPayload;
  const { requestData } = props;
  let reportBodyParams = new FormData();
  reportPayload = {
    fdate: selectedDate,
    tdate: selectedDate,
    loggedIn_user: LoggedInUser,
  };
  reportBodyParams.append("command", "getDefaulterList");
  reportBodyParams.append("params", JSON.stringify(reportPayload));
  reportBodyParams.append("type", "getReport");
  const reportParams = {
    id: REPORT_DEFAULTERLIST_ID,
    api: { body: reportBodyParams },
  };
  return requestData(reportParams);
}
export function setNewTableData(finalEmpSet, sort_by) {
  let tableArr = [];
  let columns = [];
  let obj1 = { names: "billing_date" };
  let obj2 = { names: "emp_name" };
  let obj3 = { names: "available_hrs" };
  let obj4 = { names: "estimated_hrs" };
  let obj5 = { names: "bilable_hrs" };
  let obj6 = { names: "nonbilable_hrs" };
  columns.push(obj1, obj2, obj3, obj4, obj5, obj6);
  let rows = [];
  for (let i = 0; i < finalEmpSet.length; i++) {
    let rowObj = [];
    rowObj.push(
      finalEmpSet[i].billing_date,
      finalEmpSet[i].emp_name,
      finalEmpSet[i].available_hrs,
      finalEmpSet[i].estimated_hrs,
      finalEmpSet[i].bilable_hrs,
      finalEmpSet[i].nonbilable_hrs
    );

    rows.push(rowObj);
  }
  let finalObj = { columns: columns, rows: rows };
  tableArr.push(finalObj);
  // console.log("tableArr[0] 111 = ", tableArr[0]);
  let jsonfile = defaulterList_subTable_employee_date;
  let reportDashBoardFinal = dataAbstraction(tableArr[0], jsonfile);
  return reportDashBoardFinal;
}
export function setNewTableDataDuplicate(finalEmpSet, sort_by) {
  let tableArr = [];
  let columns = [];
  let obj1 = { names: "emp_name" };
  let obj2 = { names: "id" };
  columns.push(obj1, obj2);
  let rows = [];
  for (let i = 0; i < finalEmpSet.length; i++) {
    let rowObj = [];
    rowObj.push(finalEmpSet[i].name);
    rowObj.push(finalEmpSet[i].id);
    rows.push(rowObj);
  }
  let finalObj = { columns: columns, rows: rows };
  tableArr.push(finalObj);
  // console.log("tableArr of employee cz sort by  = employee  ", tableArr[0]);
  let reportDashBoardFinal = dataAbstraction(
    tableArr[0],
    report_defaulterList_employee_date_table
  );
  return reportDashBoardFinal;
}
export function setDefaultEmployeeData(
  employeeDataFromProps,
  sort_by,
  tabname
) {
  let tempEmpSet = [];
  let finalEmpSet = [];
  if (employeeDataFromProps && employeeDataFromProps.length > 0) {
    let employeeDataTemp = employeeDataFromProps;
    for (let i = 0; i < employeeDataTemp.length; i++) {
      let tempobj = {
        id: employeeDataTemp[i].id,
        emp_name: employeeDataTemp[i].name,
      };
      tempEmpSet.push(tempobj);
    }
    for (let i = 0; i < tempEmpSet.length; i++) {
      let tempObj = {
        billing_date: "",
        emp_id: tempEmpSet[i].id,
        available_hrs: "100.00",
        estimated_hrs: "0.00",
        bilable_hrs: "0.00",
        nonbilable_hrs: "0.00",
        emp_name: tempEmpSet[i].emp_name,
      };
      finalEmpSet.push(tempObj);
    }
    let sortedSet = [];
    if (tabname === DEFAULTERLIST_TAB1) {
      // console.log("No Entry ka data mila 1");
      sortedSet = [];
      for (let k = 0; k < finalEmpSet.length; k++) {
        if (
          finalEmpSet[k].available_hrs === "8.00" &&
          finalEmpSet[k].estimated_hrs === "0.00"
        ) {
          sortedSet.push(finalEmpSet[k]);
        }
      }
    } else if (tabname === DEFAULTERLIST_TAB2) {
      // console.log("Leave ka data mila 2");
      sortedSet = [];
      for (let k = 0; k < finalEmpSet.length; k++) {
        if (finalEmpSet[k].available_hrs === "0.00") {
          sortedSet.push(finalEmpSet[k]);
        }
      }
    } else if (tabname === DEFAULTERLIST_TAB3) {
      // console.log("Filled Entry ka data mila 3");
      sortedSet = [];
      for (let k = 0; k < finalEmpSet.length; k++) {
        if (
          finalEmpSet[k].available_hrs === "8.00" &&
          finalEmpSet[k].estimated_hrs !== "0.00"
        ) {
          sortedSet.push(finalEmpSet[k]);
        }
      }
    }
    let reportTableDataFinal = setNewTableData(sortedSet, sort_by);
    return reportTableDataFinal;
  }
}

export function getDefaulterListForEmployees(props, dataObject, LoggedInUser) {
  let reportPayload;
  const { requestData } = props;
  let reportBodyParams = new FormData();
  reportPayload = {
    fdate: dataObject.fromDate,
    tdate: dataObject.toDate,
    loggedIn_user: LoggedInUser,
  };
  reportBodyParams.append("command", "getDefaulterList");
  reportBodyParams.append("params", JSON.stringify(reportPayload));
  reportBodyParams.append("type", "getReport");
  const reportParams = {
    id: REPORT_DEFAULTERLIST_ID2,
    api: { body: reportBodyParams },
  };
  requestData(reportParams);
}
export function setDatesTableData(
  webServiceDefaulterListData,
  datesData,
  selectedEmp,
  tabname
) {
  let tableArr = [];
  let columns = [];
  let obj1 = { names: "billing_date" };
  let obj2 = { names: "available_hrs" };
  let obj3 = { names: "estimated_hrs" };
  let obj4 = { names: "bilable_hrs" };
  let obj5 = { names: "nonbilable_hrs" };
  columns.push(obj1, obj2, obj3, obj4, obj5);
  let rows = [];
  let newDatesData = [];
  for (let i = 0; i < datesData.apiData.rows.length; i++) {
    newDatesData.push(datesData.apiData.rows[i][0]);
  }
  for (let i = 0; i < newDatesData.length; i++) {
    let rowObj = [];
    rowObj.push(newDatesData[i], "", "", "", "");
    rows.push(rowObj);
  }

  // console.log("webServiceDefaulterListData = ", webServiceDefaulterListData);
  // console.log("selectedEmp = ", selectedEmp);

  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < webServiceDefaulterListData.length; j++) {
      if (
        rows[i][0] === webServiceDefaulterListData[j].billing_date &&
        webServiceDefaulterListData[j].emp_id === selectedEmp.emp_id &&
        webServiceDefaulterListData[j].estimated_hrs !== "0.00"
      ) {
        // console.log("matched1");
        // console.log("rows[i] matched1 = ", rows[i]);
        // console.log("selectedEmp.emp_id matched1 = ", selectedEmp.emp_id);
        // console.log(
        //   "webServiceDefaulterListData[j] = ",
        //   webServiceDefaulterListData[j]
        // );
        let rowObj = [];
        rowObj.push(
          rows[i][0],
          "102.00",
          webServiceDefaulterListData[j].estimated_hrs,
          webServiceDefaulterListData[j].bilable_hrs,
          webServiceDefaulterListData[j].nonbilable_hrs
        );
        rows[i] = rowObj;
        console.log("new obj 1= ", rowObj);
      } else if (
        rows[i][0] === webServiceDefaulterListData[j].billing_date &&
        webServiceDefaulterListData[j].emp_id === selectedEmp.emp_id &&
        webServiceDefaulterListData[j].estimated_hrs === "0.00"
      ) {
        // console.log("matched2");
        // console.log(
        //   "webServiceDefaulterListData[j] = ",
        //   webServiceDefaulterListData[j]
        // );
        // console.log("selectedEmp.emp_id matched2 = ", selectedEmp.emp_id);
        let rowObj = [];
        rowObj.push(
          webServiceDefaulterListData[j].billing_date,
          "0.00",
          "0.00",
          "0.00",
          "0.00"
        );
        rows[i] = rowObj;
        // console.log("new obj 2= ", rowObj);
      } else {
        // console.log("no matched");
        if (rows[i]) {
        } else {
          let rowObj = [];
          rowObj.push(rows[i][0], "8.00", "0.00", "0.00", "0.00");
          rows[i] = rowObj;
          // console.log("default i, obj = ", i, rows[i]);
        }
      }
    }
  }

  let tempRows = [];
  for (let i = 0; i < rows.length; i++) {
    if (rows[i][1] === "") {
      let rowObj = [];

      const [year, month, day] = rows[i][0].split("-"); /// ajay21
      const date = new Date(year, month - 1, day);
      const days = date.getDay();
      let avail_hrs = "8.00";
      if (days == 6 || days == 0) {
        avail_hrs = "0.00";
      }
      // console.log("rows[i][0]", rows[i][0]); //// ajay21
      rowObj.push(rows[i][0], avail_hrs, "0.00", "0.00", "0.00"); //// ajay21
      rows[i] = rowObj;
      tempRows.push(rowObj);
    } else {
      tempRows.push(rows[i]);
    }
  }
  // console.log("tempRows = ", tempRows);
  // console.log("rows = ", rows);

  let finalRows = [];
  for (let i = 0; i < rows.length; i++) {
    if (tabname === DEFAULTERLIST_TAB1) {
      if (
        //// ajay21
        rows[i][1] === "8.00" ||
        (rows[i][2] === "0.00" &&
          rows[i][3] === "0.00" &&
          rows[i][4] === "0.00")
      ) {
        finalRows.push(rows[i]);
      }
    } else if (tabname === DEFAULTERLIST_TAB2) {
      if (
        rows[i][1] === "0.00" &&
        rows[i][2] === "0.00" &&
        rows[i][3] === "0.00" &&
        rows[i][4] === "0.00"
      ) {
        finalRows.push(rows[i]);
      }
    } else if (tabname === DEFAULTERLIST_TAB3) {
      if (rows[i][1] === "8.00" && rows[i][2] !== "0.00") {
        finalRows.push(rows[i]);
      }
    }
  }
  let finalObj = { columns: columns, rows: finalRows };
  tableArr.push(finalObj);
  return tableArr[0];
}

export function isLockedEntry(ogData, rowIndex) {
  let currentEntryDate, lock_date;
  let isLockedEntry = false;

  if (ogData[rowIndex - 1] === "Sub Total") {
    return isLockedEntry;
  }

  if (!isEmpty(ogData) && !isEmpty(ogData[rowIndex - 1])) {
    const currentRowItem = ogData[rowIndex - 1];
    lock_date = moment(currentRowItem["lock_date"]);
    currentEntryDate = moment(currentRowItem["billing_date"]);

    if (currentEntryDate <= lock_date) {
      isLockedEntry = true;
    }
  }
  return isLockedEntry;
}