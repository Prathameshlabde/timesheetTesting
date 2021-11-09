import { LOADER_ID, LOADER_SHOW } from "../../../../constants/app.constants";
import { getDatesArrayFromRange } from "../../../utils/calender.utils";

export function fetchLeaveApplicationsFromUtils(props, team_name) {
  const { id, requestData, updateComponentState } = props;
  updateComponentState(LOADER_ID, LOADER_SHOW, {
    showLoader: true,
  });

  let BodyParams = new FormData();
  const Payload = {
    team_name: team_name,
  };

  BodyParams.append("params", JSON.stringify(Payload));
  BodyParams.append("type", "getLeaveManagement");
  BodyParams.append("command", "getLeaveApplications");

  const Params = {
    id,
    api: {
      body: BodyParams,
    },
  };

  requestData(Params).then((response) => {
    if (response.apiData && response.apiData.isFetching === false) {
      updateComponentState(LOADER_ID, LOADER_SHOW, {
        showLoader: false,
      });
    }
  });
}

export function updateLeave(idtoUpdate, rowObject, props) {
  const { requestData, updateComponentState } = props;
  // console.log("rowObject in updateLeave = ", rowObject);
  let startDate = rowObject.columns[2].values[0].value;
  let endDate = rowObject.columns[3].values[0].value;
  let tlApprovel = rowObject.columns[6].values[0].value;
  let hrApprovel = rowObject.columns[7].values[0].value;
  let tlHrComments = rowObject.columns[8].values[0].value;
  const emp_id = rowObject.columns[11].value;

  const fdateArr = getDatesArrayFromRange(startDate, endDate);

  if (tlApprovel === "") {
    tlApprovel = 3;
  }

  if (hrApprovel === "") {
    hrApprovel = 3;
  }

  const payload = {
    leaveapp_id: idtoUpdate,
    start_date: startDate,
    end_date: endDate,
    tl_approval: tlApprovel,
    hr_approval: hrApprovel,
    tl_hr_comments: tlHrComments,
    approvedflag: "",
    emp_id,
    fdateArr,
  };

  updateComponentState(LOADER_ID, LOADER_SHOW, {
    showLoader: true,
  });

  let BodyParams = new FormData();

  BodyParams.append("params", JSON.stringify(payload));
  BodyParams.append("type", "updateData");
  BodyParams.append("command", "updateLeaveApplication");

  const Params = {
    api: {
      body: BodyParams,
    },
  };

  return requestData(Params).then((response) => {
    if (response.apiData && response.apiData.isFetching === false) {
      updateComponentState(LOADER_ID, LOADER_SHOW, {
        showLoader: false,
      });
    }
    return response;
  });
}

export function deleteLeaveApplication(leaveId, props) {
  var deleteDataParamters = new FormData();
  const payload = {
    deleteleaveapp_id: leaveId,
  };

  deleteDataParamters.append("params", JSON.stringify(payload));
  deleteDataParamters.append("type", "removeData");
  deleteDataParamters.append("command", "deleteLeaveApplication");
  const { deleteData } = props;
  const deleteEntryParams = {
    api: {
      body: deleteDataParamters,
    },
  };

  return deleteData(deleteEntryParams).then((response) => {
    if (response.apiData && response.apiData.apiData === true) {
      return true;
    } else {
      return false;
    }
  });
}
