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
  SORT_BY,
  CATEGORY,
  APP_TITLE_SUBTITLE,
  REPORTS_MSG_DATA_NOT_FOUND,
  ICON_TITLE_COLLAPSE,
  EXPAND_LESS_ICON_NAME,
  ENTER_SEARCH_CRITERIA,
  FOR_HIDE1,
  TITLE_SUBTITLE_ID,
  ERROR_STR,
  DASHBOARD_NAVIGATE_ID,
} from "../../../../constants/app.constants.js";

import { requestData, clearData } from "../../../../actions/data.actions.js";
import {
  fetchProjectsDashboard,
  clearProjects,
} from "../../../../actions/projects.actions.js";
import {
  fetchReport,
  clearReport,
} from "../../../../actions/report.actions.js";
import {
  fetchProjectList,
  fetchEmployeeList,
  setCurrentProps,
  getDataFromUtils,
  clearDataFromUtils,
} from "./managementReport.utils.js";
import ReportTableView from "../../../widgets/TableView/ReportTableView.js";
import { dataAbstractionForReport } from "../../../utils/dataAbstraction.utils.js";
import moment from "moment";
import { getDataFromCookie } from "../../../utils/CheckLoginDetails";
import RenderReport from "../RenderReport";
import { getExpandIcon, getJsonTableFile } from "../reports.ui.utils.js";
import { getDownArrowObj, getUpArrowObj } from "../Reports.utils.js";
import ReportSubDetails from "../ReportSubDetails.js";

class ManagementReport extends Component {
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
      subTotalindexes: { indexes: [] },
      isTableData: "null",
      sort_by: "project",
      isFormExpand: true,
      expandIconName: EXPAND_LESS_ICON_NAME,
      expandIconTitle: ICON_TITLE_COLLAPSE,
      criteriyaMessage: ENTER_SEARCH_CRITERIA,
      classNameDiv: FOR_HIDE1,
      dataObject: "",
      category: "1",
    };
  }

  componentWillMount() {
    const { updateComponentState, clearData } = this.props;
    const clearParams = {
      id: REPORT_SUBMENU_ID,
    };
    clearData(clearParams);
    let LoggedInUserFromRedux = "employee";
    if (getDataFromCookie().role) {
      LoggedInUserFromRedux = getDataFromCookie().role; //from redux state
    }
    this.setState(
      {
        LoggedInUser: LoggedInUserFromRedux,
      },
      () => {
        let titleSub = {
          title: "Reports",
          subtitle: "Management Report",
        };
        updateComponentState(TITLE_SUBTITLE_ID, APP_TITLE_SUBTITLE, titleSub);
        fetchProjectList(this.props);
        fetchEmployeeList(this.props);
        setCurrentProps(this.props, this.state);
      }
    );
  }

  componentWillReceiveProps(nextProps) {
    let jsonFile;
    let totalHrs;
    let billableHrs;

    if (this.props.reportState !== nextProps.reportState) {
      const sort_by_from_state = nextProps.reportState.get(SORT_BY, ERROR_STR);
      if (sort_by_from_state && sort_by_from_state !== ERROR_STR) {
        this.setState(
          {
            sort_by: sort_by_from_state,
          },
          () => {
            jsonFile = this.getRespectiveJsonTableFile();
          }
        );
      }

      const category_by_from_state = nextProps.reportState.get(
        CATEGORY,
        ERROR_STR
      );
      if (category_by_from_state && category_by_from_state !== ERROR_STR) {
        this.setState(
          {
            category: category_by_from_state,
          },
          () => {
            jsonFile = this.getRespectiveJsonTableFile();
          }
        );
      }
    } else {
      jsonFile = this.getRespectiveJsonTableFile();
    }

    if (this.props.reportDashboardState !== nextProps.reportDashboardState) {
      if (
        nextProps.reportDashboardState &&
        nextProps.reportDashboardState.apiData
      ) {
        let nextApiData = nextProps.reportDashboardState.apiData;
        let subTotalindexesArr = [];
        for (let i = 0; i < nextApiData.rows.length; i++) {
          if (nextApiData.rows[i][0] === "Sub Total") {
            subTotalindexesArr.push(i + 1);
          }
        }

        let reportDashBoard;

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
        dataobj["reportTitle"] = "Management Report";
        dataobj["totalDuration"] = totalHrs;
        dataobj["bilable_hrs"] = billableHrs;

        reportDashBoard = dataAbstractionForReport(
          nextApiData,
          jsonFile,
          this.props,
          dataobj
        );

        let reportTableData = reportDashBoard.tableData;

        if (reportTableData) {
          this.setState({
            isTableData: "yes",
            reportData: reportTableData,
            subTotalindexes: { indexes: [subTotalindexesArr] },
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
          subTotalindexes: { indexes: [] },
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
      reportData: {
        rows: [],
      },
      subTotalindexes: { indexes: [] },
      isFormExpand: true,
      expandIconName: EXPAND_LESS_ICON_NAME,
      expandIconTitle: ICON_TITLE_COLLAPSE,
      criteriyaMessage: ENTER_SEARCH_CRITERIA,
      classNameDiv: "",
      dataObject: "",
      category: "1",
    });

    const {
      id,
      clearData,
      clearProjects,
      clearReport,
      deleteComponentState,
    } = this.props;
    const clearParams = {
      id,
    };
    clearData(clearParams);
    clearProjects(clearParams);
    clearReport(REPORT_SUBMENU_ID);
    deleteComponentState(DASHBOARD_NAVIGATE_ID);
  }

  getRespectiveJsonTableFile() {
    return getJsonTableFile(
      "Management Report",
      this.state.sort_by,
      false,
      false,
      "",
      "",
      this.state.category
    );
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

  render() {
    const { reportState } = this.props;
    const reportJsonFileName = reportState.get(REPORT_JSONFILE, ERROR_STR);
    const { isTableData } = this.state;
    console.log(
      "reportJsonFileName isTableData",
      reportJsonFileName,
      isTableData,
      reportState
    );

    return (
      <div className="page-content-form">
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
        <div className="report-table-section" id="management-report">
          {isTableData === "yes" ? (
            <ReportTableView
              {...this.state.reportData}
              subTotalindexes={this.state.subTotalindexes}
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
  const { component, report, projects, data } = state;
  const id = ownProps.id;

  return {
    componentState: component.get(id, Map()),
    reportState: component.get(REPORT_SUBMENU_ID, Map()),
    reportDashboardState: report.getIn([REPORT_SUBMENU_ID, "apiData"], null),
    projectsDataState: projects.getIn([REPORT_SUBMENU_ID, "apiData"], null),
    employeeDataState: data.getIn([REPORT_SUBMENU_ID, "apiData"], null),
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
    fetchProjectsDashboard,
    clearProjects,
    requestData,
    clearData,
  }
)(ManagementReport);
