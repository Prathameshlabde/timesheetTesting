import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Map } from "immutable";
import {
  clearComponentState,
  updateComponentState,
  deleteComponentState,
} from "../../../actions/component.actions.js";
import {
  APP_ID,
  APP_NEW_ENTRY,
  APP_EDIT_ENTRY_ID,
  APP_DUPLICATE_ENTRY_ID, ////////////////////// 26 july 2019////////////////////////////////
  UPDATE_DASHBOARD,
  DASHBOARD_SHOULD_UPDATE,
  ID_NEW_ENTRY,
  APP_TITLE_SUBTITLE,
  PROJECT_NOTE,
  TITLE_SUBTITLE_ID,
  DASHBOARD_WEEK_DATE,
  MIN_WINDOW,
  CLOSE_WINDOW,
  NO_RECORDS_FOUND,
  DEFAULT_OPTION,
  ERROR_STR,
} from "../../../constants/app.constants.js";
import {
  buttonStyle,
  dropDownStyle,
  dropDownDateRange,
  fetchActiveProjects,
  fetchReportDashboard,
  deleteEntry,
  fetchWeekReportDashboard,
  weeksDefaultData,
} from "./MyEntries.utils.js";
import {
  fetchReport,
  deleteReport,
  clearReport,
} from "../../../actions/report.actions.js";
import "./myEntries.css";
import Icon from "../../widgets/Icon.js";
import Snackbar from "../../widgets/Snackbar";
import { getPropsCalender } from "../../utils/calender.utils.js";
import Colors from "../../common/colors/index.js";
import { RECORD_DIALOG_MSG } from "../../../constants/dialog.constants";
import SpanLabel from "../../widgets/SpanLabel.js";
import WeekBar from "./WeekBar.js";
import DatePicker from "../../widgets/DatePicker.js";
import Dropdown from "../../widgets/DropdownList.js";
import DiaglogBox from "../../widgets/AlertBox.js";
import MyEntriesTableView from "../../widgets/TableView/MyEntriesTableView.js";
import { dataAbstraction } from "../../utils/dataAbstraction.utils.js";
import billing_dashboad from "../../json/MyEntries/report_myEntries.json";
import moment from "moment";
import { requestData, deleteData } from "../../../actions/data.actions.js";
import { fetchWekReport } from "../../../actions/weekReport.actions.js";
import { fetchProjectsDashboard } from "../../../actions/projects.actions.js";
import NewEntry from "../../newEntry/NewEntry.js";
import { getDataFromCookie } from "../../utils/CheckLoginDetails";
import { isEmpty } from "../../utils/common.utils.js";

const ErrorTextStyle = {
  color: Colors.redColor,
};
class MyEntries extends Component {
  static propTypes = {
    id: PropTypes.string,
    componentState: PropTypes.object.isRequired,
    updateComponentState: PropTypes.func.isRequired,
  };

  state = {
    selectedDateRange: "Today",
    selectedDateRangeValue: "custom",
    selectedProject: "",
    selectedStartDate: moment(),
    selectedStartDateDashBoard: "",
    selectedEndDate: moment(),
    isNewTimeSheet: false,
    reportWeekData: weeksDefaultData,
    reportData: {
      rows: [],
    },
    ogData: [],
    previousIsEnable: false,
    nextIsEnable: false,
    selectedWeek: 0,
    selectedDateInWeekBar: moment(),
    isWeekDivClick: false,
    validationMessage: "",
    selectedDtaeTop: moment(),
    selectedProjectTemp: "",
    showdeleteDialog: false,
    snackIsOpen: false,
    snackMessage: "",
    showminWindowDialog: false,
    idToEdit: "",
    deleleEdited: "",
    backgroundImageURL: "",
  };

  componentWillMount() {
    const { updateComponentState } = this.props;
    updateComponentState(UPDATE_DASHBOARD, DASHBOARD_SHOULD_UPDATE, "NO");
    let titleSub = {
      title: "My Entries",
      subtitle: "",
    };
    updateComponentState(TITLE_SUBTITLE_ID, APP_TITLE_SUBTITLE, titleSub);

    this.setState(
      {
        selectedStartDate: moment(),
        selectedStartDateDashBoard: moment(),
        selectedEndDate: moment(),
      },
      function() {
        this.getSelectedDateTop();
        fetchReportDashboard(this.props, this.state);
        fetchWeekReportDashboard(this.props, this.state);
        fetchActiveProjects(this.props);
      }
    );

    if (!isEmpty(getDataFromCookie().backgroundImageURL)) {
      this.setState({
        backgroundImageURL: getDataFromCookie().backgroundImageURL,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      reportDashboardState,
      projectsDataState,
      projectsWeekDataState,
    } = nextProps;

    if (
      nextProps.updateDashboardState.get(DASHBOARD_SHOULD_UPDATE, "NO") !==
      this.props.updateDashboardState.get(DASHBOARD_SHOULD_UPDATE, "NO")
    ) {
      fetchReportDashboard(nextProps, this.state);
      fetchWeekReportDashboard(this.props, this.state);
      const { updateComponentState } = this.props;
      updateComponentState(UPDATE_DASHBOARD, DASHBOARD_SHOULD_UPDATE, "NO");
    }

    if (
      projectsDataState &&
      projectsDataState !== this.props.projectsDataState
    ) {
      this.setState({ projectsData: projectsDataState });
    }

    if (reportDashboardState !== this.props.reportDashboardState) {
      if (reportDashboardState && reportDashboardState.apiData) {
        const reportDashBoard = dataAbstraction(
          reportDashboardState.apiData,
          billing_dashboad
        );

        this.setState({
          reportData: reportDashBoard,
          ogData: reportDashboardState.apiData.ogData,
          dataErrorMsg: "",
        });
      } else {
        this.setState({ dataErrorMsg: NO_RECORDS_FOUND });
      }
    }

    if (reportDashboardState && reportDashboardState.isError) {
      if (reportDashboardState.isError) {
        this.setState({
          reportData: { rows: [] },
          ogData: [],
        });
      }
    }

    if (
      projectsWeekDataState &&
      projectsWeekDataState.apiData &&
      projectsWeekDataState !== this.props.projectsWeekDataState
    ) {
      if (
        projectsWeekDataState.apiData.length === 1 ||
        projectsWeekDataState.apiData.length === 0
      ) {
        this.setState({
          previousIsEnable: false,
          nextIsEnable: false,
          reportWeekData: projectsWeekDataState.apiData[0],
        });
      } else {
        if (this.state.isWeekDivClick === false) {
          this.setState({
            previousIsEnable: true,
            nextIsEnable: false,
            reportWeekData:
              projectsWeekDataState.apiData[
                projectsWeekDataState.apiData.length - 1
              ],
            selectedWeek: projectsWeekDataState.apiData.length - 1,
          });
        } else {
          if (projectsWeekDataState && projectsWeekDataState.apiData) {
            this.setState({
              reportWeekData:
                projectsWeekDataState.apiData[this.state.selectedWeek],
            });
          }
        }
      }
    }
  }

  componentWillUnmount() {
    const { id, clearReport, updateComponentState } = this.props;
    const reportDashboardParams = {
      id,
    };
    clearReport(reportDashboardParams);
    updateComponentState(APP_ID, APP_NEW_ENTRY, false);
    updateComponentState(APP_ID, MIN_WINDOW, false);
    updateComponentState(APP_ID, CLOSE_WINDOW, false);
  }

  componentDidMount() {
    const { updateComponentState } = this.props;
    let titleSub = {
      title: "My Entries",
      subtitle: "",
    };
    updateComponentState(TITLE_SUBTITLE_ID, APP_TITLE_SUBTITLE, titleSub);
  }

  onChangeDropDown = (id, value) => {
    if (value === DEFAULT_OPTION) {
      this.setState({ [id]: "" });
    } else if (value === "Today") {
      this.setState({
        [id]: value,
        selectedStartDate: moment(),
        selectedEndDate: moment(),
        selectedDateRangeValue: "Custom",
      });
    } else if (value === "This Week") {
      this.setState({
        [id]: value,
        selectedStartDate: moment().startOf("isoWeek"),
        selectedEndDate: moment(),
        selectedDateRangeValue: "Custom",
      });
    } else if (value === "Last Week") {
      this.setState({
        [id]: value,
        selectedStartDate: moment()
          .subtract(1, "weeks")
          .startOf("isoWeek"),
        selectedEndDate: moment()
          .subtract(1, "weeks")
          .endOf("isoWeek"),

        selectedDateRangeValue: "Custom",
      });
    } else if (value === "Last Two Week") {
      this.setState({
        [id]: value,
        selectedStartDate: moment()
          .subtract(2, "weeks")
          .startOf("isoWeek"),

        selectedEndDate: moment()
          .subtract(1, "weeks")
          .endOf("isoWeek"),

        selectedDateRangeValue: "Custom",
      });
    } else if (value === "Custom") {
      this.setState({
        [id]: value,
        selectedStartDate: moment(),
        selectedEndDate: moment(),
        selectedDateRangeValue: "Custom",
      });
    } else {
      this.setState({
        [id]: value,
      });
    }
  };

  searchBilling() {
    const {
      selectedStartDate,
      selectedEndDate,
      selectedProjectTemp,
    } = this.state;
    if (selectedStartDate > selectedEndDate) {
      this.setState({
        validationMessage: "Please Select Date Properly.",
      });
    } else {
      this.setState(
        {
          reportData: { rows: [] },
          ogData: [],
          selectedDateInWeekBar: selectedEndDate,
          selectedStartDateDashBoard: selectedEndDate,
          isWeekDivClick: false,
          validationMessage: "",
          selectedDtaeTop: selectedEndDate,
          selectedProject: selectedProjectTemp,
        },
        () => {
          fetchReportDashboard(this.props, this.state);
          fetchWeekReportDashboard(this.props, this.state);
          this.getSelectedDateTop();
        }
      );
    }
  }

  onChangeDateRange = (id, value) => {
    this.setState({ [id]: value });
  };

  onClickNext = () => {
    const { projectsWeekDataState } = this.props;

    if (projectsWeekDataState && projectsWeekDataState.apiData) {
      this.setState(
        {
          selectedWeek: this.state.selectedWeek + 1,
        },
        () => {
          if (
            this.state.selectedWeek ===
            projectsWeekDataState.apiData.length - 1
          ) {
            this.setState({
              reportWeekData:
                projectsWeekDataState.apiData[this.state.selectedWeek],
              previousIsEnable: true,
              nextIsEnable: false,
            });
          } else {
            this.setState({
              reportWeekData:
                projectsWeekDataState.apiData[this.state.selectedWeek],
              previousIsEnable: true,
            });
          }
        }
      );
    }
  };
  onClickPrevious = () => {
    const { projectsWeekDataState } = this.props;

    if (projectsWeekDataState && projectsWeekDataState.apiData) {
      this.setState(
        {
          selectedWeek: this.state.selectedWeek - 1,
        },
        () => {
          if (this.state.selectedWeek === 0) {
            this.setState({
              reportWeekData:
                projectsWeekDataState.apiData[this.state.selectedWeek],
              previousIsEnable: false,
              nextIsEnable: true,
            });
          } else {
            this.setState({
              reportWeekData:
                projectsWeekDataState.apiData[this.state.selectedWeek],
              nextIsEnable: true,
            });
          }
        }
      );
    }
  };

  onClickWeekBarDiv = (selectedDate) => {
    const { projectsWeekDataState } = this.props;
    const momentObj = moment(selectedDate);
    this.setState(
      {
        selectedStartDateDashBoard: momentObj,
        isWeekDivClick: true,
        selectedDtaeTop: momentObj,
        selectedDateRangeValue: "Custom",
      },
      () => {
        if (projectsWeekDataState && projectsWeekDataState.apiData) {
          this.getSelectedDateTop();
          this.setState(
            {
              reportData: { rows: [] },
              ogData: [],
              selectedDateInWeekBar: momentObj,
              reportWeekData:
                projectsWeekDataState.apiData[this.state.selectedWeek],
            },
            () => {
              fetchReportDashboard(this.props, this.state);
            }
          );
        }
      }
    );
  };

  getSelectedDateTop() {
    const calender = getPropsCalender(this.state.selectedDtaeTop);
    this.setState({
      date: calender.currentDate,
      currentDay: calender.currentDay,
      dateAbbrv: calender.dateAbbrv,
      currentMonth: calender.currentMonth,
    });
  }

  showNewEntry = () => {
    this.setState({ idToEdit: "" });
    const { updateComponentState, appState } = this.props;
    updateComponentState(APP_ID, APP_EDIT_ENTRY_ID, "");
    updateComponentState(APP_ID, APP_NEW_ENTRY, true);
    updateComponentState(
      APP_ID,
      DASHBOARD_WEEK_DATE,
      this.state.selectedDateInWeekBar
    );

    const min_window = appState.get(MIN_WINDOW, ERROR_STR);
    if (min_window === true) {
      this.setState({ showminWindowDialog: true });
    }
  };

  onclickEdit = (idToEdit) => {
    this.setState({ idToEdit });

    const { appState, updateComponentState } = this.props;
    const min_window = appState.get(MIN_WINDOW, ERROR_STR);
    if (min_window === true) {
      this.setState({
        showminWindowDialog: true,
      });
    }
    updateComponentState(APP_ID, APP_DUPLICATE_ENTRY_ID, false);
    updateComponentState(APP_ID, APP_NEW_ENTRY, true);
    updateComponentState(APP_ID, APP_EDIT_ENTRY_ID, idToEdit);
  };

  onclickDelete = (idToDelete) => {
    const { appState } = this.props;
    const weekDate = appState.get(DASHBOARD_WEEK_DATE, ERROR_STR);

    if (this.state.idToEdit === idToDelete && weekDate === ERROR_STR) {
      this.setState({
        deleleEdited: "This entry is in edit mode. ",
      });
    } else {
      this.setState({
        deleleEdited: "",
      });
    }
    this.setState({
      showdeleteDialog: true,
      idToDelete: idToDelete,
    });
  };
  onclickDuplicate = (idToEdit) => {
    this.setState({ idToEdit });
    const { appState } = this.props;
    const min_window = appState.get(MIN_WINDOW, ERROR_STR);

    const { updateComponentState } = this.props;
    if (min_window === true) {
      this.setState({
        showminWindowDialog: true,
      });
    }

    updateComponentState(APP_ID, APP_NEW_ENTRY, true);
    updateComponentState(APP_ID, APP_EDIT_ENTRY_ID, idToEdit);
    updateComponentState(APP_ID, APP_DUPLICATE_ENTRY_ID, true); ///////////////////////////////////// 26 july 2019
  };

  onClickcancelToDialog = () => {
    this.setState({
      showdeleteDialog: false,
      showminWindowDialog: false,
    });
  };

  onOkCloseWindow = () => {
    const { updateComponentState } = this.props;
    updateComponentState(APP_ID, CLOSE_WINDOW, true);

    this.setState(
      {
        showminWindowDialog: false,
      },
      () => {
        updateComponentState(APP_ID, CLOSE_WINDOW, false);
        if (this.state.idToEdit !== "") {
          updateComponentState(APP_ID, APP_EDIT_ENTRY_ID, this.state.idToEdit);
        } else {
          updateComponentState(
            APP_ID,
            DASHBOARD_WEEK_DATE,
            this.state.selectedDateInWeekBar
          );
        }

        setTimeout(() => {
          this.onclickEdit(this.state.idToEdit);
        }, 1000);
      }
    );
  };

  onClickOkToDialog = () => {
    const { id, deleteData } = this.props;

    if (this.state.idToDelete === this.state.idToEdit) {
      const { updateComponentState } = this.props;
      updateComponentState(APP_ID, CLOSE_WINDOW, true);
    }

    deleteEntry(
      { id, deleteData },
      this.state.idToDelete,
      this.state,
      this.props
    ).then((response) => {
      if (response === true) {
        this.setState(
          {
            snackIsOpen: true,
            snackMessage: RECORD_DIALOG_MSG.detele.success,
            reportData: {
              rows: [],
            },
            ogData: [],
            // reportWeekData
          },
          () => {
            fetchReportDashboard(this.props, this.state);
            fetchWeekReportDashboard(this.props, this.state);
          }
        );
      } else {
        this.setState({
          snackIsOpen: true,
          snackMessage: RECORD_DIALOG_MSG.detele.fail,
        });
      }
    });

    this.setState({
      showdeleteDialog: false,
      idToDelete: null,
    });
  };

  onSnackClose() {
    this.setState({
      snackIsOpen: false,
    });
  }

  render() {
    const spanLabelProps = {
      id: "lbl",
      maxFont: 14,
      minFont: 5.5,
      className: "span-label",
    };

    const spanLabelDateProps = {
      id: "lbl",
      maxFont: 23,
      minFont: 14,
      className: "span-label",
    };

    const { appState } = this.props;
    const { selectedDateRangeValue, selectedProject} = this.state

    const isNewTimeSheet = appState.get(APP_NEW_ENTRY, false);
    const newStyle = {
      backgroundColor: "transparent",
      width: "100%",
      backgroundImage: "url(" + this.state.backgroundImageURL + ")",
      backgroundSize: "cover",
    };

    const newEntryProps = {
      selectedDateRangeValue,
      selectedProject
    }

    return (
      <div style={newStyle}>
        {isNewTimeSheet === true ? (
          <NewEntry id={ID_NEW_ENTRY} currentTableData={this.state.ogData} newEntryProps={newEntryProps}/>
        ) : null}

        <div className="pr-row" style={{ padding: "3px 3%" }}>
          <DiaglogBox
            open={this.state.showdeleteDialog}
            title="Alert"
            onCancel={this.onClickcancelToDialog}
            onConfirm={this.onClickOkToDialog}
            button1={"Cancel"}
            button2={"Ok"}
            alertMsg={
              this.state.deleleEdited + "Are you sure you want to delete?"
            }
          />
          <DiaglogBox
            open={this.state.showminWindowDialog}
            title="Alert"
            onCancel={this.onClickcancelToDialog}
            onConfirm={this.onOkCloseWindow}
            button1={"No"}
            button2={"Yes"}
            alertMsg="With this action, it will close the currently minimized window. Are you sure you want to proceed further?"
          />
          <Snackbar
            snackIsOpen={this.state.snackIsOpen}
            snackMessage={this.state.snackMessage}
            onSnackClose={() => this.onSnackClose()}
          />

          <div className="pr-col-9">
            <span className="dashboard-section1-day">
              {this.state.currentDay},
            </span>
            <span className="dashboard-section1-date">
              {this.state.date}
              <sup>{this.state.dateAbbrv} </sup>
              {this.state.currentMonth}
            </span>

            <div
              className="dashboard-section2-right"
              style={{
                display: "inline-block",
                float: "right",
                height: "44px",
              }}
            >
              <Icon
                icon="add_box"
                title="New Entry"
                onClick={() => this.showNewEntry(true)}
              />
            </div>
          </div>
        </div>

        <div className="pr-row" style={{ padding: "3px 3%" }}>
          <div className="pr-col-3">
            <div className="dashboard-section2-left-projects">
              <div
                style={{
                  fontWeight: "500",
                  color: "#192028",
                  fontSize: "14px",
                }}
              >
                Project
                <div className="growContainer">
                  <div className="grow">
                    <Icon
                      icon="info"
                      className="outline"
                      style={{
                        cursor: "default",
                        paddingLeft: "1px",
                        fontSize: "15px",
                      }}
                    />
                    <span>{PROJECT_NOTE}</span>
                  </div>
                </div>
              </div>
              <Dropdown
                id="selectedProjectTemp"
                defaultOption={"All"}
                style={dropDownStyle}
                dropDownData={this.state.projectsData}
                onChange={this.onChangeDropDown}
                selectedID={this.state.selectedProjectTemp}
              />
            </div>
          </div>

          <div className="pr-col-6" id="dash-searchBox">
            <div className="dashboard-section2-left-daterange">
              <SpanLabel {...spanLabelProps} data="Date Range" />

              <Dropdown
                id="selectedDateRange"
                dropDownData={dropDownDateRange}
                defaultOption={"null"}
                style={dropDownStyle}
                onChange={this.onChangeDropDown}
                selectedID={this.state.selectedDateRange}
              />
            </div>
            {this.state.selectedDateRange === "Custom" ? (
              <div className="dashboard-section2-left-hidden-datepickers">
                <div
                  id="startDatePicker"
                  className="dashboard-section2-left-startdate"
                >
                  <SpanLabel {...spanLabelDateProps} data="Start Date" />
                  <DatePicker
                    className="dashboard-left-datepicker"
                    id="selectedStartDate"
                    onChange={this.onChangeDateRange}
                    value={moment(this.state.selectedStartDate)}
                    isEnablePastDates={true}
                  />
                </div>
                <div
                  id="endDatePicker"
                  className="dashboard-section2-left-enddate"
                >
                  <SpanLabel {...spanLabelDateProps} data="End Date" />
                  <DatePicker
                    className="dashboard-left-datepicker"
                    id="selectedEndDate"
                    onChange={this.onChangeDateRange}
                    value={moment(this.state.selectedEndDate)}
                    isEnablePastDates={true}
                  />
                </div>
              </div>
            ) : null}

            <div className="dashboard-section2-left-selectbutton">
              <button style={buttonStyle} onClick={() => this.searchBilling()}>
                Search
              </button>
            </div>
          </div>
        </div>

        {this.state.validationMessage !== "" ? (
          <div className="pr-row" style={{ padding: "3px 3%" }}>
            <div className="pr-col-9" style={{ padding: "5px 0" }}>
              <span style={ErrorTextStyle}>{this.state.validationMessage}</span>
            </div>
          </div>
        ) : null}

        <div className="page-content-dashboard" id={this.props.id}>
          <div className="pr-row" style={{ marginBottom: "20px" }}>
            <WeekBar
              weekData={this.state.reportWeekData}
              onClickNext={this.onClickNext}
              previousIsEnable={this.state.previousIsEnable}
              onClickPrevious={this.onClickPrevious}
              nextIsEnable={this.state.nextIsEnable}
              onClickWeekBar={this.onClickWeekBarDiv}
              selectedDateInWeekBar={this.state.selectedDateInWeekBar}
            />
          </div>
          <div
            className="pr-row"
            id="dash-res-table"
            style={{ padding: "3px 3%" }}
          >
            {this.state.dataErrorMsg ? (
              <div>
                <span>No records available for </span>
                <span>{this.state.currentDay}, </span>
                <span>
                  {this.state.date}
                  <sup>{this.state.dateAbbrv} </sup>
                  {this.state.currentMonth}.
                </span>
              </div>
            ) : (
              <MyEntriesTableView
                {...this.state.reportData}
                ogData={this.state.ogData}
                onclickEdt={(e) => this.onclickEdit(e)}
                onClickDel={(e) => this.onclickDelete(e)}
                onClickDup={(e) => this.onclickDuplicate(e)}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const { component, report, projects, weekBar } = state;
  const id = ownProps.id;
  return {
    componentState: component.get(id, Map()),
    appState: component.get(APP_ID, Map()),
    updateDashboardState: component.get(UPDATE_DASHBOARD, Map()),
    reportDashboardState: report.getIn([id, "apiData"], null),
    projectsDataState: projects.getIn([id, "apiData"], null),
    projectsWeekDataState: weekBar.getIn([id, "apiData"], null),
  };
}

export default connect(
  mapStateToProps,
  {
    clearComponentState,
    updateComponentState,
    deleteComponentState,
    fetchReport,
    deleteReport,
    clearReport,
    fetchProjectsDashboard,
    requestData,
    deleteData,
    fetchWekReport,
  }
)(MyEntries);
