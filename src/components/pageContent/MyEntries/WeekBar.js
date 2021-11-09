import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Map } from "immutable";
import {
  CHART_ID,
  CHART_SHOW,
  CHART_CONTAINER_ID,
  WEEK_OBJ_ARRAY,
} from "../../../constants/app.constants";
import {
  clearComponentState,
  updateComponentState,
} from "../../../actions/component.actions";
import Colors from "../../common/colors";
import { dateFormatter } from "../../utils/calender.utils";
import PieChart from "../Charts/PieChart";
import { requestData } from "../../../actions/data.actions";
import Overlay from "../../widgets/Overlay/OverLay.js";
import Icon from "../../widgets/Icon";
import "./myEntries.css";
import moment from "moment";

class WeekBar extends Component {
  static propTypes = {
    id: PropTypes.string,
    componentState: PropTypes.object.isRequired,
    updateComponentState: PropTypes.func.isRequired,
  };
  state = {
    weeksData: this.props.weekData,
    selectedDateState: dateFormatter(
      this.props.selectedDateInWeekBar,
      "yyyy-MM-dd"
    ),
  };

  componentWillReceiveProps(nextProps) {
    const { weekData, selectedDateInWeekBar } = nextProps;
    const selectedDateInWeek = selectedDateInWeekBar;
    if (weekData && weekData !== this.props.weekData) {
      this.setState({ weeksData: weekData });
    }
    if (
      selectedDateInWeek &&
      selectedDateInWeek !== this.props.selectedDateInWeekBar
    ) {
      this.setState({
        selectedDateState: dateFormatter(selectedDateInWeek, "yyyy-MM-dd"),
      });
    }
  }

  onClickDiv(selectedDate, selectedID) {
    const date = moment(selectedDate);
    const now = moment();

    if (now > date) {
      this.setState({ selectedDateState: selectedDate });
      this.props.onClickWeekBar(selectedDate);
    }
  }

  showChart = (dateForChart) => {
    const { requestData, id } = this.props;
    // console.log("dateForChart", dateForChart);
    let paramters = new FormData();
    const payload = {
      DateRange: "custom",
      fdate: dateForChart,
      pro_id: "",
      tdate: dateForChart,
    };
    paramters.append("params", JSON.stringify(payload));
    paramters.append("type", "getData");
    paramters.append("command", "getBillableWeeksChart");
    const chartParams = {
      id: id,
      api: {
        body: paramters,
      },
    };

    requestData(chartParams).then((response) => {
      if (response.apiData && response.apiData.apiData) {
        this.setState(
          {
            chartDataState: response.apiData.apiData,
          },
          () => {
            const { updateComponentState } = this.props;
            updateComponentState(CHART_ID, CHART_SHOW, true);
          }
        );
      }
    });
  };

  getSingleDateComponent(id, weeksDataObj, selectedDateState) {
    return (
      <div
        id={id}
        key={id}
        className="dashboard-section3-week-bar-date1"
        style={
          weeksDataObj.date === selectedDateState
            ? {
                backgroundColor: Colors.lightBlueColor,
                borderBottom: `3px solid ${Colors.blueColorWeekSelected}`,
              }
            : {
                backgroundColor: Colors.weekBarGrayColors,
                borderBottom: "",
              }
        }
        onClick={() => this.onClickDiv(weeksDataObj.date, id)}
      >
        <div className="dayname">
          <span className="daynameSpan">
            <strong>{weeksDataObj.title}</strong>
          </span>
        </div>
        <div className="dayhours">
          <span className="dayhoursSpan">
            {weeksDataObj.estimated}
            {" ("}
            {weeksDataObj.data}
            {") "}
          </span>
        </div>
      </div>
    );
  }

  getDatesComponents(selectedDateState) {
    return WEEK_OBJ_ARRAY.map((item) =>
      this.getSingleDateComponent(
        item.id,
        this.state.weeksData[item.index],
        selectedDateState
      )
    );
  }

  render() {
    const { weeksData, selectedDateState } = this.state;
    const { chartDialogState } = this.props;
    const isShowGraph = chartDialogState.get("CHART_SHOW", false);

    return (
      <div className="dashboard-section3-week-bar">
        {isShowGraph === true ? (
          <Overlay
            subComponent={
              <PieChart
                id={CHART_CONTAINER_ID}
                chartsData={this.state.chartDataState}
                startDate={weeksData[0].date}
                endDate={weeksData[6].date}
              />
            }
          />
        ) : null}
        {this.props.previousIsEnable === true ? (
          <div className="dashboard-section3-week-bar-button-left">
            <button
              type="button"
              className="dashboard-section3-week-button"
              onClick={() => this.props.onClickPrevious()}
              disabled={!this.props.previousIsEnable}
              style={{
                color: Colors.arrowBlueColor,
                cursor: "pointer",
              }}
            >
              &#8249;
            </button>
          </div>
        ) : null}

        {this.getDatesComponents(selectedDateState)}

        {this.props.nextIsEnable === true ? (
          <div className="dashboard-section3-week-bar-button-left">
            <button
              type="button"
              className="dashboard-section3-week-button"
              onClick={this.props.onClickNext}
              disabled={!this.props.nextIsEnable}
              style={{
                color: Colors.arrowBlueColor,
                cursor: "pointer",
              }}
            >
              &#8250;
            </button>
          </div>
        ) : null}

        <div className="dashboard-section3-week-bar-totalTime">
          <div className="dayname" style={{ marginTop: "5%" }}>
            <span className="daynameSpan">
              <strong>Total</strong>
            </span>
          </div>
          <div className="dayhours">
            <span className="dayhoursSpan">
              {weeksData[7].estimated}
              {" ("}
              {weeksData[7].data}
              {")"}
            </span>
          </div>
        </div>
        <div className="dashboard-section3-week-bar-chart">
          <Icon
            icon="pie_chart"
            style={{ color: "#192028" }}
            title="Chart"
            className="chart-icon"
            onClick={() => this.showChart(weeksData[6].date)}
          />
        </div>
      </div>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const { data, component } = state;
  const id = ownProps.id;
  return {
    componentState: state.component.get(ownProps.id, Map()),
    chartState: data.getIn([id, "apiData"], Map()),
    chartDialogState: component.get(CHART_ID, Map()),
  };
}

export default connect(
  mapStateToProps,
  {
    clearComponentState,
    updateComponentState,
    requestData,
  }
)(WeekBar);
