// Step 1 - Including react
import React, { Component } from "react";

// Step 2 - Including the react-fusioncharts component
import ReactFC from "react-fusioncharts";

// Step 3 - Including the fusioncharts library
import FusionCharts from "fusioncharts";

// Step 4 - Including the chart type
import Charts from "fusioncharts/fusioncharts.charts";

// Step 5 - Including the theme as fusion
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";

// Step 6 - Adding the chart as dependency to the core fusioncharts
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

// Step 7 - Creating the JSON object to store the chart configurations

class FusionChart extends Component {
  render() {
    const { chartsData } = this.props;
    FusionCharts.options.creditLabel = false;
    // console.log("chartData :----", chartsData);
    return <ReactFC {...chartsData} />;
  }
}
export default FusionChart;
