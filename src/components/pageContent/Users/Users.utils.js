import colors from "../../common/colors";

import {
  USERS_MODULE_ID_2,
  USERS_ID,
  LOADER_ID,
  LOADER_SHOW,
} from "../../../constants/app.constants";
import Colors from "../../common/colors";
import { isMetaProduct, isEmpty } from "../../utils/common.utils";

export function getPageCount(totalRecords, dataLimit) {
  if (totalRecords) {
    let totalCountPage = 0;
    let tempCount = totalRecords / dataLimit;
    if (tempCount < 0) {
      totalCountPage = 1;
      return totalCountPage;
    } else {
      totalCountPage = Math.ceil(tempCount);
      return totalCountPage;
    }
  }
}

export const spanStyleHeader = {
  color: "#4a4a4a",
  fontWeight: "bold",
  fontSize: "20px",
};

export const textFieldStyle = {
  textfieldSmall: {
    width: "90%",
    color: Colors.textColor,
  },
  textfieldPM: {
    width: "100%",
    boxShadow: `${colors.boxShadowTextfield} 0px 2px 2px 0px`,
    backgroundColor: colors.teftFieldBackground,
    border: `1px solid ${colors.grayColorBorder}`,
    height: "30%",
    fontSize: "12px",
    paddingleft: "3px",
    color: Colors.textColor,
  },
  textfieldLarge: {
    width: "80%",
    boxShadow: `${colors.boxShadowTextfield} 0px 2px 2px 0px`,
    backgroundColor: colors.teftFieldBackground,
    border: `1px solid ${colors.grayColorBorder}`,
    height: "25px",
    fontSize: "12px",
    paddingleft: "3px",
    color: Colors.textColor,
  },
};

const spanLabel = {
  id: "lbl",
  maxFont: 14,
  minFont: 5.5,
  className: "span-label",
};

export function getPropsspanLabel() {
  return spanLabel;
}

const dropDownStyle = {
  width: "92%",
};

const dropDown = {
  style: dropDownStyle,
};

export function getPropsDropdown() {
  return dropDown;
}

const todayDate =
  new Date().getFullYear() +
  "-" +
  ("0" + (new Date().getMonth() + 1)).slice(-2) +
  "-" +
  ("0" + new Date().getDate()).slice(-2);

const datePickerStyles = {
  width: "80%",
};

const datePicker = {
  currentDate: todayDate,
  style: datePickerStyles,
};

export function getPropsDatePicker() {
  return datePicker;
}

const closeButton = {
  id: "btn",
  data: "Cancel",
  width: "100%",
  className: "button-cancel",
};

export function getPropsButtonClose() {
  return closeButton;
}

const submitButton = {
  id: "btn",
  data: "Submit",
  className: "button-submitEntry",
};

export function getPropsButtonSubmit() {
  return submitButton;
}

export function checkUserExist(props, state) {
  let addDataParamters = new FormData();
  const { uname } = state;

  const payload = {
    uname,
  };
  // console.log("Payload :-", payload);
  addDataParamters.append("params", JSON.stringify(payload));
  addDataParamters.append("type", "getData");
  addDataParamters.append("command", "checkUserExist");

  const { USERS_NEW_ENTRY, requestData } = props;
  const checkUserParams = {
    USERS_NEW_ENTRY,
    api: {
      body: addDataParamters,
    },
  };

  requestData(checkUserParams);
}

export function addNewUser(props, state, dataOffset) {
  let addDataParamters = new FormData();
  const {
    fname,
    lname,
    uname,
    password,
    email_id,
    role,
    team_name,
    join_date,
    last_date,
    is_reminder,
    team_emp,
    leavesPerMonth
  } = state;

  let jdate = "";
  if (typeof join_date !== "string") {
    jdate = join_date.format("YYYY-MM-DD");
  } else {
    jdate = join_date;
  }

  let ldate = "";
  if (typeof last_date !== "string") {
    ldate = last_date.format("YYYY-MM-DD");
  } else {
    ldate = last_date;
  }

  const payload = {
    fname,
    lname,
    uname,
    password,
    email_id,
    role,
    team_name,
    join_date: jdate,
    last_date: ldate,
    is_reminder: is_reminder,
    team_emp: team_emp,
    isMetaProduct: isMetaProduct(),
    leavesPerMonth
  };
  // console.log("Payload :-", payload);
  addDataParamters.append("params", JSON.stringify(payload));
  addDataParamters.append("type", "addData");
  addDataParamters.append("command", "addNewUser");

  const { USERS_NEW_ENTRY, requestData } = props;
  const newEntryParams = {
    USERS_NEW_ENTRY,
    api: {
      body: addDataParamters,
    },
  };

  return requestData(newEntryParams).then((response) => {
    if (response.apiData && response.apiData.apiData === true) {
      fetchUsersFromUtils(
        props,
        dataOffset.dataLimit,
        dataOffset.dataOffset,
        dataOffset.searchParameterKey
      );
      return true;
    } else if (response.apiData && response.apiData.apiData === "duplicate") {
      return "duplicate";
    } else {
      return false;
    }
  });
}

export function fetchUsersFromUtils(
  props,
  dataLimit,
  dataOffset,
  searchParameterKey
) {
  const { fetchAllUsers, updateComponentState } = props;

  // const { dataLimit, dataOffset, searchParameterKey } = state;
  updateComponentState(LOADER_ID, LOADER_SHOW, {
    showLoader: true,
  });

  const userParameters = {
    id: USERS_ID,
    dataLimit,
    dataOffset,
    searchParameterKey,
  };

  fetchAllUsers(userParameters).then((response) => {
    if (response.apiData && response.apiData.isFetching === false) {
      updateComponentState(LOADER_ID, LOADER_SHOW, {
        showLoader: false,
      });
    }
  });
}

export function fetchEntryDataFromUtils(entryID, props) {
  const { requestData } = props;

  let BodyParams = new FormData();
  const Payload = {
    emp_id: entryID,
  };

  BodyParams.append("params", JSON.stringify(Payload));
  BodyParams.append("type", "getData");
  BodyParams.append("command", "getSingleUserData");
  const Params = {
    id: USERS_MODULE_ID_2,
    api: {
      body: BodyParams,
    },
  };

  requestData(Params);
}

export function updateUser(entryID, props, state, dataOffset) {
  let updateDataParamters = new FormData();
  const {
    fname,
    lname,
    uname,
    password,
    email_id,
    role,
    team_name,
    join_date,
    last_date,
    is_reminder,
    team_emp,
    leavesPerMonth
  } = state;

  let isEmailChanged = false;
  if (!isEmpty(state.ogfetchedData)) {
    if (email_id !== state.ogfetchedData.email_id) {
      isEmailChanged = true;
    }
  }

  let jdate = "";
  if (typeof join_date !== "string") {
    jdate = join_date.format("YYYY-MM-DD");
  } else {
    jdate = join_date;
  }

  let ldate = "";
  if (typeof last_date !== "string") {
    ldate = last_date.format("YYYY-MM-DD");
  } else {
    ldate = last_date;
  }

  const payload = {
    fname,
    lname,
    uname,
    password,
    email_id,
    role,
    team_name,
    join_date: jdate,
    last_date: ldate,
    emp_id: entryID,
    is_reminder: is_reminder,
    team_emp: team_emp,
    isMetaProduct: isMetaProduct(),
    isEmailChanged,
    leavesPerMonth
  };

  updateDataParamters.append("params", JSON.stringify(payload));
  updateDataParamters.append("type", "updateData");
  updateDataParamters.append("command", "updateUser");
  const { id, updateData } = props;
  const newEntryParams = {
    id,
    api: {
      body: updateDataParamters,
    },
  };

  return updateData(newEntryParams).then((response) => {
    // console.log("response.apiData && response.apiData.apiData", response);
    if (response.apiData && response.apiData.apiData === true) {
      // console.log
      fetchUsersFromUtils(
        props,
        dataOffset.dataLimit,
        dataOffset.dataOffset,
        dataOffset.searchParameterKey
      );
      return true;
    } else if (response.apiData && response.apiData.apiData === "duplicate") {
      return "duplicate";
    } else {
      return false;
    }
  });
}

export function deleteUser(userID, props, dataOffset) {
  // console.log(userID, props);
  // console.log("in delete entry");
  var deleteDataParamters = new FormData();
  const payload = {
    emp_id: userID,
  };

  deleteDataParamters.append("params", JSON.stringify(payload));
  deleteDataParamters.append("type", "removeData");
  deleteDataParamters.append("command", "deleteUser");
  const { id, deleteData } = props;
  const deleteEntryParams = {
    id,
    api: {
      body: deleteDataParamters,
    },
  };
  // deleteData(deleteEntryParams);
  return deleteData(deleteEntryParams).then((response) => {
    if (response.apiData && response.apiData.apiData === true) {
      // fetchUsersFromUtils(props,
      //   dataOffset.dataLimit,
      //   dataOffset.dataOffset,
      //   dataOffset.searchParameterKey
      // );
      return true;
    } else {
      return false;
    }
  });
}

export function fetchEmployeeList(props) {
  const { requestData } = props;
  const payload = {};
  let parameters = new FormData();
  parameters.append("params", JSON.stringify(payload));
  parameters.append("type", "getData");
  parameters.append("command", "getActiveEmployees");

  const employeeParams = {
    id: "USERS_MODULE_ID_3",
    api: {
      body: parameters,
    },
  };

  requestData(employeeParams);
}

export function getRolesData(isProduct) {
  ////// ajay 24 june

  if (isProduct) {
    return [
      {
        id: "employee",
        name: "Employee",
      },
      {
        id: "pm",
        name: "Project Manager",
      },
      {
        id: "pm_associate",
        name: "PM Associate",
      },
      {
        id: "admin",
        name: "Admin",
      },
    ];
  } else {
    return [
      {
        id: "employee",
        name: "Employee",
      },
      {
        id: "pm",
        name: "Project Manager",
      },
      {
        id: "pm_associate",
        name: "PM Associate",
      },
      {
        id: "admin",
        name: "Admin",
      },
      {
        id: "superadmin",
        name: "Super Admin",
      },
    ];
  }
}
