import { callApi } from "../components/utils/api.utils.js";

import {
  SUBTASKS_FETCH,
  SUBTASKS_DELETE,
  SUBTASKS_ERROR,
  SUBTASKS_CLEAR
} from "../constants/action.constants.js";

function onFetch(id, apiData) {
  return { type: SUBTASKS_FETCH, id, apiData: apiData };
}

function onDelete(id) {
  return { type: SUBTASKS_DELETE, id };
}

function onError(id, apiData) {
  return { type: SUBTASKS_ERROR, id, apiData: apiData };
}

function onClear(id, apiData) {
  return { type: SUBTASKS_CLEAR, id, apiData: apiData };
}

export function fetchAllSubTasks(parameters, sortBy = "", sortType = "", selectedProjectId = "") {
  let dataLimit = "";
  let dataOffset = "";
  let searchKey = "";
  let selecetProId = "";

  if (parameters) {
    dataLimit = parameters.dataLimit;
    dataOffset = parameters.dataOffset;
    searchKey = parameters.searchParameterKey;
    selecetProId = selectedProjectId
  }
  const Payload = {
    dataLimit: dataLimit,
    dataOffset: dataOffset,
    searchKey: searchKey,
    sortBy: sortBy,
    sortType: sortType,
    selectedProId: selecetProId
  };

  const bodyParams = new FormData();
  bodyParams.append("type", "getData");
  bodyParams.append("command", "getAllSubTasks");
  bodyParams.append("params", JSON.stringify(Payload));
  const projectParameters = {
    id: parameters.id,
    api: {
      body: bodyParams
    }
  };

  return function (dispatch) {
    return callApi(projectParameters).then(apiData => {
      if (apiData.isError === false) {
        return dispatch(onFetch(apiData.id, apiData));
      } else {
        return dispatch(onError(apiData.id, apiData));
      }
    });
  };
}

export function fetchSubTasks(parameters) {
  return function (dispatch) {
    callApi(parameters).then(apiData => {
      if (apiData.isError === false) {
        dispatch(onFetch(apiData.id, apiData));
      } else {
        dispatch(onError(apiData.id, apiData));
      }
    });
  };
}

export function deleteSubTasks(parameters) {
  return function (dispatch) {
    callApi(parameters).then(apiData => {
      if (apiData.isError === false) {
        dispatch(onDelete(apiData.id, apiData));
      } else {
        dispatch(onError(apiData.id, apiData));
      }
    });
  };
}

export function clearSubTasks(parameters) {
  return function (dispatch) {
    dispatch(onClear(parameters.id, parameters));
  };
}
