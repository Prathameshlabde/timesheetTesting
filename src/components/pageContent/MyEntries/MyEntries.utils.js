import { dateFormatter } from "../../utils/calender.utils";
import { LOADER_ID, LOADER_SHOW } from "../../../constants/app.constants";

export const buttonStyle = {
  marginTop: "16px",
  width: "100px",
  height: "30px",
  borderRadius: "5px",
  backgroundColor: "#054770",
  color: "#ffffff",
  fontZize: "15px",
  border: "1px solid #E6EBED",
  // boxShadow: "2px 1px 8px 1px #bebebe",
};

export const dropDownStyle = {
  // width: "95%",
  // boxShadow: "rgba(0, 0, 0, 0.43) 0px 2px 2px 0px",
  // backgroundColor: Colors.whiteColor,
  // border: `1px solid ${Colors.grayColorBorder}`,
  // height: "30px"
};

export const dropDownDateRange = {
  apiData: [
    {
      name: "Today",
      id: "Today",
    },
    {
      name: "This Week",
      id: "This Week",
    },
    {
      name: "Last Week",
      id: "Last Week",
    },
    {
      name: "Last Two Weeks",
      id: "Last Two Week",
    },
    {
      name: "Custom",
      id: "Custom",
    },
  ],
};

export const weeksDefaultData = [
  {
    title: "Mon",
    data: "0",
    estimated: "0",
    date: "2018-07-01",
    ishighLighted: false,
  },
  {
    title: "Tue",
    data: "0",
    estimated: "0",
    date: "2018-07-02",
    ishighLighted: false,
  },
  {
    title: "Wed",
    data: "0",
    estimated: "0",
    date: "2018-07-03",
    ishighLighted: false,
  },
  {
    title: "Thu",
    data: "0",
    estimated: "0",
    date: "2018-07-04",
    ishighLighted: false,
  },
  {
    title: "Fri",
    data: "0",
    estimated: "0",
    date: "2018-07-05",
    ishighLighted: false,
  },
  {
    title: "Sat",
    data: "0",
    estimated: "0",
    date: "2018-07-06",
    ishighLighted: false,
  },
  {
    title: "Sun",
    data: "0",
    estimated: "0",
    date: "2018-07-07",
    ishighLighted: false,
  },
  {
    title: "Total",
    data: "0",
    estimated: "0",
  },
];

export function fetchActiveProjects(props) {
  const { id, fetchProjectsDashboard } = props;
  const projectParameters = {
    id,
    from: "allActiveInactive",
  };

  fetchProjectsDashboard(projectParameters);
}

export function fetchReportDashboard(props, state) {
  const { id, fetchReport, updateComponentState } = props;

  updateComponentState(LOADER_ID, LOADER_SHOW, {
    showLoader: true,
  });

  let reportDashboardBodyParams = new FormData();
  const billingDashboardPayload = {
    fdate: dateFormatter(state.selectedStartDateDashBoard, "yyyy-MM-dd"),
    tdate: dateFormatter(state.selectedStartDateDashBoard, "yyyy-MM-dd"),
    DateRange: state.selectedDateRangeValue.toLowerCase(),
    pro_id: state.selectedProject,
  };

  reportDashboardBodyParams.append(
    "params",
    JSON.stringify(billingDashboardPayload)
  );
  reportDashboardBodyParams.append("type", "getData");
  reportDashboardBodyParams.append("command", "getDashboardBillingSearch");

  const reportDashboardParams = {
    id,
    api: {
      body: reportDashboardBodyParams,
    },
  };

  return fetchReport(reportDashboardParams).then((response) => {
    if (response.apiData && response.apiData.isFetching === false) {
      updateComponentState(LOADER_ID, LOADER_SHOW, {
        showLoader: false,
      });
    }
    return response
  });
}

export function deleteEntry(selectedProps, billingID, state, props) {
  // console.log("in delete entry");
  let deleteDataParamters = new FormData();
  const payload = {
    bill_id: billingID,
  };

  deleteDataParamters.append("params", JSON.stringify(payload));
  deleteDataParamters.append("type", "removeData");
  deleteDataParamters.append("command", "deleteTimesheetEntry");

  const { id, deleteData } = selectedProps;

  const deleteEntryParams = {
    id,
    api: {
      body: deleteDataParamters,
    },
  };
  return deleteData(deleteEntryParams).then((response) => {
    if (response.apiData && response.apiData.apiData === true) {
      // fetchWeekReportDashboard(props, state);
      // fetchReportDashboard(props, state);
      return true;
    } else {
      return false;
    }
  });
}

export function fetchWeekReportDashboard(props, state) {
  const { id, fetchWekReport } = props;
  let reportDashboardBodyParams = new FormData();
  const billingDashboardPayload = {
    fdate: dateFormatter(state.selectedStartDate, "yyyy-MM-dd"),
    tdate: dateFormatter(state.selectedEndDate, "yyyy-MM-dd"),
    DateRange: "custom",
    pro_id: state.selectedProject,
  };

  // console.log("Final Parameters in weekbar:- ", billingDashboardPayload);
  reportDashboardBodyParams.append(
    "params",
    JSON.stringify(billingDashboardPayload)
  );
  reportDashboardBodyParams.append("type", "getData");
  reportDashboardBodyParams.append("command", "getBillableWeeks");

  const reportDashboardParams = {
    id,
    api: {
      body: reportDashboardBodyParams,
    },
  };
  fetchWekReport(reportDashboardParams);
}
