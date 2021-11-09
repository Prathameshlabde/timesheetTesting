import {
  LOGIN_DETAILS_FETCH,
  LOGIN_DETAILS_ERROR,
  LOGIN_DETAILS_CLEAR
} from "../../constants/action.constants.js";

import { Map } from "immutable";

const initialState = Map();

function requestApi(id, state, action) {
  const { apiData } = action;
  const dataMap = Map({
    id,
    apiData
  });
  return state.set(id, dataMap);
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

function clearApi(id, state, action) {
  return state.delete(id);
}

function apiStates(state, action, fn) {
  // const { apiData } = action;
  let { id = "" } = action;
  id = id.split(",");

  id.forEach(currentId => {
    state = fn(currentId, state, action);
  });

  return state;
}

export default function dataReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_DETAILS_FETCH: {
      return apiStates(state, action, requestApi);
    }

    case LOGIN_DETAILS_ERROR: {
      return apiStates(state, action, errorApi);
    }
    case LOGIN_DETAILS_CLEAR: {
      return apiStates(state, action, clearApi);
    }
    default: {
      return state;
    }
  }
}
