import { callApi } from "../components/utils/api.utils.js";

import {
  CATEGORIES_FETCH,
  CATEGORIES_DELETE,
  CATEGORIES_ERROR,
  CATEGORIES_CLEAR,
  CATEGORIES_UPDATE
} from "../constants/action.constants.js";

function onFetch(id, apiData) {
  return { type: CATEGORIES_FETCH, id, apiData: apiData };
}

function onUpdate(id, apiData) {
  return { type: CATEGORIES_UPDATE, id, apiData: apiData };
}

function onDelete(id, apiData) {
  return { type: CATEGORIES_DELETE, id, apiData: apiData };
}

function onError(id, apiData) {
  return { type: CATEGORIES_ERROR, id, apiData: apiData };
}

function onClear(id, apiData) {
  return { type: CATEGORIES_CLEAR, id, apiData: apiData };
}

//used in catagories sub module index js
export function fetchAllCategories(parameters, sortBy = "", sortType = "") {
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

  // console.log("Payload categories:-", Payload);
  const bodyParams = new FormData();
  bodyParams.append("type", "getData");
  bodyParams.append("command", "getAllCategories");
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
        // console.log("Not in error API Data", apiData);
        return dispatch(onFetch(apiData.id, apiData));
      } else {
        // console.log("in error API Data", apiData);
        return dispatch(onError(apiData.id, apiData));
      }
    });
  };
}

export function addCateroies(parameters) {
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

export function updateCateroies(parameters) {
  return function(dispatch) {
    return callApi(parameters).then(apiData => {
      if (apiData.isError === false) {
        return dispatch(onUpdate(apiData.id, apiData));
      } else {
        return dispatch(onError(apiData.id, apiData));
      }
    });
  };
}

//used in new task
export function fetchCategories(parameters) {
  return function(dispatch) {
    callApi(parameters).then(apiData => {
      if (apiData.isError === false) {
        dispatch(onFetch(apiData.id, apiData));
      } else {
        dispatch(onError(apiData.id, apiData));
      }
    });
  };
}

export function deleteCategories(parameters) {
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

export function clearCategories(parameters) {
  return function(dispatch) {
    dispatch(onClear(parameters.id, parameters));
  };
}
