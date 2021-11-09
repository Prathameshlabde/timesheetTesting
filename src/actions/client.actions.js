import { callApi } from "../components/utils/api.utils.js";

import {
  CLIENT_REQUEST,
  CLIENT_UPDATE,
  CLIENT_DELETE,
  CLIENT_ERROR,
  CLIENT_CLEAR
} from "../constants/action.constants.js";

function onRequest(id, apiData) {
  return { type: CLIENT_REQUEST, id, apiData: apiData };
}

function onUpdate(id, apiData) {
  return { type: CLIENT_UPDATE, id, apiData: apiData };
}
function onDelete(id) {
  return { type: CLIENT_DELETE, id };
}

function onError(id, apiData) {
  return { type: CLIENT_ERROR, id, apiData: apiData };
}

function onClear(id, apiData) {
  return { type: CLIENT_CLEAR, id, apiData: apiData };
}

export function fetchAllClients(parameters) {
  let dataLimit = "";
  let dataOffset = "";
  let searchKey = "";

  if (parameters) {
    dataLimit = parameters.dataLimit;
    dataOffset = parameters.dataOffset;
    searchKey = parameters.searchParameterKey;
  }

  const Payload = {
    dataLimit: dataLimit,
    dataOffset: dataOffset,
    searchKey: searchKey
  };

  const bodyParams = new FormData();
  bodyParams.append("type", "getData");
  bodyParams.append("command", "getAllClients");
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
        return dispatch(onRequest(apiData.id, apiData));
      } else {
        return dispatch(onError(apiData.id, apiData));
      }
    });
  };
}

export function requestClients(parameters) {
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

export function updateClient(parameters) {
  return function(dispatch) {
    callApi(parameters).then(apiData => {
      if (apiData.isError === false) {
        dispatch(onUpdate(apiData.id, apiData));
      } else {
        dispatch(onError(apiData.id, apiData));
      }
    });
  };
}

export function deleteClient(parameters) {
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

export function clearClient(parameters) {
  return function(dispatch) {
    dispatch(onClear(parameters.id, parameters));
  };
}
