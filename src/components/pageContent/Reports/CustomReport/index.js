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
  PROJECT_ID,
  SPRINT_ID,
  TASK_ID,
  SORT_BY,
  APP_TITLE_SUBTITLE,
  REPORTS_MSG_DATA_NOT_FOUND,
  ICON_TITLE_COLLAPSE,
  EXPAND_LESS_ICON_NAME,
  ENTER_SEARCH_CRITERIA,
  TITLE_SUBTITLE_ID,
  DASHBOARD_NAVIGATE_ID,
  // REPORT_OBJECT,
  ERROR_STR,
} from "../../../../constants/app.constants.js";

import { requestData, clearData } from "../../../../actions/data.actions.js";
import {
  fetchProjects,
  clearProjects,
} from "../../../../actions/projects.actions.js";
import {
  fetchReport,
  clearReport,
} from "../../../../actions/report.actions.js";
import {
  fetchSprints,
  clearSprints,
} from "../../../../actions/sprints.actions.js";
import { fetchTasks, clearTasks } from "../../../../actions/tasks.actions.js";
import {
  fetchSubTasks,
  clearSubTasks,
} from "../../../../actions/subTasks.actions.js";
import {
  fetchProjectList,
  fetchEmployeeList,
  fetchSprintsAndTasksList,
  fetchSubTasksList,
  setCurrentProps,
  getDataFromUtils,
  clearDataFromUtils,
  fetchTasksListFromSprint,
} from "./customReport.utils.js";
import ReportTableView from "../../../widgets/TableView/ReportTableView.js";
import { dataAbstractionForReport } from "../../../utils/dataAbstraction.utils.js";
import { getDataFromCookie } from "../../../utils/CheckLoginDetails";
import moment from "moment";
import RenderReport from "../RenderReport";
import { getJsonTableFile, getExpandIcon } from "../reports.ui.utils.js";
import { getDownArrowObj, getUpArrowObj } from "../Reports.utils.js";
import ReportSubDetails from "../ReportSubDetails.js";

class CustomReport extends Component {
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
      sprint_id: "",
      task_id: "",
      sub_task_id: "",
      billable: "0",
      nonbillable: "0",
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
      sort_by: "date",
      employee_name: "All",

      isFormExpand: true,
      expandIconName: EXPAND_LESS_ICON_NAME,
      expandIconTitle: ICON_TITLE_COLLAPSE,
      criteriyaMessage: ENTER_SEARCH_CRITERIA,
      classNameDiv: "",
      dataObject: "",
    };
  }

  componentWillMount() {
    const {
      updateComponentState,
      clearData,
      clearSprints,
      clearTasks,
      clearSubTasks,
    } = this.props;

    const clearParams = {
      id: REPORT_SUBMENU_ID,
    };
    clearData(clearParams);
    clearSprints(clearParams);
    clearTasks(clearParams);
    clearSubTasks(clearParams);

    let LoggedInUser = "employee";
    if (getDataFromCookie().role) {
      LoggedInUser = getDataFromCookie().role; //from redux state
    }
    this.setState({ LoggedInUser }, () => {
      const titleSub = {
        title: "Reports",
        subtitle: "Custom Report",
      };
      updateComponentState(TITLE_SUBTITLE_ID, APP_TITLE_SUBTITLE, titleSub);
      updateComponentState(REPORT_SUBMENU_ID, PROJECT_ID, "");

      fetchProjectList(this.props);
      fetchEmployeeList(this.props);
      setCurrentProps(this.props, this.state);
    });
  }

  componentWillReceiveProps(nextProps) {
    let totalHrs;
    let billableHrs;
    let nonbillableHrs;

    if (this.props.reportState !== nextProps.reportState) {
      const pro_ID_from_nextprops = nextProps.reportState.get(
        PROJECT_ID,
        ERROR_STR
      );

      const pro_ID_from_thisprops = this.props.reportState.get(
        PROJECT_ID,
        ERROR_STR
      );

      const sprint_ID_from_nextprops = nextProps.reportState.get(
        SPRINT_ID,
        ERROR_STR
      );

      const sprint_ID_from_thisprops = this.props.reportState.get(
        SPRINT_ID,
        ERROR_STR
      );

      const task_ID_from_nextprops = nextProps.reportState.get(
        TASK_ID,
        ERROR_STR
      );

      const task_ID_from_thisprops = this.props.reportState.get(
        TASK_ID,
        ERROR_STR
      );

      const sort_by_from_nextprops = nextProps.reportState.get(
        SORT_BY,
        ERROR_STR
      );

      if (
        sprint_ID_from_thisprops &&
        sprint_ID_from_thisprops !== ERROR_STR &&
        sprint_ID_from_nextprops !== sprint_ID_from_thisprops
      ) {
        const { clearSubTasks } = this.props;
        const clearParams = {
          id: REPORT_SUBMENU_ID,
        };
        clearSubTasks(clearParams);
      }

      if (
        pro_ID_from_nextprops &&
        pro_ID_from_nextprops !== pro_ID_from_thisprops &&
        pro_ID_from_nextprops !== ERROR_STR
      ) {
        const { clearSprints, clearTasks, clearSubTasks } = this.props;
        const clearParams = {
          id: REPORT_SUBMENU_ID,
        };
        clearSprints(clearParams);
        clearTasks(clearParams);
        clearSubTasks(clearParams);

        fetchSprintsAndTasksList(pro_ID_from_nextprops, this.props);

        const { updateComponentState } = this.props;
        updateComponentState(REPORT_SUBMENU_ID, TASK_ID, "");
      } else if (pro_ID_from_nextprops === "") {
        const { clearSprints, clearTasks, clearSubTasks } = this.props;
        const clearParams = {
          id: REPORT_SUBMENU_ID,
        };
        clearSprints(clearParams);
        clearTasks(clearParams);
        clearSubTasks(clearParams);
      }

      if (
        task_ID_from_nextprops &&
        task_ID_from_nextprops !== ERROR_STR &&
        pro_ID_from_nextprops !== "" &&
        pro_ID_from_nextprops &&
        task_ID_from_nextprops !== task_ID_from_thisprops
      ) {
        const { clearSubTasks } = this.props;
        const clearParams = {
          id: REPORT_SUBMENU_ID,
        };
        clearSubTasks(clearParams);

        fetchSubTasksList(task_ID_from_nextprops, this.props);
      } else if (task_ID_from_nextprops === "") {
        const { clearSubTasks } = this.props;
        const clearParams = {
          id: REPORT_SUBMENU_ID,
        };
        clearSubTasks(clearParams);
      }

      if (sort_by_from_nextprops && sort_by_from_nextprops !== ERROR_STR) {
        this.setState({
          sort_by: sort_by_from_nextprops,
        });
      }
    }

    if (this.props.reportDashboardState !== nextProps.reportDashboardState) {
      if (
        nextProps.reportDashboardState &&
        nextProps.reportDashboardState.apiData
      ) {
        let subTotalindexesArr = [];
        for (
          let i = 0;
          i < nextProps.reportDashboardState.apiData.rows.length;
          i++
        ) {
          if (
            nextProps.reportDashboardState.apiData.rows[i][0] === "Sub Total"
          ) {
            subTotalindexesArr.push(i + 1);
          }
        }

        let reportDashBoard;
        let nextApiData = nextProps.reportDashboardState.apiData;
        let rowCount = nextApiData.rows.length - 1;
        let columns = nextApiData.columns;
        var keytotalDuration = 0;
        var keyBillable = 0;
        var keyNonBillable = 0;
        for (var i = 0; i < columns.length; i++) {
          if (columns[i].names === "bilable_hrs") {
            keyBillable = i;
          } else if (columns[i].names === "non_bilable_hrs") {
            keyNonBillable = i;
          } else if (columns[i].names === "estimated_hrs") {
            keytotalDuration = i;
          }
        }
        let lastRow = nextApiData.rows[rowCount];
        billableHrs = lastRow[keyBillable];
        nonbillableHrs = lastRow[keyNonBillable];
        totalHrs = lastRow[keytotalDuration];

        let dataobj = getDataFromUtils();
        dataobj["reportTitle"] = "Custom Report";
        let billableBool = dataobj.billableBool_customReport;
        let nonbillableBool = dataobj.nonbillableBool_customReport;
        if (nextApiData.business_days && nextApiData.business_hours) {
          dataobj["business_days"] = nextApiData.business_days;
          dataobj["business_hours"] = nextApiData.business_hours;
        }

        if (billableBool === false && nonbillableBool === false) {
          dataobj["totalDuration"] = totalHrs;
          dataobj["bilable_hrs"] = billableHrs;
          dataobj["non_bilable_hrs"] = nonbillableHrs;
        } else if (billableBool === true) {
          dataobj["bilable_hrs"] = billableHrs;
        } else if (nonbillableBool === true) {
          dataobj["non_bilable_hrs"] = nonbillableHrs;
        }

        dataobj["billableBool"] = billableBool;
        dataobj["nonbillableBool"] = nonbillableBool;

        reportDashBoard = dataAbstractionForReport(
          nextApiData,
          this.getRespectiveJsonTableFile(dataobj),
          this.props,
          dataobj
        );

        let reportTableData = reportDashBoard.tableData;

        if (reportTableData) {
          this.setState({
            isTableData: "yes",
            reportData: reportTableData,
            business_days: nextApiData.business_days,
            business_hours: nextApiData.business_hours,
            subTotalindexes: { indexes: [subTotalindexesArr] },
            billable: billableHrs,
            nonbillable: nonbillableHrs,
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
      emp_id: "",
      sprint_id: "",
      billable: "0",
      nonbillable: "0",
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
      sort_by: "date",
      employee_name: "All",
      dataObject: "",
      isFormExpand: true,
      expandIconName: EXPAND_LESS_ICON_NAME,
      expandIconTitle: ICON_TITLE_COLLAPSE,
      criteriyaMessage: ENTER_SEARCH_CRITERIA,
      classNameDiv: "",
    });

    const {
      id,
      clearData,
      clearProjects,
      clearSprints,
      clearTasks,
      clearSubTasks,
    } = this.props;
    const clearParams = {
      id,
    };
    clearData(clearParams);
    clearProjects(clearParams);
    clearSprints(clearParams);
    clearTasks(clearParams);
    clearSubTasks(clearParams);
    const { clearReport, deleteComponentState } = this.props;
    clearReport(REPORT_SUBMENU_ID);
    deleteComponentState(DASHBOARD_NAVIGATE_ID);
  }

  componentWillUpdate(nextProps, nextStates) {
    if (this.props.reportState !== nextProps.reportState) {
      const pro_ID_from_nextprops = nextProps.reportState.get(
        PROJECT_ID,
        ERROR_STR
      );

      const sprint_ID_from_nextprops = nextProps.reportState.get(
        SPRINT_ID,
        ERROR_STR
      );

      const sprint_ID_from_thisprops = this.props.reportState.get(
        SPRINT_ID,
        ERROR_STR
      );

      let sprint_id = 0;

      if (sprint_ID_from_nextprops !== "") {
        sprint_id = sprint_ID_from_nextprops;
      } else {
        sprint_id = "0";
      }

      if (
        sprint_ID_from_nextprops &&
        sprint_ID_from_nextprops !== sprint_ID_from_thisprops &&
        sprint_ID_from_nextprops !== ERROR_STR
      ) {
        fetchTasksListFromSprint(pro_ID_from_nextprops, sprint_id, this.props);
      }

      if (sprint_id === "0") {
        fetchTasksListFromSprint(pro_ID_from_nextprops, sprint_id, this.props);
      }
    }
  }

  getRespectiveJsonTableFile(dataObject) {
    return getJsonTableFile(
      "Custom Report",
      this.state.sort_by,
      dataObject.billableBool_customReport,
      dataObject.nonbillableBool_customReport
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
        <div className="report-table-section">
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
  const { report, projects, data, sprints, tasks, subTasks, component } = state;
  const id = ownProps.id;

  return {
    componentState: component.get(id, Map()),
    reportState: component.get(REPORT_SUBMENU_ID, Map()),
    reportDashboardState: report.getIn([REPORT_SUBMENU_ID, "apiData"], null),
    projectsDataState: projects.getIn([REPORT_SUBMENU_ID, "apiData"], null),
    employeeDataState: data.getIn([REPORT_SUBMENU_ID, "apiData"], null),
    sprintsDataState: sprints.getIn([REPORT_SUBMENU_ID, "apiData"], null),
    tasksDataState: tasks.getIn([REPORT_SUBMENU_ID, "apiData"], null),
    subTasksDataState: subTasks.getIn([REPORT_SUBMENU_ID, "apiData"], null),
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
    fetchProjects,
    fetchSprints,
    fetchTasks,
    fetchSubTasks,
    clearProjects,
    clearSprints,
    clearTasks,
    clearSubTasks,
    requestData,
    clearData,
  }
)(CustomReport);
