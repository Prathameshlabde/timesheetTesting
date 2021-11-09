import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Map } from "immutable";
import {
  clearComponentState,
  updateComponentState,
  deleteComponentState
} from "../../../actions/component.actions.js";
import { getDataFromCookie } from "../../utils/CheckLoginDetails";
import { requestData, clearData } from "../../../actions/data.actions.js";
import { dataAbstractionForReport } from "../../utils/dataAbstraction.utils.js";
import ReportTableView from "../../widgets/TableView/ReportTableView";
import Icon from "../../widgets/Icon";
import report_referenceNo_sub_table from "../../json/reports/referenceno report/report_referenceNo_sub_table";
import report_taskReport_sub_table from "../../json/reports/task report/report_taskReport_sub_table";

import { fetchSubRefNoReport } from "./ReferenceNumberReport/referenceNoReport.utils";
import moment from "moment";
import {
  TASK_REPORT,
  REPORT_SUBMENU_ID,
  SUB_EXPORT_DATA
} from "../../../constants/app.constants.js";
import { fetchSubTaskReport } from "./TaskReport/taskReport.utils";

class SubReport extends Component {
  static propTypes = {
    id: PropTypes.string,
    componentState: PropTypes.object.isRequired,
    updateComponentState: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      isTableData: "null",
      reportTableData: {
        rows: []
      }
    };
  }

  componentWillMount() {
    let LoggedInUserFromRedux = "employee";
    if (getDataFromCookie().role) {
      LoggedInUserFromRedux = getDataFromCookie().role; //from redux state
    }
    this.setState({
      LoggedInUser: LoggedInUserFromRedux
    });

    const { requestData, updateComponentState } = this.props;

    if (this.props.mainReport && this.props.mainReport === TASK_REPORT) {
      this.setState({
        tableJson: report_taskReport_sub_table
      });
      fetchSubTaskReport(
        this.props.id,
        this.props.data,
        { requestData, updateComponentState },
        LoggedInUserFromRedux,
        this.props.reportState
      );
    } else {
      this.setState({
        tableJson: report_referenceNo_sub_table
      });
      fetchSubRefNoReport(
        this.props.id,
        this.props.data,
        { requestData, updateComponentState },
        LoggedInUserFromRedux
      );
    }

    let dataObj = this.props.otherData;
    this.setState({
      dataObj: dataObj
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.reportData !== nextProps.reportData) {
      // console.log("nextProps.reportData  sub report  = ", nextProps.reportData);

      if (nextProps.reportData && nextProps.reportData.apiData) {
        let reportDashBoard;
        let dataobj = this.state.dataObj;

        if (this.props.mainReport && this.props.mainReport === TASK_REPORT) {
          dataobj["reportTitle"] = "Task User Entries";
          dataobj["task_title"] = this.props.data.task_title;
          dataobj["projectName"] = this.props.otherData.pro_name;
        } else {
          dataobj["reportTitle"] = "Single Reference Number";
          dataobj["task_title"] = this.props.data["Main Reference Number"];
          dataobj["projectName"] = this.props.otherData.pro_name;
          if (
            this.props.data["Sub Reference Number"] &&
            this.props.data["Sub Reference Number"] !== ""
          ) {
            dataobj["sub_task_title"] = this.props.data["Sub Reference Number"];
          }
        }

        // data: {Main Reference Number: "Analysis", Sub Reference Number: ""}

        const { updateComponentState } = this.props;
        reportDashBoard = dataAbstractionForReport(
          nextProps.reportData.apiData,
          this.state.tableJson,
          { updateComponentState },
          dataobj
        );
        let reportTableData = reportDashBoard.tableData;
        this.setState({
          isTableData: "yes",
          reportTableData: reportTableData
        });
      }
    }
  }

  componentWillUnmount() {
    this.setState({ isTableData: "null" });
    const { id, clearData } = this.props;
    const clearParams = {
      id
    };
    clearData(clearParams);
  }

  closeNewEntry = isButtonPressed => {
    const { deleteComponentState, id } = this.props;
    deleteComponentState(id);
    updateComponentState(REPORT_SUBMENU_ID, SUB_EXPORT_DATA, "");
  };

  render() {
    return this.state.isTableData === "yes" ? (
      <div className="pr-inner-div pr-center" id="refwisereport">
        <div className="pr-header-level" style={{ display: "flex" }}>
          <div
            className="pr-col-inner-div-header-left"
            style={{ padding: "4px 0", width: "98%", marginLeft: "1%" }}
          >
            <div className="pr-row">
              <div className="pr-col-9">
                <span className="pr-col-2-no-wrap">
                  {this.props.mainReport &&
                  this.props.mainReport === TASK_REPORT ? (
                    <b>
                      User Entries from &nbsp;
                      {moment(this.state.dataObj.fromDate).format(
                        "DD-MMM-YYYY"
                      )}
                      &nbsp; to&nbsp;
                      {moment(this.state.dataObj.toDate).format("DD-MMM-YYYY")}
                    </b>
                  ) : (
                    <b>
                      Reference Number Report from &nbsp;
                      {moment(this.state.dataObj.fromDate).format(
                        "DD-MMM-YYYY"
                      )}
                      &nbsp; to&nbsp;
                      {moment(this.state.dataObj.toDate).format("DD-MMM-YYYY")}
                    </b>
                  )}
                </span>
              </div>
            </div>

            <div className="pr-row">
              <div className="pr-col-9">
                <span className="pr-col-2-no-wrap">
                  <b>Project Name: {this.state.dataObj.pro_name}</b>
                </span>
              </div>
            </div>

            {this.state.dataObj.task_title !== "" ? (
              <div className="pr-row">
                <div className="pr-col-9">
                  <span className="pr-col-2-no-wrap">
                    <b>Task Title: {this.state.dataObj.task_title}</b>
                  </span>
                </div>
              </div>
            ) : null}

            {this.props.data["Sub Reference Number"] &&
            this.props.data["Sub Reference Number"] !== "" ? (
              <div className="pr-row">
                <div className="pr-col-9">
                  <span className="pr-col-2-no-wrap">
                    <b>Sub Task: {this.props.data["Sub Reference Number"]}</b>
                  </span>
                </div>
              </div>
            ) : null}
          </div>

          <div className="pr-col-inner-div-header-right">
            <Icon
              icon="close"
              style={{
                fontSize: "20px",
                cursor: "pointer",
                margin: "3px",
                color: "black"
              }}
              title="close"
              onClick={() => this.closeNewEntry(false)}
            />
          </div>
        </div>
        <div style={{ width: "98%", margin: "1%" }}>
          <ReportTableView {...this.state.reportTableData} isSubReport={true} />
        </div>
      </div>
    ) : null;
  }
}

export function mapStateToProps(state, ownProps) {
  const { component, data } = state;
  const id = ownProps.id;
  return {
    componentState: component.get(id, Map()),
    reportData: data.getIn([id, "apiData"], null)
  };
}

export default connect(
  mapStateToProps,
  {
    clearComponentState,
    updateComponentState,
    deleteComponentState,
    requestData,
    clearData
  }
)(SubReport);
