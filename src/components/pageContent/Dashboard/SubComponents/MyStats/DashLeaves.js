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
import { isEmpty } from "../../../../utils/common.utils.js";
import SpanLabel from "../../../../widgets/SpanLabel.js";
import Colors from "../../../../common/colors/index.js";
import Loader from "../../../../widgets/Loader";
import { LOADER_STYLE } from "../../../../../constants/app.constants.js";

class DashLeaves extends Component {
  state = {
    isLoading: false,
    currentDate: dateFormatter(moment(), "yyyy-MM-dd"),
    current_year: moment().format("YYYY"),
    nextYear: moment()
      .add(1, "years")
      .format("YYYY"),
    leavesData: [],
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

  getLeavesData = () => {
    const { requestData, id } = this.props;
    const { currentDate, current_year, nextYear } = this.state;
    let paramters = new FormData();
    const payload = {
      currentDate,
      current_year,
      nextYear,
    };
    paramters.append("params", JSON.stringify(payload));
    paramters.append("type", "getDashboard");
    paramters.append("command", "getDashboardLeaves");
    const params = {
      id: id,
      api: {
        body: paramters,
      },
    };

    requestData(params).then((response) => {
      if (response.apiData && response.apiData.apiData) {
        this.setState({
          leavesData: response.apiData.apiData,
          isLoading: false,
        });
      }
    });
  };

  renderLeaves(leavesData) {
    if (isEmpty(leavesData)) {
      return <div />;
    } else {
      const styleSpanDiv = {
        margin: "15px 20px",
        border: "1px solid rgba(246, 246, 246, 0.48)",
      };
      const mainDivStyleHead = {
        padding: "5px",
        background: Colors.newBgColor,
      };
      const mainDivStyleValue = { padding: "5px" };
      return (
        <div style={{ display: "flex" }}>
          <div className="pr-col-3">
            <div style={styleSpanDiv}>
              <SpanLabel
                mainDivStyle={mainDivStyleHead}
                data="Entitled To Date"
              />
              <SpanLabel
                mainDivStyle={mainDivStyleValue}
                data={leavesData.entitledToDate}
              />
            </div>
            <div style={styleSpanDiv}>
              <SpanLabel
                mainDivStyle={mainDivStyleHead}
                data="Balance Leaves"
              />
              <SpanLabel
                mainDivStyle={mainDivStyleValue}
                data={leavesData.balanceLeaves}
              />
            </div>
          </div>
          <div className="pr-col-3">
            <div style={styleSpanDiv}>
              <SpanLabel
                mainDivStyle={mainDivStyleHead}
                data="Leave Applications"
              />
              <SpanLabel
                mainDivStyle={mainDivStyleValue}
                data={leavesData.leaveApplications}
              />
            </div>
            <div style={styleSpanDiv}>
              <SpanLabel
                mainDivStyle={mainDivStyleHead}
                data="Pending Applications"
              />
              <SpanLabel
                mainDivStyle={mainDivStyleValue}
                data={leavesData.pendingLeaves}
              />
            </div>
          </div>
          <div className="pr-col-3">
            <div style={styleSpanDiv}>
              <SpanLabel
                mainDivStyle={mainDivStyleHead}
                data="Approved Leaves"
              />
              <SpanLabel
                mainDivStyle={mainDivStyleValue}
                data={leavesData.approvedLeaves}
              />
            </div>
            <div style={styleSpanDiv}>
              <SpanLabel
                mainDivStyle={mainDivStyleHead}
                data="Not Approved Leaves"
              />
              <SpanLabel
                mainDivStyle={mainDivStyleValue}
                data={leavesData.notApprovedLeaves}
              />
            </div>
          </div>
        </div>
      );
    }
  }

  render() {
    const { leavesData, isLoading } = this.state;
    return (
      <div
        className="boxShadowSpecific"
        style={{ width: "100%", height: "100%" }}
      >
        <div className="statsTitleDiv">
          <SpanLabel
            mainDivStyle={{ justifyContent: "center" }}
            style={{ color: Colors.textColor }}
            data="My Leaves"
          />
        </div>

        {isLoading === true ? (
          <Loader style={LOADER_STYLE} />
        ) : !isEmpty(leavesData) ? (
          <div
            style={{ paddingTop: "1%", textAlign: "center", height: "100%" }}
          >
            {this.renderLeaves(leavesData)}
          </div>
        ) : null}
      </div>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const { component } = state;
  const id = ownProps.id;
  return {
    componentState: component.get(id, Map()),
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
)(DashLeaves);
