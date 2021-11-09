import { callApi } from "../components/utils/api.utils.js";

import {
  SPRINTS_FETCH,
  SPRINTS_DELETE,
  SPRINTS_ERROR,
  SPRINTS_CLEAR
} from "../constants/action.constants.js";

function onFetch(id, apiData) {
  return { type: SPRINTS_FETCH, id, apiData: apiData };
}

function onDelete(id) {
  return { type: SPRINTS_DELETE, id };
}

function onError(id, apiData) {
  return { type: SPRINTS_ERROR, id, apiData: apiData };
}

function onClear(id, apiData) {
  return { type: SPRINTS_CLEAR, id, apiData: apiData };
}

export function fetchAllSprints(
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

  const bodyParams = new FormData();
  bodyParams.append("type", "getData");
  bodyParams.append("command", "getAllSprints");
  bodyParams.append("params", JSON.stringify(Payload));

  const projectParameters = {
    id: parameters.id,
    api: {
      body: bodyParams
    }
  };

  return function(dispatch) {
    return callApi(projectParameters).then(apiData => {
      // console.log(" apiData is :-", apiData);
      if (apiData.isError === false) {
        return dispatch(onFetch(apiData.id, apiData));
      } else {
        return dispatch(onError(apiData.id, apiData));
      }
    });
  };
}

export function fetchSprints(parameters) {
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

export function deleteSprints(parameters) {
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

export function clearSprints(parameters) {
  return function(dispatch) {
    dispatch(onClear(parameters.id, parameters));
  };
}
