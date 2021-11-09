import React, { Component } from "react";
import { connect } from "react-redux";
import { Map } from "immutable";
import {
  clearComponentState,
  updateComponentState,
} from "../../../../actions/component.actions.js";

import {
  updateData,
  requestData,
  deleteData,
} from "../../../../actions/data.actions";

import "../leave.css";
import {
  TITLE_SUBTITLE_ID,
  APP_TITLE_SUBTITLE,
  NO_RECORDS_FOUND,
} from "../../../../constants/app.constants.js";

import { teamDropDownData } from "../../../utils/common.utils";

import { fetchLeaveApplicationsFromUtils } from "./appliedLeaves.utils";
import { getDataFromCookie } from "../../../utils/CheckLoginDetails";
import leave_ApprovedApplications_table from "../../../json/leave/leave_ApprovedApplications_table.json";
import { dataAbstraction } from "../../../utils/dataAbstraction.utils";
import TableView from "../../../widgets/TableView/TableView";

class AppliedLeaves extends Component {
  state = {
    team_name: "All",
    team_id: "1",
    teamsData: teamDropDownData,
  };

  componentWillMount() {
    const { updateComponentState } = this.props;
    let LoggedInUserFromRedux = "employee";
    if (getDataFromCookie().role) {
      LoggedInUserFromRedux = getDataFromCookie().role; //from redux state
    }
    this.setState(
      {
        LoggedInUser: LoggedInUserFromRedux,
      },
      () => {
        this.fetchData();
      }
    );

    let titleSub = {
      title: "Leave",
      subtitle: "Applied Leaves",
    };

    updateComponentState(TITLE_SUBTITLE_ID, APP_TITLE_SUBTITLE, titleSub);
  }

  componentWillReceiveProps(nextProps) {
    const { leaveApplicationsData } = nextProps;
    if (leaveApplicationsData !== this.props.leaveApplicationsData) {
      if (
        leaveApplicationsData &&
        leaveApplicationsData.apiData &&
        leaveApplicationsData.apiData !== true
      ) {
        const balanceLeavesFromDataAbstraction = dataAbstraction(
          leaveApplicationsData.apiData,
          leave_ApprovedApplications_table
        );

        this.setState({
          leaveApplicationsTableData: balanceLeavesFromDataAbstraction,
          dataErrorMsg: "",
        });
      } else {
        this.setState({
          dataErrorMsg: NO_RECORDS_FOUND,
        });
      }
    }
  }

  fetchData() {
    const { updateComponentState, requestData, id } = this.props;

    fetchLeaveApplicationsFromUtils(
      { id, requestData, updateComponentState },
      ""
    );
  }

  render() {
    return (
      <div className="page-content-leave">
        <div className="pr-container">
          {this.state.leaveApplicationsTableData ? (
            <TableView {...this.state.leaveApplicationsTableData} />
          ) : (
            <div className="pr-row">{this.state.dataErrorMsg}</div>
          )}
        </div>
      </div>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const { data } = state;
  return {
    componentState: state.component.get(ownProps.id, Map()),
    leaveApplicationsData: data.getIn([ownProps.id, "apiData"], null),
  };
}

export default connect(mapStateToProps, {
  clearComponentState,
  updateComponentState,
  updateData,
  requestData,
  deleteData,
})(AppliedLeaves);
// innodb_buffer_pool_size=402653184;
