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

class DashHolidays extends Component {
  state = {
    isLoading: false,
    currentDate: dateFormatter(moment(), "yyyy-MM-dd"),
    currentYear: moment().format("YYYY"),
    nextYear: moment()
      .add(1, "years")
      .format("YYYY"),
    holidaysData: [],
  };

  componentWillMount() {
    this.setState({ isLoading: true }, () => {
      this.getNextHolidays();
    });
  }

  componentWillUnmount() {
    const { id, deleteComponentState } = this.props;
    deleteComponentState(id);
  }

  getNextHolidays = () => {
    const { requestData, id } = this.props;
    const { currentDate, currentYear, nextYear } = this.state;
    let paramters = new FormData();
    const payload = {
      currentDate,
      currentYear,
      nextYear,
    };
    paramters.append("params", JSON.stringify(payload));
    paramters.append("type", "getDashboard");
    paramters.append("command", "getLatestHolidays");
    const params = {
      id: id,
      api: {
        body: paramters,
      },
    };

    requestData(params).then((response) => {
      if (response.apiData && response.apiData.apiData) {
        this.setState({
          holidaysData: response.apiData.apiData,
          isLoading: false,
        });
      }
    });
  };

  getFormattedDate(holi_date) {
    return moment(holi_date)
      .format("ddd DD MMMM ")
      .toString();
  }

  getOddEvenRow(index) {
    if (index % 2 === 0) {
      return "pr-even";
    } else {
      return "pr-odd";
    }
  }

  getSingleRow(item, index) {
    let cls = this.getOddEvenRow(index);
    return (
      <div
        key={item.holi_desc}
        className={cls}
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          height: "17%",
          alignItems: "center",
        }}
      >
        <div style={{ width: "40%" }}>
          <SpanLabel
            data={this.getFormattedDate(item.holi_date)}
            isRequired={false}
          />
        </div>

        <div style={{ paddingLeft: "1%", width: "60%" }}>
          <SpanLabel data={item.holi_desc} isRequired={false} />
        </div>
      </div>
    );
  }

  renderHolidays(holidaysData) {
    if (!isEmpty(holidaysData)) {
      let retObj = holidaysData.map(
        (item, index) => (item ? this.getSingleRow(item, index) : null)
      );
      return retObj;
    } else return null;
  }

  render() {
    const { holidaysData, isLoading } = this.state;
    return (
      <div
        className="boxShadowSpecific"
        style={{ width: "100%", height: "100%" }}
      >
        <div className="statsTitleDiv">
          <SpanLabel
            mainDivStyle={{ justifyContent: "center" }}
            style={{ color: Colors.textColor }}
            data="Upcoming Holidays"
          />
        </div>

        {isLoading === true ? (
          <Loader style={LOADER_STYLE} />
        ) : !isEmpty(holidaysData) ? (
          <div
            style={{
              // paddingTop: "1%",
              // paddingBottom: "1%",
              textAlign: "center",
              height: "100%",
            }}
          >
            {this.renderHolidays(holidaysData)}
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
)(DashHolidays);
