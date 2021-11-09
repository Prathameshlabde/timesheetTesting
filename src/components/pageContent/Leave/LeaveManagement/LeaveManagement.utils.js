import {
  LOADER_ID,
  LOADER_SHOW,
  REPORT_SUBMENU_ID,
  EXPORT_DATA
} from "../../../../constants/app.constants";
import {
  getMatchValue,
  renameKeys
} from "../../../utils/dataAbstraction.utils";

const spanLabel = {
  id: "lbl",
  maxFont: 14,
  minFont: 5.5,
  className: "span-label"
};

export function getPropsspanLabel() {
  return spanLabel;
}

export function getAllFields(dataObject) {
  let fieldValues = {
    april: dataObject[3].values[0].value,
    may: dataObject[4].values[0].value,
    june: dataObject[5].values[0].value,
    july: dataObject[6].values[0].value,
    august: dataObject[7].values[0].value,
    september: dataObject[8].values[0].value,
    october: dataObject[9].values[0].value,
    november: dataObject[10].values[0].value,
    december: dataObject[11].values[0].value,
    january: dataObject[12].values[0].value,
    february: dataObject[13].values[0].value,
    march: dataObject[14].values[0].value,

    //For comments...
    april_comments: dataObject[3].values[1].value,
    may_comments: dataObject[4].values[1].value,
    june_comments: dataObject[5].values[1].value,
    july_comments: dataObject[6].values[1].value,
    august_comments: dataObject[7].values[1].value,
    september_comments: dataObject[8].values[1].value,
    october_comments: dataObject[9].values[1].value,
    november_comments: dataObject[10].values[1].value,
    december_comments: dataObject[11].values[1].value,
    january_comments: dataObject[12].values[1].value,
    february_comments: dataObject[13].values[1].value,
    march_comments: dataObject[14].values[1].value,

    emp_name: dataObject[1].values[0].value,
    leave_id: dataObject[21].value
  };
  return fieldValues;
}

export function fetchLeaveManagementFromUtils(props, current_year) {
  const { id, requestData, updateComponentState } = props;
  updateComponentState(LOADER_ID, LOADER_SHOW, {
    showLoader: true
  });

  let BodyParams = new FormData();
  const Payload = {
    current_year: current_year
  };

  BodyParams.append("params", JSON.stringify(Payload));
  BodyParams.append("type", "getLeaveManagement");
  BodyParams.append("command", "getLeaveManagement");

  const Params = {
    id,
    api: {
      body: BodyParams
    }
  };

  requestData(Params).then(response => {
    if (response.apiData && response.apiData.isFetching === false) {
      updateComponentState(LOADER_ID, LOADER_SHOW, {
        showLoader: false
      });
    }
  });
}

export function callApiToGenerateCaryForLeave(props, current_year) {
  const { requestData, updateComponentState } = props;
  updateComponentState(LOADER_ID, LOADER_SHOW, {
    showLoader: true
  });

  let BodyParams = new FormData();
  const Payload = {
    current_year: current_year
  };

  BodyParams.append("params", JSON.stringify(Payload));
  BodyParams.append("type", "setCarryForwardLeave");
  BodyParams.append("command", "setCarryForwardLeave");

  const Params = {
    api: {
      body: BodyParams
    }
  };

 return requestData(Params).then(response => {
    if (response.apiData && response.apiData.isFetching === false) {
      updateComponentState(LOADER_ID, LOADER_SHOW, {
        showLoader: false
      });
    }

    return response
  });
}

export function fetchLeavesYearData(props) {
  const { id, requestData, updateComponentState } = props;
  updateComponentState(LOADER_ID, LOADER_SHOW, {
    showLoader: true
  });

  let BodyParams = new FormData();
  const Payload = {};

  BodyParams.append("params", JSON.stringify(Payload));
  BodyParams.append("type", "getLeaveManagement");
  BodyParams.append("command", "getLeavesYearData");

  const Params = {
    id,
    api: {
      body: BodyParams
    }
  };

  requestData(Params).then(response => {
    if (response.apiData && response.apiData.isFetching === false) {
      updateComponentState(LOADER_ID, LOADER_SHOW, {
        showLoader: false
      });
    }
  });
}

export function updateLeave(result, props) {
  let updateDataParamters = new FormData();
  updateDataParamters.append("params", JSON.stringify(result));
  updateDataParamters.append("type", "updateData");
  updateDataParamters.append("command", "updateLeave");
  const { id, updateData } = props;
  const newEntryParams = {
    id,
    api: {
      body: updateDataParamters
    }
  };
  return updateData(newEntryParams).then(response => {
    if (response.apiData && response.apiData.apiData === true) {
      return true;
    } else {
      return false;
    }
  });
}

export function updateLeaveAll(result, props) {
  let updateDataParamters = new FormData();
  updateDataParamters.append("params", JSON.stringify(result));
  updateDataParamters.append("type", "updateData");
  updateDataParamters.append("command", "updateLeaveAll");
  const { updateData } = props;
  const newEntryParams = {
    api: {
      body: updateDataParamters
    }
  };
  return updateData(newEntryParams).then(response => {
    return response;
  });
}

export function deleteLeave(leaveId, props) {
  var deleteDataParamters = new FormData();
  const payload = {
    deleteleave_id: leaveId
  };

  deleteDataParamters.append("params", JSON.stringify(payload));
  deleteDataParamters.append("type", "removeData");
  deleteDataParamters.append("command", "deleteLeave");
  const { id, deleteData } = props;
  const deleteEntryParams = {
    id,
    api: {
      body: deleteDataParamters
    }
  };

  return deleteData(deleteEntryParams).then(response => {
    if (response.apiData && response.apiData.apiData === true) {
      return true;
    } else {
      return false;
    }
  });
}

export function getHeader(exportKeysArray) {
  let reportHead = [];

  exportKeysArray.forEach(element => {
    if (
      element.includes("_Comments") ||
      element === "Employee" ||
      element.includes("Leave") ||
      element.includes("Entitled") ||
      element === "Excess / Balance"
    ) {
      reportHead.push({
        title: element,
        width: { wpx: 100 }
        // fgColor: { rgb: "c2c2c2" }
      });
    } else {
      reportHead.push({
        title: element,
        width: { wpx: 40 }
        // fgColor: { rgb: "c2c2c2" }
      });
    }
  });
  return reportHead;
}

let tableData = {
  rows: []
};

export function dataAbstractionForLeaveManagement(
  rawData,
  billing_json,
  props,
  reportTitle
) {
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

  let tempArr = [];
  // tempArr.push(rawData.exportKeysArray);
  for (let i = 1; i < rawData.rows.length; i++) {
    let resArray = [];
    for (let j = 0; j < rawData.rows[i].length; j++) {
      if (j === 1 || j === 2 || j === 3 || j === 4) {
      } else {
        resArray.push(rawData.rows[i][j]);
      }
    }
    tempArr.push(resArray);
  }

  let headerArr = getHeader(rawData.exportKeysArray);

  const exportExcelData1 = [
    {
      columns: [reportTitle],
      data: []
    },
    {
      columns: headerArr,
      data: []
    },
    {
      xSteps: 0, // Will start putting cell with 1 empty cell on left most
      ySteps: 0, //will put space of 1 rows,
      columns: [], //getReportHead(rawData.exportKeysArray), //tempkeyArray,
      data: tempArr
    }
  ];

  const { updateComponentState } = props;
  updateComponentState(REPORT_SUBMENU_ID, EXPORT_DATA, exportExcelData1);

  return tableData;
}
