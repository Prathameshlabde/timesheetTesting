import type { ID } from "flow/action.type";

import {
  CLEAR_COMPONENT_STATE,
  UPDATE_COMPONENT_STATE,
  DELETE_COMPONENT_STATE
} from "../constants/action.constants.js";

function updateState(id: ID, prop, value) {
  return { type: UPDATE_COMPONENT_STATE, id, payload: { prop, value } };
}

function clearState(id: ID, prop) {
  return { type: CLEAR_COMPONENT_STATE, payload: { prop }, id };
}

function deleteState(id: ID) {
  return { type: DELETE_COMPONENT_STATE, id };
}

export function updateComponentState(id, prop, value) {
  // console.log("in updateComponentState id = ", id);
  // console.log("in updateComponentState prop = ", prop);
  // console.log("in updateComponentState value = ", value);
  return function(dispatch) {
    dispatch(updateState(id, prop, value));
  };
}

export function clearComponentState(id, prop) {
  return function(dispatch) {
    dispatch(clearState(id, prop));
  };
}

export function deleteComponentState(id) {
  return function(dispatch) {
    dispatch(deleteState(id));
  };
}
