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
  REPORT_JSONFILE,
  REPORT_SUBMENU_ID,
  SUMMARY_BY,
  CATEGORY,
  APP_TITLE_SUBTITLE,
  REPORTS_MSG_DATA_NOT_FOUND,
  ICON_TITLE_COLLAPSE,
  EXPAND_LESS_ICON_NAME,
  ENTER_SEARCH_CRITERIA,
  TITLE_SUBTITLE_ID,
  LOADER_ID,
  LOADER_SHOW,
  SUMMARY_REPORT_VALIDATION,
  ERROR_STR,
  DASHBOARD_NAVIGATE_ID,
} from "../../../../constants/app.constants.js";

import { requestData, clearData } from "../../../../actions/data.actions.js";
import {
  fetchReport,
  clearReport,
} from "../../../../actions/report.actions.js";
import {
  setCurrentProps,
  clearDataFromUtils,
  getDefaultDetailsData,
  getDataFromUtils,
} from "./summaryReport.utils.js";
import { getDataFromCookie } from "../../../utils/CheckLoginDetails";
import RenderReport from "../RenderReport";
import { getExpandIcon, getJsonTableFile } from "../reports.ui.utils.js";
import SummaryReportTableView from "../../../widgets/TableView/SummaryReportTableView.js";
import moment from "moment";
import { getDownArrowObj, getUpArrowObj } from "../Reports.utils.js";
import ReportSubDetails from "../ReportSubDetails.js";
import { isEmpty } from "../../../utils/common.utils.js";
import ReportTableView from "../../../widgets/TableView/ReportTableView.js";
import { dataAbstractionForReport } from "../../../utils/dataAbstraction.utils.js";

class SummaryReport extends Component {
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
      emp_id: "",
      billable: "0",
      estimated: "0",
      summary_by: "Project",
      category: "1",
      reportData: {
        rows: [],
      },
      isTableData: "null",
      isFormExpand: true,
      expandIconName: EXPAND_LESS_ICON_NAME,
      expandIconTitle: ICON_TITLE_COLLAPSE,
      criteriyaMessage: ENTER_SEARCH_CRITERIA,
      classNameDiv: "",
      dataObject: "",
      tableDataObj: [],
      errorMessageForDate: "",
      noDataFound: false,
    };
  }

  componentWillMount() {
    const { updateComponentState, clearData } = this.props;
    const clearParams = {
      id: REPORT_SUBMENU_ID,
    };
    clearData(clearParams);
    let LoggedInUser = "employee";
    if (getDataFromCookie().role) {
      LoggedInUser = getDataFromCookie().role; //from redux state
    }
    this.setState({ LoggedInUser }, () => {
      updateComponentState(TITLE_SUBTITLE_ID, APP_TITLE_SUBTITLE, {
        title: "Reports",
        subtitle: "Summary Report",
      });

      const reportProps = {
        ...this.props,
        onFetchingComplete: this.dataFetchComplete,
        onDateError: this.onDateSelectionError,
      };

      setCurrentProps(reportProps, this.state);
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.reportState !== nextProps.reportState) {
      const summary_by_from_state = nextProps.reportState.get(
        SUMMARY_BY,
        ERROR_STR
      );
      if (summary_by_from_state && summary_by_from_state !== ERROR_STR) {
        this.setState({
          summary_by: summary_by_from_state,
        });
      }

      const category_by_from_state = nextProps.reportState.get(
        CATEGORY,
        ERROR_STR
      );
      if (category_by_from_state && category_by_from_state !== ERROR_STR) {
        this.setState({
          category: category_by_from_state,
        });
      }
    }

    if (
      nextProps.reportDashboardStateSR &&
      this.props.reportDashboardStateSR !== nextProps.reportDashboardStateSR
    ) {
      if (
        nextProps.reportDashboardStateSR.apiData &&
        nextProps.reportDashboardStateSR.apiData.rows.length > 1
      ) {
        let totalHrs;
        let billableHrs;
        let dataobj = getDataFromUtils();
        let reportDashBoard;
        const nextApiData = nextProps.reportDashboardStateSR.apiData;
        if (!isEmpty(nextApiData.columns)) {
          const rowCount = nextApiData.rows.length - 1;
          const columns = nextApiData.columns;
          let keytotalDuration = 0;
          let keyBillable = 0;
          for (let i = 0; i < columns.length; i++) {
            if (columns[i].names === "bilable_hrs") {
              keyBillable = i;
            } else if (columns[i].names === "estimated_hrs") {
              keytotalDuration = i;
            }
          }
          const lastRow = nextApiData.rows[rowCount];
          billableHrs = lastRow[keyBillable];
          totalHrs = lastRow[keytotalDuration];

          // let dataobj = getDataFromUtils();
          dataobj["reportTitle"] = "Summary Report";
          dataobj["totalDuration"] = totalHrs;
          dataobj["bilable_hrs"] = billableHrs;

          reportDashBoard = dataAbstractionForReport(
            nextApiData,
            this.getRespectiveJsonTableFile(),
            this.props,
            dataobj
          );

          const reportData = reportDashBoard.tableData;

          if (reportData) {
            this.setState({
              isTableData: "yes",
              reportData,
              billable: billableHrs,
              estimated: totalHrs,
              dataObject: dataobj,
            });

            //To hide Form
            this.showForm();
          }
        }
      } else {
        this.setState({
          isTableData: "no",
          noDataFound: true,
          reportData: {
            rows: [],
          },
          dataObject: "",
        });
      }
    }
  }

  getRespectiveJsonTableFile() {
    return getJsonTableFile(
      "Summary Report",
      "",
      false,
      false,
      "",
      this.state.summary_by,
      this.state.category
    );
  }

  componentWillUnmount() {
    clearDataFromUtils();
    this.setState({
      LoggedInUser: "",
      selectedFromDate: moment(),
      selectedToDate: moment(),
      emp_id: "",
      billable: "0",
      estimated: "0",
      projectsData: "",
      reportData: {
        rows: [],
      },
      isFormExpand: true,
      expandIconName: EXPAND_LESS_ICON_NAME,
      expandIconTitle: ICON_TITLE_COLLAPSE,
      criteriyaMessage: ENTER_SEARCH_CRITERIA,
      classNameDiv: "",
      category: "1",
    });

    const { id, clearData, clearReport, deleteComponentState } = this.props;
    const clearParams = {
      id,
    };
    clearData(clearParams);
    clearReport(REPORT_SUBMENU_ID);
    clearReport("REPORT_SUBMENU_ID_NEW_SR");
    deleteComponentState(DASHBOARD_NAVIGATE_ID);
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

  onDateSelectionError = (isCorrectDateSelected, fdate, tdate) => {
    if (!isCorrectDateSelected) {
      this.setState({
        errorMessageForDate: SUMMARY_REPORT_VALIDATION.errorDate,
        tableDataObj: [],
        isTableData: "no",
        dataObject: "",
      });
    } else {
      if (moment(tdate).diff(moment(fdate), "months") > 12) {
        this.setState({
          errorMessageForDate: SUMMARY_REPORT_VALIDATION.errorDateExceds,
          tableDataObj: [],
          isTableData: "no",
          dataObject: "",
        });
      } else {
        this.setState({
          errorMessageForDate: "",
        });
      }
    }

    // errorMessageForDate
    this.setState(
      {
        isCorrectDateSelected,
      },
      () => {
        if (!isCorrectDateSelected) {
          this.setState({
            tableDataObj: [],
          });
        }
      }
    );
  };

  dataFetchComplete = (tableDataObj) => {
    const { updateComponentState } = this.props;
    updateComponentState(LOADER_ID, LOADER_SHOW, {
      showLoader: false,
    });
    const isTableDataFound = !isEmpty(tableDataObj.tableRows) ? "yes" : "no";
    this.setState(
      {
        tableDataObj,
        isTableData: isTableDataFound,
        dataObject: getDefaultDetailsData(),
        noDataFound: isTableDataFound === "no",
      },
      () => {
        if (!isEmpty(tableDataObj.tableRows)) {
          this.showForm();
        }
      }
    );
  };

  render() {
    const { reportState } = this.props;
    const reportJsonFileName = reportState.get(REPORT_JSONFILE, ERROR_STR);
    const {
      isTableData,
      tableDataObj,
      errorMessageForDate,
      dataObject,
    } = this.state;

    const reportProps = {
      ...this.props,
      onFetchingComplete: this.dataFetchComplete,
      onDateError: this.onDateSelectionError,
    };

    return (
      <div className="page-content-form">
        <div className="pr-col-accordion" onClick={() => this.showForm()}>
          <div className="accordion-inner-div-left">
            {this.state.criteriyaMessage}
          </div>
          {getExpandIcon(
            isTableData,
            this.state.expandIconName,
            this.state.expandIconTitle
          )}
        </div>

        <RenderReport
          jsonFile={reportJsonFileName}
          reportStates={this.state}
          reportProps={reportProps}
        />

        {!isEmpty(errorMessageForDate) ? (
          <span style={{ color: "red", marginLeft: "3%" }}>
            {errorMessageForDate}
          </span>
        ) : null}

        <div className="report-components-section2">
          {isTableData === "yes" ? (
            <ReportSubDetails data={this.state.dataObject} />
          ) : null}
        </div>

        <div
          className="report-table-section"
          style={{ display: "block", overflow: "auto" }}
        >
          {isTableData === "yes" && isEmpty(errorMessageForDate) ? (
            dataObject.isDateRangeBool_summaryReport === true ? (
              <ReportTableView {...this.state.reportData} />
            ) : (
              <SummaryReportTableView tableData={tableDataObj} />
            )
          ) : isTableData === "no" && this.state.noDataFound ? (
            <div>
              <div>{REPORTS_MSG_DATA_NOT_FOUND}</div>
            </div>
          ) : null}
        </div>

        <div className="table-container-summary" style={{ height: "inherit" }}>
          <div
            className="table-inner-view"
            style={{
              height: "inherit",
              overflowX: "auto",
              overflowY: "unset",
            }}
          />
        </div>
      </div>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const { report, component } = state;
  const id = ownProps.id;

  return {
    componentState: component.get(id, Map()),
    reportState: component.get(REPORT_SUBMENU_ID, Map()),
    reportDashboardState: report.getIn([REPORT_SUBMENU_ID, "apiData"], null),
    reportDashboardStateSR: report.getIn(
      ["REPORT_SUBMENU_ID_NEW_SR", "apiData"],
      null
    ),
    pmDashboardState: component.get(DASHBOARD_NAVIGATE_ID, Map()),
  };
}

export default connect(
  mapStateToProps,
  {
    clearComponentState,
    updateComponentState,
    deleteComponentState,
    fetchReport,
    clearReport,
    requestData,
    clearData,
  }
)(SummaryReport);
