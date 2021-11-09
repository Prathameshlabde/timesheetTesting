import React from "react";

export const APP_ID = "APP_ID";
export const LOADER_ID = "LOADER_ID";
export const SNACKBAR_ID = "SNACKBAR_ID";
export const SNACKBAR_SHOW = "SNACKBAR_SHOW";
export const LOADER_SHOW = "LOADER_SHOW";
export const CHART_CONTAINER_ID = "CHART_CONTAINER_ID";
export const CHART_ID = "CHART_ID";
export const CHART_SHOW = "CHART_SHOW";
export const APP_CURRENT_PAGE = "APP_CURRENT_PAGE";
export const TITLE_SUBTITLE_ID = "TITLE_SUBTITLE_ID";
export const APP_TITLE_SUBTITLE = "APP_TITLE_SUBTITLE";
export const APP_NEW_ENTRY = false;
export const APP_EDIT_ENTRY_ID = "";
export const APP_DUPLICATE_ENTRY_ID = "APP_DUPLICATE_ENTRY_ID";
// export const BUILD_PATH = "timesheet/";
export const BUILD_PATH = "test_timesheet/"; //live test
// export const BUILD_PATH = "META_TS/"; //product

export const BUILD_PATH_COUNT = BUILD_PATH.length; //Build path character count

//---------//---------BUY URL---------//---------
//check product popup link for the BUY button before release
//---------//---------//---------//---------

// comment following block for live (local host)
// -----------------------------------------------------------------------------------
// const BASE_URL = "http://192.168.2.83:8888/timesheet_api/";
// const BASE_URL = "http://localhost:8888/test_timesheet_api/"; //test live
// const BASE_URL = "http://localhost/product_timesheet_api/"; //test local
const BASE_URL = "http://localhost/timesheet_api/"; //test local from prathamesh machine 
export const APP_BASE_URL = BASE_URL;
// -----------------------------------------------------------------------------------

// uncomment following block for live (test server and live server)
// -----------------------------------------------------------------------------------
// export const folderPath = "/test_timesheet_api/"; //live test
// export const folderPath = "/timesheet_api/"; //live
// export const folderPath = "/product_timesheet_api/"; //product
// export const portNumber = ":8080"; //use this for metasys test and live
// export const portNumber = ""; //use this for stage server it is blank
// export let APP_BASE_URL = getUrl();
// export function getUrl() {
//   const urlArray = window.location.href.split("/", 3);
//   const ip = urlArray[2].split(":");
//   const finalUrl = urlArray[0] + "//" + ip[0] + portNumber + folderPath;
//   return finalUrl;
// }
// -----------------------------------------------------------------------------------

export const TEAM_REPORT_NEW_TAB_URL = APP_BASE_URL + "repTeam.php?";
export const CUSTOM_REPORT_NEW_TAB_URL = APP_BASE_URL + "repCustomNew.php?";
export const MONTHLY_ROLLING_REPORT_NEW_TAB_URL =
  APP_BASE_URL + "repMonthly.php?";

export const REPORT_TEMP_ENTRY_ID = "REPORT_TEMP_ENTRY_ID";
export const APP_BASE_URL_METHOD = "POST";
export const ID_NEW_ENTRY = "ID_NEW_ENTRY";
export const DASHBOARD_ID = "DASHBOARD_ID";
export const UPDATE_DASHBOARD = "UPDATE_DASHBOARD";
export const DASHBOARD_SHOULD_UPDATE = "";
export const REPORT_SUBMENU_ID = "REPORT_SUBMENU_ID";
export const REPORT_SUBMENU = "REPORT_SUBMENU";
export const REPORT_JSONFILE = "REPORT_JSONFILE";
export const PROJECT_ID = "PROJECT_ID";
export const PROJECTS_ID = "PROJECTS_ID";
export const TASK_ID = "TASK_ID";
export const SORT_BY = "SORT_BY";
export const LOGGED_IN_DETAILS_ID = "LOGGED_IN_DETAILS_ID";
export const LOGGED_IN_DATA = "LOGGED_IN_DATA";
export const PROJECTS_SUBMENU_ID = "PROJECTS_SUBMENU_ID";
export const PROJECTS_JSONFILE = "PROJECTS_JSONFILE";
export const PROJECTS_SUBMENU = "PROJECTS_SUBMENU";
export const RULES_ROUTE = "RULES_ROUTE";
export const RULES_EDITOR_ROUTE = "RULES_EDITOR_ROUTE";
export const PROJECTS_NEW_ENTRY_ID = "PROJECTS_NEW_ENTRY_ID";
export const PROJECTS_NEW_ENTRY = "PROJECTS_NEW_ENTRY";
export const PROJECTS_EDIT_ENTRY_ID = "PROJECTS_EDIT_ENTRY_ID";
export const PROJECTS_MODULE_ID = "PROJECTS_MODULE_ID";
export const PROJECTS_MODULE_ID_2 = "PROJECTS_MODULE_ID_2"; //request data and data duplication
export const UPDATE_PROJECTS_MODULE = "UPDATE_PROJECTS_MODULE";
export const PROJECTS_MODULE_SHOULD_UPDATE = "";
export const SUMMARY_BY = "SUMMARY_BY";
export const CATEGORY = "CATEGORY";
export const REPORT_TEMP_BOOL = "REPORT_TEMP_BOOL"; //temp for updating the UI of reports
export const REPORT_TEMP_BOOL2 = "REPORT_TEMP_BOOL2"; //temp for updating the UI of reports
export const REPORT_TEMP_BOOL3 = "REPORT_TEMP_BOOL3"; //temp for updating the UI of reports
export const TASKS_NEW_ENTRY_ID = "TASKS_NEW_ENTRY_ID";
export const TASKS_NEW_ENTRY = "TASKS_NEW_ENTRY";
export const TASKS_EDIT_ENTRY_ID = "TASKS_EDIT_ENTRY_ID";
export const TASKS_MODULE_ID = "TASKS_MODULE_ID";
export const TASKS_MODULE_ID_2 = "TASKS_MODULE_ID_2";
export const UPDATE_TASKS_MODULE = "UPDATE_TASKS_MODULE";
export const TASKS_MODULE_SHOULD_UPDATE = "TASKS_MODULE_SHOULD_UPDATE";
export const SPRINTS_NEW_ENTRY_ID = "SPRINTS_NEW_ENTRY_ID";
export const SPRINTS_NEW_ENTRY = "SPRINTS_NEW_ENTRY";
export const SPRINTS_EDIT_ENTRY_ID = "SPRINTS_EDIT_ENTRY_ID";
export const SPRINTS_MODULE_ID = "SPRINTS_MODULE_ID";
export const SPRINTS_MODULE_ID_2 = "SPRINTS_MODULE_ID_2";
export const UPDATE_SPRINTS_MODULE = "UPDATE_SPRINTS_MODULE";
export const SPRINTS_MODULE_SHOULD_UPDATE = "SPRINTS_MODULE_SHOULD_UPDATE";
export const SPRINT_ID = "SPRINT_ID";
export const SUBTASKS_NEW_ENTRY_ID = "SUBTASKS_NEW_ENTRY_ID";
export const SUBTASKS_NEW_ENTRY = "SUBTASKS_NEW_ENTRY";
export const SUBTASKS_EDIT_ENTRY_ID = "SUBTASKS_EDIT_ENTRY_ID";
export const SUBTASKS_MODULE_ID = "SUBTASKS_MODULE_ID";
export const SUBTASKS_MODULE_ID_2 = "SUBTASKS_MODULE_ID_2";
export const UPDATE_SUBTASKS_MODULE = "UPDATE_SUBTASKS_MODULE";
export const SUBTASKS_MODULE_SHOULD_UPDATE = "SUBTASKS_MODULE_SHOULD_UPDATE";
export const CATEGORIES_NEW_ENTRY_ID = "CATEGORIES_NEW_ENTRY_ID";
export const CATEGORIES_NEW_ENTRY = "CATEGORIES_NEW_ENTRY";
export const CATEGORIES_EDIT_ENTRY_ID = "CATEGORIES_EDIT_ENTRY_ID";
export const CATEGORIES_MODULE_ID = "CATEGORIES_MODULE_ID";
export const CATEGORIES_MODULE_ID_2 = "CATEGORIES_MODULE_ID_2";
export const UPDATE_CATEGORIES_MODULE = "UPDATE_CATEGORIES_MODULE";
export const CATEGORIES_MODULE_SHOULD_UPDATE =
  "CATEGORIES_MODULE_SHOULD_UPDATE";
export const UPDATE_REVIEWENTRIES = "UPDATE_REVIEWENTRIES";
export const REVIEWENTRIES_SHOULD_UPDATE = "REVIEWENTRIES_SHOULD_UPDATE";
export const REVIEWENTRIES_NEW_ENTRY_ID = "REVIEWENTRIES_NEW_ENTRY_ID";
export const REPORTS_MSG_DATA_NOT_FOUND =
  "There is no data matching your criteria. Please change your criteria above.";
export const REPORT_MSG_CHANGE_DATE =
  "You can review entries for one month only. Please change the date accordingly";
export const ICON_TITLE_COLLAPSE = "Collapse";
export const ICON_TITLE_EXPAND = "Expand";
export const EXPAND_LESS_ICON_NAME = "expand_less";
export const EXPAND_MORE_ICON_NAME = "expand_more";
export const ENTER_SEARCH_CRITERIA = ""; //"Please Enter Search Criteria.";
export const SHOW_SEARCH_CRITERIA = "";
export const REPORT_SUBMIT_BUTTON_TITLE = "Generate Report";
export const FOR_HIDE1 = "for-hide1"; //classnames for hidden section of reports
export const FOR_HIDE2 = "for-hide2"; //classnames for hidden section of reports
export const EXPORT_DATA = "EXPORT_DATA";
export const SUB_EXPORT_DATA = "SUB_EXPORT_DATA";
export const PROJECT_NOTE = "Note: Inactive Projects are in red.";
export const USERS_NEW_ENTRY = "USERS_NEW_ENTRY";
export const USERS_PROFILE = "USERS_PROFILE";
export const USERS_MODULE_ID = "USERS_MODULE_ID";
export const USERS_NEW_ENTRY_ID = "USERS_NEW_ENTRY_ID";
export const UPDATE_USERS_MODULE = "UPDATE_USERS_MODULE";
export const USERS_MODULE_SHOULD_UPDATE = "USERS_MODULE_SHOULD_UPDATE";
export const USERS_ID = "USERS_ID";
export const USERS_EDIT_ENTRY_ID = "USERS_EDIT_ENTRY_ID";
export const USERS_MODULE_ID_2 = "USERS_MODULE_ID_2";
export const PIE_CHART_CAPTION = "Project Overview";
export const PIE_CHART_SUBCAPTION = "Billable Hours";
export const PR_NUM_TEXT = "pr-num-text";
export const SUBREPORT_ID = "SUBREPORT_ID";
export const IS_SUB_REPORT = false;
export const SUB_REPORT_PARAMS = "";
export const HOLIDAYS_MODULE_ID = "HOLIDAYS_MODULE_ID";
export const EDIT_CLIENT_ID = "EDIT_CLIENT_ID";
export const REPORT_PROJECT_ID = "REPORT_PROJECT_ID";
export const ACCESS_TITLE_SUBTITLE = {
  title: "Access Denied",
  subttle: "Please contact administrator for more details.",
};

export const PROFILE_CHANGED_ID = "PROFILE_CHANGED_ID";
export const PROFILE_URL = "PROFILE_URL";
export const COMPANY_PROFILE_CHANGED_ID = "COMPANY_CHANGED_ID"; //// ajay 19 june 2020
export const COMPANY_PROFILE_URL = "COMPANY_PROFILE_URL"; /// ajay 19 june 2020
export const REPORT_SUBMENU_ID_TEMP = "";
export const REPORT_DEFAULTERLIST_ID = "REPORT_DEFAULTERLIST_ID";
export const REPORT_DEFAULTERLIST_ID2 = "REPORT_DEFAULTERLIST_ID2";
export const IS_RELOAD = false;
export const DEFAULTERLIST_TAB1 = "No Entry";
export const DEFAULTERLIST_TAB2 = "Leave";
export const DEFAULTERLIST_TAB3 = "Filled Entry";
export const SORT_BY_EMPLOYEE = "employee";
export const REPORT_TEAMREPORT_ID = "REPORT_TEAMREPORT_ID";
export const ADD_NEW_TECHNOLOGY = "Add New Technology";
export const EDIT_TECHNOLOGY = "Edit Technology";
export const NO_RECORDS_FOUND = "No Records Found";
export const UPDATE = "Update";
export const SUBMIT = "Submit";
export const TECHNOLOGIES_MODULE_ID = "TECHNOLOGIES_MODULE_ID";
export const LEAVE_SUBMENU_ID = "LEAVE_SUBMENU_ID";
export const LEAVE_SUBMENU = "LEAVE_SUBMENU";
export const LEAVE_EDIT_ENTRY = "LEAVE_EDIT_ENTRY";
export const LEAVE_MODULE_ID = "LEAVE_MODULE_ID";
export const FROM_EMAIL_ID = "";
export const CC_EMAIL_ID = "hrd@metasyssoftware.com";
export const REPORT_CUSTOM_REPORT_NEW_ID = "REPORT_CUSTOM_REPORT_NEW_ID";
export const REPORT_MONTHLY_ROLLING_REPORT_ID =
  "REPORT_MONTHLY_ROLLING_REPORT_ID";
export const REPORT_SUBMENU_ID2 = "REPORT_SUBMENU_ID2";
export const ADD_NEW_TEAM = "Add New Team";
export const EDIT_TEAM = "Edit Team";
export const TEAMS_ID = "TEAMS_ID";
export const TEAMS_ID_2 = "TEAMS_ID_2";
export const TEAMS_MODULE_ID = "TEAMS_MODULE_ID";
export const TEAM_EMP_ID = "TEAM_EMP_ID";
export const TEAM_TECH_ID = "TEAM_TECH_ID";
export const PROJECTS_MODULE_ID_3 = "PROJECTS_MODULE_ID_3";
export const TASK_REPORT = "TASK_REPORT";
export const REFERENCENO_REPORT = "REFERENCENO_REPORT";
export const TASK_TITLE = "Task Title";
export const TASK_UNKNOWN_TASKS = "Unknown Tasks";
export const REPORT_BUSINESS_DURATION_ID = "REPORT_BUSINESS_DURATION_ID"; //for business days and hours
export const REPORT_BUSINESS_DURATION_HRS = 0;
export const DASHBOARD_WEEK_DATE = "DASHBOARD_WEEK_DATE";
export const VIEW_BY = "VIEW_BY";
export const REPORT_SUBMENU_ID_DEF = "REPORT_SUBMENU_ID_DEF";
export const NEW_NOTIFICATION_MSG = (
  <ol>
    <li>
      Lock entries feature - Once the monthly / weekly invoice gets sent to the
      Client for the respective projects, the administrator will set the lock
      date for those projects.So, users won 't be able to edit/delete/add
      entries for those projects till the lock date.
    </li>
  </ol>
); //msg for new features
export const NOTIFICATION_MSG_EXPIRE_DATE = "02-07-2020"; //"MM-DD-YYYY"
export const MIN_WINDOW = "MIN_WINDOW";
export const CLOSE_WINDOW = "CLOSE_WINDOW";
export const SOLARIZED_THEME_STR = "Solarized";
export const RED_THEME_STR = "Red";
export const BLUE_THEME_STR = "Blue";
export const dropDownThemeData = {
  apiData: [
    {
      name: "Default",
      id: "Default",
    },
    {
      name: "Solarized",
      id: "Solarized",
    },
    {
      name: "Red",
      id: "Red",
    },
    {
      name: "Blue",
      id: "Blue",
    },
  ],
};
export const WEEK_OBJ_ARRAY = [
  { id: "mon", index: 0 },
  { id: "tue", index: 1 },
  { id: "wed", index: 2 },
  { id: "thu", index: 3 },
  { id: "fri", index: 4 },
  { id: "sat", index: 5 },
  { id: "sun", index: 6 },
];
export const UPDATE_PROFILE_ID = "UPDATE_PROFILE_ID";
export const DEFAULT_OPTION = "defaultOption";

export const SUMMARY_REPORT_VALIDATION = {
  errorDate: "Please select date properly.",
  errorDateExceds: "Date selection is allowed only for 12 months.",
};

export const DATE_FORMAT = "DD-MMM-YYYY";
export const REPORT_IS_DATE_RANGE_BOOL = false;

//new dashboard aditya
export const DASHBOARD_CHART_ID = "DASHBOARD_CHART_ID";
export const DASHBOARD_HOLIDAYS_ID = "DASHBOARD_HOLIDAYS_ID";
export const DASHBOARD_LEAVES_ID = "DASHBOARD_LEAVES_ID";
export const DASHBOARD_PROJECTS_STATS_ID = "DASHBOARD_PROJECTS_STATS_ID";
export const DASHBOARD_TEAM_LEAVES_ID = "DASHBOARD_TEAM_LEAVES_ID";
export const DASHBOARD_TEAM_PROJECTS_STATS_ID =
  "DASHBOARD_TEAM_PROJECTS_STATS_ID";
export const DASHBOARD_TEAM_PROJECTS_DIV_ID = "DASHBOARD_TEAM_PROJECTS_DIV_ID";
export const DASHBOARD_TEAM_PROJECTS_CHART_ID =
  "DASHBOARD_TEAM_PROJECTS_CHART_ID";
export const DASHBOARD_TEAM_CHART_ID = "DASHBOARD_TEAM_CHART_ID";
export const DASHBOARD_TEAM_HOURS_ID = "DASHBOARD_TEAM_HOURS_ID";
export const COMPANY_PM_STATS_ID = "COMPANY_PM_STATS_ID";
export const UPDATED_DATES = "UPDATED_DATES";
export const DASHBOARD_NAVIGATE_ID = "DASHBOARD_NAVIGATE_ID";
export const REPORT_OBJECT = "REPORT_OBJECT";
export const EMP_ID = "EMP_ID";
export const ERROR_STR = "error";
export const DASHBOARD_TEAM_EMPLOYEES_STATS_ID =
  "DASHBOARD_TEAM_EMPLOYEES_STATS_ID";
export const DASHBOARD_TEAM_EMPLOYEES_DIV_ID =
  "DASHBOARD_TEAM_EMPLOYEES_DIV_ID";
export const DASHBOARD_CONTEXT_ID = "DASHBOARD_CONTEXT_ID";
export const DASHBOARD_COMPANY_CHART_ID = "DASHBOARD_COMPANY_CHART_ID";
export const DASHBOARD_COMPANY_HOURS_ID = "DASHBOARD_COMPANY_HOURS_ID";
export const DASHBOARD_COMPANY_LEAVES_ID = "DASHBOARD_COMPANY_LEAVES_ID";
export const DASHBOARD_COMPANY_PROJECTS_STATS_ID =
  "DASHBOARD_COMPANY_PROJECTS_STATS_ID";
export const DASHBOARD_COMPANY_EMPLOYEES_STATS_ID =
  "DASHBOARD_COMPANY_EMPLOYEES_STATS_ID";
export const COMPANY_EMPLOYEE_STATS_ID = "COMPANY_EMPLOYEE_STATS_ID";
//https://jasonsalzman.github.io/react-add-to-calendar/
export const LOADER_STYLE = {
  position: "unset",
  left: "0px",
  right: "0px",
  top: "0px",
  bottom: "0px",
  display: "flex",
  zIndex: "3",
  backgroundColor: "rgba(0, 0, 0, 0.3)",
  height: "250px",
};

export const SUPER_ADMIN_ID = null;
export const PRODUCT_EXTEND_ID = "PRODUCT_EXTEND_ID";
export const IMMEDIATE_RESPONSE =
  "For immediate response, please contact us at +1 415 830 3674 or email us at info@metasyssoftware.com";

export const USER_ENTRIES = "User Entries";
export const SUMMARY_TEAM_REPORT = "Summary Team Report";
export const DETAILED_TEAM_REPORT = "Detailed Team Report";
export const MONTHLY_ROLLING_REPORT = "Monthly Rolling Report";
export const CUSTOM_REPORT = "Custom Report";
export const REFERENCE_NO_REPORT = "Reference Number Report";
export const REVIEW_ENTRIES = "Review Entries";
export const TASK_REPO = "Task Report";
export const DEFAULTER_LIST = "Defaulter List";
export const MANAGEMENT_REPORT = "Management Report";
export const SUMMARY_REPORT = "Summary Report";
