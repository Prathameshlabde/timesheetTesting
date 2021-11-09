import { PRODUCT_VALIDATION_DLGS } from "../../constants/dialog.constants";
import { PRODUCT_EXTEND_ID } from "../../constants/app.constants";
import { isMetaProduct } from "../utils/common.utils";

export function checkLogin(props) {
  const { id, requestData, username, password } = props;
  let loginBodyParams = new FormData();
  let loginPayload = {
    username,
    password,
  };

  if (isMetaProduct()) {
    loginPayload = {
      username,
      password,
      company_id: props.company_id,
      fdate: props.fdate,
    };
  }

  loginBodyParams.append("params", JSON.stringify(loginPayload));
  loginBodyParams.append("type", "login");
  loginBodyParams.append("command", "checkLogin");
  const loginDataParams = {
    id,
    api: {
      body: loginBodyParams,
    },
    typeofQuery: "login",
  };
  requestData(loginDataParams);
}

export function checkAndSetForgotNewPassword(props) {
  let setDataParamters = new FormData();
  const { FRGTUserName, FRGTEmailID, id, requestDataDuplicate } = props;

  let payload = {
    enteredUserName: FRGTUserName,
    emailId: FRGTEmailID,
  };

  if (isMetaProduct()) {
    payload = {
      enteredUserName: FRGTUserName,
      emailId: FRGTEmailID,
      company_id: props.FRGTcompany_id,
    };
  }

  setDataParamters.append("params", JSON.stringify(payload));
  setDataParamters.append("type", "getData");
  setDataParamters.append("command", "getNewPassword");

  const setParams = {
    id,
    api: {
      body: setDataParamters,
    },
    typeofQuery: "login",
  };

  return requestDataDuplicate(setParams).then((response) => {
    if (response.apiData && response.apiData.apiData === true) {
      return true;
    } else if (response.apiData && response.apiData.apiData === "isNotValid") {
      return "isNotValid";
    } else {
      return false;
    }
  });
}

export function isFromValidationDLGS(responseObj) {
  if (
    responseObj === PRODUCT_VALIDATION_DLGS.completelyExpired ||
    responseObj === PRODUCT_VALIDATION_DLGS.daysexpired1 ||
    responseObj === PRODUCT_VALIDATION_DLGS.daysexpired2 ||
    responseObj === PRODUCT_VALIDATION_DLGS.fetchfailed
  )
    return true;
}

export function extendExpiryDate(props) {
  const { requestData, company_id, fdate } = props;
  // console.log("in extendExpiryDate company_id, fdate  = ", company_id, fdate);
  let paramters = new FormData();
  const payload = {
    company_id,
    fdate,
  };
  paramters.append("params", JSON.stringify(payload));
  paramters.append("type", "getTanentData");
  paramters.append("command", "extendTanentExpiry");
  const params = {
    id: PRODUCT_EXTEND_ID,
    api: {
      body: paramters,
    },
    // typeofQuery: "login",
  };

  requestData(params);
}
