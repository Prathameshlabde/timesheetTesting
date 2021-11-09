import {
  LOADER_ID,
  LOADER_SHOW,
  HOLIDAYS_MODULE_ID
} from "../../../constants/app.constants";

export function fetchHolidayListFromUtils(props, year) {
  const { id, requestData, updateComponentState } = props;
  updateComponentState(LOADER_ID, LOADER_SHOW, {
    showLoader: true
  });

  let BodyParams = new FormData();
  const Payload = {
    year: year
  };

  BodyParams.append("params", JSON.stringify(Payload));
  BodyParams.append("type", "getData");
  BodyParams.append("command", "getHolidayList");

  const Params = {
    id,
    api: {
      body: BodyParams
    }
  };

  requestData(Params).then(response => {
    if (response.apiData && response.apiData.isFetching === false) {
      updateComponentState(LOADER_ID, LOADER_SHOW, {
        showLoader: false
      });
    }
  });
}

export function fetchHolidayDataFromUtils(props, entryID) {
  const { requestData, updateComponentState } = props;
  updateComponentState(LOADER_ID, LOADER_SHOW, {
    showLoader: true
  });

  let BodyParams = new FormData();
  const Payload = {
    hid: entryID
  };

  BodyParams.append("params", JSON.stringify(Payload));
  BodyParams.append("type", "getData");
  BodyParams.append("command", "getSingleHolidayData");

  const Params = {
    id: HOLIDAYS_MODULE_ID,
    api: {
      body: BodyParams
    }
  };

  requestData(Params).then(response => {
    if (response.apiData && response.apiData.isFetching === false) {
      updateComponentState(LOADER_ID, LOADER_SHOW, {
        showLoader: false
      });
    }
  });
}
export function addNewHoliday(props, state) {
  const { id, requestData } = props;

  const { description, holiday_date, selectedType } = state;

  // console.log("selectedType in add new = ", selectedType);

  let finalSelectedType = "";
  if (selectedType === "1") {
    finalSelectedType = "Normal";
  } else {
    finalSelectedType = "Optional";
  }

  let BodyParams = new FormData();
  const Payload = {
    type: finalSelectedType,
    date: holiday_date.format("YYYY/MM/DD"),
    description
  };

  BodyParams.append("params", JSON.stringify(Payload));
  BodyParams.append("type", "addData");
  BodyParams.append("command", "addHoliday");

  const Params = {
    id,
    api: {
      body: BodyParams
    }
  };

  return requestData(Params).then(response => {
    if (response.apiData && response.apiData.apiData === true) {
      fetchHolidayListFromUtils(props, state.year);

      return true;
    } else if (response.apiData && response.apiData.apiData === "duplicate") {
      return "duplicate";
    } else {
      return false;
    }
  });
}
export function updateHoliday(props, state) {
  const { id, requestData } = props;

  const { description, holiday_date, idToEdit, selectedType } = state;

  let finalSelectedType = "";
  if (selectedType === "1") {
    finalSelectedType = "Normal";
  } else {
    finalSelectedType = "Optional";
  }

  let BodyParams = new FormData();
  const Payload = {
    hid: idToEdit,
    type: finalSelectedType,
    date: holiday_date.format("YYYY/MM/DD"),
    description
  };

  BodyParams.append("params", JSON.stringify(Payload));
  BodyParams.append("type", "updateData");
  BodyParams.append("command", "updateHoliday");

  const Params = {
    id,
    api: {
      body: BodyParams
    }
  };

  return requestData(Params).then(response => {
    if (response.apiData && response.apiData.apiData === true) {
      fetchHolidayListFromUtils(props, state.year);
      return true;
    } else if (response.apiData && response.apiData.apiData === "duplicate") {
      return "duplicate";
    } else {
      return false;
    }
  });
}

export function deleteHoliday(idToDelete, props) {
  var deleteDataParamters = new FormData();
  const payload = {
    hid: idToDelete
  };

  deleteDataParamters.append("params", JSON.stringify(payload));
  deleteDataParamters.append("type", "removeData");
  deleteDataParamters.append("command", "deleteHoliday");
  const { id, deleteData } = props;
  const deleteEntryParams = {
    id,
    api: {
      body: deleteDataParamters
    }
  };
  return deleteData(deleteEntryParams).then(response => {
    if (response.apiData && response.apiData.apiData === true) {
      return true;
    } else {
      return false;
    }
  });
}
