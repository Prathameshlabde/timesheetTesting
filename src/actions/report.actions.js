import { callApi } from "../components/utils/api.utils.js";

import {
  REPORT_DASHBOARD_FETCH,
  REPORT_DASHBOARD_DELETE,
  REPORT_DASHBOARD_CLEAR,
  REPORT_DASHBOARD_ERROR
} from "../constants/action.constants.js";

function onFetch(id, apiData) {
  return { type: REPORT_DASHBOARD_FETCH, id, apiData: apiData };
}

function onDelete(id) {
  return { type: REPORT_DASHBOARD_DELETE, id };
}

function onClear(id, apiData) {
  return { type: REPORT_DASHBOARD_CLEAR, id, apiData: apiData };
}

function onError(id, apiData) {
  return { type: REPORT_DASHBOARD_ERROR, id, apiData: apiData };
}

export function fetchReport(parameters) {
  return function(dispatch) {
    return callApi(parameters).then(apiData => {
      if (apiData.isError === false) {
        return dispatch(onFetch(apiData.id, apiData));
      } else {
        return dispatch(onError(apiData.id, apiData));
      }
    });
  };
}

export function deleteReport(parameters) {
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

export function clearReport(parameters) {
  return function(dispatch) {
    dispatch(onClear(parameters.id, parameters));
  };
}
