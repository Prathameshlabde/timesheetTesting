import React, { Component } from "react";
import { connect } from "react-redux";
import { Map } from "immutable";
import {
  clearComponentState,
  updateComponentState,
  deleteComponentState,
} from "../../../actions/component.actions.js";
import {
  APP_TITLE_SUBTITLE,
  TITLE_SUBTITLE_ID,
  // NO_RECORDS_FOUND,
  COMPANY_PM_STATS_ID,
  UPDATED_DATES,
  COMPANY_EMPLOYEE_STATS_ID,
} from "../../../constants/app.constants.js";
import { buttonStyle } from "../MyEntries/MyEntries.utils";
import "./dashboard.css";
import Snackbar from "../../widgets/Snackbar";
import { dateFormatter } from "../../utils/calender.utils.js";
import SpanLabel from "../../widgets/SpanLabel.js";
import moment from "moment";
import { requestData, deleteData } from "../../../actions/data.actions.js";
import { getDataFromCookie } from "../../utils/CheckLoginDetails";
// import { isEmpty } from "../../utils/common.utils.js";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import RadioButton from "../../widgets/RadioButton.js";
import DatePicker from "../../widgets/DatePicker.js";
import SubComponents from "./SubComponents/index.js";
import { getDateDifference, isLastDateGreat } from "./Dashboard.utils.js";
import { DASHBOARD_DIALOGS } from "../../../constants/dialog.constants.js";
import Colors from "../../common/colors/index.js";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    const role = getDataFromCookie() ? getDataFromCookie().role : "employee";
    this.state = {
      tabValue: role === "superadmin" || role === "admin" ? 2 : 0,
      dataErrorMsg: "",
      role,
      statsStartDate: dateFormatter(moment().startOf("month"), "yyyy-MM-dd"),
      statsEndDate: dateFormatter(moment(), "yyyy-MM-dd"),
      isCurrentMonth: true,
    };
  }

  componentWillMount() {
    const { updateComponentState } = this.props;
    const titleSub = { title: "Dashboard", subtitle: "" };
    updateComponentState(TITLE_SUBTITLE_ID, APP_TITLE_SUBTITLE, titleSub);
  }

  componentWillUnmount() {
    const { id, deleteComponentState } = this.props;
    deleteComponentState(id);
  }

  handleTabChange = (e, tabValue) => {
    this.setState({
      tabValue,
      statsStartDate: dateFormatter(moment().startOf("month"), "yyyy-MM-dd"),
      statsEndDate: dateFormatter(moment(), "yyyy-MM-dd"),
      isCurrentMonth: true,
    });
  };

  onSnackClose() {
    this.setState({ snackIsOpen: false });
  }

  onChangeFieldValues = (id, updatedValue, updatedValue1, updatedValue2) => {
    if (updatedValue === "0") {
      this.setState({
        isCurrentMonth: false,
        statsStartDate: moment(),
        statsEndDate: moment(),
      });
    } else {
      this.setState({
        isCurrentMonth: true,
        statsStartDate: dateFormatter(moment().startOf("month"), "yyyy-MM-dd"),
        statsEndDate: dateFormatter(moment(), "yyyy-MM-dd"),
        dataErrorMsg: "",
      });
    }
  };

  onChangeDateRange = (id, value) => {
    this.setState({ [id]: value, dataErrorMsg: "" });
  };

  refreshAllStats() {
    const { statsStartDate, statsEndDate } = this.state;
    if (typeof statsStartDate === "object") {
      this.validateAndUpdate(statsStartDate, statsEndDate);
    } else {
      this.validateAndUpdate(moment(statsStartDate), moment(statsEndDate));
    }
  }

  validateAndUpdate(statsStartDate, statsEndDate) {
    if (getDateDifference(statsStartDate, statsEndDate) > 31) {
      this.setState({ dataErrorMsg: DASHBOARD_DIALOGS.validationDateRange });
    } else if (!isLastDateGreat(statsStartDate, statsEndDate)) {
      this.setState({ dataErrorMsg: DASHBOARD_DIALOGS.validationEndDate });
    } else {
      this.setState({ dataErrorMsg: "" }, () => {
        const { updateComponentState } = this.props;
        const { isCurrentMonth, tabValue } = this.state;

        if (tabValue === 0) {
          updateComponentState(COMPANY_EMPLOYEE_STATS_ID, UPDATED_DATES, {
            statsStartDate,
            statsEndDate,
            isCurrentMonth,
          });
        } else {
          updateComponentState(COMPANY_PM_STATS_ID, UPDATED_DATES, {
            statsStartDate,
            statsEndDate,
            isCurrentMonth,
          });
        }
      });
    }
  }

  render() {
    const {
      tabValue,
      role,
      isCurrentMonth,
      dataErrorMsg,
      statsStartDate,
      statsEndDate,
    } = this.state;
    const spanLabelDateProps = {
      id: "lbl",
      maxFont: 23,
      minFont: 14,
      className: "span-label",
    };
    let customButtomStyle;
    if (isCurrentMonth) {
      customButtomStyle = { marginTop: "0px" };
    } else {
      customButtomStyle = { marginTop: "23px" };
    }

    const tabStyle = { fontWeight: "600" };

    return (
      <div style={{ width: "100%" }}>
        <div id="dashboard_tabs" className="pr-dashboardTabs">
          <AppBar color="default" position="static">
            <Tabs
              TabIndicatorProps={{
                style: { background: "#054770", color: Colors.textColor },
              }}
              value={tabValue}
              onChange={(e, val) => this.handleTabChange(e, val)}
            >
              {role !== "admin" && role !== "superadmin" ? (
                <Tab label="My Stats" style={tabStyle} value={0} />
              ) : null}
              {role === "pm" || role === "pm_associate" ? (
                <Tab label="Team Stats" style={tabStyle} value={1} />
              ) : null}
              {role === "admin" || role === "superadmin" ? (
                <Tab label="Company Stats" style={tabStyle} value={2} />
              ) : null}
            </Tabs>
          </AppBar>
          <div style={{ padding: "1%" }}>
            <SpanLabel
              mainDivStyle={{
                padding: "1%",
                color: Colors.redColor,
                fontSize: "15px",
              }}
              isRequired={true}
              data={dataErrorMsg}
            />

            <div style={{ padding: "1%", width: "100%", display: "flex" }}>
              <RadioButton
                id="stats_current_month"
                name="sprint_status"
                firstName="Current Month"
                secondName="Custom Date Range"
                firstChecked={isCurrentMonth}
                onChange={this.onChangeFieldValues}
              />

              {isCurrentMonth === false ? (
                <div style={{ display: "flex" }}>
                  <div
                    id="stats_startDate"
                    className="newdashboard-section2-left-startdate"
                  >
                    <SpanLabel {...spanLabelDateProps} data="Start Date" />
                    <DatePicker
                      className="newdashboard-left-datepicker"
                      id="statsStartDate"
                      onChange={this.onChangeDateRange}
                      value={moment(this.state.statsStartDate)}
                      isEnablePastDates={true}
                      isEnableFutureDates={false}
                      spanLabelDateProps={spanLabelDateProps}
                    />
                  </div>
                  <div
                    id="stats_endDate"
                    className="newdashboard-section2-left-enddate"
                  >
                    <SpanLabel {...spanLabelDateProps} data="End Date" />
                    <DatePicker
                      className="newdashboard-left-datepicker"
                      id="statsEndDate"
                      onChange={this.onChangeDateRange}
                      value={moment(this.state.statsEndDate)}
                      isEnablePastDates={true}
                      isEnableFutureDates={false}
                      spanLabelDateProps={spanLabelDateProps}
                    />
                  </div>
                </div>
              ) : null}

              <div>
                <button
                  style={{ ...buttonStyle, ...customButtomStyle }}
                  onClick={() => this.refreshAllStats()}
                >
                  Submit
                </button>
              </div>
            </div>

            <SubComponents
              statsStartDate={statsStartDate}
              statsEndDate={statsEndDate}
              tabValue={tabValue}
            />
          </div>
        </div>

        <Snackbar
          snackIsOpen={this.state.snackIsOpen}
          snackMessage={this.state.snackMessage}
          onSnackClose={() => this.onSnackClose()}
        />
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
)(Dashboard);
