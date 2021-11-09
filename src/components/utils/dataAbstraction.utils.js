import {
  REPORT_SUBMENU_ID,
  EXPORT_DATA,
  SUB_EXPORT_DATA
} from "../../constants/app.constants.js";
import {
  numberColumns,
  columnWidth
} from "../../components/json/reports/excel/report_number_fields.json";
import moment from "moment";
export const rawDataa = {
  columns: [
    { names: "bill_id" },
    { names: "description" },
    { names: "start_time" },
    { names: "end_time" },
    { names: "estimated_hrs" },
    { names: "bilable_hrs" },
    { names: "ref_no" },
    { names: "sub_ref_no" },
    { names: "emp_id" },
    { names: "pro_id" },
    { names: "client_id" },
    { names: "update_date" },
    { names: "flag" },
    { names: "billing_date" },
    { names: "task_id" },
    { names: "sub_task_id" },
    { names: "start_time_for_query" },
    { names: "sprint_id" },
    { names: "sprint_ref_no" },
    { names: "pname" }
  ],
  rows: [
    [
      "2",
      "Happy Billing dashb...........",
      "sunday ",
      "monday",
      "500",
      "500",
      "123",
      "123",
      "123",
      "1",
      "1",
      "2018-07-04 10:48:32",
      "0",
      "2018-07-04",
      "123",
      "123",
      "10:12:00",
      "123",
      "123",
      "timesheet"
    ],
    [
      "1",
      "happy iOS ............",
      "sunday",
      "monday",
      "500",
      "500",
      "123",
      "123",
      "123",
      "1",
      "1",
      "2018-06-27 15:55:38",
      "0",
      "2018-06-07",
      "123",
      "123",
      "02:21:00",
      "123",
      "123",
      "ios App"
    ]
  ]
};

export function getFromDataRow(rawData, fieldIndex, rowIndex) {
  const dataOfIndex = rawData.rows[rowIndex];
  const valueOfRowField = dataOfIndex[fieldIndex];
  return valueOfRowField;
}

export function getMatchValue(value, rawData, rowIndex) {
  for (var i = 0; i < rawData.columns.length; i++) {
    if (value === rawData.columns[i].names) {
      const valueToreturn = getFromDataRow(rawData, i, rowIndex); // i is Fiend Index
      return valueToreturn;
    }
  }
}

export function renameKeys(obj) {
  let str = JSON.stringify(obj);
  if (str) {
    str = str.replace(/fieldName/g, "value");
    let Returnedobject = JSON.parse(str);
    return Returnedobject;
  }
}

let tableData = {
  rows: []
};

export function dataAbstraction(rawData, billing_json) {
  tableData = {
    rows: []
  };

  tableData.rows.push(renameKeys(billing_json).rows[0]);

  for (var i = 0; i < rawData.rows.length; i++) {
    // console.log("Count for loop :- ", i);
    const billingJson = JSON.stringify(billing_json);
    // eslint-disable-next-line
    const mappedData = JSON.parse(billingJson, (key, value) => {
      if (key === "fieldName") {
        const valueForFieldName = getMatchValue(value, rawData, i); // i is Row Index
        if (typeof valueForFieldName === "string") {
          return (value = valueForFieldName);
        } else {
          return (value = "");
        }
      }
      return value;
    });
    tableData.rows.push(renameKeys(mappedData).rows[1]);
    // console.log("mapped data :- ", mappedData.rows[1]);
  }
  // console.log("Final Data :- tableData.rows ", tableData.rows);
  return tableData;
}

export function headExcelText(dataobj) {
  let reportHead = [];

  let styleCell = {
    font: { bold: true, sz: "13" }
  };

  if (dataobj.projectName) {
    reportHead.push([
      {
        value: "Project Name: " + dataobj.projectName,
        style: styleCell
      }
    ]);
  }

  if (dataobj.emp_name) {
    if (dataobj.reportTitle !== "User Entries") {
      reportHead.push([
        {
          value: "Employee : " + dataobj.emp_name,
          style: styleCell
        }
      ]);
    }
  }

  if (
    dataobj.reportTitle !== "Management Report" &&
    dataobj.reportTitle !== "User Entries"
  ) {
    if (dataobj.sprintName) {
      reportHead.push([
        {
          value: "Sprint : " + dataobj.sprintName,
          style: styleCell
        }
      ]);
    }
    if (dataobj.taskName) {
      reportHead.push([
        {
          value: "Task : " + dataobj.taskName,
          style: styleCell
        }
      ]);
    }
    if (dataobj.subTaskName) {
      reportHead.push([
        {
          value: "SubTask : " + dataobj.subTaskName,
          style: styleCell
        }
      ]);
    }
  }

  return reportHead;
}

export function getReportTitle(dataobj) {
  let rpTitle =
    dataobj.reportTitle +
    " From : " +
    dataobj.fromDate +
    "  To : " +
    dataobj.toDate;

  return rpTitle;
}
export function getReportHead(headVal, headText) {
  return [
    {
      value: headText + headVal,
      style: { font: { bold: true, sz: "13" } }
    }
  ];
}

export function dataAbstractionForReport(
  rawData,
  billing_json,
  props,
  dataobj = ""
) {
  let reportHead = [];
  let reportTitle = "";
  var strCustom = "";
  let strRev = ""; //////////13 jan 2020//////////

  if (dataobj.fromDate && dataobj.fromDate) {
    dataobj.fromDate = moment(dataobj.fromDate).format("DD-MMM-YYYY");
    dataobj.toDate = moment(dataobj.toDate).format("DD-MMM-YYYY");
  }
  reportTitle = getReportTitle(dataobj); // it is use for report title

  //getReportHead used to add header text in new row
  //getReportHead( value, title text )
  if (dataobj.reportTitle === "Task User Entries") {
    if (dataobj.projectName) {
      reportHead.push(getReportHead(dataobj.projectName, "Project Name: ")); //getReportHead used to add header text in new row
    }
    if (dataobj.task_title) {
      reportHead.push(getReportHead(dataobj.task_title, "Task Title: "));
    }
  } else if (dataobj.reportTitle === "User Entries") {
    reportHead = headExcelText(dataobj);
    if (dataobj.totalDuration) {
      strCustom =
        strCustom + "Total Duration : " + dataobj.totalDuration + "  ";
    }
    if (dataobj.bilable_hrs) {
      strCustom = strCustom + "Total Billable : " + dataobj.bilable_hrs + "  ";
    }
    reportHead.push(getReportHead(strCustom, ""));
  } else if (dataobj.reportTitle === "Custom Report") {
    reportHead = headExcelText(dataobj);

    if (
      dataobj.business_days &&
      dataobj.business_hours &&
      dataobj.emp_name !== "All"
    ) {
      reportHead.push(
        getReportHead(
          "Total Working Days: " +
          dataobj.business_days +
          "  Total Working Hours:" +
          dataobj.business_hours,
          ""
        )
      );
    }
    if (dataobj.totalDuration) {
      strCustom =
        strCustom + "Total Duration : " + dataobj.totalDuration + "  ";
    }
    if (dataobj.bilable_hrs) {
      strCustom = strCustom + "Total Billable : " + dataobj.bilable_hrs + "  ";
    }

    if (dataobj.non_bilable_hrs) {
      strCustom =
        strCustom + "Total Non Billable : " + dataobj.non_bilable_hrs + "  ";
    }
    reportHead.push(getReportHead(strCustom, ""));
  } else if (dataobj.reportTitle === "Review Entries") {
    //////////13 jan 2020 ///////////////////
    reportHead = headExcelText(dataobj);
    reportHead.push(getReportHead("Project Name: " + dataobj.pro_name, ""));

    if (
      dataobj.business_days &&
      dataobj.business_hours &&
      dataobj.emp_name !== "All"
    ) {
      reportHead.push(
        getReportHead(
          "Total Working Days: " +
          dataobj.business_days +
          " Total Working Hours: " +
          dataobj.business_hours,
          ""
        )
      );
    }

    if (dataobj.totalDuration) {
      strRev = strRev + "Total Duration : " + dataobj.totalDuration + "  ";
    }
    if (dataobj.bilable_hrs) {
      strRev = strRev + "Total Billable : " + dataobj.bilable_hrs + "  ";
    }

    if (dataobj.non_bilable_hrs) {
      strRev =
        strRev + "Total Non Billable : " + dataobj.non_bilable_hrs + "  ";
    }
    reportHead.push(getReportHead(strRev, ""));

  } else if (dataobj.reportTitle === "Management Report") {
    reportHead = headExcelText(dataobj);

    var strMangt = "";

    if (dataobj.totalDuration) {
      strCustom = strMangt + "Total Duration : " + dataobj.totalDuration + "  ";
    }

    if (dataobj.bilable_hrs) {
      strMangt = strCustom + "Total Billable : " + dataobj.bilable_hrs + "  ";
    }
    reportHead.push(getReportHead(strMangt, ""));
  } else if (dataobj.reportTitle === "Summary Report") {
    var strSumry = "";

    if (dataobj.totalDuration) {
      strSumry = strSumry + "Total Duration : " + dataobj.totalDuration + "  ";
    }

    if (dataobj.bilable_hrs) {
      strSumry = strSumry + "Total Billable : " + dataobj.bilable_hrs + "  ";
    }
    reportHead.push(getReportHead(strSumry, ""));
  } else if (dataobj.reportTitle === "Reference Number Report") {
    reportHead = headExcelText(dataobj);

    var strRef = "";

    if (dataobj.totalDuration) {
      strRef = strRef + "Total Duration : " + dataobj.totalDuration + "  ";
    }

    if (dataobj.bilable_hrs) {
      strRef = strRef + "Total Billable : " + dataobj.bilable_hrs + "  ";
    }
    reportHead.push(getReportHead(strRef, ""));
  } else if (dataobj.reportTitle === "Single Reference Number") {
    if (dataobj.projectName) {
      reportHead.push(getReportHead(dataobj.projectName, "Project Name: "));
    }

    if (dataobj.task_title) {
      reportHead.push(getReportHead(dataobj.task_title, "Task Title: "));
    }

    if (dataobj.sub_task_title) {
      reportHead.push(getReportHead(dataobj.sub_task_title, "Sub Task: "));
    }

    reportHead.push(getReportHead(strCustom, ""));
  }

  tableData = {
    rows: []
  };

  tableData.rows.push(renameKeys(billing_json).rows[0]);

  if (
    dataobj.reportTitle === "Task User Entries" ||
    dataobj.reportTitle === "Custom Report" ||
    dataobj.reportTitle === "Single Reference Number" ||
    dataobj.reportTitle === "Review Entries" //////////13 jan 2020 /////////////////
  ) {
    tableData.rows[0].columns.push({
      values: [
        {
          value: "Description"
        }
      ]
    });
  }

  for (let i = 0; i < rawData.rows.length; i++) {
    const billingJson = JSON.stringify(billing_json);
    const mappedData = JSON.parse(billingJson, (key, value) => {
      if (key === "fieldName") {
        const valueForFieldName = getMatchValue(value, rawData, i); // i is Row Index
        if (typeof valueForFieldName === "string") {
          return (value = valueForFieldName);
        } else {
          return (value = "");
        }
      }
      return value;
    });
    tableData.rows.push(renameKeys(mappedData).rows[1]);
  }

  let keyArray = [];
  let tempkeyArray = [];
  for (let j = 0; j < tableData.rows[0].columns.length; j++) {
    tempkeyArray.push(tableData.rows[0].columns[j].values[0].value);
    let wd = "";

    if (columnWidth[tableData.rows[0].columns[j].values[0].value]) {
      wd = columnWidth[tableData.rows[0].columns[j].values[0].value];
      keyArray.push({ title: "", width: { wpx: wd } });
    } else {
      keyArray.push({ title: "" });
    }
  }

  let tempArr = [];
  for (let i = 0; i < tableData.rows.length; i++) {
    let tempObj = "";
    let resArray = [];

    let stexcel = {};

    var colNum = 0;
    var col_len = tableData.rows[i].columns.length;
    if (dataobj.reportTitle === "Reference Number Report") {
      colNum = 1;
      col_len = tableData.rows[i].columns.length - 1;
    }
    for (let j = colNum; j < col_len; j++) {
      if (numberColumns.includes(tempkeyArray[j])) {
        if (tableData.rows[i].columns[j].values[0].value === tempkeyArray[j]) {
          tempObj = tempkeyArray[j];
        } else {
          var strNum = tableData.rows[i].columns[j].values[0].value;
          strNum = strNum.replace(/,/g, "");

          tempObj = Number(strNum);
        }
      } else {
        //////////13 jan 2020 ///////////////////
        if (tableData.rows[i].columns[j].values) {
          tempObj = tableData.rows[i].columns[j].values[0].value;
        } else {
          tempObj = "";
        }
      }

      if (i === 0) {
        stexcel = {
          fill: {
            patternType: "solid",
            fgColor: { rgb: "c2c2c2" }
          },
          font: {
            bold: true
          }
        };
      }

      if (tempObj === "Total") {
        stexcel = {
          fill: {
            patternType: "solid",
            fgColor: { rgb: "feffb2" }
          }
        };
      }

      if (tempObj === "Sub Total") {
        stexcel = {
          fill: {
            patternType: "solid",
            fgColor: { rgb: "eeeeee" }
          }
        };
      }

      if (stexcel.fill) {
        resArray.push({
          value: tempObj,
          style: stexcel
        });
      } else {
        resArray.push(tempObj);
      }
    }

    tempArr.push(resArray);
  }

  const exportExcelData1 = [
    {
      columns: [reportTitle],
      data: reportHead
    },

    {
      xSteps: 0, // Will start putting cell with 1 empty cell on left most
      ySteps: 0, //will put space of 1 rows,
      columns: keyArray,
      data: tempArr
    }
  ];

  const { updateComponentState } = props;

  if (
    dataobj.reportTitle === "Single Reference Number" ||
    dataobj.reportTitle === "Task User Entries"
  ) {
    updateComponentState(REPORT_SUBMENU_ID, SUB_EXPORT_DATA, exportExcelData1);
  } else {
    updateComponentState(REPORT_SUBMENU_ID, EXPORT_DATA, exportExcelData1);
  }

  let obj = {
    tableData,
    tempArr
  };
  //////////13 jan 2020 ///////////////////
  if (dataobj.reportTitle === "Review Entries") {
    for (let i = 0; i < obj.tempArr.length; i++) {
      obj.tempArr[i].splice(-3, 2);
    }
  }
  return obj;
}

export function addKeyValue(obj, key, data) {
  if (obj && obj !== undefined) {
    obj[key] = data;
  } else {
    obj[key] = "";
  }
}

//for task report
//header coming from php with Dates
export function dataAbstractionForTaskReport(
  rawData,
  billing_json,
  props,
  dataobj = ""
) {
  let reportHead = [];
  let reportTitle = "";

  if (dataobj.fromDate) {
    dataobj.fromDate = moment(dataobj.fromDate).format("DD-MMM-YYYY");
  }
  if (dataobj.toDate) {
    dataobj.toDate = moment(dataobj.toDate).format("DD-MMM-YYYY");
  }

  reportTitle = getReportTitle(dataobj); // it is use for report title
  reportHead.push([
    {
      value: "Empoloyee : " + dataobj.emp_name,
      style: {
        font: { bold: true, sz: "13" }
      }
    }
  ]);

  reportHead.push([
    {
      value: "Project : " + dataobj.projectName,
      style: {
        font: { bold: true, sz: "13" }
      }
    }
  ]);

  if (dataobj.sprintName !== "") {
    reportHead.push([
      {
        value: "Sprint : " + dataobj.sprintName,
        style: {
          font: { bold: true, sz: "13" }
        }
      }
    ]);
  }

  tableData = {
    rows: []
  };

  for (var i = 0; i < rawData.rows.length; i++) {
    const billingJson = JSON.stringify(billing_json);
    // eslint-disable-next-line
    const mappedData = JSON.parse(billingJson, (key, value) => {
      if (key === "fieldName") {
        const valueForFieldName = getMatchValue(value, rawData, i); // i is Row Index
        if (typeof valueForFieldName === "string") {
          return (value = valueForFieldName);
        } else {
          return (value = "");
        }
      }
      return value;
    });
    tableData.rows.push(renameKeys(mappedData).rows[1]);
  }

  let keyArray = [];
  let tempkeyArray = [];
  for (let j = 1; j < tableData.rows[0].columns.length; j++) {
    tempkeyArray.push(tableData.rows[0].columns[j].values[0].value);
    let wd = "100";

    if (j > 3) {
      wd = "280";
    }

    keyArray.push({ title: "", width: { wpx: wd } });
  }

  let tempArr = [];
  for (let i = 0; i < tableData.rows.length; i++) {
    let tempObj = "";
    let resArray = [];

    let stexcel = {};

    var colNum = 1;
    var col_len = tableData.rows[i].columns.length;
    if (dataobj.reportTitle === "Reference Number Report") {
      colNum = 1;
      col_len = tableData.rows[i].columns.length - 1;
    }

    for (let j = colNum; j < col_len; j++) {
      if (numberColumns.includes(tempkeyArray[j])) {
        tempObj = tempkeyArray[j];
      } else {
        if (j > 3) {
          if (i === 0) {
            tempObj = tableData.rows[i].columns[j].values[0].value;
          } else {
            var strNum = tableData.rows[i].columns[j].values[0].value;
            strNum = strNum.replace(/,/g, "");
            tempObj = Number(strNum);
          }
        } else {
          tempObj = tableData.rows[i].columns[j].values[0].value;
        }
      }

      if (i === 0) {
        stexcel = {
          fill: {
            patternType: "solid",
            fgColor: { rgb: "c2c2c2" }
          },
          font: {
            bold: true
          }
        };
      }

      if (tempObj === "Total") {
        stexcel = {
          fill: {
            patternType: "solid",
            fgColor: { rgb: "feffb2" }
          }
        };
      }

      if (tempObj === "Sub Total") {
        stexcel = {
          fill: {
            patternType: "solid",
            fgColor: { rgb: "eeeeee" }
          }
        };
      }

      if (stexcel.fill) {
        resArray.push({
          value: tempObj,
          style: stexcel
        });
      } else {
        resArray.push(tempObj);
      }
    }

    tempArr.push(resArray);
  }

  const exportExcelData1 = [
    {
      columns: [reportTitle],
      data: reportHead
    },

    {
      xSteps: 0, // Will start putting cell with 1 empty cell on left most
      ySteps: 0, //will put space of 1 rows,
      columns: keyArray,
      data: tempArr
    }
  ];

  const { updateComponentState } = props;

  updateComponentState(REPORT_SUBMENU_ID, EXPORT_DATA, exportExcelData1);

  let obj = {
    tableData,
    tempArr
  };

  return obj;
}

export function dataAbstractionForDefaulter(rawData, billing_json) {
  for (var i = 0; i < rawData.rows.length; i++) { }
  tableData = {
    rows: []
  };
  tableData.rows.push(renameKeys(billing_json).rows[0]);
  for (let i = 0; i < rawData.rows.length; i++) {
    const billingJson = JSON.stringify(billing_json);
    const mappedData = JSON.parse(billingJson, (key, value) => {
      if (key === "fieldName") {
        const valueForFieldName = getMatchValue(value, rawData, i); // i is Row Index
        if (typeof valueForFieldName === "string") {
          return (value = valueForFieldName);
        } else {
          return (value = "");
        }
      }
      return value;
    });
    tableData.rows.push(renameKeys(mappedData).rows[1]);
  }

  let keyArray = [];

  for (let j = 0; j < tableData.rows[0].columns.length; j++) {
    keyArray.push(tableData.rows[0].columns[j].values[0].value);
  }

  let tempArr = [];

  for (let i = 1; i < tableData.rows.length; i++) {
    let tempArrObj = [];
    for (let j = 0; j < tableData.rows[i].columns.length; j++) {
      tempArrObj.push(tableData.rows[i].columns[j].values[0].value);
    }
    tempArr.push(tempArrObj);
  }

  let exportData = [];

  for (let i = 0; i < tempArr.length; i++) {
    let ptempppp = [];
    let tempArrObj = tempArr[i];

    for (
      let k = 0, m = 0;
      // eslint-disable-next-line
      k < keyArray.length, m < tempArrObj.length;
      k++ , m++
    ) {
      let tempkey = keyArray[k];
      addKeyValue(ptempppp, tempkey, tempArrObj[m].toString());
    }
    exportData.push(ptempppp);
  }
  let obj = {
    tableData,
    exportData
  };
  return obj;
}
