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

import { fetchBalanceLeavesFromUtils } from "./BalanceLeave.utils";
import { getDataFromCookie } from "../../../utils/CheckLoginDetails";
import balance_leaves_table from "../../../json/leave/balance_leaves_table.json";
import { dataAbstraction } from "../../../utils/dataAbstraction.utils";
import TableView from "../../../widgets/TableView/TableView";
import moment from "moment";

class BalanceLeave extends Component {
  state = {
    current_year: moment().format("YYYY"),
  };

  componentWillMount() {
    let LoggedInUserFromRedux = "employee";
    if (getDataFromCookie().role) {
      LoggedInUserFromRedux = getDataFromCookie().role; //from redux state
    }
    this.setState({
      LoggedInUser: LoggedInUserFromRedux,
    });

    const { updateComponentState, requestData, id } = this.props;
    let titleSub = {
      title: "Leave",
      subtitle: "Balance Leaves",
    };

    fetchBalanceLeavesFromUtils(
      { id, requestData, updateComponentState },
      this.state.current_year
    );
    updateComponentState(TITLE_SUBTITLE_ID, APP_TITLE_SUBTITLE, titleSub);
  }

  componentWillReceiveProps(nextProps) {
    const { balanceLeavesData } = nextProps;

    if (balanceLeavesData !== this.props.balanceLeavesData) {
      if (
        balanceLeavesData &&
        balanceLeavesData.apiData &&
        balanceLeavesData.apiData !== true
      ) {
        const balanceLeavesFromDataAbstraction = dataAbstraction(
          balanceLeavesData.apiData,
          balance_leaves_table
        );

        this.setState({
          balanceLeavesTableData: balanceLeavesFromDataAbstraction,
          dataErrorMsg: "",
          totalRowCount: balanceLeavesFromDataAbstraction.rows.length,
        });
      } else {
        this.setState({
          dataErrorMsg: NO_RECORDS_FOUND,
        });
      }
    }
  }

  render() {
    return (
      <div className="page-content-leave">
        <div className="Balance-leave">
          {this.state.balanceLeavesTableData ? (
            <TableView
              {...this.state.balanceLeavesTableData}
              heighlightRowIndex={this.state.totalRowCount - 1}
            />
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
    balanceLeavesData: data.getIn([ownProps.id, "apiData"], null),
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
)(BalanceLeave);
