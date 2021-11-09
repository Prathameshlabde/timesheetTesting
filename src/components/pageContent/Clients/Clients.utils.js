import { LOADER_ID, LOADER_SHOW } from "../../../constants/app.constants";

export function fetchClientFromUtils(props, state) {
  const { id, fetchAllClients, updateComponentState } = props;
  const { dataLimit, dataOffset, searchParameterKey } = state;

  updateComponentState(LOADER_ID, LOADER_SHOW, {
    showLoader: true
  });

  let clientParameters = {
    id,
    dataLimit,
    dataOffset,
    searchParameterKey
  };

  if (searchParameterKey && searchParameterKey !== "") {
    clientParameters = {
      id,
      dataLimit: "",
      dataOffset: "",
      searchParameterKey
    };
  }

  fetchAllClients(clientParameters).then(response => {
    if (response.apiData && response.apiData.isFetching === false) {
      updateComponentState(LOADER_ID, LOADER_SHOW, {
        showLoader: false
      });
    }
  });
}

export function fetchSingleDataFromUtils(entryID, onIdToFectch, props) {
  const { requestData } = props;
  let BodyParams = new FormData();
  const Payload = {
    client_id: entryID
  };

  BodyParams.append("params", JSON.stringify(Payload));
  BodyParams.append("type", "getData");
  BodyParams.append("command", "getSingleClientData");

  const Params = {
    id: onIdToFectch,
    api: {
      body: BodyParams
    }
  };

  requestData(Params);
}

export function addNewClient(
  firstName,
  lastName,
  companyName,
  userName,
  userPassword,
  props,
  state
) {
  let addDataParamters = new FormData();
  const payload = {
    firstName,
    lastName,
    companyName,
    userName,
    userPassword
  };

  addDataParamters.append("params", JSON.stringify(payload));
  addDataParamters.append("type", "addData");
  addDataParamters.append("command", "addClient");

  const { id, requestData } = props;
  const newEntryParams = {
    id,
    api: {
      body: addDataParamters
    }
  };

  return requestData(newEntryParams).then(response => {
    if (response.apiData && response.apiData.apiData === true) {
      fetchClientFromUtils(props, state);
      return true;
    } else if (response.apiData && response.apiData.apiData === "duplicate") {
      return "duplicate";
    } else {
      return false;
    }
  });
}

export function updateClient(
  clientId,
  firstName,
  lastName,
  companyName,
  userName,
  userPassword,
  props,
  state
) {
  let updateDataParamters = new FormData();

  const payload = {
    clientId,
    firstName,
    lastName,
    companyName,
    userName,
    userPassword
  };

  updateDataParamters.append("params", JSON.stringify(payload));
  updateDataParamters.append("type", "updateData");
  updateDataParamters.append("command", "updateClient");
  const { id, updateData } = props;
  const updateEntryParams = {
    id,
    api: {
      body: updateDataParamters
    }
  };

  return updateData(updateEntryParams).then(response => {
    if (response.apiData && response.apiData.apiData === true) {
      fetchClientFromUtils(props, state);
      return true;
    } else if (response.apiData && response.apiData.apiData === "duplicate") {
      return "duplicate";
    } else {
      return false;
    }
  });
}

export function deleteClient(clientID, props) {
  var deleteDataParamters = new FormData();
  const payload = {
    client_id: clientID
  };

  deleteDataParamters.append("params", JSON.stringify(payload));
  deleteDataParamters.append("type", "removeData");
  deleteDataParamters.append("command", "deleteClient");
  const { id, deleteData } = props;
  const deleteEntryParams = {
    id,
    api: {
      body: deleteDataParamters
    }
  };
  return deleteData(deleteEntryParams).then(response => {
    if (response.apiData && response.apiData.apiData === true) {
      // fetchCategoriesFromUtils(props, state);
      return true;
    } else {
      return false;
    }
  });
}
