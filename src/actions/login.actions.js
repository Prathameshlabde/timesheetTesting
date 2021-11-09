import { callApi } from "../components/utils/api.utils.js";

import {
  LOGIN_DETAILS_FETCH,
  LOGIN_DETAILS_ERROR,
  LOGIN_DETAILS_CLEAR
} from "../constants/action.constants.js";

function onRequest(id, apiData) {
  return { type: LOGIN_DETAILS_FETCH, id, apiData: apiData };
}

function onError(id, apiData) {
  return { type: LOGIN_DETAILS_ERROR, id, apiData: apiData };
}

function onClear(id, apiData) {
  return { type: LOGIN_DETAILS_CLEAR, id, apiData: apiData };
}

export function requestData(parameters) {
  return function(dispatch) {
    callApi(parameters).then(apiData => {
      if (apiData.isError === false) {
        dispatch(onRequest(apiData.id, apiData));
      } else {
        dispatch(onError(apiData.id, apiData));
      }
    });
  };
}

export function clearData(parameters) {
  return function(dispatch) {
    dispatch(onClear(parameters.id, parameters));
  };
}
