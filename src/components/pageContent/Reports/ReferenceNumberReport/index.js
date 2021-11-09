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
  APP_TITLE_SUBTITLE,
  REPORTS_MSG_DATA_NOT_FOUND,
  ICON_TITLE_COLLAPSE,
  EXPAND_LESS_ICON_NAME,
  ENTER_SEARCH_CRITERIA,
  TITLE_SUBTITLE_ID,
  SUBREPORT_ID,
  IS_SUB_REPORT,
  SUB_REPORT_PARAMS,
  ERROR_STR,
} from "../../../../constants/app.constants.js";

import report_referenceNo_table from "../../../json/reports/referenceno report/report_referenceNo_table.json";
import { requestData, clearData } from "../../../../actions/data.actions.js";
import {
  fetchProjects,
  clearProjects,
} from "../../../../actions/projects.actions.js";
import {
  fetchReport,
  clearReport,
} from "../../../../actions/report.actions.js";

import { dataAbstractionForReport } from "../../../utils/dataAbstraction.utils.js";
import moment from "moment";
import {
  fetchProjectList,
  fetchEmployeeList,
  setCurrentProps,
  getDataFromUtils,
  clearDataFromUtils,
} from "./referenceNoReport.utils.js";
import { getDataFromCookie } from "../../../utils/CheckLoginDetails";
import ReportTableView from "../../../widgets/TableView/ReportTableView.js";
import RenderReport from "../RenderReport";
import SubReport from "../SubReport";
import Overlay from "../../../widgets/Overlay/OverLay";
import { getExpandIcon } from "../reports.ui.utils.js";
import { getDownArrowObj, getUpArrowObj } from "../Reports.utils.js";
import ReportSubDetails from "../ReportSubDetails.js";

class ReferenceNumberReport extends Component {
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
      pro_id: "",
      emp_id: "",
      billable: "0",
      estimated: "0",
      projectsData: "",
      employeesData: "",
      sprintsData: "",
      tasksData: "",
      subTasksData: "",
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
    };
  }

  componentWillMount() {
    const { updateComponentState, clearData } = this.props;
    const clearParams = {
      id: REPORT_SUBMENU_ID,
    };
    clearData(clearParams);

    let titleSub = {
      title: "Reports",
      subtitle: "Reference Number Report",
    };
    updateComponentState(TITLE_SUBTITLE_ID, APP_TITLE_SUBTITLE, titleSub);

    fetchProjectList(this.props);
    fetchEmployeeList(this.props);
    setCurrentProps(this.props);
    let LoggedInUserFromRedux = "employee";
    if (getDataFromCookie().role) {
      LoggedInUserFromRedux = getDataFromCookie().role; //from redux state
    }
    this.setState({
      LoggedInUser: LoggedInUserFromRedux,
    });
  }

  componentWillReceiveProps(nextProps) {
    let totalHrs;
    let billableHrs;

    if (this.props.reportDashboardState !== nextProps.reportDashboardState) {
      if (
        nextProps.reportDashboardState &&
        nextProps.reportDashboardState.apiData
      ) {
        let reportDashBoard;
        let nextApiData = nextProps.reportDashboardState.apiData;
        let rowCount = nextApiData.rows.length - 1;
        let columns = nextApiData.columns;
        var keytotalDuration = 0;
        var keyBillable = 0;
        for (var i = 0; i < columns.length; i++) {
          if (columns[i].names === "bilable_hrs") {
            keyBillable = i;
          } else if (columns[i].names === "estimated_hrs") {
            keytotalDuration = i;
          }
        }
        let lastRow = nextApiData.rows[rowCount];
        billableHrs = lastRow[keyBillable];
        totalHrs = lastRow[keytotalDuration];

        let dataobj = getDataFromUtils();
        dataobj["reportTitle"] = "Reference Number Report";
        dataobj["projectName"] = dataobj.pro_name;
        dataobj["totalDuration"] = totalHrs;
        dataobj["bilable_hrs"] = billableHrs;

        reportDashBoard = dataAbstractionForReport(
          nextApiData,
          report_referenceNo_table,
          this.props,
          dataobj
        );

        let reportTableData = reportDashBoard.tableData;

        if (reportTableData) {
          this.setState({
            isTableData: "yes",
            reportData: reportTableData,
            mainReportData: reportDashBoard,
            billable: billableHrs,
            estimated: totalHrs,
            dataObject: dataobj,
          });

          //To hide Form
          this.showForm();
        }
      } else {
        this.setState({
          isTableData: "no",
          reportData: {
            rows: [],
          },
          exportData: {},
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
      pro_id: "",
      sort_by: "date",
      emp_id: "",
      sprint_id: "",
      billable: "0",
      estimated: "0",
      projectsData: "",
      employeesData: "",
      sprintsData: "",
      tasksData: "",
      subTasksData: "",
      reportData: {
        rows: [],
      },
      isFormExpand: true,
      expandIconName: EXPAND_LESS_ICON_NAME,
      expandIconTitle: ICON_TITLE_COLLAPSE,
      criteriyaMessage: ENTER_SEARCH_CRITERIA,
      classNameDiv: "",
      dataObject: "",
    });

    const { id, clearData, clearProjects } = this.props;
    const clearParams = {
      id,
    };
    clearData(clearParams);
    clearProjects(clearParams);

    const { clearReport } = this.props;

    clearReport(REPORT_SUBMENU_ID);
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

  onClickLink = (data) => {
    let newDataObj = {
      "Main Reference Number": "",
      "Sub Reference Number": "",
    };

    newDataObj["Main Reference Number"] = data.columns[0].values[0].value;
    if (data.columns[2].values[0].value === "No Sub Task")
      newDataObj["Sub Reference Number"] = "";
    else newDataObj["Sub Reference Number"] = data.columns[2].values[0].value;

    const { updateComponentState } = this.props;
    updateComponentState(SUBREPORT_ID, IS_SUB_REPORT, true);
    updateComponentState(SUBREPORT_ID, SUB_REPORT_PARAMS, newDataObj);
  };

  render() {
    const { reportState, subreportState } = this.props;
    const reportJsonFileName = reportState.get(REPORT_JSONFILE, ERROR_STR);
    const isSubReport = subreportState.get(IS_SUB_REPORT, ERROR_STR);
    const rowData = subreportState.get(SUB_REPORT_PARAMS, ERROR_STR);
    const { isTableData } = this.state;
    return (
      <div className="page-content-form">
        {isSubReport === true ? (
          <Overlay
            subComponent={
              <SubReport
                id={SUBREPORT_ID}
                data={rowData}
                otherData={getDataFromUtils()}
              />
            }
          />
        ) : null}

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
          reportProps={this.props}
        />
        <div className="report-components-section2">
          {this.state.reportData &&
          isTableData !== "null" &&
          isTableData !== "no" ? (
            <ReportSubDetails data={this.state.dataObject} />
          ) : null}
        </div>
        <div className="report-table-section">
          {isTableData === "yes" ? (
            <ReportTableView
              {...this.state.reportData}
              exportData={this.state.mainReportData}
              onclickEdt={(e) => this.onClickLink(e)}
            />
          ) : isTableData === "no" ? (
            <div>
              <div>{REPORTS_MSG_DATA_NOT_FOUND}</div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const { report, projects, data } = state;
  const id = ownProps.id;

  return {
    componentState: state.component.get(id, Map()),
    reportState: state.component.get(REPORT_SUBMENU_ID, Map()),
    subreportState: state.component.get(SUBREPORT_ID, Map()),
    reportDashboardState: report.getIn([REPORT_SUBMENU_ID, "apiData"], null),
    projectsDataState: projects.getIn([REPORT_SUBMENU_ID, "apiData"], null),
    employeeDataState: data.getIn([REPORT_SUBMENU_ID, "apiData"], null),
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
    fetchProjects,
    clearProjects,
    requestData,
    clearData,
  }
)(ReferenceNumberReport);
