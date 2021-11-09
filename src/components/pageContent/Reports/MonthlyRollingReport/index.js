import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Map } from "immutable";
import {
  clearComponentState,
  updateComponentState,
  deleteComponentState,
} from "../../../../actions/component.actions.js";

import {
  REPORT_SUBMENU_ID2,
  APP_TITLE_SUBTITLE,
  TITLE_SUBTITLE_ID,
  REPORT_MONTHLY_ROLLING_REPORT_ID,
  MONTHLY_ROLLING_REPORT_NEW_TAB_URL,
} from "../../../../constants/app.constants.js";

import {
  createEmployeesProjectsForBoxes,
  fetchTeams,
  fetchAllEmployeesAndProjects,
  validateRequiredStates,
  getAllPropsForComponent,
  addReportEntry,
  removeAllSelectedEmpAndProjects,
} from "../Reports.utils";

import { firstLetterSmall, isEmpty } from "../../../utils/common.utils";
import { requestData, clearData } from "../../../../actions/data.actions.js";
import MultiSelect from "../../../widgets/MultiSelect";
import SpanLabel from "../../../widgets/SpanLabel";
import DatePicker from "../../../widgets/DatePicker";
import Button from "../../../widgets/Button";
import CheckBox from "../../../widgets/CheckBox";
import Icon from "../../../widgets/Icon";
import moment from "moment";
import { getDataFromCookie } from "../../../utils/CheckLoginDetails";
import { dateFormatter } from "../../../utils/calender.utils";
import "../reports.css";
import {
  MONTHLY_ROLLING_REPORT_DIALOGS,
  COMMON_REPORT_DLGS,
} from "../../../../constants/dialog.constants";
import Overlay from "../../../widgets/Overlay/OverLay.js";

class MonthlyRollingReport extends Component {
  static propTypes = {
    id: PropTypes.string,
    componentState: PropTypes.object.isRequired,
    updateComponentState: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      openOverlay: false,
      fdate: dateFormatter(moment(), "yyyy-MM-dd"),
      isDatePickerOpen: false,
      isFetching: true,
      selectedFromDate: moment(),
      validationMsg: "",
      employeesRequiredStates: [],
      employeesData: "",
      team_names: [],
      url: "",
    };
  }

  componentWillMount() {
    const { updateComponentState, clearData, requestData } = this.props;

    let titleSub = {
      title: "Reports",
      subtitle: "Monthly Rolling Report",
    };

    updateComponentState(TITLE_SUBTITLE_ID, APP_TITLE_SUBTITLE, titleSub);

    fetchAllEmployeesAndProjects({ requestData });
    fetchTeams({ requestData }, REPORT_MONTHLY_ROLLING_REPORT_ID);

    const clearParams = {
      id: REPORT_SUBMENU_ID2,
    };
    clearData(clearParams);

    let LoggedInUserFromRedux = "employee";
    if (getDataFromCookie().role) {
      LoggedInUserFromRedux = getDataFromCookie().role; //from redux state
    }
    this.setState({
      LoggedInUser: LoggedInUserFromRedux,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { employeeProjectsData, teamsData } = nextProps;
    //aditya 13 july
    if (this.props.teamsData !== teamsData && teamsData && teamsData.apiData) {
      this.setState(
        {
          teamsData: teamsData.apiData,
        },
        () => {
          let employeesStates = [];

          for (let i = 0; i < this.state.teamsData.length; i++) {
            let obj2 = {
              [firstLetterSmall(this.state.teamsData[i].name) + "emp"]: [],
              [firstLetterSmall(this.state.teamsData[i].name) + "emptemp"]: [],
            };
            employeesStates.push(obj2);
          }

          this.setState({
            employeesRequiredStates: employeesStates,
          });
        }
      );
    }

    if (nextProps.employeeProjectsData !== this.props.employeeProjectsData) {
      if (employeeProjectsData && employeeProjectsData.apiData) {
        this.setState({
          isFetching: employeeProjectsData.isFetching,
          employeeProjectsData: employeeProjectsData,
          employeesData: employeeProjectsData.apiData.employeesData,
        });
      }
    }
  }

  componentWillUnmount() {
    const { id, clearData } = this.props;
    const clearParams = {
      id,
    };
    clearData(clearParams);

    const clearParams2 = {
      id: REPORT_SUBMENU_ID2,
    };
    clearData(clearParams2);

    const clearParams3 = {
      id: REPORT_MONTHLY_ROLLING_REPORT_ID,
    };
    clearData(clearParams3);
  }

  submit = (e) => {
    if (this.state.team_names.length === 0) {
      this.setState({
        validationMsg: MONTHLY_ROLLING_REPORT_DIALOGS.validationTeam,
      });
    } else if (
      validateRequiredStates([], this.state.employeesRequiredStates)
        .isEmployeeSelected === false
    ) {
      this.setState({
        validationMsg: MONTHLY_ROLLING_REPORT_DIALOGS.validationemp,
      });
    } else {
      let objToAdd = {
        tr_emp_data: this.state.employeesRequiredStates,
        tr_fdate: this.state.fdate,
      };

      const { requestData } = this.props;
      let latestRowId = "";
      addReportEntry({ requestData }, JSON.stringify(objToAdd)).then(
        (response) => {
          if (response && response !== false) {
            latestRowId = response;
            // console.log("latestRowId in team report = ", latestRowId);

            this.setState({
              url:
                MONTHLY_ROLLING_REPORT_NEW_TAB_URL +
                "&latestRowId=" +
                latestRowId,
            });

            if (this.state.url !== "") {
              this.setState({
                openOverlay: true,
              });
            }
          } else {
            //show alert box
          }
        }
      );
    }
  };

  checkBoxesforValidationMsg() {
    let obj = validateRequiredStates([], this.state.employeesRequiredStates);

    if (obj.isEmployeeSelected === true) {
      this.setState({
        validationMsg: "",
      });
    }
  }

  onChangeFieldValues = (id, updatedValue, updatedValue2, updatedValue3) => {
    if (id === "fdate") {
      this.setState({
        isDatePickerOpen1: false,
        [id]: updatedValue.format("YYYY-MM-DD"),
      });
    } else if (id === "team_names") {
      if (updatedValue2 && updatedValue2.name && updatedValue2 !== "") {
        let retObj = removeAllSelectedEmpAndProjects(
          updatedValue2,
          [],
          this.state.employeesRequiredStates
        );

        let empChkBoxId = firstLetterSmall(updatedValue2.name) + "emp_id";

        this.setState({
          employeesRequiredStates: retObj.localEmpStates,
          [empChkBoxId]: false,
        });
      }

      this.setState(
        {
          [id]: updatedValue,
        },
        () => {
          if (this.state.team_names.length > 0) {
            this.setState({
              validationMsg: "",
            });
          }
        }
      );
    } else {
      if (id.slice(-3) === "emp") {
        if (
          updatedValue &&
          updatedValue.length &&
          updatedValue.length !== this.state.employeesData[updatedValue2].length
        ) {
          // console.log("m unchecking that all active checkbox");
          let checkBoxId = id + "_id";
          this.setState({
            [checkBoxId]: false,
          });
        }
        this.checkBoxesforValidationMsg();
      } else {
        this.setState({
          [id]: updatedValue,
        });
      }
    }
  };

  onClickCheckBox = (id, updatedValue, updatedValue2, updatedValue3) => {
    if (updatedValue2 === undefined) {
      updatedValue2 = 0;
    }
    if (updatedValue3 === undefined) {
      updatedValue3 = id.slice(0, -3);
    }

    let tempActiveEmpArr = [];
    if (updatedValue === true) {
      for (let i = 0; i < this.state.employeesData[updatedValue2].length; i++) {
        if (this.state.employeesData[updatedValue2][i].status_flag === "0") {
          tempActiveEmpArr.push(this.state.employeesData[updatedValue2][i].id);
        }
      }

      if (this.state.employeesRequiredStates[updatedValue2].length > 0) {
        for (
          let j = 0;
          j < this.state.employeesRequiredStates[updatedValue2].length;
          j++
        ) {
          tempActiveEmpArr.push(
            this.state.employeesRequiredStates[updatedValue2][j]
          );
        }
      }

      let localEmpStates = this.state.employeesRequiredStates;
      localEmpStates[updatedValue2][updatedValue3] = tempActiveEmpArr;

      this.setState(
        {
          employeesRequiredStates: localEmpStates,
        },
        () => {
          this.checkBoxesforValidationMsg();
        }
      );
    } else {
      let localEmpStates = this.state.employeesRequiredStates;
      tempActiveEmpArr = [];
      localEmpStates[updatedValue2][updatedValue3] = tempActiveEmpArr;
      this.setState({
        employeesRequiredStates: localEmpStates,
      });
    }

    this.setState({
      [id]: updatedValue,
    });
  };

  renderMultipleBoxes(team_names, data, empproj) {
    let finalArray = createEmployeesProjectsForBoxes(
      team_names,
      this.state.teamsData,
      empproj
    );

    return this.renderBoxes(data, finalArray, empproj);
  }

  renderBoxes(arrname = [], finalArray, projemp) {
    let retObj = finalArray.map(
      (singleTeam, index) =>
        arrname ? (
          <div key={singleTeam.team_name} className="pr-col-2point5">
            <div
              style={{
                display: "flex",
                fontSize: "12px",
                width: "100%",
              }}
            >
              <SpanLabel
                mainDivStyle={{ width: "50%" }}
                data={
                  singleTeam.team_name.charAt(0).toUpperCase() +
                  singleTeam.team_name.slice(1)
                }
                isRequired={false}
                style={{
                  paddingRight: "20px",
                }}
              />
              <div style={{ float: "right", display: "flex" }}>
                <SpanLabel data="All Active" isRequired={false} />

                <CheckBox
                  id={singleTeam.allActiveId}
                  isCheck={this.state[singleTeam.allActiveId]}
                  className="task-check"
                  onClick={this.onClickCheckBox}
                  dataSetIndex={singleTeam.team_id}
                  dataSetID={singleTeam.selectedArr}
                />
              </div>
            </div>

            {this.renderChildBox(
              singleTeam,
              arrname,
              this.state.employeesRequiredStates[singleTeam.team_id][
                singleTeam.selectedArr
              ]
            )}
          </div>
        ) : null
    );

    return retObj;
  }

  renderChildBox(singleTeam, arrname, multipleSelectedId) {
    return (
      <MultiSelect
        id={singleTeam.selectedArr}
        data={arrname[singleTeam.team_id]}
        onChange={this.onChangeFieldValues}
        multipleSelectedId={multipleSelectedId}
        isFromReport={true}
        dataSetIndex={singleTeam.team_id}
        // dataSetID={singleTeam.selectedArr}
      />
    );
  }

  removeTaskFunction() {
    // console.log("button clicked aaaaaaaaaaaa");
  }

  onReportClose = () => {
    this.setState({
      openOverlay: false,
      validationMsg: "",
    });
  };

  render() {
    const props = getAllPropsForComponent();
    return (
      <div className="page-content-form">
        {this.state.openOverlay === true ? (
          <Overlay
            subComponent={
              <div className="pr-inner-div pr-center pr-repPopup">
                <p>Are you sure you want to generate this report?</p>
                <a
                  target="_blank"
                  href={this.state.url}
                  onClick={this.onReportClose}
                  className="prOk button-submitEntry"
                >
                  OK
                </a>
                <a
                  className="prCancel button-cancel"
                  onClick={this.onReportClose}
                >
                  Cancel
                </a>
              </div>
            }
          />
        ) : null}
        <div className="pr-col-accordion">
          <div
            className="pr-container"
            id="team_report"
            style={{
              width: "100%",
              border: "0px",
            }}
          >
            <div className="pr-col-1" style={{ paddingBottom: "2%" }}>
              <SpanLabel {...props.spanLabel} data="Date" />
              <DatePicker
                value={this.state.fdate}
                isOpen={this.state.isDatePickerOpen1}
                id="fdate"
                onChange={this.onChangeFieldValues}
                className="date-picker"
                isEnablePastDates={true}
              />
            </div>

            <div className="pr-row">
              <SpanLabel data="Select Teams" isRequired={true} />
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
                  <span>{MONTHLY_ROLLING_REPORT_DIALOGS.note}</span>
                </div>
              </div>
            </div>

            <div className="pr-row" style={{ paddingBottom: "2%" }}>
              <MultiSelect
                id="team_names"
                data={this.state.teamsData}
                onChange={this.onChangeFieldValues}
                multipleSelectedId={this.state.team_names}
                isSelectionColor={false}
                style={{
                  display: "flex",
                  width: "100%",
                  height: "10%",
                  border: "0px",
                }}
              />
            </div>
            {this.state.team_names.length !== 0 &&
            this.state.employeesData &&
            this.state.isFetching === false ? (
              <div style={{ paddingBottom: "2%" }}>
                <SpanLabel
                  data="Employees"
                  isRequired={false}
                  mainDivStyle={{ marginBottom: "1%" }}
                  style={{
                    borderBottom: "1.5px solid #c5c9cc",
                  }}
                />
                <div className="pr-row">
                  {this.renderMultipleBoxes(
                    this.state.team_names,
                    this.state.employeesData,
                    "emp"
                  )}
                </div>
              </div>
            ) : null}
            {/* ////aditya 13 july */}
            {isEmpty(this.state.teamsData) ? (
              <SpanLabel
                style={{ color: "#FF0000" }}
                data={COMMON_REPORT_DLGS.createTeamEmpProj}
              />
            ) : null}
            {this.state.validationMsg !== "" ? (
              <div className="error-right-div" id="errDiv">
                <span style={{ color: "#FF0000" }}>
                  {this.state.validationMsg}
                </span>
              </div>
            ) : null}
            <Button
              {...props.submitButton}
              onClick={this.submit}
              className="button-submitEntry"
            />
            <a
              style={{ display: "none" }}
              href={this.state.url}
              target="_blank"
              ref={(a) => (this.inputElement = a)}
            />
          </div>
        </div>
      </div>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const { data } = state;
  const id = ownProps.id;

  return {
    componentState: state.component.get(id, Map()),
    employeeProjectsData: data.getIn([REPORT_SUBMENU_ID2, "apiData"], null),
    teamsData: data.getIn([REPORT_MONTHLY_ROLLING_REPORT_ID, "apiData"], null),
  };
}

export default connect(
  mapStateToProps,
  {
    clearComponentState,
    updateComponentState,
    deleteComponentState,
    requestData,
    clearData,
  }
)(MonthlyRollingReport);
