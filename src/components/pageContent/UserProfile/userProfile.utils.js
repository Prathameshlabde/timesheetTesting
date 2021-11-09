import { getDataFromCookie } from "../../utils/CheckLoginDetails";
import { UPDATE_PROFILE_ID } from "../../../constants/app.constants";

const submitButton = {
  id: "btn",
  data: "Save",
  className: "button-submitEntry",
};

export function getSubmitButton() {
  return submitButton;
}

export function setUserDataFromWebService(data, allFormData) {
  let statePersonal = allFormData.personal;
  statePersonal.forEach((element, index) => {
    allFormData.personal[index].value = data.personal[element.key];
  });
  let stateProfile = allFormData.profile;
  stateProfile.forEach((element, index) => {
    allFormData.profile[index].value = data.profile[element.key];
  });

  let stateEducation = allFormData.education;
  for (let i = 0; i < stateEducation.length; i++) {
    stateEducation[i].forEach((element, index) => {
      allFormData.education[i][index].value = data.education[i][element.key];
    });
  }

  let stateEmergency = allFormData.emergency;
  for (let i = 0; i < stateEmergency.length; i++) {
    stateEmergency[i].forEach((element, index) => {
      allFormData.emergency[i][index].value = data.emergancy[i][element.key];
    });
  }
  return allFormData;
}

export function setDefaultProjectsfromUtils(multipleSelectedIds, props) {
  let setDataParamters = new FormData();
  const payload = {
    multipleSelectedIds,
    emp_id: getDataFromCookie().empID,
  };
  setDataParamters.append("params", JSON.stringify(payload));
  setDataParamters.append("type", "updateData");
  setDataParamters.append("command", "updateDefaultProjects");
  const { id, requestData } = props;

  const setParams = {
    id,
    api: {
      body: setDataParamters,
    },
  };

  return requestData(setParams).then((response) => {
    if (response.apiData && response.apiData.apiData === true) {
      return true;
    } else if (response.apiData && response.apiData.apiData === "duplicate") {
      return "duplicate";
    } else {
      return false;
    }
  });
}

export function fetchDefaultProjectsFromUtils(props, emp_id) {
  const { id, requestData } = props;
  var dataParamters = new FormData();
  const payload = {
    emp_id,
  };

  dataParamters.append("params", JSON.stringify(payload));
  dataParamters.append("type", "getData");
  dataParamters.append("command", "getDefaultProjects");

  const entryParams = {
    id,
    api: {
      body: dataParamters,
    },
  };
  return requestData(entryParams).then((response) => {
    if (response.apiData && response.apiData.apiData) {
      // let singleArr = [];
      // for (let i = 0; i < response.apiData.apiData.length; i++) {
      //   singleArr.push(response.apiData.apiData[i].pro_id);
      // }

      return response.apiData.apiData;
    } else {
      return false;
    }
  });
}

export function updatePersonalInfoFromUtils(data, props) {
  let setDataParamters = new FormData();
  const { education, emergency, personal, profile } = data;
  let emergancy_contact1,
    emergancy_contact2,
    edu_qualification1,
    edu_qualification2,
    edu_qualification3 = "";

  for (let a = 0; a < education.length; a++) {
    let valuesStr = "";
    for (let i = 0; i < education[a].length; i++) {
      if (i === 0) valuesStr = education[a][i].value;
      else valuesStr = valuesStr + "#$&$#" + education[a][i].value;
    }
    if (a === 0) edu_qualification1 = valuesStr;
    if (a === 1) edu_qualification2 = valuesStr;
    if (a === 2) edu_qualification3 = valuesStr;
  }

  for (let a = 0; a < emergency.length; a++) {
    let valuesStr = "";
    for (let i = 0; i < emergency[a].length; i++) {
      if (i === 0) valuesStr = emergency[a][i].value;
      else valuesStr = valuesStr + "#$&$#" + emergency[a][i].value;
    }
    if (a === 0) emergancy_contact1 = valuesStr;
    if (a === 1) emergancy_contact2 = valuesStr;
  }

  let objArr = personal.concat(profile);
  let dataObj = {};

  objArr.forEach((element) => {
    dataObj[element.key] = element.value;
  });

  const payload = {
    birth_date: dataObj["birth_date"],
    father_name: dataObj["father_name"],
    spouse_name: dataObj["spouse_name"],
    perm_address: dataObj["perm_address"],
    local_address: dataObj["local_address"],
    perm_contact: dataObj["perm_contact"],
    mobile_number: dataObj["mobile_number"],
    pers_email_id: dataObj["pers_email_id"],
    blood_group: dataObj["blood_group"],
    PAN_no: dataObj["pan_no"],
    UAN_no: dataObj["uan_no"],
    emergancy_contact1,
    emergancy_contact2,
    edu_qualification1,
    edu_qualification2,
    edu_qualification3,
    join_date: dataObj["join_date"],
    aadhar_no: dataObj["aadhar_no"],
    salary_account_no: dataObj["salary_account_no"],
    passport_no: dataObj["passport_no"],

    emp_id: getDataFromCookie().empID,
  };

  setDataParamters.append("params", JSON.stringify(payload));
  setDataParamters.append("type", "updateData");
  setDataParamters.append("command", "updateUserPersonalInfo");
  const { requestData } = props;
  const setParams = {
    id: UPDATE_PROFILE_ID,
    api: {
      body: setDataParamters,
    },
  };

  return requestData(setParams).then((response) => {
    if (response.apiData && response.apiData.apiData === true) {
      return true;
    } else if (response.apiData && response.apiData.apiData === "duplicate") {
      return "duplicate";
    } else {
      return false;
    }
  });
}

export function getPersonalInfoFromUtils(props) {
  const { id, requestData } = props;
  var dataParamters = new FormData();

  let emp_id = "";
  if (id === "USER_PROFILE_INFO_ID") {
    emp_id = getDataFromCookie().empID;
  } else {
    emp_id = id;
  }

  const payload = {
    emp_id: emp_id,
  };

  dataParamters.append("params", JSON.stringify(payload));
  dataParamters.append("type", "getData");
  dataParamters.append("command", "getUserPersonalInfo");

  const entryParams = {
    id,
    api: {
      body: dataParamters,
    },
  };
  requestData(entryParams);
}
