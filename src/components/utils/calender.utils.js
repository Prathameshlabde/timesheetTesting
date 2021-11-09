import moment from "moment";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function getDateAbbrv(d) {
  if (d > 3 && d < 21) return "th"; // thanks kennebec
  switch (d % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

// const datePickerStyles = {
//   padding: "5px"
// };

// eslint-disable-next-line
Date.prototype.format = function(format) {
  var date = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S+": this.getMilliseconds(),
  };

  if (/(y+)/i.test(format)) {
    format = format.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }

  for (var k in date) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length === 1
          ? date[k]
          : ("00" + date[k]).substr(("" + date[k]).length)
      );
    }
  }

  return format;
};

const timeStamp = new Date().format("hh:mm:ss");

export function dateFormatter(momentObject, userFormat) {
  let formatedDate = momentObject.toDate().format(userFormat);
  return formatedDate;
}

export function getPropsCalender(selectedDate) {
  // console.log("selectedDate :-", selectedDate);
  let today = selectedDate.toDate();
  const currentDay = days[today.getDay()];
  let currentDate = today.getDate();
  let dateAbbrv = getDateAbbrv(currentDate);
  let currentMonth = today
    .toDateString()
    .toString()
    .slice(4, 7);

  let formatedDate = currentDate + dateAbbrv + " " + currentMonth;

  const calenders = {
    id: "calender",
    currentDate: currentDate,
    currentDay: currentDay,
    dateAbbrv: dateAbbrv,
    currentMonth: currentMonth,
    formatedDate: formatedDate,
  };

  // console.log("calenders :-", calenders);
  return calenders;
}

export function getPropsCurrentTimeStamp() {
  return timeStamp;
}

export function getStartTime() {
  var hoursOG = new Date().getHours();
  var dateFor = new Date();
  var minutes = (dateFor.getMinutes() < 10 ? "0" : "") + dateFor.getMinutes();
  var hours = (hoursOG + 24 - 2) % 24;

  var mid = "AM";
  if (hours === 0) {
    //At 00 hours we need to show 12 am
    hours = 12;
  } else if (hoursOG > 12) {
    hours = hoursOG % 12;
    mid = "PM";
  } else if (hoursOG < 12) {
    hours = hoursOG % 12;
    mid = "AM";
  }

  var finalStartTime = hours + ":" + minutes + " " + mid;
  return finalStartTime;
}

export function getDatesArrayFromRange(fdate, tdate) {
  let dateArray = [];
  let currentDate = moment(fdate);
  const stopDate = moment(tdate);
  const DTFormat = "yyyy-MM-dd";
  while (currentDate <= stopDate) {
    dateArray.push(dateFormatter(moment(currentDate), DTFormat));
    currentDate = moment(currentDate).add(1, "days");
  }
  return dateArray;
}

export function convertTime12to24(time12h) {
  const [time, modifier] = time12h.split(" ");

  let [hours, minutes] = time.split(":");

  if (hours === "12") {
    hours = "00";
  }

  if (modifier === "PM") {
    hours = parseInt(hours, 10) + 12;
  }

  return `${hours}:${minutes}`;
}

export function getMomemt24hTime(timeString) {
  var format = "hh:mm:ss";
  return moment(convertTime12to24(timeString), format);
}
