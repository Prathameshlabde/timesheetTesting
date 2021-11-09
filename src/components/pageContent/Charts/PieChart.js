import React, { Component } from "react";
import FusionChart from "../../widgets/FusionChart.js";
import Icon from "../../widgets/Icon";
import { connect } from "react-redux";
import { Map } from "immutable";

import {
  clearComponentState,
  updateComponentState,
  deleteComponentState,
} from "../../../actions/component.actions";

import {
  CHART_ID,
  CHART_SHOW,
  PIE_CHART_CAPTION,
  PIE_CHART_SUBCAPTION,
} from "../../../constants/app.constants";

import moment from "moment";

const closeIconStyle = {
  fontSize: "20px",
  cursor: "pointer",
  margin: "3px",
  color: "black",
};
class PieChart extends Component {
  state = {
    type: "Pie2D", // The chart type
    width: "895", // Width of the chart
    height: "500", // Height of the chart
    dataFormat: "json",

    chart: {
      // caption: PIE_CHART_CAPTION,
      // subCaption: PIE_CHART_SUBCAPTION,
      theme: "fusion",
      showPercentValues: "0",
      showPercentInTooltip: "0",
      // paletteColors:
      //   "#E6B0AA,#F5B7B1,#CB4335,#D7BDE2,#2C3E50,#2980B9,#A9CCE3,#AED6F1,#A3E4D7,#F9E79F,#F5B041,#FAD7A0,#EDBB99,#E5E7E9,#CCD1D1,#AEB6BF,#ABB2B9,#884EA0,#7FB3D5,#76D7C4,#D35400"
      paletteColors:
        "#C0392B,#E74C3C,#9B59B6,#8E44AD,#2980B9,#3498DB,#1ABC9C,#16A085,#27AE60,#2ECC71,#F1C40F,#F39C12,#E67E22,#D35400,#BDC3C7,#95A5A6,#7F8C8D,#34495E,#2C3E50",
    },
    date: "",
  };

  componentWillMount() {
    let data = this.props.chartsData;
    if (data) {
      let finalData = [];
      for (var i = 0; i < data.length; i++) {
        if (data[i].pname !== "null" && data[i].pname !== null) {
          finalData.push({
            label: data[i].pname,
            value: data[i].totalbillable,
          });
        }
      }
      this.setState({
        date: finalData,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      chartdata: nextProps.chartsData,
    });
  }

  componentWillUnmount() {
    const { updateComponentState } = this.props;
    updateComponentState(CHART_ID, CHART_SHOW, false);
  }

  closeNewEntry = (isButtonPressed) => {
    const { deleteComponentState } = this.props;
    deleteComponentState(CHART_ID);
  };

  render() {
    const { type, width, height, dataFormat, date } = this.state;
    const finalChartData = {
      chartdata: {
        type, // The chart type
        width, // Width of the chart
        height, // Height of the chart
        dataFormat, // Data type
        dataSource: {
          chart: this.state.chart,
          data: date,
        },
      },
    };

    return (
      <div className="pr-inner-div pr-chart">
        <div className="header-level header-alignment">
          <div
            className="col-inner-div-header-left chart-title-subtitle"
            style={{ padding: "4px 0" }}
          >
            <span className="title-chart">
              {PIE_CHART_CAPTION +
                " from " +
                moment(this.props.startDate).format("DD-MMM-YYYY") +
                " to " +
                moment(this.props.endDate).format("DD-MMM-YYYY")}{" "}
            </span>

            <span className="subtitletitle-chart">{PIE_CHART_SUBCAPTION}</span>
          </div>

          <div className="col-inner-div-header-right">
            <Icon
              icon="close"
              style={closeIconStyle}
              title="close"
              onClick={() => this.closeNewEntry(false)}
            />
          </div>
        </div>

        <div style={{ padding: "5px" }}>
          <FusionChart chartsData={finalChartData.chartdata} />
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
  }
)(PieChart);
