import React, { Component } from "react";
import { connect } from "react-redux";
import { Map } from "immutable";
import {
  clearComponentState,
  updateComponentState,
} from "../../../../actions/component.actions.js";
import {
  DASHBOARD_CHART_ID,
  DASHBOARD_HOLIDAYS_ID,
  DASHBOARD_LEAVES_ID,
  DASHBOARD_PROJECTS_STATS_ID,
  DASHBOARD_TEAM_LEAVES_ID,
  DASHBOARD_TEAM_EMPLOYEES_STATS_ID,
  DASHBOARD_TEAM_PROJECTS_STATS_ID,
  DASHBOARD_TEAM_PROJECTS_CHART_ID,
  DASHBOARD_TEAM_CHART_ID,
  DASHBOARD_TEAM_HOURS_ID,
  DASHBOARD_COMPANY_CHART_ID,
  DASHBOARD_COMPANY_HOURS_ID,
  DASHBOARD_COMPANY_LEAVES_ID,
  DASHBOARD_COMPANY_PROJECTS_STATS_ID,
  DASHBOARD_COMPANY_EMPLOYEES_STATS_ID,
} from "../../../../constants/app.constants.js";

import DashChart from "./MyStats/DashChart.js";
import DashHolidays from "./MyStats/DashHolidays.js";
import DashLeaves from "./MyStats/DashLeaves.js";
import DashProjectChart from "./MyStats/DashProjectChart.js";
import TeamLeaves from "./TeamStats/TeamLeaves.js";
import TeamProjectStats from "./TeamStats/TeamProjectStats.js";
import TeamProjectChart from "./TeamStats/TeamProjectChart.js";
import TeamChart from "./TeamStats/TeamChart.js";
import TeamHours from "./TeamStats/TeamHours.js";
import TeamEmployeeStats from "./TeamStats/TeamEmployeeStats.js";
import CompanyChart from "./CompanyStats/CompanyChart.js";
import CompanyHours from "./CompanyStats/CompanyHours.js";
import CompanyLeaves from "./CompanyStats/CompanyLeaves.js";
import CompanyProjectStats from "./CompanyStats/CompanyProjectStats.js";
import CompanyEmployeeStats from "./CompanyStats/CompanyEmployeeStats.js";

class SubComponents extends Component {
  displayEmpComponents() {
    const { statsStartDate, statsEndDate } = this.props;

    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "30%",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div style={{ width: "50%", padding: "1%" }}>
            <DashChart
              id={DASHBOARD_CHART_ID}
              statsStartDate={statsStartDate}
              statsEndDate={statsEndDate}
            />
          </div>
          <div style={{ width: "50%", padding: "1%" }}>
            <DashHolidays id={DASHBOARD_HOLIDAYS_ID} />
          </div>
        </div>
        <div style={{ height: "30%", padding: "1%" }}>
          <DashLeaves id={DASHBOARD_LEAVES_ID} />
        </div>
        <div style={{ height: "30%", padding: "1%" }}>
          <DashProjectChart
            id={DASHBOARD_PROJECTS_STATS_ID}
            statsStartDate={statsStartDate}
            statsEndDate={statsEndDate}
          />
        </div>
      </div>
    );
  }

  displayPMComponents(isCurrentMonth) {
    const { statsStartDate, statsEndDate } = this.props;
    return (
      <div
        style={{
          width: "100%",
          height: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "334px",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div style={{ width: "50%", padding: "1%" }}>
            <TeamChart
              statsStartDate={statsStartDate}
              statsEndDate={statsEndDate}
              id={DASHBOARD_TEAM_CHART_ID}
            />
          </div>
          <div style={{ width: "50%", padding: "1%" }}>
            <TeamProjectChart
              statsStartDate={statsStartDate}
              statsEndDate={statsEndDate}
              id={DASHBOARD_TEAM_PROJECTS_CHART_ID}
            />
          </div>
        </div>

        <div
          style={{
            width: "100%",
            height: "340px",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div style={{ width: "50%", padding: "1%" }}>
            <TeamHours id={DASHBOARD_TEAM_HOURS_ID} />
          </div>
          <div style={{ width: "50%", padding: "1%" }}>
            <TeamLeaves id={DASHBOARD_TEAM_LEAVES_ID} />
          </div>
        </div>

        <div style={{ maxHeight: "400px", padding: "1%" }}>
          <TeamProjectStats
            statsStartDate={statsStartDate}
            statsEndDate={statsEndDate}
            id={DASHBOARD_TEAM_PROJECTS_STATS_ID}
          />
        </div>
        <div style={{ maxHeight: "400px", padding: "1%" }}>
          <TeamEmployeeStats
            statsStartDate={statsStartDate}
            statsEndDate={statsEndDate}
            id={DASHBOARD_TEAM_EMPLOYEES_STATS_ID}
          />
        </div>
      </div>
    );
  }

  displayCompanyComponents(isCurrentMonth) {
    const { statsStartDate, statsEndDate } = this.props;
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            width: "100%",
            maxHeight: "400px",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div style={{ width: "50%", padding: "1%" }}>
            <CompanyChart
              statsStartDate={statsStartDate}
              statsEndDate={statsEndDate}
              id={DASHBOARD_COMPANY_CHART_ID}
            />
          </div>
          <div style={{ width: "50%", padding: "1%" }}>
            <CompanyHours id={DASHBOARD_COMPANY_HOURS_ID} />
          </div>
        </div>

        <div
          style={{
            width: "98%",
            maxHeight: "334px",
            padding: "1%",
          }}
        >
          <CompanyLeaves id={DASHBOARD_COMPANY_LEAVES_ID} />
        </div>
        <div style={{ maxHeight: "400px", padding: "1%" }}>
          <CompanyProjectStats
            statsStartDate={statsStartDate}
            statsEndDate={statsEndDate}
            id={DASHBOARD_COMPANY_PROJECTS_STATS_ID}
          />
        </div>
        <div style={{ maxHeight: "400px", padding: "1%" }}>
          <CompanyEmployeeStats
            statsStartDate={statsStartDate}
            statsEndDate={statsEndDate}
            id={DASHBOARD_COMPANY_EMPLOYEES_STATS_ID}
          />
        </div>
      </div>
    );
  }

  render() {
    const { tabValue, isCurrentMonth } = this.props;
    return tabValue === 0
      ? this.displayEmpComponents()
      : tabValue === 1
        ? this.displayPMComponents(isCurrentMonth)
        : tabValue === 2
          ? this.displayCompanyComponents(isCurrentMonth)
          : null;
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
  }
)(SubComponents);
