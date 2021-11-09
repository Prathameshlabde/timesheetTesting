import { LOADER_ID, LOADER_SHOW } from "../../../../constants/app.constants";

export function fetchBalanceLeavesFromUtils(props, current_year) {
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
  BodyParams.append("command", "getBalanceLeaves");

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

export function applyLeave(Payload, props) {
  // console.log("Payload :-", Payload);

  const { requestData, updateComponentState } = props;
  updateComponentState(LOADER_ID, LOADER_SHOW, {
    showLoader: true
  });

  let BodyParams = new FormData();

  BodyParams.append("params", JSON.stringify(Payload));
  BodyParams.append("type", "addData");
  BodyParams.append("command", "applyLeave");

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
    return response;
  });
}
