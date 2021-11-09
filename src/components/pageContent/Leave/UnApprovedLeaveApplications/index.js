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

import { fetchLeaveApplicationsFromUtils } from "./UnApprovedLeaveApplication.utils.js";
import { getDataFromCookie } from "../../../utils/CheckLoginDetails";
import UnApproved_LeaveApp_lication_table from "../../../json/leave/leave_UnApprovedApplications_table.json";
import { dataAbstraction } from "../../../utils/dataAbstraction.utils";
import TableView from "../../../widgets/TableView/TableView";
import SpanLabel from "../../../widgets/SpanLabel";
import DropdownList from "../../../widgets/DropdownList";

class ApprovedLeaveApplications extends Component {
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

    // console.log("this.props.id of Leave Applications = ", this.props.id);

    let titleSub = {
      title: "Leave",
      subtitle: "UnApproved Leave Applications",
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
          UnApproved_LeaveApp_lication_table
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

  onChangeFieldValues = (id, updatedValue, updatedValue1, updatedValue2) => {
    if (id === "team_name") {
      this.setState(
        {
          team_id: updatedValue,
          team_name: updatedValue2,
          leaveApplicationsTableData: "",
        },
        () => {
          this.fetchData();
        }
      );
    }
  };

  fetchData() {
    const { updateComponentState, requestData, id } = this.props;
    if (
      this.state.LoggedInUser === "pm" ||
      this.state.LoggedInUser === "admin" ||
      this.state.LoggedInUser === "superadmin"
    ) {
      fetchLeaveApplicationsFromUtils(
        { id, requestData, updateComponentState },
        this.state.team_name
      );
    } else {
      fetchLeaveApplicationsFromUtils(
        { id, requestData, updateComponentState },
        ""
      );
    }
  }

  render() {
    return (
      <div className="page-content-leave">
        <div className="pr-container">
          {this.state.LoggedInUser === "pm" ||
          this.state.LoggedInUser === "admin" ||
          this.state.LoggedInUser === "superadmin" ? (
            <div className="pr-row">
              <div className="pr-col-3">
                <div className="pr-top-level-section1-comp">
                  <SpanLabel className="span-table-leave" data="Select Team" />
                  <DropdownList
                    id="team_name"
                    dropDownData={this.state.teamsData}
                    onChange={this.onChangeFieldValues}
                    // defaultOption="Select Technology"
                    selectedID={this.state.team_id}
                  />
                </div>
              </div>
            </div>
          ) : null}

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

export default connect(
  mapStateToProps,
  {
    clearComponentState,
    updateComponentState,
    updateData,
    requestData,
    deleteData,
  }
)(ApprovedLeaveApplications);
