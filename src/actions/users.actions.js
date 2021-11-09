import { callApi } from "../components/utils/api.utils.js";

import {
  USERS_FETCH,
  USERS_DELETE,
  USERS_ERROR,
  USERS_ACTIVE,
  USERS_IN_ACTIVE,
  USER_UPDATE,
} from "../constants/action.constants.js";

function onFetch(id, apiData) {
  return { type: USERS_FETCH, id, apiData: apiData };
}

function onUpdate(id, apiData) {
  return { type: USER_UPDATE, id, apiData: apiData };
}

function onDelete(id, apiData) {
  return { type: USERS_DELETE, id, apiData: apiData };
}
function onActive(id, response) {
  return { type: USERS_ACTIVE, id, response };
}
function onInActive(id, response) {
  return { type: USERS_IN_ACTIVE, id, response };
}

function onError(id, apiData) {
  return { type: USERS_ERROR, id, apiData: apiData };
}

export function fetchAllUsers(parameters) {
  let dataLimit = "";
  let dataOffset = "";
  let searchKey = "";

  if (parameters.dataLimit) {
    dataLimit = parameters.dataLimit;
    dataOffset = parameters.dataOffset;
    searchKey = parameters.searchParameterKey;
  }

  const Payload = {
    dataLimit: dataLimit,
    dataOffset: dataOffset,
    searchKey: searchKey,
  };

  const bodyParams = new FormData();
  bodyParams.append("type", "getData");
  bodyParams.append("command", "viewEmployeeList");
  bodyParams.append("params", JSON.stringify(Payload));
  const userParameters = {
    id: parameters.id,
    api: {
      body: bodyParams,
    },
  };

  return function(dispatch) {
    return callApi(userParameters).then((apiData) => {
      if (apiData.isError === false) {
        return dispatch(onFetch(apiData.id, apiData));
      } else {
        return dispatch(onError(apiData.id, apiData));
      }
    });
  };
}

export function deleteData(parameters) {
  return function(dispatch) {
    return callApi(parameters).then((apiData) => {
      if (apiData.isError === false) {
        return dispatch(onDelete(apiData.id, apiData));
      } else {
        return dispatch(onError(apiData.id, apiData));
      }
    });
  };
}

export function activeUsers(parameters) {
  return function(dispatch) {
    return callApi(parameters).then((apiData) => {
      if (apiData.isError === false) {
        return dispatch(onActive(apiData.id, apiData));
      } else {
        return dispatch(onError(apiData.id, apiData));
      }
    });
  };
}

export function inActiveUsers(parameters) {
  return function(dispatch) {
    return callApi(parameters).then((apiData) => {
      if (apiData.isError === false) {
        return dispatch(onInActive(apiData.id, apiData));
      } else {
        return dispatch(onError(apiData.id, apiData));
      }
    });
  };
}

export function deleteUsers(parameters) {
  return function(dispatch) {
    return callApi(parameters).then((apiData) => {
      if (apiData.isError === false) {
        return dispatch(onDelete(apiData.id, apiData));
      } else {
        return dispatch(onError(apiData.id, apiData));
      }
    });
  };
}

export function requestUser(parameters) {
  return function(dispatch) {
    return callApi(parameters).then((apiData) => {
      if (apiData.isError === false) {
        return dispatch(onFetch(apiData.id, apiData));
      } else {
        return dispatch(onError(apiData.id, apiData));
      }
    });
  };
}

export function requestData(parameters) {
  return function(dispatch) {
    return callApi(parameters).then((apiData) => {
      if (apiData.isError === false) {
        return dispatch(onFetch(apiData.id, apiData));
      } else {
        return dispatch(onError(apiData.id, apiData));
      }
    });
  };
}

export function updateData(parameters) {
  return function(dispatch) {
    return callApi(parameters).then((apiData) => {
      if (apiData.isError === false) {
        return dispatch(onUpdate(apiData.id, apiData));
      } else {
        return dispatch(onError(apiData.id, apiData));
      }
    });
  };
}
