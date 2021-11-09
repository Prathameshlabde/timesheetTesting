import React, { Component } from "react";
import { connect } from "react-redux";
import { Map } from "immutable";

import {
  displayTotalHrs,
  displayBillableHrs,
  displayNonBillableHrs,
  displayTotalWorkingHours,
  displayTotalWorkingDays,
  displayProjectName,
  displaySprintName,
  displayTaskName,
  displaySubTaskName,
  displayEmpName,
  displayFromDate,
  displayToDate,
} from "./reports.ui.utils";
import { getDataFromCookie } from "../../utils/CheckLoginDetails";
import { dateFormatter } from "../../utils/calender.utils";
import { stringDateToMoment } from "../../utils/common.utils";
import Colors from "../../common/colors";

class ReportSubDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mainDivStyle: {
        fontSize: "14px",
        color: Colors.textColor,
        border: Colors.newBgColor,
        borderTop: "1px solid #d2d2d2",
        borderBottom: "1px solid #d2d2d2",
        marginTop: "10px",
        background: Colors.newBgColor,
        padding: "0.4% 1.3%",
      },
      mainDivStyle2: {
        fontSize: "14px",
        color: Colors.textColor,
        border: Colors.newBgColor,
        borderTop: "none",
        borderBottom: "none",
        marginTop: "10px",
        background: Colors.newBgColor,
        padding: "0.4% 1.3%",
      },
    };
  }

  getAllHours(data) {
    return data.billableBool === false && data.nonbillableBool === false ? (
      <div className="pr-row">
        {displayTotalHrs(data.totalDuration)}
        {displayBillableHrs(data.bilable_hrs)}
        {displayNonBillableHrs(data.non_bilable_hrs)}
      </div>
    ) : data.billableBool === true && data.nonbillableBool === false ? (
      <div className="pr-row">{displayBillableHrs(data.bilable_hrs)}</div>
    ) : data.billableBool === false && data.nonbillableBool === true ? (
      <div className="pr-row">
        {displayNonBillableHrs(data.non_bilable_hrs)}
      </div>
    ) : null;
  }

  getTotalAndBillable(data) {
    return (
      <div className="pr-row">
        {displayTotalHrs(data.totalDuration)}
        {displayBillableHrs(data.bilable_hrs)}
      </div>
    );
  }

  getWorkingData(data) {
    return (
      <div className="pr-row">
        {displayTotalWorkingDays(data.business_days)}
        {displayTotalWorkingHours(data.business_hours)}
      </div>
    );
  }

  getDates(data) {
    console.log('data',data); 
    const mfdate = dateFormatter(
      stringDateToMoment(data.fromDate),
      "yyyy-MM-dd"
    );
    const mtdate = dateFormatter(stringDateToMoment(data.toDate), "yyyy-MM-dd");
    
    return (
      <div className="pr-row">
        {displayFromDate(mfdate)}
        {displayToDate(mtdate)}
      </div>
    );
  }

  renderUserEntries(data, mainDivStyle) {
    return (
      <div className="pr-container" style={mainDivStyle}>
        <div className="pr-row">
          {displayFromDate(data.fromDate)}
          {displayToDate(data.toDate)}

          {getDataFromCookie().role !== "employee" &&
          getDataFromCookie().role !== "pm"
            ? displayEmpName(data.emp_name)
            : null}
        </div>
        <div className="pr-row">
          {displayProjectName(data.pro_name)}
          {displaySprintName(data.sprint_name)}
          {displayTaskName(data.task_name)}
          {displaySubTaskName(data.subtask_name)}
        </div>
        {data.business_days &&
        data.business_hours &&
        getDataFromCookie().role !== "employee" &&
        getDataFromCookie().role !== "pm" &&
        data.emp_name !== "All"
          ? this.getWorkingData(data)
          : getDataFromCookie().role === "employee"
            ? this.getWorkingData(data)
            : null}

        {this.getAllHours(data)}
      </div>
    );
  }

  renderTaskReport(data, mainDivStyle) {
    return (
      <div className="pr-container" style={mainDivStyle}>
        {this.getDates(data)}

        <div className="pr-row">
          {displayEmpName(data.emp_name, "pr-col-4")}
        </div>
        <div className="pr-row">
          {displayProjectName(data.pro_name, "pr-col-4")}
        </div>

        {data.sprint_name !== "" ? (
          <div className="pr-row">
            {displaySprintName(data.sprint_name, "pr-col-4")}
          </div>
        ) : null}
      </div>
    );
  }

  renderSummaryReport(data, mainDivStyle) {
    return (
      <div className="pr-container" style={mainDivStyle}>
        {this.getDates(data)}
        {this.getTotalAndBillable(data)}
      </div>
    );
  }

  renderReviewEntries(data, mainDivStyle) {
    return (
      <div className="pr-container" style={mainDivStyle}>
        {this.getDates(data)}
        <div className="pr-row">{displayEmpName(data.emp_name)}</div>
        <div className="pr-row">{displayProjectName(data.pro_name)}</div>
        {data.emp_name && data.emp_name !== "All"
          ? this.getWorkingData(data)
          : null}
        {this.getAllHours(data)}
      </div>
    );
  }

  renderReferenceNoReport(data, mainDivStyle) {
    return (
      <div className="pr-container" style={mainDivStyle}>
        {this.getDates(data)}
        {getDataFromCookie().role !== "employee" ? (
          <div className="pr-row">{displayEmpName(data.emp_name)}</div>
        ) : null}

        {displayProjectName(data.pro_name)}
        {this.getTotalAndBillable(data)}
      </div>
    );
  }

  renderManagementReport(data, mainDivStyle) {
    return (
      <div className="pr-container" style={mainDivStyle}>
        {this.getDates(data)}
        <div className="pr-row">
          {displayEmpName(data.emp_name, "pr-col-2")}
          {displayProjectName(data.pro_name, "pr-col-2")}
        </div>
        {this.getTotalAndBillable(data)}
      </div>
    );
  }

  renderDefaulterList(data, mainDivStyle) {
    return (
      <div className="pr-container" style={mainDivStyle}>
        {/* {this.getDates(data)} */}
        <div className="pr-row">
          {displayFromDate(data.fromDate)}
          {displayToDate(data.toDate)}
        </div>
      </div>
    );
  }

  renderCustomReport(data, mainDivStyle) {
    return (
      <div className="pr-container" style={mainDivStyle}>
        <div className="pr-row">
          {displayFromDate(data.fromDate)}
          {displayToDate(data.toDate)}
          {data.emp_name && getDataFromCookie().role !== "employee"
            ? displayEmpName(data.emp_name)
            : null}
        </div>
        <div className="pr-row">
          {data.pro_name && data.pro_name !== ""
            ? displayProjectName(data.pro_name)
            : null}
          {data.sprint_name && data.sprint_name !== ""
            ? displaySprintName(data.sprint_name)
            : null}
          {data.task_name && data.task_name !== ""
            ? displayTaskName(data.task_name)
            : null}
          {data.subtask_name && data.subtask_name !== ""
            ? displaySubTaskName(data.subtask_name)
            : null}
        </div>
        {data.emp_name && data.emp_name !== "All"
          ? this.getWorkingData(data)
          : null}

        {this.getAllHours(data)}
      </div>
    );
  }

  render() {
    const { data } = this.props;

    let mainDivStyle = this.state.mainDivStyle;

    return data.reportTitle === "User Entries"
      ? this.renderUserEntries(data, mainDivStyle)
      : data.reportTitle === "Task Report"
        ? this.renderTaskReport(data, mainDivStyle)
        : data.reportTitle === "Summary Report"
          ? this.renderSummaryReport(data, mainDivStyle)
          : data.reportTitle === "Review Entries"
            ? this.renderReviewEntries(data, mainDivStyle)
            : data.reportTitle === "Reference Number Report"
              ? this.renderReferenceNoReport(data, mainDivStyle)
              : data.reportTitle === "Management Report"
                ? this.renderManagementReport(data, mainDivStyle)
                : data.reportTitle === "Defaulter List"
                  ? this.renderDefaulterList(data, this.state.mainDivStyle2)
                  : data.reportTitle === "Custom Report"
                    ? this.renderCustomReport(data, mainDivStyle)
                    : null;
  }
}

export function mapStateToProps(state, ownProps) {
  const { component } = state;
  const id = ownProps.id;
  return {
    componentState: component.get(id, Map()),
  };
}

export default connect(
  mapStateToProps,
  {}
)(ReportSubDetails);
