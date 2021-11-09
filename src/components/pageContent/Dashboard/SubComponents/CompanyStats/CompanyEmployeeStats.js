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
import dashBoard_pmstats_employees from "../../../../json/dashboard/dashBoard_pmstats_employees.json";
import DashboardTableView from "../../../../widgets/TableView/Dashboard/DashboardTableView.js";
import { dataAbstraction } from "../../../../utils/dataAbstraction.utils.js";
import { dateFormatter } from "../../../../utils/calender.utils.js";

class CompanyEmployeeStats extends Component {
  state = {
    headerText: "Employee Stats For Current Month",
    isLoading: false,
    support: "1",
    category: 1,
    employeesStatsData: {
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
    const { newDatesState, teamEmployeesState } = nextProps;
    if (this.props.newDatesState !== newDatesState) {
      const newDateObj = newDatesState.get(UPDATED_DATES, {});
      if (!isEmpty(newDateObj)) {
        const fdate = newDateObj.statsStartDate;
        const tdate = newDateObj.statsEndDate;

        const isCurrentMonth = newDateObj.isCurrentMonth;

        let headerText;
        if (isCurrentMonth === false) {
          headerText =
            "Employee Stats from " +
            dateFormatter(fdate, "yyyy-MM-dd") +
            " to " +
            dateFormatter(tdate, "yyyy-MM-dd");
        } else {
          headerText = "Employee Stats For Current Month";
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

    if (teamEmployeesState !== this.props.teamEmployeesState) {
      // console.log("teamEmployeesState - ", teamEmployeesState);
      if (
        teamEmployeesState &&
        teamEmployeesState.apiData &&
        !isEmpty(teamEmployeesState.apiData.rows)
      ) {
        const employeesStatsData = dataAbstraction(
          teamEmployeesState.apiData,
          dashBoard_pmstats_employees
        );

        this.setState(
          {
            employeesStatsData,
            ogData: teamEmployeesState.apiData.ogData,
            dataErrorMsg: "",
            isLoading: false,
          },
          () => {
            // console.log("employeesStatsData in rcvprops 11 = ", employeesStatsData);
          }
        );
      } else {
        this.setState({ isLoading: false, dataErrorMsg: NO_RECORDS_FOUND });
      }
    }

    if (teamEmployeesState && teamEmployeesState.isError) {
      if (teamEmployeesState.isError) {
        this.setState({
          employeesStatsData: { rows: [] },
          ogData: [],
          isLoading: false,
        });
      }
    }
  }

  getCurrentMonthsStats = () => {
    const { requestData, id } = this.props;
    const { fdate, tdate, support, category } = this.state;
    let paramters = new FormData();
    const payload = {
      isPmCompanyOrMyStats: "companystats",
      fdate,
      tdate,
      support,
      category,
    };
    paramters.append("params", JSON.stringify(payload));
    paramters.append("type", "getDashboard");
    paramters.append("command", "getCompanyTeamEmployeeStats");
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
      employeesStatsData,
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
        ) : !isEmpty(employeesStatsData.rows) ? (
          <div style={{ height: "100%" }}>
            <DashboardTableView
              {...employeesStatsData}
              ogData={ogData}
              fdate={fdate}
              tdate={tdate}
              isEmployeeOrProjectStats="emp"
            />
          </div>
        ) : null}
        {isEmpty(employeesStatsData.rows) ? (
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
    teamEmployeesState: data.getIn([id, "apiData"], null),
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
)(CompanyEmployeeStats);
