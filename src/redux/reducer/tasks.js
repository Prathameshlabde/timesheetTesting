import {
  TASKS_FETCH,
  TASKS_DELETE,
  TASKS_ERROR,
  TASKS_CLEAR
} from "../../constants/action.constants.js";

import { Map } from "immutable";

const initialState = Map();

function fetchApi(id, state, action) {
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
  let { id = "" } = action;
  id = id.split(",");
  id.forEach(currentId => {
    state = fn(currentId, state, action);
  });
  return state;
}

export default function dataReducer(state = initialState, action) {
  switch (action.type) {
    case TASKS_FETCH: {
      // return receiveApi(state, action);
      return apiStates(state, action, fetchApi);
    }
    case TASKS_DELETE: {
      // return deleteStateOnApi(state, action);
      const { id } = action;
      return state.delete(id);
    }
    case TASKS_ERROR: {
      // return errorStateOnApi(state, action);
      return apiStates(state, action, errorApi);
    }
    case TASKS_CLEAR: {
      return apiStates(state, action, clearApi);
    }

    default: {
      return state;
    }
  }
}
