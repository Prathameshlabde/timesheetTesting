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
import { getLastNDays, getLastNDates } from "../../Dashboard.utils.js";
import Loader from "../../../../widgets/Loader";
import { LOADER_STYLE } from "../../../../../constants/app.constants.js";
import TableViewSimple from "../../../../widgets/TableView/TableViewSimple.js";

class CompanyHours extends Component {
  state = {
    isLoading: false,
    fdate: dateFormatter(moment().subtract(5, "days"), "yyyy-MM-dd"),
    fdateArr: getLastNDays(5),
    onlyDatesArr: getLastNDates(5),
    tdate: dateFormatter(moment(), "yyyy-MM-dd"),
    hoursData: [],
    finalData: [],
  };

  componentWillMount() {
    this.setState({ isLoading: true }, () => {
      this.getHours();
    });
  }

  componentWillUnmount() {
    const { id, deleteComponentState } = this.props;
    deleteComponentState(id);
  }

  getHours = () => {
    const { requestData, id } = this.props;
    const { fdate, tdate, fdateArr } = this.state;
    // console.log("fdateArr = ", fdateArr);
    let paramters = new FormData();
    const payload = {
      fdate,
      tdate,
      pro_id: "",
      fdateArr,
      isPmCompanyOrMyStats: "companystats",
    };
    paramters.append("params", JSON.stringify(payload));
    paramters.append("type", "getDashboard");
    paramters.append("command", "getCompanyTeamHours");
    const chartParams = {
      id,
      api: {
        body: paramters,
      },
    };

    requestData(chartParams).then((response) => {
      if (response.apiData && response.apiData.apiData) {
        this.setState({
          finalhoursData: response.apiData.apiData,
          isLoading: false,
        });
      }
    });
  };

  render() {
    const { finalhoursData, onlyDatesArr, isLoading } = this.state;
    return (
      <div
        className="boxShadowSpecific"
        style={{ width: "100%", height: "100%" }}
      >
        <div className="statsTitleDiv">
          <SpanLabel
            mainDivStyle={{ justifyContent: "center" }}
            style={{ color: Colors.textColor }}
            data="Timesheet Last 5 days"
          />
        </div>
        <div>
          {isLoading === true ? (
            <Loader style={LOADER_STYLE} />
          ) : !isEmpty(finalhoursData) ? (
            <TableViewSimple
              headerArr={onlyDatesArr}
              finalhoursData={finalhoursData}
              statName="companystats"
              isFromStats={true}
            />
          ) : null}
        </div>
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
)(CompanyHours);
