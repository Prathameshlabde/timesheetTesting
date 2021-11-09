import React, { Component } from "react";
import { connect } from "react-redux";
import { Map } from "immutable";
import {
  clearComponentState,
  updateComponentState,
  deleteComponentState,
} from "../../../../../actions/component.actions.js";
import "../../dashboard.css";
import {
  requestData,
  deleteData,
} from "../../../../../actions/data.actions.js";
import { isEmpty } from "../../../../utils/common.utils.js";
import SpanLabel from "../../../../widgets/SpanLabel.js";
import Colors from "../../../../common/colors/index.js";
import FusionChart from "../../../../widgets/FusionChart.js";
import Loader from "../../../../widgets/Loader";
import {
  LOADER_STYLE,
  COMPANY_PM_STATS_ID,
  UPDATED_DATES,
  NO_RECORDS_FOUND,
} from "../../../../../constants/app.constants.js";
import { dateFormatter } from "../../../../utils/calender.utils.js";
import { getDataFromCookie } from "../../../../utils/CheckLoginDetails.js";

class TeamProjectChart extends Component {
  state = {
    headerText: "Projects of Current Month",
    isLoading: false,
    summary: "project",
    support: "1",
    category: 1,
    projectsStatsData: [],
    chartData: [],
    //piechart
    type: "mscolumn2d", // The chart type
    renderAt: "chart-container",
    width: "540", // Width of the chart
    height: "250", // Height of the chart
    dataFormat: "json",
    chart: {
      caption: "Projects Stats",
      subCaption: "This month",
      xAxisName: "Projectwise Analysis",
      yAxisName: "Hours",
      plotFillAlpha: "80",
      divLineIsDashed: "1",
      divLineDashLen: "1",
      divLineGapLen: "1",
      // pYAxisName: "Hours",
      // sYAxisname: "Percentage",
      // showHoverEffect: "1",
      theme: "fusion",
      // showPercentValues: "0",
      // showPercentInTooltip: "0",
      // palette: 5,
      // paletteColors:
      //   "#E6B0AA,#F5B7B1,#CB4335,#D7BDE2,#2C3E50,#2980B9,#A9CCE3,#AED6F1,#A3E4D7,#F9E79F,#F5B041,#FAD7A0,#EDBB99,#E5E7E9,#CCD1D1,#AEB6BF,#ABB2B9,#884EA0,#7FB3D5,#76D7C4,#D35400"
      paletteColors:
        "#2980B9,#3498DB,#C0392B,#E74C3C,#9B59B6,#8E44AD,#1ABC9C,#16A085,#27AE60,#2ECC71,#F1C40F,#F39C12,#E67E22,#D35400,#BDC3C7,#95A5A6,#7F8C8D,#34495E,#2C3E50",
      // paletteColors: "#F0A430,#45b336,#ff2424",
    },
  };

  componentWillMount() {
    const { statsStartDate, statsEndDate } = this.props;
    this.setState(
      { isLoading: true, fdate: statsStartDate, tdate: statsEndDate },
      () => {
        this.getCurrentMonthsStats();
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
            "Projects Chart from " +
            dateFormatter(fdate, "yyyy-MM-dd") +
            " to " +
            dateFormatter(tdate, "yyyy-MM-dd");
        } else {
          headerText = "Projects of Current Month";
        }
        this.setState(
          {
            fdate,
            tdate,
            isLoading: true,
            headerText,
          },
          () => {
            this.getCurrentMonthsStats();
          }
        );
      }
    }
  }

  getCurrentMonthsStats = () => {
    const { requestData, id } = this.props;
    const { fdate, tdate, summary, support, category } = this.state;
    let paramters = new FormData();
    const payload = {
      isPmCompanyOrMyStats: "pmstats",
      fdate,
      tdate,
      summary,
      support,
      category,
      role: getDataFromCookie().role,
      isChart: true,
    };
    paramters.append("params", JSON.stringify(payload));
    paramters.append("type", "getDashboard");
    paramters.append("command", "getMonthlyStats");
    const params = {
      id: id,
      api: {
        body: paramters,
      },
    };

    requestData(params).then((response) => {
      // console.log("response = ", response);
      if (response.apiData && response.apiData.apiData) {
        this.setState(
          {
            projectsStatsData: response.apiData.apiData,
          },
          () => {
            const { projectsStatsData } = this.state;
            if (projectsStatsData) {
              let categoryArr = [];
              let billableArr = [];
              let estimatedArr = [];
              let nonbillableArr = [];
              projectsStatsData.forEach((element) => {
                categoryArr.push({ label: element.pname });
                estimatedArr.push({
                  value: element.estimated_hrs,
                });
                let nonBillableValue =
                  parseInt(element.estimated_hrs, 10) -
                  parseInt(element.bilable_hrs, 10);
                nonbillableArr.push({
                  value: nonBillableValue.toFixed(2),
                });
                billableArr.push({
                  value: element.bilable_hrs,
                });
              });

              const { type, width, height, dataFormat, chart } = this.state;
              const finalChartData = {
                chartdata: {
                  type, // The chart type
                  width, // Width of the chart
                  height, // Height of the chart
                  dataFormat, // Data type
                  // categories,
                  dataEmptyMessage: NO_RECORDS_FOUND,
                  dataSource: {
                    chart,
                    categories: [
                      {
                        category: categoryArr,
                      },
                    ],
                    dataset: [
                      {
                        seriesname: "Billable Hours",
                        data: billableArr,
                      },
                      {
                        seriesname: "Non Billable Hours",
                        data: nonbillableArr,
                      },
                    ],
                  },
                },
              };
              this.setState({ finalChartData, isLoading: false });
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
      <div
        className="boxShadowSpecific"
        style={{ width: "100%"}}
      >
        <div className="statsTitleDiv">
          <SpanLabel
            mainDivStyle={{ justifyContent: "center" }}
            style={{ color: Colors.textColor }}
            data={headerText}
          />
        </div>
        {isLoading === true ? (
          <Loader style={LOADER_STYLE} />
        ) : !isEmpty(finalChartData) ? (
          <div style={{ height: "100%",paddingTop: "1%" }}>
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
    newDatesState: component.get(COMPANY_PM_STATS_ID, Map()),
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
)(TeamProjectChart);
