import { callApi } from "../components/utils/api.utils.js";

import {
  PROJECTS_FETCH,
  PROJECTS_DELETE,
  PROJECTS_ERROR,
  PROJECTS_CLEAR,
  PROJECTS_ACTIVE,
  PROJECTS_IN_ACTIVE
} from "../constants/action.constants.js";

function onFetch(id, apiData) {
  return { type: PROJECTS_FETCH, id, apiData: apiData };
}

function onDelete(id, apiData) {
  return { type: PROJECTS_DELETE, id, apiData: apiData };
}
function onActive(id, response) {
  return { type: PROJECTS_ACTIVE, id, response };
}
function onInActive(id, response) {
  return { type: PROJECTS_IN_ACTIVE, id, response };
}

function onError(id, apiData) {
  return { type: PROJECTS_ERROR, id, apiData: apiData };
}

function onClear(id, apiData) {
  return { type: PROJECTS_CLEAR, id, apiData: apiData };
}

export function fetchAllProjects(parameters, sortBy = "", sortType = "") {
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
    searchKey: searchKey,
    sortBy: sortBy,
    sortType: sortType
  };

  const bodyParams = new FormData();
  bodyParams.append("type", "getData");
  bodyParams.append("command", "getAllProjects");
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
        return dispatch(onFetch(apiData.id, apiData));
      } else {
        return dispatch(onError(apiData.id, apiData));
      }
    });
  };
}

export function fetchProjects(parameters) {
  let payload = "";
  if (parameters && parameters.from) {
    payload = {
      from: parameters.from
    };
  }

  const bodyParams = new FormData();
  bodyParams.append("type", "getData");
  bodyParams.append("command", "getActiveProjects");
  bodyParams.append("params", JSON.stringify(payload));
  const projectParameters = {
    id: parameters.id,
    api: {
      body: bodyParams
    }
  };

  return function(dispatch) {
    callApi(projectParameters).then(apiData => {
      if (apiData.isError === false) {
        dispatch(onFetch(apiData.id, apiData));
      } else {
        dispatch(onError(apiData.id, apiData));
      }
    });
  };
}

//active and inactive red
export function fetchProjectsDashboard(parameters) {
  const bodyParams = new FormData();
  let payload = "";
  if (parameters && parameters.from) {
    payload = {
      from: parameters.from
    };
  }

  bodyParams.append("type", "getData");
  bodyParams.append("command", "getActiveDashboardProjects");
  bodyParams.append("params", JSON.stringify(payload));
  const projectParameters = {
    id: parameters.id,
    api: {
      body: bodyParams
    }
  };

  return function(dispatch) {
    callApi(projectParameters).then(apiData => {
      if (apiData.isError === false) {
        dispatch(onFetch(apiData.id, apiData));
      } else {
        dispatch(onError(apiData.id, apiData));
      }
    });
  };
}

export function activeProjects(parameters) {
  return function(dispatch) {
    return callApi(parameters).then(apiData => {
      if (apiData.isError === false) {
        return dispatch(onActive(apiData.id, apiData));
        // return apiData;
      } else {
        return dispatch(onError(apiData.id, apiData));
        // return apiData;
      }
    });
  };
}

export function inActiveProjects(parameters) {
  return function(dispatch) {
    return callApi(parameters).then(apiData => {
      if (apiData.isError === false) {
        return dispatch(onInActive(apiData.id, apiData));
        // return apiData;
      } else {
        return dispatch(onError(apiData.id, apiData));
        // return apiData;
      }
    });
  };
}

export function deleteProjects(parameters) {
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

export function clearProjects(parameters) {
  return function(dispatch) {
    dispatch(onClear(parameters.id, parameters));
  };
}

export function activeSwitch(parameters) {
  return function(dispatch) {
    return callApi(parameters).then(apiData => {
      if (apiData.isError === false) {
        return dispatch(onActive(apiData.id, apiData));
        // return apiData;
      } else {
        return dispatch(onError(apiData.id, apiData));
        // return apiData;
      }
    });
  };
}

export function inActiveSwitch(parameters) {
  return function(dispatch) {
    return callApi(parameters).then(apiData => {
      if (apiData.isError === false) {
        return dispatch(onInActive(apiData.id, apiData));
        // return apiData;
      } else {
        return dispatch(onError(apiData.id, apiData));
        // return apiData;
      }
    });
  };
}
