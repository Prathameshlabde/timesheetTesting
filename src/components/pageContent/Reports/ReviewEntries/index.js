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
  APP_ID,
  APP_NEW_ENTRY,
  APP_EDIT_ENTRY_ID,
  REVIEWENTRIES_NEW_ENTRY_ID,
  UPDATE_REVIEWENTRIES,
  REVIEWENTRIES_SHOULD_UPDATE,
  REPORTS_MSG_DATA_NOT_FOUND,
  ICON_TITLE_COLLAPSE,
  EXPAND_LESS_ICON_NAME,
  ENTER_SEARCH_CRITERIA,
  TITLE_SUBTITLE_ID,
  SORT_BY,
  REPORT_MSG_CHANGE_DATE,
  PROJECT_ID,
  TASK_ID,
  ERROR_STR,
  DASHBOARD_NAVIGATE_ID,
} from "../../../../constants/app.constants.js";

import {
  requestData,
  clearData,
  deleteData,
} from "../../../../actions/data.actions.js";

import {
  fetchProjects,
  clearProjects,
} from "../../../../actions/projects.actions.js";
import { fetchTasks, clearTasks } from "../../../../actions/tasks.actions.js";
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
  deleteEntryFromUtils,
  fetchReportFromUtils,
  fetchTasksList,
} from "./reviewEntries.utils";
import { getJsonTableFile, getExpandIcon } from "../reports.ui.utils.js";
import { getDataFromCookie } from "../../../utils/CheckLoginDetails";
import ReportTableView from "../../../widgets/TableView/ReportTableView.js";
import DiaglogBox from "../../../widgets/AlertBox.js";
import Overlay from "../../../widgets/Overlay/OverLay.js";
import NewEntry from "../../../newEntry/NewEntry";
import RenderReport from "../RenderReport";
import { dataAbstractionForReport } from "../../../utils/dataAbstraction.utils.js";
import moment from "moment";
import {
  getDownArrowObj,
  getUpArrowObj,
  getDateDifferencesFromUtils,
} from "../Reports.utils.js";
import ReportSubDetails from "../ReportSubDetails.js";
import { isEmpty } from "../../../utils/common.utils.js";

class ReviewEntries extends Component {
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
      reportData: {
        rows: [],
      },
      isTableData: "null",
      isFormExpand: true,
      expandIconName: EXPAND_LESS_ICON_NAME,
      expandIconTitle: ICON_TITLE_COLLAPSE,
      criteriyaMessage: ENTER_SEARCH_CRITERIA,
      showdeleteDialog: false,
      classNameDiv: "",
      dataObject: "",
      sort_by: "date",
      subTotalindexes: { indexes: [] },
      ogData: [],
    };
    const { updateComponentState } = this.props;
    updateComponentState(
      UPDATE_REVIEWENTRIES,
      REVIEWENTRIES_SHOULD_UPDATE,
      "NO"
    );
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

    this.setState({ LoggedInUser: LoggedInUserFromRedux }, () => {
      let titleSub = {
        title: "Reports",
        subtitle: "Review Entries",
      };
      updateComponentState(TITLE_SUBTITLE_ID, APP_TITLE_SUBTITLE, titleSub);

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

      const { clearTasks, updateComponentState, fetchTasks } = this.props;
      if (
        pro_ID_from_nextprops &&
        pro_ID_from_nextprops !== pro_ID_from_thisprops &&
        pro_ID_from_nextprops !== ERROR_STR
      ) {
        const clearParams = { id: REPORT_SUBMENU_ID };
        clearTasks(clearParams);
        fetchTasksList({ projectId: pro_ID_from_nextprops, fetchTasks });
        updateComponentState(REPORT_SUBMENU_ID, TASK_ID, "");
      } else if (pro_ID_from_nextprops === "") {
        const clearParams = { id: REPORT_SUBMENU_ID };
        clearTasks(clearParams);
      }

      const sort_by_from_nextprops = nextProps.reportState.get(
        SORT_BY,
        ERROR_STR
      );
      if (sort_by_from_nextprops && sort_by_from_nextprops !== ERROR_STR) {
        this.setState({
          sort_by: sort_by_from_nextprops,
        });
      }
    }

    // if (
    //   nextProps.updateReviewEntriesState !== this.props.updateReviewEntriesState
    // ) {
    //   const isUpdateThisProps = this.props.updateReviewEntriesState.get(
    //     REVIEWENTRIES_SHOULD_UPDATE,
    //     "NO"
    //   );
    //   const isUpdateNextProps = nextProps.updateReviewEntriesState.get(
    //     REVIEWENTRIES_SHOULD_UPDATE,
    //     "NO"
    //   );
    //   if (isUpdateThisProps !== isUpdateNextProps) {
    //     console.log("nextprop", nextProps.updateReviewEntriesState);
    //     console.log("this.props", this.props.updateReviewEntriesState);
    //     console.log("update review entry");
    //     const { updateComponentState } = this.props;
    //     // updateComponentState(
    //     //   UPDATE_REVIEWENTRIES,
    //     //   REVIEWENTRIES_SHOULD_UPDATE,
    //     //   "NO"
    //     // );
    //     // updateComponentState(APP_ID, APP_NEW_ENTRY, false);
    //     fetchReportFromUtils(nextProps, this.state);
    //   }
    // }

    if (
      nextProps.updateReviewEntriesState.get(
        REVIEWENTRIES_SHOULD_UPDATE,
        "NO"
      ) !==
      this.props.updateReviewEntriesState.get(REVIEWENTRIES_SHOULD_UPDATE, "NO")
    ) {
      // console.log("nextprop", nextProps.updateReviewEntriesState);
      // console.log("this.props", this.props.updateReviewEntriesState);
      // console.log("update review entry");
      const { updateComponentState, deleteComponentState } = this.props;
      updateComponentState(
        UPDATE_REVIEWENTRIES,
        REVIEWENTRIES_SHOULD_UPDATE,
        "NO"
      );
      updateComponentState(APP_ID, APP_NEW_ENTRY, false);
      // deleteComponentState(UPDATE_REVIEWENTRIES);
      fetchReportFromUtils(nextProps, this.state);
    }

    if (this.props.reportDashboardState !== nextProps.reportDashboardState) {
      if (
        nextProps.reportDashboardState &&
        nextProps.reportDashboardState.apiData &&
        !isEmpty(nextProps.reportDashboardState.apiData.columns)
      ) {
        let reportDashBoard;
        let nextApiData = nextProps.reportDashboardState.apiData;
        let rowCount = nextApiData.rows.length - 1;
        let columns = nextApiData.columns;
        let keytotalDuration = 0;
        let keyBillable = 0;
        let keyNonBillable = 0;

        let subTotalindexesArr = [];
        for (let i = 0; i < nextApiData.rows.length; i++) {
          if (nextApiData.rows[i][0] === "Sub Total") {
            subTotalindexesArr.push(i + 1);
          }
        }

        for (let i = 0; i < columns.length; i++) {
          if (columns[i].names === "bilable_hrs") {
            keyBillable = i;
          } else if (columns[i].names === "non_bilable_hrs") {
            keyNonBillable = i;
          } else if (columns[i].names === "estimated_hrs") {
            keytotalDuration = i;
          }
        }

        const lastRow = nextApiData.rows[rowCount];
        billableHrs = lastRow[keyBillable];
        nonbillableHrs = lastRow[keyNonBillable];
        totalHrs = lastRow[keytotalDuration];
        let dataobj = getDataFromUtils();
        dataobj["reportTitle"] = "Review Entries";
        dataobj["billableBool"] = dataobj.billableBool_reviewEntries;
        dataobj["nonbillableBool"] = dataobj.nonbillableBool_reviewEntries;
        dataobj["totalDuration"] = totalHrs;
        dataobj["bilable_hrs"] = billableHrs;
        dataobj["non_bilable_hrs"] = nonbillableHrs;
        reportDashBoard = dataAbstractionForReport(
          nextApiData,
          this.getRespectiveJsonTableFile(dataobj),
          this.props,
          dataobj
        );

        let reportTableData = reportDashBoard.tableData; //////////13 jan 2020 ///////////////////

        if (reportTableData) {
          if (nextApiData.business_days && nextApiData.business_hours) {
            dataobj["business_days"] = nextApiData.business_days;
            dataobj["business_hours"] = nextApiData.business_hours;
          }
          reportDashBoard = dataAbstractionForReport(
            nextApiData,
            this.getRespectiveJsonTableFile(dataobj),
            this.props,
            dataobj
          );
          this.setState(
            {
              isTableData: "yes",
              reportData: reportTableData,
              business_days: nextApiData.business_days,
              business_hours: nextApiData.business_hours,
              billable: billableHrs,
              nonbillableHrs,
              estimated: totalHrs,
              dataObject: dataobj,
              isFormExpand: true,
              subTotalindexes: { indexes: [subTotalindexesArr] },
              ogData: nextApiData.ogData,
            },
            () => {
              this.showForm();
            }
          );
        }
      } else {
        this.setState(
          {
            isTableData: "no",
            reportData: { rows: [] },
            dataObject: "",
            isFormExpand: false,
            subTotalindexes: { indexes: [] },
            ogData: [],
          },
          () => {
            this.showForm();
          }
        );
      }
    }
  }

  getRespectiveJsonTableFile(dataObject) {
    return getJsonTableFile(
      "Review Entries",
      this.state.sort_by,
      dataObject.billableBool_reviewEntries,
      dataObject.nonbillableBool_reviewEntries
    );
  }

  componentWillUnmount() {
    clearDataFromUtils();
    const {
      id,
      clearData,
      clearProjects,
      clearTasks,
      updateComponentState,
      deleteComponentState,
      clearReport,
    } = this.props;
    const clearParams = { id };
    clearData(clearParams);
    clearProjects(clearParams);
    clearTasks(clearParams);
    clearReport(REPORT_SUBMENU_ID);
    updateComponentState(APP_ID, APP_NEW_ENTRY, false);
    deleteComponentState(DASHBOARD_NAVIGATE_ID);
  }

  onclickEdit = (idToEdit) => {
    const { updateComponentState } = this.props;
    updateComponentState(APP_ID, APP_NEW_ENTRY, true);
    updateComponentState(APP_ID, APP_EDIT_ENTRY_ID, idToEdit);
  };

  onclickDelete = (idToDelete) => {
    this.setState({ showdeleteDialog: true, idToDelete: idToDelete });
  };

  onClickcancelToDialog = () => {
    this.setState({ showdeleteDialog: false });
  };

  onClickOkToDialog = () => {
    // console.log("Delete Click ID :- ", this.state.idToDelete);
    const { id, deleteData } = this.props;
    deleteEntryFromUtils(
      { id, deleteData },
      this.state.idToDelete,
      this.state,
      this.props
    );
    this.setState({ showdeleteDialog: false, idToDelete: null });
  };

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
    const { appState, reportState } = this.props;
    const isNewTimeSheet = appState.get(APP_NEW_ENTRY, false);
    const reportJsonFileName = reportState.get(REPORT_JSONFILE, ERROR_STR);
    const dataobj = getDataFromUtils();
    const DifferenceOfDate = getDateDifferencesFromUtils(
      dataobj.fromDate,
      dataobj.toDate
    );

    return (
      <div className="page-content-form">
        {isNewTimeSheet === true ? (
          <Overlay
            subComponent={
              <NewEntry
                id={REVIEWENTRIES_NEW_ENTRY_ID}
                currentTableData={this.state.ogData}
                mainPage="Reports"
              />
            }
          />
        ) : null}
        <div>
          <DiaglogBox
            open={this.state.showdeleteDialog}
            title="Alert"
            onCancel={this.onClickcancelToDialog}
            onConfirm={this.onClickOkToDialog}
            button1={"Cancel"}
            button2={"Ok"}
            alertMsg="Are you sure you want to delete?"
          />

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
            this.state.isTableData !== "null" &&
            this.state.isTableData !== "no" ? (
              <ReportSubDetails data={this.state.dataObject} />
            ) : null}
          </div>
          <div className="report-table-section">
            {DifferenceOfDate > 31 ? ( //////////13 jan 2020//////////
              <div style={{ color: "red" }}>{REPORT_MSG_CHANGE_DATE}</div>
            ) : this.state.isTableData === "yes" ? (
              <ReportTableView
                {...this.state.reportData}
                ogData={this.state.ogData}
                reportName={"Review Entries"}
                onclickEdt={(e) => this.onclickEdit(e)}
                onClickDel={(e) => this.onclickDelete(e)}
                hideExcel="false" //////////13 jan 2020 ///////////////////
                headFix="false"
                subTotalindexes={this.state.subTotalindexes}
              />
            ) : this.state.isTableData === "no" ? (
              <div>
                <div>{REPORTS_MSG_DATA_NOT_FOUND}</div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const { component, report, data, projects, tasks } = state;
  const id = ownProps.id;

  return {
    componentState: state.component.get(id, Map()),
    appState: component.get(APP_ID, Map()),
    updateReviewEntriesState: component.get(UPDATE_REVIEWENTRIES, Map()),
    reportState: state.component.get(REPORT_SUBMENU_ID, Map()),
    reportDashboardState: report.getIn([REPORT_SUBMENU_ID, "apiData"], null),
    projectsDataState: projects.getIn([REPORT_SUBMENU_ID, "apiData"], null),
    employeeDataState: data.getIn([REPORT_SUBMENU_ID, "apiData"], null),
    tasksDataState: tasks.getIn([REPORT_SUBMENU_ID, "apiData"], null),
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
    clearProjects,
    fetchTasks,
    clearTasks,
    requestData,
    clearData,
    deleteData,
  }
)(ReviewEntries);
