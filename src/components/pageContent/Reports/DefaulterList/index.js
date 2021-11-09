import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Map } from "immutable";
import {
  clearComponentState,
  updateComponentState,
  deleteComponentState,
} from "../../../../actions/component.actions.js";

import {
  REPORT_SUBMENU_ID_DEF,
  REPORT_JSONFILE,
  REPORT_SUBMENU_ID,
  APP_TITLE_SUBTITLE,
  REPORTS_MSG_DATA_NOT_FOUND,
  ICON_TITLE_COLLAPSE,
  EXPAND_LESS_ICON_NAME,
  ENTER_SEARCH_CRITERIA,
  TITLE_SUBTITLE_ID,
  IS_RELOAD,
  SORT_BY,
  VIEW_BY,
  SNACKBAR_ID,
  SNACKBAR_SHOW,
  LOADER_ID,
  LOADER_SHOW,
  DEFAULT_OPTION,
  ERROR_STR,
} from "../../../../constants/app.constants.js";
import {
  setCurrentProps,
  getDataFromUtils,
  clearDataFromUtils,
  fetchEmployeeList,
  getPropsButtonSubmit,
  sendReminderToEmp,
  getLastReminderData,
} from "./defaulterList.utils.js";

import { requestData, clearData } from "../../../../actions/data.actions.js";
import ReportTableViewDefaulterList from "../../../widgets/TableView/ReportTableViewDefaulterList.js";
import ReportTableView from "../../../widgets/TableView/ReportTableView.js";
import { dataAbstractionForReport } from "../../../utils/dataAbstraction.utils.js";
import moment from "moment";
import { getDataFromCookie } from "../../../utils/CheckLoginDetails";
import RenderReport from "../RenderReport";
import DropdownList from "../../../widgets/DropdownList";
import Button from "../../../widgets/Button";
import { getExpandIcon, getJsonTableFile } from "../reports.ui.utils.js";
import { getDownArrowObj, getUpArrowObj } from "../Reports.utils.js";
import ReportSubDetails from "../ReportSubDetails.js";

class DefaulterList extends Component {
  static propTypes = {
    id: PropTypes.string,
    componentState: PropTypes.object.isRequired,
    updateComponentState: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedFromDate: moment(),
      selectedToDate: moment(),
      sort_by: "date",
      view_by: "expanded",
      dataObject: "",
      reportData: {
        rows: [],
      },
      subTotalindexes: { indexes: [] },
      isFillIndexes: { indexes: [] },
      leavesIndex: { indexes: [] },
      isTableData: "null",
      isFormExpand: true,
      expandIconName: EXPAND_LESS_ICON_NAME,
      expandIconTitle: ICON_TITLE_COLLAPSE,
      criteriyaMessage: ENTER_SEARCH_CRITERIA,
      classNameDiv: "",
      weeksData: [
        {
          id: "0",
          name: "Current Week",
        },
        {
          id: "1",
          name: "Last Week",
        },
        {
          id: "2",
          name: "Last 2 Weeks",
        },
      ],
      weekSelected: DEFAULT_OPTION,
      errReminder: "",
      lastReminderData: [],
      last_reminder_date: "",
      // weeksData: { "Current": "0"; "Last Week": "1"; "Last 2 Week": "2" }
    };
  }

  componentWillMount() {
    const { id, requestData, updateComponentState } = this.props;

    let titleSub = {
      title: "Reports",
      subtitle: "Defaulter List",
    };

    getLastReminderData(this.props).then((response) => {
      if (response.apiData !== "") {
        this.setState({
          lastReminderData: response.apiData[0],
          last_reminder_date: response.apiData[0].last_reminder_date,
        });
      }
    });

    updateComponentState(REPORT_SUBMENU_ID, SORT_BY, "date");
    updateComponentState(REPORT_SUBMENU_ID, VIEW_BY, "expanded");
    updateComponentState(TITLE_SUBTITLE_ID, APP_TITLE_SUBTITLE, titleSub);
    updateComponentState(REPORT_SUBMENU_ID, IS_RELOAD, false);
    setCurrentProps(this.props);

    fetchEmployeeList({ id, requestData });
    let LoggedInUserFromRedux = "employee";
    if (getDataFromCookie().role) {
      LoggedInUserFromRedux = getDataFromCookie().role; //from redux state
    }
    this.setState({
      LoggedInUser: LoggedInUserFromRedux,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { reportState } = this.props;

    if (this.props.employeeData !== nextProps.employeeData) {
      this.setState({
        employeeData: nextProps.employeeData.apiData,
      });
    }

    if (this.props.defaulterData !== nextProps.defaulterData) {
      if (nextProps.defaulterData && nextProps.defaulterData.apiData) {
        const sort_by_prop = reportState.get(SORT_BY, ERROR_STR);
        const view_by_prop = reportState.get(VIEW_BY, ERROR_STR);

        let sort_by = this.state.sort_by;
        if (sort_by_prop !== ERROR_STR) {
          sort_by = sort_by_prop;
          this.setState({
            sort_by: sort_by_prop,
          });
        }

        if (view_by_prop !== ERROR_STR) {
          this.setState({
            view_by: view_by_prop,
          });
        }

        let subTotalindexesArr = [];
        let isFillIndexesArr = [];
        let leavesIndexArr = [];
        let subTotalIndex = 6;
        if (sort_by === "employee") {
          subTotalIndex = 1;
        }

        for (let i = 0; i < nextProps.defaulterData.apiData.rows.length; i++) {
          if (
            nextProps.defaulterData.apiData.rows[i][subTotalIndex] ===
            "Sub Total"
          ) {
            subTotalindexesArr.push(i + 1);
          }
          if (nextProps.defaulterData.apiData.rows[i][7] === "0") {
            isFillIndexesArr.push(i + 1);
          }

          if (nextProps.defaulterData.apiData.rows[i][8] === "45") {
            leavesIndexArr.push(i + 1);
          }
        }

        this.setState(
          {
            defaulterData: nextProps.defaulterData,
          },
          () => {
            let reportDashBoard;
            let reportTableData;
            let dataObj = getDataFromUtils();
            dataObj["reportTitle"] = "Defaulter List";
            reportDashBoard = dataAbstractionForReport(
              nextProps.defaulterData.apiData,
              this.getRespectiveJsonTableFile(dataObj),
              this.props,
              ""
            );

            reportTableData = reportDashBoard.tableData;
            if (reportTableData) {
              this.setState({
                isTableData: "yes",
                reportData: reportTableData,
                subTotalindexes: { indexes: [subTotalindexesArr] },
                isFillIndexes: { indexes: [isFillIndexesArr] },
                leavesIndex: { indexes: [leavesIndexArr] },
                dataObject: dataObj,
                sort_by: dataObj.sort_by,
                view_by: dataObj.view_by,
              });

              //To hide Form
              this.showForm();
            }
          }
        );
      } else {
        this.setState({
          isTableData: "no",
          reportData: {
            rows: [],
          },
          isFillIndexes: { indexes: [] },
          subTotalindexes: { indexes: [] },
          leavesIndex: { indexes: [] },

          dataObject: "",
        });
      }
    }
  }

  componentWillUnmount() {
    clearDataFromUtils();

    this.setState({
      LoggedInUser: "",
      selectedFromDate: moment(),
      selectedToDate: moment(),

      sort_by: "date",
      view_by: "expanded",
      reportData: {
        rows: [],
      },
      leavesIndex: { indexes: [] },
      isFillIndexes: { indexes: [] },
      subTotalindexes: { indexes: [] },
      isFormExpand: true,
      expandIconName: EXPAND_LESS_ICON_NAME,
      expandIconTitle: ICON_TITLE_COLLAPSE,
      criteriyaMessage: ENTER_SEARCH_CRITERIA,
      classNameDiv: "",
      dataObject: "",
    });

    const { clearData, updateComponentState } = this.props;
    const clearParams = {
      id: "DEFAULTER_LIST_TEMP_ID",
    };

    clearData(clearParams);
    updateComponentState(REPORT_SUBMENU_ID, SORT_BY, "");
  }

  getRespectiveJsonTableFile(dataObj) {
    return getJsonTableFile(
      "Defaulter List",
      dataObj.sort_by,
      false,
      false,
      "",
      "",
      "",
      dataObj.view_by
    );
  }

  getAllPropsForComponent() {
    const submitButton = getPropsButtonSubmit();
    return {
      submitButton,
    };
  }

  showForm() {
    this.setState(
      {
        isFormExpand: !this.state.isFormExpand,
      },
      () => {
        let obj;
        if (this.state.isFormExpand === true) {
          obj = getDownArrowObj();
        } else {
          obj = getUpArrowObj();
        }
        this.setState({
          expandIconName: obj.name,
          expandIconTitle: obj.title,
          criteriyaMessage: obj.message,
          classNameDiv: obj.div,
        });
      }
    );
  }

  onChangeFieldValues = (id, updatedValue) => {
    if (id === "weeks") {
      this.setState({
        weekSelected: updatedValue,
      });
    }
  };

  sendReminder = () => {
    const { updateComponentState } = this.props;

    if (this.state.weekSelected === DEFAULT_OPTION) {
      this.setState({
        errReminder: "Please select week option to send reminder",
      });
    } else if (
      moment(this.state.last_reminder_date).isSame(Date.now(), "day") === true
    ) {
      this.setState({
        errReminder:
          "You have already sent reminder today from date " +
          this.state.lastReminderData.selected_date,
      });
    } else {
      updateComponentState(LOADER_ID, LOADER_SHOW, {
        showLoader: true,
      });

      this.setState({
        errReminder: "",
      });
      sendReminderToEmp(this.props, this.state.weekSelected).then(
        (response) => {
          updateComponentState(LOADER_ID, LOADER_SHOW, {
            showLoader: false,
          });

          if (response.apiData === "success") {
            updateComponentState(SNACKBAR_ID, SNACKBAR_SHOW, {
              showSnackBar: true,
              snackMessage: "Reminder email sent.",
            });

            getLastReminderData(this.props).then((response) => {
              if (response.apiData !== "") {
                this.setState({
                  lastReminderData: response.apiData[0],
                  last_reminder_date: response.apiData[0].last_reminder_date,
                });
              }
            });
          } else {
            var remMsg = "";
            if (response.apiData === false) {
              remMsg = "Some unknown error while sending reminder email";
            } else {
              remMsg = "Reminder not sent to : " + response.apiData;
            }

            this.setState({
              errReminder: remMsg,
            });

            updateComponentState(SNACKBAR_ID, SNACKBAR_SHOW, {
              showSnackBar: true,
              snackMessage: remMsg,
            });
          }
        }
      );
    }
  };

  render() {
    const props = this.getAllPropsForComponent();
    const { isTableData } = this.state;
    const { reportState } = this.props;
    const reportJsonFileName = reportState.get(REPORT_JSONFILE, ERROR_STR);

    var reminderDate = "";

    var lastDate = moment(
      this.state.lastReminderData.last_reminder_date
    ).format("D MMM Y");

    if (lastDate !== "Invalid date") {
      reminderDate = "Last Notification sent on " + lastDate;
    }

    return (
      <div className="page-content-form" id="report-defaulter">
        <div
          className="pr-container"
          style={{
            background: "#ebebeb",
            color: "#151718",
            marginBottom: "5px",
            display: "-webkit-box",
          }}
        >
          <div className="pr-row">
            <h5 style={{ width: "200px" }}>
              <DropdownList
                id="weeks"
                dropDownData={this.state.weeksData}
                onChange={this.onChangeFieldValues}
                defaultOption="---Select---"
                selectedID={this.state.weekSelected}
              />
              <div style={{ marginTop: "5px" }}>
                <span
                  style={{
                    color: "#767676",
                    whiteSpace: "nowrap",
                  }}
                >
                  {reminderDate}
                </span>
              </div>
            </h5>
            <h5>
              <Button
                className="button-submit"
                {...props.submitButton}
                onClick={this.sendReminder}
              />
              <span style={{ color: "red" }}>{this.state.errReminder}</span>
            </h5>
          </div>
        </div>
        <div className="pr-col-accordion" onClick={() => this.showForm()}>
          <div className="accordion-inner-div-left">
            {this.state.criteriyaMessage}
          </div>
          {getExpandIcon(
            this.state.isTableData,
            this.state.expandIconName,
            this.state.expandIconTitle
          )}
        </div>

        <RenderReport
          jsonFile={reportJsonFileName}
          reportStates={this.state}
          reportProps={this.props}
        />

        <div className="report-components-section2">
          {this.state.reportData &&
          isTableData !== "null" &&
          isTableData !== "no" ? (
            <ReportSubDetails data={this.state.dataObject} />
          ) : null}
        </div>

        <div id="def_list">
          <div className="report-table-section">
            {isTableData === "yes" && this.state.view_by === "expanded" ? (
              <div style={{ width: "100%" }}>
                <div
                  style={{ display: "flow-root" }}
                  className="row deflist-infobox"
                >
                  <div className="def_leaveBox">
                    <span>Leave</span>
                  </div>
                  <div className="def_notFIlledBox">
                    <span>Not Filled</span>
                  </div>
                </div>
                <ReportTableView
                  {...this.state.reportData}
                  subTotalindexes={this.state.subTotalindexes}
                  isFillIndexes={this.state.isFillIndexes}
                  leavesIndex={this.state.leavesIndex}
                  hideExcel="true"
                  headFix="true"
                />
              </div>
            ) : isTableData === "yes" && this.state.view_by === "collapsed" ? (
              <ReportTableViewDefaulterList
                {...this.state.reportData}
                employeeData={this.state.employeeData}
                dataObject={this.state.dataObject}
                defaulterDateData={this.state.defaulterData}
              />
            ) : isTableData === "no" ? (
              <div>{REPORTS_MSG_DATA_NOT_FOUND}</div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const { data } = state;
  const id = ownProps.id;
  return {
    componentState: state.component.get(id, Map()),
    reportState: state.component.get(REPORT_SUBMENU_ID, Map()),
    defaulterData: data.getIn([REPORT_SUBMENU_ID_DEF, "apiData"], null),
    employeeData: data.getIn(["DEFAULTER_LIST_TEMP_ID", "apiData"], null),
  };
}

export default connect(
  mapStateToProps,
  {
    clearComponentState,
    updateComponentState,
    deleteComponentState,
    requestData,
    clearData,
  }
)(DefaulterList);
