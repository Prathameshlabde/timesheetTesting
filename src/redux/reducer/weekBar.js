import {
  REPORT_WEEK_DASHBOARD_FETCH,
  REPORT_WEEK_DASHBOARD_DELETE,
  REPORT_WEEK_DASHBOARD_CLEAR,
  REPORT_WEEK_DASHBOARD_ERROR
} from "../../constants/action.constants.js";

import { Map } from "immutable";

const initialState = Map();

function fetchApi(id, state, action) {
  const { apiData } = action;
  const dataMap = Map({
    id,
    apiData,
    isFetching: false,
    isError: false
  });

  return state.set(id, dataMap);
}

function clearApi(id, state, action) {
  // const { id } = action;
  // const dataMap = Map({
  //   id,
  //   apiData,
  //   isFetching: false,
  //   isError: false
  // });
  // state.delete(id);
  return state.delete(id);
}

function errorApi(id, state, action) {
  const { apiData } = action;
  const errorData = apiData.json;

  const dataMap = Map({
    id,
    isFetching: false,
    isError: true,
    errorData,
    apiData
  });

  return state.set(id, dataMap);
}

function apiStates(state, action, fn) {
  let { id = "" } = action;
  id = id.split(",");
  id.forEach(currentId => {
    state = fn(currentId, state, action);
  });
  return state;
}

export default function dataReducer(state = initialState, action) {
  switch (action.type) {
    case REPORT_WEEK_DASHBOARD_FETCH: {
      // return receiveApi(state, action);
      return apiStates(state, action, fetchApi);
    }
    case REPORT_WEEK_DASHBOARD_DELETE: {
      // return deleteStateOnApi(state, action);
      const { id } = action;
      return state.delete(id);
    }
    case REPORT_WEEK_DASHBOARD_CLEAR: {
      // return errorStateOnApi(state, action);
      return apiStates(state, action, clearApi);
    }
    case REPORT_WEEK_DASHBOARD_ERROR: {
      // return errorStateOnApi(state, action);
      return apiStates(state, action, errorApi);
    }

    default: {
      return state;
    }
  }
}
