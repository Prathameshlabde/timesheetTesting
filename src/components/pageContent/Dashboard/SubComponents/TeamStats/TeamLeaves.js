import React, { Component } from "react";
import { connect } from "react-redux";
import { Map } from "immutable";
import {
  clearComponentState,
  updateComponentState,
  deleteComponentState,
} from "../../../../../actions/component.actions.js";
import "../../dashboard.css";
import { dateFormatter } from "../../../../utils/calender.utils.js";
import moment from "moment";
import {
  requestData,
  deleteData,
} from "../../../../../actions/data.actions.js";
import {
  NO_RECORDS_FOUND,
  LOADER_STYLE,
} from "../../../../../constants/app.constants.js";
import { isEmpty } from "../../../../utils/common.utils.js";
import SpanLabel from "../../../../widgets/SpanLabel.js";
import Colors from "../../../../common/colors/index.js";
import dashBoard_pmstats_leaves from "../../../../json/dashboard/dashBoard_pmstats_leaves.json";
import TableView from "../../../../widgets/TableView/TableView.js";
import { dataAbstraction } from "../../../../utils/dataAbstraction.utils.js";
import Loader from "../../../../widgets/Loader";

class TeamLeaves extends Component {
  state = {
    isLoading: false,
    currentDate: dateFormatter(moment(), "yyyy-MM-dd"),
    current_year: moment().format("YYYY"),
    nextYear: moment()
      .add(1, "years")
      .format("YYYY"),
    leavesData: {
      rows: [],
    },
  };

  componentWillMount() {
    this.setState({ isLoading: true }, () => {
      this.getLeavesData();
    });
  }

  componentWillUnmount() {
    const { id, deleteComponentState } = this.props;
    deleteComponentState(id);
  }

  componentWillReceiveProps(nextProps) {
    const { teamLeavesState } = nextProps;

    if (teamLeavesState !== this.props.teamLeavesState) {
      // console.log("teamLeavesState - ", teamLeavesState);
      if (
        teamLeavesState &&
        teamLeavesState.apiData &&
        !isEmpty(teamLeavesState.apiData.rows)
      ) {
        const leavesData = dataAbstraction(
          teamLeavesState.apiData,
          dashBoard_pmstats_leaves
        );

        this.setState(
          {
            leavesData,
            ogData: teamLeavesState.apiData.ogData,
            dataErrorMsg: "",
            isLoading: false,
          },
          () => {
            // console.log("leavesData in rcvprops 11 = ", leavesData);
          }
        );
      } else {
        this.setState({ isLoading: false, dataErrorMsg: NO_RECORDS_FOUND });
      }
    }

    if (teamLeavesState && teamLeavesState.isError) {
      if (teamLeavesState.isError) {
        this.setState({
          leavesData: { rows: [] },
          ogData: [],
          isLoading: false,
        });
      }
    }
  }

  getLeavesData = () => {
    const { requestData, id } = this.props;
    const { currentDate, current_year, nextYear } = this.state;
    let paramters = new FormData();
    const payload = {
      currentDate,
      current_year,
      nextYear,
      isPmCompanyOrMyStats: "pmstats",
    };
    paramters.append("params", JSON.stringify(payload));
    paramters.append("type", "getDashboard");
    paramters.append("command", "getCompanyTeamLeaves");
    const params = {
      id: id,
      api: {
        body: paramters,
      },
    };

    requestData(params).then((response) => {});
  };

  render() {
    const { leavesData, dataErrorMsg, isLoading } = this.state;
    return (
      <div
        className="boxShadowSpecific"
        style={{ width: "100%", Height: "340px" }}
      >
        <div className="statsTitleDiv">
          <SpanLabel style={{ color: Colors.textColor }} data="Team Leaves" />
        </div>
        <div style={{ textAlign: "center", height: "100%" }}>
          {isLoading === true ? (
            <Loader style={LOADER_STYLE} />
          ) : !isEmpty(leavesData.rows) ? (
            <TableView isFromStats={true} {...leavesData} />
          ) : null}
          {isEmpty(leavesData.rows) ? (
            <div
              style={{
                paddingTop: "2%",
                paddingBottom: "2%",
                textAlign: "center",
              }}
            >
              {dataErrorMsg}
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const { component, data } = state;
  const id = ownProps.id;
  return {
    componentState: component.get(id, Map()),
    teamLeavesState: data.getIn([id, "apiData"], null),
  };
}

export default connect(
  mapStateToProps,
  {
    clearComponentState,
    updateComponentState,
    deleteComponentState,
    requestData,
    deleteData,
  }
)(TeamLeaves);
