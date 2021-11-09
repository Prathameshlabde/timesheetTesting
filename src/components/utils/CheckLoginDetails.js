import { readCookie, isMetaProduct } from "./common.utils";

export function isLoggedIn() {
  if (readCookie("username") && readCookie("empId") && readCookie("uname")) {
    return true;
  } else {
    return false;
  }
}

export function getDataFromCookie() {
  if (readCookie("empId") && readCookie("role") && readCookie("uname")) {
    const empID = readCookie("empId");
    const role = readCookie("role");
    const uname = readCookie("uname");
    const userName = readCookie("username").replace(/%20/g, " ");
    let backgroundImageURL = "";
    if (readCookie("backgroundImageURL")) {
      backgroundImageURL = readCookie("backgroundImageURL").replace(
        /%3A/g,
        ":"
      );
    }

    let userObj = {
      empID,
      role,
      uname,
      userName,
      backgroundImageURL,
    };

    if (isMetaProduct()) {
      const company_id = readCookie("company_id");
      const companyImgurl = readCookie("companyImgurl");
      userObj = {
        empID,
        role,
        uname,
        userName,
        backgroundImageURL,
        company_id,
        companyImgurl,
      };
    }

    return userObj;
  } else {
    return null;
  }
}
