import {
  APP_BASE_URL,
  APP_BASE_URL_METHOD,
  BUILD_PATH,
} from "../../constants/app.constants";
import { isLoggedIn } from "../utils/CheckLoginDetails";
import { browserHistory } from "react-router";

import { readCookie, isMetaProduct } from "../utils/common.utils";
import { API_DIALOGS } from "../../constants/dialog.constants";

export function callApi(parameters) {
  var id, api, data;
  let dataMap = {
    id,
    api,
    data,
    isFetching: false,
    isError: false,
  };

  if (parameters.typeofQuery === "login" || isLoggedIn() === true) {
    if (readCookie("empId")) {
      const empIDfromCookie = readCookie("empId");
      const unamefromCookie = readCookie("uname");
      const rolefromCookie = readCookie("role");

      parameters.api.body.append("emp_id", empIDfromCookie);
      parameters.api.body.append("uname", unamefromCookie);
      parameters.api.body.append("role", rolefromCookie);
      if (isMetaProduct()) {
        const companyIdFromCookie = readCookie("company_id");
        parameters.api.body.append("company_id", companyIdFromCookie);
      }
    }

    return fetch(APP_BASE_URL, {
      method: APP_BASE_URL_METHOD,
      body: parameters.api.body,
    })
      .then((response) => response.json())
      .then((json) => {
        dataMap = {
          id: parameters.id,
          // api: parameters.api,
          apiData: json, //{ ...json }
          isFetching: false,
          isError: false,
        };

        return dataMap;
      })
      .catch(function(error) {
        if(error.message === "Failed to fetch"){
          alert(`Error! ${error.message}.\n${API_DIALOGS.validationNetwork}`)
        }
        dataMap = {
          id: parameters.id,
          apiData: "",
          isFetching: false,
          isError: true,
        };
        return dataMap;
      });

      
  } else {
    browserHistory.push("/" + BUILD_PATH + "login");
    alert(API_DIALOGS.validationSession)
    return new Promise(() => { 
      dataMap = {
        id: parameters.id,
        apiData: "",
        isFetching: false,
        isError: true,
      };
      return dataMap;
  });
  }
}
