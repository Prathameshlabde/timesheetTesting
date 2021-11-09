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
  fetchSprints,
  clearSprints,
} from "../../../../actions/sprints.actions.js";

import {
  REPORT_JSONFILE,
  REPORT_SUBMENU_ID,
  APP_TITLE_SUBTITLE,
  REPORTS_MSG_DATA_NOT_FOUND,
  ICON_TITLE_COLLAPSE,
  EXPAND_LESS_ICON_NAME,
  ENTER_SEARCH_CRITERIA,
  TITLE_SUBTITLE_ID,
  REPORT_PROJECT_ID,
  SUBREPORT_ID,
  IS_SUB_REPORT,
  SUB_REPORT_PARAMS,
  TASK_REPORT,
  PROJECT_ID,
  SPRINT_ID,
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
  fetchProjectList,
  fetchEmployeeList,
  setCurrentProps,
  getDataFromUtils,
  clearDataFromUtils,
  fetchSprintsAndTasksList,
} from "./taskReport.utils.js";
import { getDataFromCookie } from "../../../utils/CheckLoginDetails";
import RenderReport from "../RenderReport";
import Overlay from "../../../widgets/Overlay/OverLay.js";
import SubReport from "../SubReport.js";
import { getExpandIcon, getJsonTableFile } from "../reports.ui.utils.js";
import ReportTableView from "../../../widgets/TableView/ReportTableView.js";
import { dataAbstractionForTaskReport } from "../../../utils/dataAbstraction.utils.js";
import moment from "moment";
import { getDownArrowObj, getUpArrowObj } from "../Reports.utils.js";
import ReportSubDetails from "../ReportSubDetails.js";

class TaskReport extends Component {
  static propTypes = {
    id: PropTypes.string,
    componentState: PropTypes.object.isRequired,
    updateComponentState: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      LoggedInUser: getDataFromCookie().role,
      selectedFromDate: moment(),
      selectedToDate: moment(),
      pro_id: "",
      emp_id: "",
      emp_name: "",
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
      singleProject: [],
      sprintName: "",
    };
  }

  componentWillMount() {
    const { updateComponentState, clearData } = this.props;
    let titleSub = {
      title: "Reports",
      subtitle: "Task Report",
    };

    updateComponentState(TITLE_SUBTITLE_ID, APP_TITLE_SUBTITLE, titleSub);
    const clearParams = {
      id: REPORT_SUBMENU_ID,
    };

    updateComponentState(REPORT_SUBMENU_ID, PROJECT_ID, "");
    updateComponentState(REPORT_SUBMENU_ID, SPRINT_ID, "");
    clearData(clearParams);
    // clearReport(REPORT_SUBMENU_ID);

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

  getJSONfile(dataobj) {
    return getJsonTableFile("Task Report", "", dataobj.billable, false, "");
  }

  componentWillReceiveProps(nextProps) {
    let totalHrs;
    let billableHrs;

    if (this.props.reportState !== nextProps.reportState) {
      const pro_ID_from_nextprops = nextProps.reportState.get(
        PROJECT_ID,
        ERROR_STR
      );

      const pro_ID_from_thisprops = this.props.reportState.get(
        PROJECT_ID,
        ERROR_STR
      );

      if (pro_ID_from_nextprops !== pro_ID_from_thisprops) {
        if (pro_ID_from_nextprops === "") {
          const { clearSprints } = this.props;
          const clearParams = {
            id: REPORT_SUBMENU_ID,
          };
          clearSprints(clearParams);
        }
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

        const sprint_ID_from_nextprops = nextProps.reportState.get(
          SPRINT_ID,
          ERROR_STR
        );

        let sprintData = this.props.sprintsDataState.apiData;
        let index = sprintData.findIndex(
          (p) => p.id === sprint_ID_from_nextprops
        );
        let sprintName = "";

        if (index >= 0) {
          sprintName = sprintData[index]["name"];
        }

        let dataobj = getDataFromUtils();

        dataobj["reportTitle"] = "Task Report";
        dataobj["sprintName"] = sprintName;
        dataobj["sprint_name"] = sprintName;
        this.setState({
          sprintName,
          emp_name: dataobj["emp_name"],
        });

        dataobj["projectName"] = this.state.singleProject.pname;

        if (nextApiData !== false) {
          reportDashBoard = dataAbstractionForTaskReport(
            nextApiData,
            this.getJSONfile(dataobj),
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

    if (this.props.singleprojectData !== nextProps.singleprojectData) {
      this.setState({
        singleProject: nextProps.singleprojectData.apiData,
      });
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

    const { id, clearData, clearProjects, clearSprints } = this.props;
    const clearParams = {
      id,
    };
    clearData(clearParams);
    clearProjects(clearParams);
    clearSprints(clearParams);

    const { clearReport } = this.props;
    clearReport(REPORT_SUBMENU_ID);
  }

  componentWillUpdate(nextProps, nextStates) {
    if (this.props.reportState !== nextProps.reportState) {
      const pro_ID_from_nextprops = nextProps.reportState.get(
        PROJECT_ID,
        ERROR_STR
      );

      const pro_ID_from_thisprops = this.props.reportState.get(
        PROJECT_ID,
        ERROR_STR
      );

      if (
        pro_ID_from_nextprops &&
        pro_ID_from_nextprops !== pro_ID_from_thisprops &&
        pro_ID_from_nextprops !== ERROR_STR
      ) {
        fetchSprintsAndTasksList(pro_ID_from_nextprops, this.props);
      }
    }
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
      task_id: "",
      task_title: "",
    };

    if (data) {
      newDataObj["task_id"] = data.columns[0].values[0].value;
      newDataObj["task_title"] = data.columns[1].values[0].value;
    }

    const { updateComponentState } = this.props;
    updateComponentState(SUBREPORT_ID, IS_SUB_REPORT, true);
    updateComponentState(SUBREPORT_ID, SUB_REPORT_PARAMS, newDataObj);
  };

  render() {
    const { reportState, subreportState } = this.props;
    const reportJsonFileName = reportState.get(REPORT_JSONFILE, ERROR_STR);
    const isSubReport = subreportState.get(IS_SUB_REPORT, ERROR_STR);
    const { isTableData } = this.state;
    const rowData = subreportState.get(SUB_REPORT_PARAMS, ERROR_STR);

    return (
      <div className="page-content-form">
        {isSubReport === true ? (
          <Overlay
            subComponent={
              <SubReport
                id={SUBREPORT_ID}
                data={rowData}
                otherData={getDataFromUtils()}
                mainReport={TASK_REPORT}
                reportState={reportState}
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
        <div className="report-table-section" id="task-report">
          {this.state.isTableData === "yes" ? (
            <ReportTableView
              {...this.state.reportData}
              exportData={this.state.mainReportData}
              onclickEdt={(e) => this.onClickLink(e)}
            />
          ) : this.state.isTableData === "no" ? (
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
  const { report, projects, data, sprints } = state;
  const id = ownProps.id;

  return {
    componentState: state.component.get(id, Map()),
    reportState: state.component.get(REPORT_SUBMENU_ID, Map()),
    reportDashboardState: report.getIn([REPORT_SUBMENU_ID, "apiData"], null),
    projectsDataState: projects.getIn([REPORT_SUBMENU_ID, "apiData"], null),
    employeeDataState: data.getIn([REPORT_SUBMENU_ID, "apiData"], null),
    singleprojectData: data.getIn([REPORT_PROJECT_ID, "apiData"], null),
    subreportState: state.component.get(SUBREPORT_ID, Map()),
    sprintsDataState: sprints.getIn([REPORT_SUBMENU_ID, "apiData"], null),
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
    fetchSprints,
    clearSprints,
  }
)(TaskReport);
