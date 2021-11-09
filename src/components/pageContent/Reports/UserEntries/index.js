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
  fetchTasksListFromSPrint,
  fetchSubTasksList,
  setCurrentProps,
  getDataFromUtils,
  clearDataFromUtils,
} from "./userEntries.utils.js";
import { getExpandIcon, getJsonTableFile } from "../reports.ui.utils.js";
import { getDataFromCookie } from "../../../utils/CheckLoginDetails";
import RenderReport from "../RenderReport";
import ReportTableView from "../../../widgets/TableView/ReportTableView.js";
import { dataAbstractionForReport } from "../../../utils/dataAbstraction.utils.js";
import moment from "moment";
import { getDownArrowObj, getUpArrowObj } from "../Reports.utils.js";
import ReportSubDetails from "../ReportSubDetails.js";

class UserEntries extends Component {
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
      estimated: "0",
      projectsData: "",
      employeesData: "",
      sprintsData: "",
      tasksData: "",
      subTasksData: "",
      sort_by: "date",
      dataObject: "",
      reportData: {
        rows: [],
      },
      isTableData: "null",
      isFormExpand: true,
      expandIconName: EXPAND_LESS_ICON_NAME,
      expandIconTitle: ICON_TITLE_COLLAPSE,
      criteriyaMessage: ENTER_SEARCH_CRITERIA,
      classNameDiv: "",
    };
  }

  componentWillMount() {
    const {
      updateComponentState,
      clearSprints,
      clearTasks,
      clearSubTasks,
      clearData,
    } = this.props;

    let titleSub = {
      title: "Reports",
      subtitle: "User Entries",
    };
    updateComponentState(TITLE_SUBTITLE_ID, APP_TITLE_SUBTITLE, titleSub);
    updateComponentState(REPORT_SUBMENU_ID, PROJECT_ID, "");

    fetchProjectList(this.props);
    fetchEmployeeList(this.props);
    setCurrentProps(this.props);

    const clearParams = {
      id: REPORT_SUBMENU_ID,
    };
    clearData(clearParams);
    clearSprints(clearParams);
    clearTasks(clearParams);
    clearSubTasks(clearParams);

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
        let billableBool = dataobj.billableBool_userEntries;
        let nonbillableBool = dataobj.nonbillableBool_userEntries;

        dataobj["reportTitle"] = "User Entries";

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
            exportData: reportDashBoard.exportData,
            business_days: nextApiData.business_days,
            business_hours: nextApiData.business_hours,
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
          dataObject: "",
        });
      }
    }
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
        fetchTasksListFromSPrint(pro_ID_from_nextprops, sprint_id, this.props);
      }

      if (sprint_id === "0") {
        fetchTasksListFromSPrint(pro_ID_from_nextprops, sprint_id, this.props);
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
      estimated: "0",
      projectsData: "",
      employeesData: "",
      sprintsData: "",
      tasksData: "",
      subTasksData: "",
      sort_by: "date",
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

    const { clearReport } = this.props;

    clearReport(REPORT_SUBMENU_ID);
  }

  getRespectiveJsonTableFile(dataObject) {
    return getJsonTableFile(
      "User Entries",
      this.state.sort_by,
      dataObject.billableBool_userEntries,
      dataObject.nonbillableBool_userEntries,
      dataObject.emp_name
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
    const { isTableData, expandIconName, expandIconTitle } = this.state;
    return (
      <div className="page-content-form">
        <div className="pr-col-accordion" onClick={() => this.showForm()}>
          <div className="accordion-inner-div-left">
            {this.state.criteriyaMessage}
          </div>
          {getExpandIcon(isTableData, expandIconName, expandIconTitle)}
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
            <ReportTableView {...this.state.reportData} />
          ) : isTableData === "no" ? (
            <div>{REPORTS_MSG_DATA_NOT_FOUND}</div>
          ) : null}
        </div>
      </div>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const { report, projects, data, sprints, tasks, subTasks } = state;
  const id = ownProps.id;

  return {
    componentState: state.component.get(id, Map()),
    reportState: state.component.get(REPORT_SUBMENU_ID, Map()),
    reportDashboardState: report.getIn([REPORT_SUBMENU_ID, "apiData"], null),
    projectsDataState: projects.getIn([REPORT_SUBMENU_ID, "apiData"], null),
    employeeDataState: data.getIn([REPORT_SUBMENU_ID, "apiData"], null),
    sprintsDataState: sprints.getIn([REPORT_SUBMENU_ID, "apiData"], null),
    tasksDataState: tasks.getIn([REPORT_SUBMENU_ID, "apiData"], null),
    subTasksDataState: subTasks.getIn([REPORT_SUBMENU_ID, "apiData"], null),
    // isFetching: reportDashboardState.apiData.getIn(
    //   [REPORT_SUBMENU_ID, "isFetching"],
    //   false
    // )
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
)(UserEntries);
