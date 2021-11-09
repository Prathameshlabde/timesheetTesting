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
import {
  requestData,
  deleteData,
} from "../../../../../actions/data.actions.js";
import { isEmpty } from "../../../../utils/common.utils.js";
import FusionChart from "../../../../widgets/FusionChart.js";
import SpanLabel from "../../../../widgets/SpanLabel.js";
import Colors from "../../../../common/colors/index.js";
import Loader from "../../../../widgets/Loader";
import {
  LOADER_STYLE,
  COMPANY_EMPLOYEE_STATS_ID,
  UPDATED_DATES,
  NO_RECORDS_FOUND,
} from "../../../../../constants/app.constants.js";

class DashChart extends Component {
  state = {
    headerText: "This Months Stats",
    isLoading: false,
    chartData: [],
    finalData: [],
    //piechart
    // dataEmptyMessage: NO_RECORDS_FOUND,
    // dataLoadErrorMessage: NO_RECORDS_FOUND,
    type: "Pie2D", // The chart type
    width: "500", // Width of the chart
    height: "250", // Height of the chart
    dataFormat: "json",
    chart: {
      // caption: PIE_CHART_CAPTION,
      // subCaption: PIE_CHART_SUBCAPTION,
      theme: "fusion",
      showPercentValues: "0",
      showPercentInTooltip: "0",
      // paletteColors:
      //   "#E6B0AA,#F5B7B1,#CB4335,#D7BDE2,#2C3E50,#2980B9,#A9CCE3,#AED6F1,#A3E4D7,#F9E79F,#F5B041,#FAD7A0,#EDBB99,#E5E7E9,#CCD1D1,#AEB6BF,#ABB2B9,#884EA0,#7FB3D5,#76D7C4,#D35400"
      // paletteColors:
      //   "#C0392B,#E74C3C,#9B59B6,#8E44AD,#2980B9,#3498DB,#1ABC9C,#16A085,#27AE60,#2ECC71,#F1C40F,#F39C12,#E67E22,#D35400,#BDC3C7,#95A5A6,#7F8C8D,#34495E,#2C3E50",
      paletteColors: "#2C3E50,#2980B9,#A9CCE3",
    },
  };

  componentWillMount() {
    const { statsStartDate, statsEndDate } = this.props;
    this.setState(
      { isLoading: true, fdate: statsStartDate, tdate: statsEndDate },
      () => {
        this.displayChart();
      }
    );
  }

  componentWillUnmount() {
    const { id, deleteComponentState } = this.props;
    deleteComponentState(id);
  }

  componentWillReceiveProps(nextProps) {
    const { newDatesState } = nextProps;
    if (this.props.newDatesState !== newDatesState) {
      const newDateObj = newDatesState.get(UPDATED_DATES, {});
      if (!isEmpty(newDateObj)) {
        const fdate = newDateObj.statsStartDate;
        const tdate = newDateObj.statsEndDate;
        // console.log("fdate new = ", fdate);
        // console.log("tdate new = ", fdate);
        const isCurrentMonth = newDateObj.isCurrentMonth;
        //console.log("isCurrentMonth new = ", isCurrentMonth);
        let headerText;
        if (isCurrentMonth === false) {
          headerText =
            "Stats from " +
            dateFormatter(fdate, "yyyy-MM-dd") +
            " to " +
            dateFormatter(tdate, "yyyy-MM-dd");
        } else {
          headerText = "This Months Stats";
        }

        this.setState(
          {
            fdate,
            tdate,
            isLoading: true,
            headerText,
          },
          () => {
            this.displayChart();
          }
        );
      }
    }
  }

  displayChart = () => {
    const { requestData, id } = this.props;
    const { fdate, tdate } = this.state;
    let paramters = new FormData();
    const payload = {
      fdate,
      tdate,
      isPmCompanyOrMyStats: "mystats",
    };
    paramters.append("params", JSON.stringify(payload));
    paramters.append("type", "getDashboard");
    paramters.append("command", "getMonthlyChart");
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
            chartData: response.apiData.apiData,
          },
          () => {
            const data = this.state.chartData;

            if (!isEmpty(data)) {
              const finalData = [
                { label: "Available Hours", value: data[0].available_hrs },
                { label: "Billable Hours", value: data[0].bilable_hrs },
                { label: "Non Billable Hours", value: data[0].non_bilable_hrs },
              ];

              const { type, width, height, dataFormat, chart } = this.state;
              const finalChartData = {
                chartdata: {
                  type, // The chart type
                  width, // Width of the chart
                  height, // Height of the chart
                  dataFormat, // Data type
                  dataEmptyMessage: NO_RECORDS_FOUND,
                  dataSource: {
                    chart,
                    data: finalData,
                  },
                },
              };

              this.setState({
                finalChartData,
                estimated_hrs: data[0].estimated_hrs,
                bilable_hrs: data[0].bilable_hrs,
                non_bilable_hrs: data[0].non_bilable_hrs,
                isLoading: false,
              });
            } else {
              this.setState({ isLoading: false });
            }
          }
        );
      }
    });
  };

  render() {
    const { finalChartData, isLoading, headerText } = this.state;
    return (
      <div className="boxShadowSpecific" style={{ width: "100%" }}>
        <div className="statsTitleDiv">
          <SpanLabel
            mainDivStyle={{ justifyContent: "center" }}
            style={{ color: Colors.textColor }}
            data={headerText}
          />
        </div>

        {isLoading === true ? (
          <Loader style={LOADER_STYLE} />
        ) : finalChartData ? (
          <div style={{ paddingTop: "1%" }}>
            <FusionChart chartsData={finalChartData.chartdata} />
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
    newDatesState: component.get(COMPANY_EMPLOYEE_STATS_ID, Map()),
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
)(DashChart);
