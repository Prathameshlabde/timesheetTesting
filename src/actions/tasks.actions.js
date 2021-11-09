import { callApi } from "../components/utils/api.utils.js";

import {
  TASKS_FETCH,
  TASKS_DELETE,
  TASKS_ERROR,
  TASKS_CLEAR
} from "../constants/action.constants.js";

function onFetch(id, apiData) {
  return { type: TASKS_FETCH, id, apiData: apiData };
}

function onDelete(id) {
  return { type: TASKS_DELETE, id };
}

function onError(id, apiData) {
  return { type: TASKS_ERROR, id, apiData: apiData };
}

function onClear(id, apiData) {
  return { type: TASKS_CLEAR, id, apiData: apiData };
}

export function fetchAllTasks(
  parameters,
  sortBy = "",
  sortType = "",
  selectedProjectId = ""
) {
  let dataLimit = "";
  let dataOffset = "";
  let searchKey = "";
  let selectedProId = "";

  if (parameters) {
    dataLimit = parameters.dataLimit;
    dataOffset = parameters.dataOffset;
    searchKey = parameters.searchParameterKey;
    selectedProId = selectedProjectId;
  }
  const Payload = {
    dataLimit: dataLimit,
    dataOffset: dataOffset,
    searchKey: searchKey,
    sortBy: sortBy,
    sortType: sortType,
    selectedProId: selectedProId
  };
  // console.log("Payload task:-", Payload);
  const bodyParams = new FormData();
  bodyParams.append("type", "getData");
  bodyParams.append("command", "getAllTasks");
  bodyParams.append("params", JSON.stringify(Payload));
  const projectParameters = {
    id: parameters.id,
    api: {
      body: bodyParams
    }
  };

  return function(dispatch) {
    return callApi(projectParameters).then(apiData => {
      if (apiData.isError === false) {
        return dispatch(onFetch(apiData.id, apiData));
      } else {
        return dispatch(onError(apiData.id, apiData));
      }
    });
  };
}

export function fetchTasks(parameters) {
  return function(dispatch) {
    callApi(parameters).then(apiData => {
      if (apiData.isError === false) {
        dispatch(onFetch(apiData.id, apiData));
      } else {
        dispatch(onError(apiData.id, apiData));
      }
    });
  };
}

export function deleteTasks(parameters) {
  return function(dispatch) {
    callApi(parameters).then(apiData => {
      if (apiData.isError === false) {
        dispatch(onDelete(apiData.id, apiData));
      } else {
        dispatch(onError(apiData.id, apiData));
      }
    });
  };
}

export function clearTasks(parameters) {
  return function(dispatch) {
    dispatch(onClear(parameters.id, parameters));
  };
}
