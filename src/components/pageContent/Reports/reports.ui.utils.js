import React from "react";
import moment from "moment";

import report_customReports_employee_table from "../../json/reports/custom report/report_customReports_employee_table.json";
import report_customReports_employee_billable_table from "../../json/reports/custom report/report_customReports_employee_billable_table.json";
import report_customReports_employee_nonbillable_table from "../../json/reports/custom report/report_customReports_employee_nonbillable_table.json";
import report_customReports_project_table from "../../json/reports/custom report/report_customReports_project_table.json";
import report_customReports_project_billable_table from "../../json/reports/custom report/report_customReports_project_billable_table.json";
import report_customReports_project_nonbillable_table from "../../json/reports/custom report/report_customReports_project_nonbillable_table.json";
import report_customReports_date_table from "../../json/reports/custom report/report_customReports_date_table.json";
import report_customReports_date_billable_table from "../../json/reports/custom report/report_customReports_date_billable_table.json";
import report_customReports_date_nonbillable_table from "../../json/reports/custom report/report_customReports_date_nonbillable_table.json";

import report_defaulterList_employee_date_table from "../../json/reports/defaulter list/report_defaulterList_employee_date_table.json";
import report_defaulterList_date_employee_table from "../../json/reports/defaulter list/report_defaulterList_date_employee_table.json";
import report_defaulterList_expanded_employee_date_table from "../../json/reports/defaulter list/report_defaulterList_expanded_employee_date_table.json";
import report_defaulterList_expanded_date_employee_table from "../../json/reports/defaulter list/report_defaulterList_expanded_date_employee_table.json";

import report_managementReport_project_table from "../../json/reports/management report/report_managementReport_project_table.json";
import report_managementReport_project_category_table from "../../json/reports/management report/report_managementReport_project_category_table.json";
import report_managementReport_employee_table from "../../json/reports/management report/report_managementReport_employee_table.json";
import report_managementReport_employee_category_table from "../../json/reports/management report/report_managementReport_employee_category_table.json";

import report_reviewEntries_employee_table from "../../json/reports/review entries/report_reviewEntries_employee_table.json";
import report_reviewEntries_employee_billable_table from "../../json/reports/review entries/report_reviewEntries_employee_billable_table.json";
import report_reviewEntries_employee_nonbillable_table from "../../json/reports/review entries/report_reviewEntries_employee_nonbillable_table.json";
import report_reviewEntries_project_table from "../../json/reports/review entries/report_reviewEntries_project_table.json";
import report_reviewEntries_project_billable_table from "../../json/reports/review entries/report_reviewEntries_project_billable_table.json";
import report_reviewEntries_project_nonbillable_table from "../../json/reports/review entries/report_reviewEntries_project_nonbillable_table.json";
import report_reviewEntries_date_table from "../../json/reports/review entries/report_reviewEntries_date_table.json";
import report_reviewEntries_date_billable_table from "../../json/reports/review entries/report_reviewEntries_date_billable_table.json";
import report_reviewEntries_date_nonbillable_table from "../../json/reports/review entries/report_reviewEntries_date_nonbillable_table.json";

import report_summaryReport_project_table from "../../json/reports/summary report/report_summaryReport_project_table.json";
import report_summaryReport_project_category_table from "../../json/reports/summary report/report_summaryReport_project_category_table.json";
import report_summaryReport_employee_table from "../../json/reports/summary report/report_summaryReport_employee_table.json";
import report_summaryReport_employee_category_table from "../../json/reports/summary report/report_summaryReport_employee_category_table.json";

import report_taskReport_table from "../../json/reports/task report/report_taskReport_table.json";
import report_taskReport_table_billable from "../../json/reports/task report/report_taskReport_table_billable.json";

import report_userEntries_date_table from "../../json/reports/user entries/report_userEntries_date_table.json";
import report_userEntries_date_billable_table from "../../json/reports/user entries/report_userEntries_date_billable_table.json";
import report_userEntries_date_nonbillable_table from "../../json/reports/user entries/report_userEntries_date_nonbillable_table.json";
import report_userEntries_project_table from "../../json/reports/user entries/report_userEntries_project_table.json";
import report_userEntries_project_billable_table from "../../json/reports/user entries/report_userEntries_project_billable_table.json";
import report_userEntries_project_nonbillable_table from "../../json/reports/user entries/report_userEntries_project_nonbillable_table.json";

import report_userEntries_employee_date_table from "../../json/reports/user entries/report_userEntries_employee_date_table.json";
import report_userEntries_employee_date_billable_table from "../../json/reports/user entries/report_userEntries_employee_date_billable_table.json";
import report_userEntries_employee_date_nonbillable_table from "../../json/reports/user entries/report_userEntries_employee_date_nonbillable_table.json";
import report_userEntries_employee_project_table from "../../json/reports/user entries/report_userEntries_employee_project_table.json";
import report_userEntries_employee_project_billable_table from "../../json/reports/user entries/report_userEntries_employee_project_billable_table.json";
import report_userEntries_employee_project_nonbillable_table from "../../json/reports/user entries/report_userEntries_employee_project_nonbillable_table.json";

import Icon from "../../widgets/Icon";

export function getExpandIcon(isTableData, expandIconName, expandIconTitle) {
  if (isTableData === "yes")
    return (
      <div className="accordion-inner-div-right">
        <Icon
          icon={expandIconName}
          className="expand-icon"
          title={expandIconTitle}
        />
      </div>
    );
  else
    return (
      <div
        className="accordion-inner-div-right"
        style={{ visibility: "hidden" }}
      >
        <Icon
          icon={expandIconName}
          className="expand-icon"
          title={expandIconTitle}
        />
      </div>
    );
}

export function displayTotalHrs(estimated) {
  return (
    <div className="pr-col-2">
      <span>
        <b>Total Duration: &nbsp;</b>
      </span>
      <span>{estimated}</span>
    </div>
  );
}

export function displayBillableHrs(billable) {
  return (
    <div className="pr-col-2">
      <span>
        <b>Total Billable: &nbsp;</b>
      </span>
      <span>{billable}</span>
    </div>
  );
}

export function displayNonBillableHrs(nonbillableHrs) {
  return (
    <div className="pr-col-2">
      <span>
        <b>Total Non Billable: &nbsp;</b>
      </span>
      <span>{nonbillableHrs}</span>
    </div>
  );
}

export function displayTotalWorkingHours(business_hours) {
  return (
    <div className="pr-col-2">
      <span>
        <b>Total Working Hours: &nbsp;</b>
      </span>
      <span>{business_hours}</span>
    </div>
  );
}

export function displayTotalWorkingDays(business_days) {
  return (
    <div className="pr-col-2">
      <span>
        <b>Total Working Days: &nbsp;</b>
      </span>
      <span>{business_days}</span>
    </div>
  );
}

export function displayProjectName(pro_name, prNewCol = "") {
  let classNameFromFunc = "pr-col-9";
  if (prNewCol && prNewCol !== "") {
    classNameFromFunc = prNewCol;
  }

  return (
    <div className={classNameFromFunc}>
      <span className="pr-col-2-no-wrap">
        <b>Project Name: &nbsp;</b>
      </span>
      <span className="pr-col-2-no-wrap">{pro_name}</span>
    </div>
  );
}

export function displaySprintName(sprintName, prNewCol = "") {
  let classNameFromFunc = "pr-col-9";
  if (prNewCol && prNewCol !== "") {
    classNameFromFunc = prNewCol;
  }
  return (
    <div className={classNameFromFunc}>
      <span>
        <b>Sprint: &nbsp;</b>
      </span>
      <span>{sprintName}</span>
    </div>
  );
}

export function displayTaskName(taskName) {
  return (
    <div className="pr-col-9">
      <span>
        <b>Task: &nbsp;</b>
      </span>
      <span>{taskName}</span>
    </div>
  );
}

export function displaySubTaskName(subTaskName) {
  return (
    <div className="pr-col-9">
      <span>
        <b>Sub Task: &nbsp;</b>
      </span>
      <span>{subTaskName}</span>
    </div>
  );
}

export function displayEmpName(emp_name, prNewCol = "") {
  let classNameFromFunc = "pr-col-3";
  if (prNewCol && prNewCol !== "") {
    classNameFromFunc = prNewCol;
  }
  return (
    <div className={classNameFromFunc}>
      <span>
        <b>Employee: &nbsp;</b>
      </span>
      <span>{emp_name}</span>
    </div>
  );
}

export function displayFromDate(fromDate) {
  return (
    <div className="pr-col-2">
      <span>
        <b>From: &nbsp;</b>
      </span>
      <span>{moment(fromDate).format("DD-MMM-YYYY")}</span>
    </div>
  );
}

export function displayToDate(toDate) {
  return (
    <div className="pr-col-2">
      <span>
        <b>To: &nbsp;</b>
      </span>
      <span>{moment(toDate).format("DD-MMM-YYYY")}</span>
    </div>
  );
}

export function getJsonTableFile(
  reportName,
  sort_by = "",
  billableBool = false,
  nonbillableBool = false,
  emp_name = "",
  summary_by = "",
  category = "",
  view_by = ""
) {
  if (reportName === "Review Entries") {
    if (sort_by === "employee") {
      if (billableBool === false && nonbillableBool === false) {
        return report_reviewEntries_employee_table;
      } else if (billableBool === true) {
        return report_reviewEntries_employee_billable_table;
      } else if (nonbillableBool === true) {
        return report_reviewEntries_employee_nonbillable_table;
      }
    } else if (sort_by === "date") {
      if (billableBool === false && nonbillableBool === false) {
        return report_reviewEntries_date_table;
      } else if (billableBool === true) {
        return report_reviewEntries_date_billable_table;
      } else if (nonbillableBool === true) {
        return report_reviewEntries_date_nonbillable_table;
      }
    } else if (sort_by === "project") {
      if (billableBool === false && nonbillableBool === false) {
        return report_reviewEntries_project_table;
      } else if (billableBool === true) {
        return report_reviewEntries_project_billable_table;
      } else if (nonbillableBool === true) {
        return report_reviewEntries_project_nonbillable_table;
      }
    }
  } else if (reportName === "Custom Report") {
    if (sort_by === "employee") {
      if (billableBool === false && nonbillableBool === false) {
        return report_customReports_employee_table;
      } else if (billableBool === true) {
        return report_customReports_employee_billable_table;
      } else if (nonbillableBool === true) {
        return report_customReports_employee_nonbillable_table;
      }
    } else if (sort_by === "date") {
      if (billableBool === false && nonbillableBool === false) {
        return report_customReports_date_table;
      } else if (billableBool === true) {
        return report_customReports_date_billable_table;
      } else if (nonbillableBool === true) {
        return report_customReports_date_nonbillable_table;
      }
    } else if (sort_by === "project") {
      if (billableBool === false && nonbillableBool === false) {
        return report_customReports_project_table;
      } else if (billableBool === true) {
        return report_customReports_project_billable_table;
      } else if (nonbillableBool === true) {
        return report_customReports_project_nonbillable_table;
      }
    }
  } else if (reportName === "User Entries") {
    if (emp_name !== "All") {
      if (sort_by === "date") {
        if (billableBool === true && nonbillableBool === false) {
          return report_userEntries_employee_date_billable_table;
        } else if (nonbillableBool === true && billableBool === false) {
          return report_userEntries_employee_date_nonbillable_table;
        } else {
          return report_userEntries_employee_date_table;
        }
      } else if (sort_by === "project") {
        if (billableBool === true && nonbillableBool === false) {
          return report_userEntries_employee_project_billable_table;
        } else if (nonbillableBool === true && billableBool === false) {
          return report_userEntries_employee_project_nonbillable_table;
        } else {
          return report_userEntries_employee_project_table;
        }
      }
    } else if (emp_name === "All") {
      if (sort_by === "date") {
        if (billableBool === true && nonbillableBool === false) {
          return report_userEntries_date_billable_table;
        } else if (nonbillableBool === true && billableBool === false) {
          return report_userEntries_date_nonbillable_table;
        } else {
          return report_userEntries_date_table;
        }
      } else if (sort_by === "project") {
        if (billableBool === true && nonbillableBool === false) {
          return report_userEntries_project_billable_table;
        } else if (nonbillableBool === true && billableBool === false) {
          return report_userEntries_project_nonbillable_table;
        } else {
          return report_userEntries_project_table;
        }
      }
    }
  } else if (reportName === "Task Report") {
    if (billableBool === true) {
      return report_taskReport_table_billable;
    } else {
      return report_taskReport_table;
    }
  } else if (reportName === "Summary Report") {
    if (summary_by === "Project") {
      if (category === "0") {
        return report_summaryReport_project_table;
      } else {
        return report_summaryReport_project_category_table;
      }
    } else if (summary_by === "Employee") {
      if (category === "0") {
        return report_summaryReport_employee_table;
      } else {
        return report_summaryReport_employee_category_table;
      }
    }
  } else if (reportName === "Management Report") {
    if (sort_by === "employee") {
      if (category === "1") {
        return report_managementReport_employee_category_table;
      } else {
        return report_managementReport_employee_table;
      }
    } else if (sort_by === "project") {
      if (category === "1") {
        return report_managementReport_project_category_table;
      } else {
        return report_managementReport_project_table;
      }
    }
  } else if (reportName === "Defaulter List") {
    if (view_by === "collapsed") {
      if (sort_by === "date") {
        return report_defaulterList_date_employee_table;
      } else if (sort_by === "employee") {
        return report_defaulterList_employee_date_table;
      }
    } else {
      if (sort_by === "date") {
        return report_defaulterList_expanded_date_employee_table;
      } else if (sort_by === "employee") {
        return report_defaulterList_expanded_employee_date_table;
      }
    }
  }
}
