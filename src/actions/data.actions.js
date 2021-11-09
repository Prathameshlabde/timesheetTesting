import { callApi } from "../components/utils/api.utils.js";

import {
  DATA_REQUEST,
  DATA_UPDATE,
  DATA_DELETE,
  DATA_ERROR,
  DATA_CLEAR
} from "../constants/action.constants.js";

function onRequest(id, apiData) {
  return { type: DATA_REQUEST, id, apiData: apiData };
}

function onUpdate(id, apiData) {
  return { type: DATA_UPDATE, id, apiData: apiData };
}
function onDelete(id, apiData) {
  return { type: DATA_DELETE, id, apiData: apiData };
}

function onError(id, apiData) {
  return { type: DATA_ERROR, id, apiData: apiData };
}

function onClear(id, apiData) {
  return { type: DATA_CLEAR, id, apiData: apiData };
}

export function requestData(parameters) {
  return function(dispatch) {
    return callApi(parameters).then(apiData => {
      if (apiData.isError === false) {
        return dispatch(onRequest(apiData.id, apiData));
      } else {
        return dispatch(onError(apiData.id, apiData));
      }
    });
  };
}

//special case for default projects - forget password
export function requestDataDuplicate(parameters) {
  return function(dispatch) {
    return callApi(parameters).then(apiData => {
      if (apiData.isError === false) {
        return dispatch(onRequest(apiData.id, apiData));
      } else {
        return dispatch(onError(apiData.id, apiData));
      }
    });
  };
}

export function updateData(parameters) {
  return function(dispatch) {
    return callApi(parameters).then(apiData => {
      if (apiData.isError === false) {
        return dispatch(onUpdate(apiData.id, apiData));
      } else {
        return dispatch(onError(apiData.id, apiData));
      }
    });
  };
}

export function deleteData(parameters) {
  return function(dispatch) {
    return callApi(parameters).then(apiData => {
      if (apiData.isError === false) {
        return dispatch(onDelete(apiData.id, apiData));
      } else {
        return dispatch(onError(apiData.id, apiData));
      }
    });
  };
}

export function clearData(parameters) {
  return function(dispatch) {
    dispatch(onClear(parameters.id, parameters));
  };
}
