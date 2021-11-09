import colors from "../../../common/colors";
import { CATEGORIES_MODULE_ID_2 } from "../../../../constants/app.constants";
import { LOADER_ID, LOADER_SHOW } from "../../../../constants/app.constants";
import Colors from "../../../common/colors";

export const spanStyleHeader = {
  color: colors.blueColor,
  fontWeight: "bold",
  fontSize: "20px",
};

const textAreaStyle = {
  width: "98%",
  boxShadow: `${colors.boxShadowTextfield} 0px 2px 2px 0px`,
  backgroundColor: colors.grayColor,
  color: Colors.textColor,
  border: `1px solid ${colors.grayColorBorder}`,
  resize: "none",
  borderRadius: "3px",
  fontSize: "1em",
};

const textArea = {
  data: "",
  style: textAreaStyle,
  rows: "8",
  cols: "50",
};

export function getPropsTextArea() {
  return textArea;
}

const submitButton = {
  id: "btn",
  data: "Submit",
  className: "button-submitEntry",
};

export function getPropsButtonSubmit() {
  return submitButton;
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
  width: "80%",
  textAlignLast: "center",
  boxShadow: `${colors.boxShadowTextfield} 0px 2px 2px 0px`,
  backgroundColor: colors.teftFieldBackground,
  border: `1px solid ${colors.grayColorBorder}`,
  color: Colors.textColor,
  height: "25px",
  fontSize: "14px",
};

const multipleDropDownStyle = {
  width: "80%",
  textAlignLast: "center",
  boxShadow: `${colors.boxShadowTextfield} 0px 2px 2px 0px`,
  backgroundColor: colors.teftFieldBackground,
  border: `1px solid ${colors.grayColorBorder}`,
  color: Colors.textColor,
  height: "200px",
  fontSize: "14px",
};

const dropDown = {
  style: dropDownStyle,
};

const multipleDropDown = {
  style: multipleDropDownStyle,
};

export function getPropsDropdown() {
  return dropDown;
}
export function getPropsMultipleDropdown() {
  return multipleDropDown;
}

export const textFieldStyle = {
  textfieldSmall: {
    width: "80%",
    boxShadow: `${colors.boxShadowTextfield} 0px 2px 2px 0px`,
    backgroundColor: colors.teftFieldBackground,
    border: `1px solid ${colors.grayColorBorder}`,
    color: Colors.textColor,
    height: "25px",
    fontSize: "14px",
  },
  textfieldPM: {
    width: "100%",
    boxShadow: `${colors.boxShadowTextfield} 0px 2px 2px 0px`,
    backgroundColor: colors.teftFieldBackground,
    border: `1px solid ${colors.grayColorBorder}`,
    color: Colors.textColor,
    height: "30%",
    fontSize: "14px",
  },
  textfieldLarge: {
    width: "80%",
    boxShadow: `${colors.boxShadowTextfield} 0px 2px 2px 0px`,
    backgroundColor: colors.teftFieldBackground,
    border: `1px solid ${colors.grayColorBorder}`,
    color: Colors.textColor,
    height: "25px",
    fontSize: "14px",
  },
};

export function fetchCategoriesFromUtils(
  props,
  state,
  sortBy = "",
  sortType = ""
) {
  const { id, fetchAllCategories, updateComponentState } = props;
  const { dataLimit, dataOffset, searchParameterKey } = state;

  updateComponentState(LOADER_ID, LOADER_SHOW, {
    showLoader: true,
  });

  let categoryParameters = {
    id,
    dataLimit,
    dataOffset,
    searchParameterKey,
  };

  if (searchParameterKey && searchParameterKey !== "") {
    categoryParameters = {
      id,
      dataLimit: "",
      dataOffset: "",
      searchParameterKey,
    };
  }

  fetchAllCategories(categoryParameters, sortBy, sortType).then((response) => {
    if (response.apiData && response.apiData.isFetching === false) {
      updateComponentState(LOADER_ID, LOADER_SHOW, {
        showLoader: false,
      });
    }
  });
}

export function fetchEntryDataFromUtils(entryID, props) {
  const { fetchCategories } = props;
  let BodyParams = new FormData();
  const Payload = {
    category_id: entryID,
  };

  BodyParams.append("params", JSON.stringify(Payload));
  BodyParams.append("type", "getData");
  BodyParams.append("command", "getSingleCategoryData");

  const Params = {
    id: CATEGORIES_MODULE_ID_2,
    api: {
      body: BodyParams,
    },
  };

  fetchCategories(Params);
}

export function addNewCategory(
  category_name,
  for_task,
  for_sprint,
  props,
  state
) {
  let addDataParamters = new FormData();
  const payload = {
    for_task,
    for_sprint,
    category_name,
  };

  addDataParamters.append("params", JSON.stringify(payload));
  addDataParamters.append("type", "addData");
  addDataParamters.append("command", "addCategory");

  const { id, requestData } = props;
  const newEntryParams = {
    id,
    api: {
      body: addDataParamters,
    },
  };

  return requestData(newEntryParams).then((response) => {
    if (response.apiData && response.apiData.apiData === true) {
      fetchCategoriesFromUtils(props, state);
      return true;
    } else if (response.apiData && response.apiData.apiData === "duplicate") {
      return "duplicate";
    } else {
      return false;
    }
  });
}

export function updateCategory(
  category_id,
  category_name,
  for_task,
  for_sprint,
  props,
  state
) {
  let updateDataParamters = new FormData();

  const payload = {
    category_id,
    for_task,
    for_sprint,
    category_name,
  };

  updateDataParamters.append("params", JSON.stringify(payload));
  updateDataParamters.append("type", "updateData");
  updateDataParamters.append("command", "updateCategory");
  const { id, updateData } = props;
  const updateEntryParams = {
    id,
    api: {
      body: updateDataParamters,
    },
  };

  return updateData(updateEntryParams).then((response) => {
    if (response.apiData && response.apiData.apiData === true) {
      fetchCategoriesFromUtils(props, state);
      return true;
    } else if (response.apiData && response.apiData.apiData === "duplicate") {
      return "duplicate";
    } else {
      return false;
    }
  });
}
export function deleteCategory(categoryID, props, state) {
  // console.log("in delete entry");
  var deleteDataParamters = new FormData();
  const payload = {
    category_id: categoryID,
  };

  deleteDataParamters.append("params", JSON.stringify(payload));
  deleteDataParamters.append("type", "removeData");
  deleteDataParamters.append("command", "deleteCategory");
  const { id, deleteData } = props;
  const deleteEntryParams = {
    id,
    api: {
      body: deleteDataParamters,
    },
  };
  return deleteData(deleteEntryParams).then((response) => {
    if (response.apiData && response.apiData.apiData === true) {
      // fetchCategoriesFromUtils(props, state);
      return true;
    } else {
      return false;
    }
  });
}
