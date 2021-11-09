import { isString } from "util";
import moment from "moment";
import { DATE_FORMAT, BUILD_PATH } from "../../constants/app.constants";

export function deepFreeze(obj) {
  // Retrieve the property names defined on obj
  const propNames = Object.getOwnPropertyNames(obj);

  // Freeze properties before freezing self
  propNames.forEach(function(name) {
    const prop = obj[name];

    // Freeze prop if it is an object
    if (typeof prop === "object" && prop !== null) deepFreeze(prop);
  });

  // Freeze self (no-op if already frozen)
  return Object.freeze(obj);
}

export function createCookie(name, value, expires, pathParam, domain) {
  // console.log("domain is :-", domain)
  let path = "/";
  // let domain = APP_BASE_URL_COOK;
  var cookie = name + "=" + escape(value) + ";";

  if (expires) {
    // If it's a date
    if (expires instanceof Date) {
      // If it isn't a valid date
      if (isNaN(expires.getTime())) expires = new Date();
    } else
      expires = new Date(
        new Date().getTime() + parseInt(expires, 10) * 1000 * 60 * 60 * 24
      );

    cookie += "expires=" + expires.toGMTString() + ";";
  }

  if (path) cookie += "path=" + path + ";";
  if (domain) cookie += "domain=" + domain + ";";

  document.cookie = cookie;
}

export function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export function eraseCookie(name) {
  createCookie(name, "", -1);
}

export function capitalizeFirstChar(s) {
  return s && s[0].toUpperCase() + s.slice(1);
}

export const teamDropDownData = [
  {
    id: "1",
    name: "All",
  },
  {
    id: "2",
    name: "Filemaker",
  },
  {
    id: "3",
    name: "Dotnet",
  },
  {
    id: "4",
    name: "Iphone",
  },
  {
    id: "5",
    name: "Support",
  },
  {
    id: "6",
    name: "Salesforce",
  },
  {
    id: "7",
    name: "Android",
  },
];

export function isNumberValidate(str) {
  var regex = /^[0-9]+$/;
  if (str.match(regex)) {
    return true;
  } else {
    return false;
  }
}

export function firstLetterSmall(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export function openInNewTab(url) {
  var win = window.open(url, "_tab");
  win.open();
}

export function isEmpty(value) {
  let isEmpty = false;

  if (isUndefined(value) || isNull(value)) {
    isEmpty = true;
  } else if (isString(value) && value === "") {
    isEmpty = true;
  } else if (Array.isArray(value) && value.length === 0) {
    isEmpty = true;
  } else if (whatIsIt(value) === "Object" && Object.keys(value).length === 0) {
    isEmpty = true;
  }

  return isEmpty;
}

export function isUndefined(value) {
  return value === undefined;
}

export function isNull(value) {
  return value === null;
}

let stringConstructor = "test".constructor;
let arrayConstructor = [].constructor;
let objectConstructor = {}.constructor;

export function whatIsIt(object) {
  if (object === null) {
    return "null";
  } else if (object === undefined) {
    return "undefined";
  } else if (object.constructor === stringConstructor) {
    return "String";
  } else if (object.constructor === arrayConstructor) {
    return "Array";
  } else if (object.constructor === objectConstructor) {
    return "Object";
  } else if (typeof object === "number") {
    return "Number";
  } else {
    return "unknown";
  }
}

export function stringDateToMoment(dateToConvert) {
  return moment(dateToConvert, DATE_FORMAT);
}

export function isMetaProduct() {
  return BUILD_PATH.includes("META_TS") ? true : false;
}


export function removeValueFromArray(array, value) {
  const index = array.indexOf(value);
  if (index >= 0) {
    array.splice(index, 1);
  }
  return array;
}