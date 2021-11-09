import React, { Component } from "react";
import { connect } from "react-redux";
import { Map } from "immutable";
import {
  clearComponentState,
  updateComponentState,
  deleteComponentState,
} from "../../../../../actions/component.actions.js";
import {
  requestData,
  deleteData,
} from "../../../../../actions/data.actions.js";
import {
  LOADER_STYLE,
  COMPANY_PM_STATS_ID,
  UPDATED_DATES,
  NO_RECORDS_FOUND,
} from "../../../../../constants/app.constants.js";
import "../../dashboard.css";
import { isEmpty } from "../../../../utils/common.utils.js";
import SpanLabel from "../../../../widgets/SpanLabel.js";
import Colors from "../../../../common/colors/index.js";
import Loader from "../../../../widgets/Loader";
import dashBoard_pmstats_projects from "../../../../json/dashboard/dashBoard_pmstats_projects.json";
import DashboardTableView from "../../../../widgets/TableView/Dashboard/DashboardTableView.js";
import { dataAbstraction } from "../../../../utils/dataAbstraction.utils.js";
import { dateFormatter } from "../../../../utils/calender.utils.js";
import { getDataFromCookie } from "../../../../utils/CheckLoginDetails.js";

class TeamProjectStats extends Component {
  state = {
    headerText: "Projects Stats For Current Month",
    isLoading: false,
    summary: "project",
    support: "1",
    category: 1,
    projectsStatsData: {
      rows: [],
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
    const { newDatesState, teamProjectsState } = nextProps;
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
            "Projects Stats from " +
            dateFormatter(fdate, "yyyy-MM-dd") +
            " to " +
            dateFormatter(tdate, "yyyy-MM-dd");
        } else {
          headerText = "Projects Stats For Current Month";
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

    if (teamProjectsState !== this.props.teamProjectsState) {
      // console.log("teamProjectsState - ", teamProjectsState);
      if (
        teamProjectsState &&
        teamProjectsState.apiData &&
        !isEmpty(teamProjectsState.apiData.rows)
      ) {
        const projectsStatsData = dataAbstraction(
          teamProjectsState.apiData,
          dashBoard_pmstats_projects
        );

        this.setState(
          {
            projectsStatsData,
            ogData: teamProjectsState.apiData.ogData,
            dataErrorMsg: "",
            isLoading: false,
          },
          () => {
            // console.log("projectsStatsData in rcvprops 11 = ", projectsStatsData);
          }
        );
      } else {
        this.setState({ isLoading: false, dataErrorMsg: NO_RECORDS_FOUND });
      }
    }

    if (teamProjectsState && teamProjectsState.isError) {
      if (teamProjectsState.isError) {
        this.setState({
          projectsStatsData: { rows: [] },
          ogData: [],
          isLoading: false,
        });
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
      isChart: false,
      role: getDataFromCookie().role,
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

    requestData(params).then((response) => {});
  };

  render() {
    const {
      projectsStatsData,
      dataErrorMsg,
      isLoading,
      ogData,
      fdate,
      tdate,
      headerText,
    } = this.state;
    return (
      <div
        className="boxShadowSpecific"
        style={{ width: "100%", height: "100%" }}
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
        ) : !isEmpty(projectsStatsData.rows) ? (
          <div style={{ height: "100%" }}>
            <DashboardTableView
              {...projectsStatsData}
              ogData={ogData}
              fdate={fdate}
              tdate={tdate}
              isEmployeeOrProjectStats="pro"
            />
          </div>
        ) : null}
        {isEmpty(projectsStatsData.rows) ? (
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
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const { component, data } = state;
  const id = ownProps.id;
  return {
    componentState: component.get(id, Map()),
    newDatesState: component.get(COMPANY_PM_STATS_ID, Map()),
    teamProjectsState: data.getIn([id, "apiData"], null),
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
)(TeamProjectStats);
