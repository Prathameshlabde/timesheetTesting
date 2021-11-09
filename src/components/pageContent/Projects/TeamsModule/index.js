import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Map } from "immutable";
import {
  clearComponentState,
  updateComponentState,
} from "../../../../actions/component.actions.js";
import {
  updateData,
  requestData,
  deleteData,
} from "../../../../actions/data.actions";

import {
  activeSwitch,
  inActiveSwitch,
} from "../../../../actions/projects.actions";

import {
  APP_TITLE_SUBTITLE,
  TITLE_SUBTITLE_ID,
  TEAMS_ID,
  TEAMS_ID_2,
  TEAM_EMP_ID,
  TEAM_TECH_ID,
  TEAMS_MODULE_ID,
  ADD_NEW_TEAM,
  EDIT_TEAM,
  NO_RECORDS_FOUND,
  SUBMIT,
  UPDATE,
} from "../../../../constants/app.constants";
import {
  fetchTeamsForTable,
  fetchSingleTeamDataFromUtils,
  addNewTeam,
  updateTeam,
  fetchEmployeeList,
  fetchTechnologies,
  getPropsDropdown,
} from "./teamsModule.utils";

import { TEAMS_DIALOG_MSG } from "../../../../constants/dialog.constants";
import { getDataFromCookie } from "../../../utils/CheckLoginDetails";
import { dataAbstraction } from "../../../utils/dataAbstraction.utils";
import Snackbar from "../../../widgets/Snackbar";
import SpanLabel from "../../../widgets/SpanLabel";
import TextField from "../../../widgets/TextField";
import Button from "../../../widgets/Button";
import TableView from "../../../widgets/TableView/TableView";
import MultiSelect from "../../../widgets/MultiSelect";
import DropdownList from "../../../widgets/DropdownList";
import "../../pageContent.css";
import "../../Dashboard/dashboard.css";
import teams_module_table from "../../../json/projects/teams_module_table.json";
import { isEmpty } from "../../../utils/common.utils.js";

class TeamsModule extends Component {
  static propTypes = {
    id: PropTypes.string,
    componentState: PropTypes.object.isRequired,
    updateComponentState: PropTypes.func.isRequired,
  };

  state = {
    headText: ADD_NEW_TEAM,
    subMenuTitle: ADD_NEW_TEAM,
    team_name: "",
    buttonText: SUBMIT,
    isEdit: false,
    idToEdit: "",
    validationMessage: "",
    snackIsOpen: false,
    snackMessage: "",
    LoggedInUser: "",
    team_emp: [],
  };

  componentWillMount() {
    let LoggedInUserFromRedux = "employee";
    if (getDataFromCookie().role) {
      LoggedInUserFromRedux = getDataFromCookie().role; //from redux state
    }
    this.setState({
      LoggedInUser: LoggedInUserFromRedux,
    });

    const { requestData, updateComponentState } = this.props;
    let titleSub = {
      title: "Teams",
      subtitle: "",
    };
    updateComponentState(TITLE_SUBTITLE_ID, APP_TITLE_SUBTITLE, titleSub);
    fetchTeamsForTable({ requestData, updateComponentState });
    fetchEmployeeList({ requestData });
    fetchTechnologies({ requestData, updateComponentState });
  }

  componentWillUnmount() {}

  componentWillReceiveProps(nextProps) {
    const { technologiesData, employeesData, teamsData, editState } = nextProps;

    if (
      technologiesData &&
      technologiesData !== this.props.technologiesData &&
      !isEmpty(technologiesData.apiData) //aditya 13 july
    ) {
      this.setState({
        technologiesData: technologiesData.apiData,
        tech_id: technologiesData.apiData[0].id,
      });
    }

    if (
      employeesData &&
      employeesData !== this.props.employeesData &&
      employeesData.apiData
    ) {
      this.setState({
        employeesData: employeesData.apiData,
      });
    }

    if (teamsData !== this.props.teamsData) {
      if (
        teamsData &&
        teamsData.apiData &&
        teamsData.apiData !== true &&
        teamsData.apiData !== "duplicate"
      ) {
        this.setState({
          teamsTableData: dataAbstraction(
            teamsData.apiData,
            teams_module_table
          ),
          totalRowsCount: parseInt(teamsData.apiData.totalCount, 10),
          team_name: "",
          buttonText: SUBMIT,
          isEdit: false,
          idToEdit: "",
          subMenuTitle: ADD_NEW_TEAM,
          dataErrorMsg: "",
        });
      } else {
        this.setState({
          dataErrorMsg: NO_RECORDS_FOUND,
        });
      }
    }

    if (editState !== this.props.editState && editState && editState.apiData) {
      let data = editState.apiData[0];

      this.setState({
        team_id: data.team_id,
        tech_id: data.tech_id,
        team_name: data.team_name,
        status_flag: data.status_flag,
        team_emp: data.team_emp,
        isEdit: true,
        buttonText: UPDATE,
        subMenuTitle: EDIT_TEAM,
      });
    }
  }

  onclickEdit = (idToEdit) => {
    this.setState({
      idToEdit: idToEdit,
      headText: EDIT_TEAM,
      validationMessage: "",
    });
    const { requestData, updateComponentState } = this.props;
    fetchSingleTeamDataFromUtils(
      { requestData, updateComponentState },
      idToEdit
    );
  };

  onChangeFieldValues = (id, updatedValue, updatedValue2, updatedValue3) => {
    if (id === "team_emp") {
      let arrValues = [];
      updatedValue.forEach((element) => {
        // console.log("element in on change = ", element);
        arrValues.push(element);
      });
      this.setState(
        {
          team_emp: arrValues,
        },
        () => {
          // console.log("selected pms = ", this.state.pm_assign);
        }
      );
    } else if (id === "tech_name") {
      this.setState({
        tech_id: updatedValue,
        tech_name: updatedValue2,
      });
    } else {
      this.setState({
        [id]: updatedValue,
      });
    }
  };

  onClickSearch = () => {
    const { id, requestData, updateComponentState } = this.props;
    fetchTeamsForTable({ id, requestData, updateComponentState });
  };

  submitNewEntry = () => {
    const { team_name, isEdit } = this.state;
    const { id, requestData, updateComponentState } = this.props;

    if (team_name === "") {
      this.setState({
        validationMessage: TEAMS_DIALOG_MSG.validation,
      });
    } else if (team_name.length > 60) {
      this.setState({
        validationMessage: TEAMS_DIALOG_MSG.validation_char_limit,
      });
    } else if (this.state.team_emp.length === 0) {
      this.setState({
        validationMessage: TEAMS_DIALOG_MSG.validationemp,
      });
    } else {
      if (isEdit === false) {
        let paraObj = {
          team_name: this.state.team_name,
          team_emp: this.state.team_emp,
          tech_id: this.state.tech_id,
        };
        addNewTeam({ id, requestData, updateComponentState }, paraObj).then(
          (response) => {
            this.setState(
              {
                snackIsOpen: true,
              },
              () => {
                if (response === true) {
                  this.setState({
                    snackMessage: TEAMS_DIALOG_MSG.add.success,
                    team_name: "",
                    team_emp: [],
                    tech_id: "",
                  });
                } else if (response === "duplicate") {
                  this.setState({
                    snackMessage: TEAMS_DIALOG_MSG.duplicate,
                  });
                } else {
                  this.setState({
                    snackMessage: TEAMS_DIALOG_MSG.add.fail,
                  });
                }
              }
            );
          }
        );
      } else {
        let paraObj = {
          idToEdit: this.state.idToEdit,
          team_name: this.state.team_name,
          team_emp: this.state.team_emp,
          tech_id: this.state.tech_id,
        };

        updateTeam({ id, requestData, updateComponentState }, paraObj).then(
          (response) => {
            this.setState(
              {
                snackIsOpen: true,
              },
              () => {
                if (response === true) {
                  this.setState({
                    snackMessage: TEAMS_DIALOG_MSG.update.success,
                    headText: ADD_NEW_TEAM,
                    team_name: "",
                    team_emp: [],
                    tech_id: "",
                  });
                } else if (response === "duplicate") {
                  this.setState({
                    snackMessage: TEAMS_DIALOG_MSG.duplicate,
                  });
                } else {
                  this.setState({
                    snackMessage: TEAMS_DIALOG_MSG.update.fail,
                  });
                }
              }
            );
          }
        );
      }
      this.setState({
        validationMessage: "",
      });
    }
  };

  clearData = () => {
    this.setState({
      team_name: "",
      team_emp: [],
      buttonText: SUBMIT,
      isEdit: false,
      headText: ADD_NEW_TEAM,
      validationMessage: "",
    });
  };

  onSnackClose() {
    this.setState({
      snackIsOpen: false,
    });
  }

  switchChanged = (idToEdit, currentstatus) => {
    // console.log("idToEdit switchChanged= ", idToEdit);
    // console.log("currentstatus = ", currentstatus);
    const { activeSwitch, inActiveSwitch } = this.props;
    let BodyParams = new FormData();
    BodyParams.append("type", "updateData");
    const payload = {
      team_id: idToEdit,
    };
    BodyParams.append("params", JSON.stringify(payload));
    const Params = {
      id: TEAMS_ID,
      api: {
        body: BodyParams,
      },
    };
    const { requestData, updateComponentState } = this.props;
    if (currentstatus === true) {
      BodyParams.append("command", "inActiveTeam");
      inActiveSwitch(Params).then((result) => {
        if (result.response && result.response.apiData === true) {
          fetchTeamsForTable({ requestData, updateComponentState });
        }
      });
    } else {
      BodyParams.append("command", "activeTeam");
      activeSwitch(Params).then((result) => {
        if (result.response && result.response.apiData === true) {
          fetchTeamsForTable({ requestData, updateComponentState });
        }
      });
    }
  };

  render() {
    const dropDownProps = getPropsDropdown();
    return (
      <div className="page-content-form">
        <div id={this.props.id}>
          <div
            style={{ padding: "0px 2.8% 0px", border: "unset" }}
            className="pr-container"
            id="newEntry"
          >
            <div className="pr-row" style={{ padding: "0px" }}>
              <h4>{this.state.headText}</h4>
            </div>
            <div className="pr-row" style={{ padding: "0px" }}>
              <div className="pr-col-2">
                <div style={{ paddingBottom: "10%" }}>
                  <SpanLabel
                    data="Name"
                    className="span-label"
                    isRequired={true}
                  />
                  <TextField
                    id="team_name"
                    data={this.state.team_name}
                    onChange={this.onChangeFieldValues}
                    classNames="pr-txtfield-lg w-90"
                    style={{ width: "95%" }}
                  />
                </div>
                <div style={{ width: "90%" }}>
                  <SpanLabel
                    data="Select Technology"
                    className="span-label"
                    isRequired={true}
                  />
                  <DropdownList
                    id="tech_name"
                    {...dropDownProps}
                    dropDownData={this.state.technologiesData}
                    onChange={this.onChangeFieldValues}
                    // defaultOption="Select Technology"
                    selectedID={this.state.tech_id}
                  />
                </div>
              </div>

              <div className="pr-col-2">
                <SpanLabel
                  data="Select Employees"
                  className="span-label"
                  isRequired={true}
                />
                <MultiSelect
                  id="emp_list"
                  data={this.state.employeesData}
                  onChange={this.onChangeFieldValues}
                  multipleSelectedId={this.state.team_emp}
                />
              </div>
            </div>
            <div className="pr-row" style={{ padding: "0px" }}>
              <div className="pr-col-4">
                <Button
                  onClick={this.submitNewEntry}
                  className="submit-button-holiday"
                  data={this.state.buttonText}
                  style={{ marginLeft: "0px" }}
                />

                {this.state.isEdit === true ? (
                  <Button
                    onClick={this.clearData}
                    className="clear-button-holiday"
                    data="Cancel"
                  />
                ) : null}

                {this.state.validationMessage !== "" ? (
                  <span style={{ color: "#FF0000", padding: "0 10px" }}>
                    {this.state.validationMessage}
                  </span>
                ) : null}
              </div>
              <div className="pr-col-4">
                <div style={{ paddingRight: "15px", float: "right" }}>
                  <div className="" style={{ display: "-webkit-inline-box" }}>
                    <Snackbar
                      snackIsOpen={this.state.snackIsOpen}
                      snackMessage={this.state.snackMessage}
                      onSnackClose={() => this.onSnackClose()}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pr-row" style={{ padding: "0px 2.8%" }}>
            <div className="pr-col-6">
              <div className="search-field-year-left">List of Teams</div>
            </div>
          </div>

          <div className="dashboard-section4">
            {this.state.teamsTableData ? (
              <TableView
                {...this.state.teamsTableData}
                onclickEdt={(e) => this.onclickEdit(e)}
                onClickDel={(e) => this.onclickDelete(e)}
                onChngeSwitch={(e, f) => this.switchChanged(e, f)}
              />
            ) : (
              this.state.dataErrorMsg
            )}
          </div>
        </div>
      </div>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const { data } = state;
  return {
    componentState: state.component.get(ownProps.id, Map()),
    editState: data.getIn([TEAMS_MODULE_ID, "apiData"], null),
    teamsData: data.getIn([TEAMS_ID_2, "apiData"], null),
    employeesData: data.getIn([TEAM_EMP_ID, "apiData"], null),
    technologiesData: data.getIn([TEAM_TECH_ID, "apiData"], null),
  };
}

export default connect(
  mapStateToProps,
  {
    clearComponentState,
    updateComponentState,
    updateData,
    requestData,
    deleteData,
    activeSwitch,
    inActiveSwitch,
  }
)(TeamsModule);
