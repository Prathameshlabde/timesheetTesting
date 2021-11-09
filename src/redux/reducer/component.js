// @flow
import {
  CLEAR_COMPONENT_STATE,
  UPDATE_COMPONENT_STATE,
  DELETE_COMPONENT_STATE
} from "../../constants/action.constants.js";
import { Map } from "immutable";

const initialState = Map();

function updateState(state, action) {
  const { id, payload } = action;
  const { prop, value } = payload;
  return state.setIn([id, prop], value);
}

function clearState(state, action) {
  const { id, payload } = action;
  const { prop } = payload;

  return state.deleteIn([id, prop]);
}

function deleteState(state, action) {
  const { id } = action;
  return state.delete(id);
}

export default function componentReducer(state = initialState, action) {
  switch (action.type) {
    case CLEAR_COMPONENT_STATE: {
      return clearState(state, action);
    }
    case UPDATE_COMPONENT_STATE: {
      return updateState(state, action);
    }
    case DELETE_COMPONENT_STATE: {
      return deleteState(state, action);
    }
    default: {
      return state;
    }
  }
}
