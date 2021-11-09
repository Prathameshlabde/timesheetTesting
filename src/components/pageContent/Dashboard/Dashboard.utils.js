import { dateFormatter, getPropsCalender } from "../../utils/calender.utils";
import moment from "moment";

export const dashboardRowStyles = {
  tableRow: {
    display: "flex",
    padding: "0px 2px",
    borderBottom: `1px solid #E6EBED`,
  },
  ColStyle: {
    display: "table-column",
    width: "7.5%",
    padding: "5px",
  },
  spanLabel: {
    display: "block",
  },
};

export function getLastNDays(numberOfDays) {
  let daysArr = [];
  for (let i = 1; i <= numberOfDays; i++) {
    daysArr.push(dateFormatter(moment().subtract(i, "days"), "yyyy-MM-dd"));
  }
  return daysArr;
}

export function getLastNDates(numberOfDays) {
  let daysArr = [];
  for (let i = 1; i <= numberOfDays; i++) {
    daysArr.push(
      dateFormatter(moment().subtract(i, "days"), "dd") +
        " " +
        getPropsCalender(moment().subtract(i, "days")).currentMonth
      // dateFormatter(moment().subtract(i, "days"), "MMM")
    );
  }
  return daysArr.reverse();
}

export function getDateDifference(fdate, tdate) {
  const now = moment(tdate); //todays date
  const end = moment(fdate); // another date
  const duration = moment.duration(now.diff(end));
  return duration.asDays();
}

export function getGroupValuesArr(role) {
  const reportArr = [
    { reportname: "Custom Report", linkTo: "custom-report" },
    { reportname: "Review Entries", linkTo: "review-entries-report" },
    { reportname: "Summary Report", linkTo: "summary-report" },
  ];

  if (role === "pm_associate") {
    return [{ reportname: "Review Entries", linkTo: "review-entries-report" }];
  } else if (role === "pm") {
    return reportArr;
  } else if (role === "admin" || role === "superadmin") {
    return [
      ...reportArr,
      { reportname: "Management Report", linkTo: "management-report" },
    ];
  }
}

export function getDataObjectForDashboardRow(props) {
  const { fdate, tdate, rows, ogData, rowIndex } = props;
  let fdateFinal = fdate;
  let tdateFinal = tdate;
  if (typeof fdate === "object") {
    fdateFinal = dateFormatter(fdate, "yyyy-MM-dd");
    tdateFinal = dateFormatter(tdate, "yyyy-MM-dd");
  }

  return {
    dataTitle: rows[0].dataTitle,
    id: rows[0].value,
    name: ogData[rowIndex - 1].pname,
    fdate: fdateFinal,
    tdate: tdateFinal,
  };
}

export const tableOverFlowStyle = {
  overflow: "scroll",
  display: "block",
  maxHeight: "225px",
};

export function isLastDateGreat(fdate, tdate) {
  const lastDate = moment(tdate); //todays date
  const startDate = moment(fdate); // another date
  if (lastDate >= startDate) return true;
  else return false;
}
