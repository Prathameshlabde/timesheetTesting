import React, { Component } from "react";
import { connect } from "react-redux";
import { Map } from "immutable";
import {
  clearComponentState,
  updateComponentState,
  deleteComponentState
} from "../../../../actions/component.actions";
import {
  updateData,
  requestData,
  clearData
} from "../../../../actions/data.actions";
import { requestClients } from "../../../../actions/client.actions";
import { fetchAllProjects } from "../../../../actions/projects.actions.js";
import {
  UPDATE_PROJECTS_MODULE,
  PROJECTS_MODULE_SHOULD_UPDATE,
  PROJECTS_EDIT_ENTRY_ID,
  PROJECTS_MODULE_ID,
  PROJECTS_MODULE_ID_2,
  PROJECTS_MODULE_ID_3,
  SNACKBAR_ID,
  SNACKBAR_SHOW
} from "../../../../constants/app.constants";

import {
  getPropsDatePicker,
  getPropsButtonClose,
  getPropsButtonSubmit,
  getPropsTextArea,
  getPropsspanLabel,
  getPropsDropdown,
  getPropsMultipleDropdown,
  textFieldStyle,
  fetchEntryDataFromUtils,
  addNewProject,
  updateProject,
  fetchProjectManagerList,
  fetchClientList
} from "./projectsModule.utils";

import TextField from "../../../widgets/TextField";
import DropdownList from "../../../widgets/DropdownList";
import DatePicker from "../../../widgets/DatePicker";
import Button from "../../../widgets/Button";
import TextArea from "../../../widgets/TextArea";
import SpanLabel from "../../../widgets/SpanLabel";
import Icon from "../../../widgets/Icon";
import RadioButton from "../../../widgets/RadioButton";
import Snackbar from "../../../widgets/Snackbar";
import MultiSelect from "../../../widgets/MultiSelect";
import { PROJECT_DIALOG_MSG } from "../../../../constants/dialog.constants";
import { fetchTeams } from "../../Reports/Reports.utils";
import "../projects.css";
import { dateFormatter } from "../../../utils/calender.utils";
import moment from "moment";
import { getDataFromCookie } from "../../../utils/CheckLoginDetails";

class NewProject extends Component {
  constructor(props) {
    super(props);
    let todaysDate = dateFormatter(moment(), "yyyy-MM-dd");
    this.state = {
      start_date: todaysDate,
      end_date: todaysDate,
      pname: "",
      description: "",
      client_id: "",
      estimated_hrs: "",
      team_name: "",
      is_billable: "1",
      is_task_mandate: "0",
      is_sprint_mandate: "0",
      isDatePickerOpen: false,
      r1firstChecked: true,
      r2firstChecked: false,
      r3firstChecked: false,
      validationMsg: "",
      isEditEntry: false,
      snackIsOpen: false,
      snackMessage: "",
      pm_assign: [],
      teamsData: [],
      team_id: "0"
    };
  }

  // state = {
  //   validationMessageee: ""
  // };
  componentWillMount() {
    const { updateComponentState, editState, requestData } = this.props;
    updateComponentState(
      UPDATE_PROJECTS_MODULE,
      PROJECTS_MODULE_SHOULD_UPDATE,
      "NO"
    );

    const entryID = editState.get(PROJECTS_EDIT_ENTRY_ID, "");
    fetchTeams({ requestData }, PROJECTS_MODULE_ID_3);
    fetchProjectManagerList(this.props);
    fetchClientList(this.props);
    if (entryID) {
      fetchEntryDataFromUtils(entryID, this.props);
    }

    let LoggedInUser = "employee";

    if (getDataFromCookie().role) {
      LoggedInUser = getDataFromCookie().role; //from redux state
    }
    this.setState({ LoggedInUser }, () => {
      if (LoggedInUser === "admin" || LoggedInUser === "superadmin") {
        let todaysDate = dateFormatter(moment().subtract(365, "days"), "yyyy-MM-dd")
        this.setState({ lock_date: todaysDate });
      }
    });
  }

  componentWillUnmount() {
    const { id, clearData, deleteComponentState } = this.props;
    const clearParams = { id };
    clearData(clearParams);
    deleteComponentState(this.props.id);
  }
  capitalize(s) {
    return s && s[0].toUpperCase() + s.slice(1);
  }

  componentWillReceiveProps(nextProps) {
    const { editState } = this.props;
    const { entryDataState, appState, clientState, teamsDataState } = nextProps;

    if (teamsDataState !== this.props.teamsDataState) {
      this.setState({ teamsData: teamsDataState.apiData });
    }

    if (appState !== this.props.appState) {
      if (appState && appState.apiData && appState.apiData !== "duplicate") {
        this.setState({ PMData: appState.apiData });
      }
    }

    if (clientState !== this.props.clientState) {
      if (clientState && clientState.apiData) {
        this.setState({ clientData: clientState.apiData });
      }
    }

    const entryID = editState.get(PROJECTS_EDIT_ENTRY_ID, "");
    if (entryID) {
      if (nextProps.entryDataState !== this.props.entryDataState) {
        if (entryDataState) {
          const apiData = entryDataState.apiData;
          this.setState({ pm_assign: [] }, () => {
            let tempArr = [];
            for (let i = 0; i < apiData.pm_assign.length; i++) {
              if (apiData.pm_assign[i].emp_id) {
                tempArr.push(apiData.pm_assign[i].emp_id);
              }
            }
            this.setState({ pm_assign: tempArr });
          });

          this.setState(
            {
              start_date: apiData.start_date,
              end_date: apiData.end_date,
              pname: apiData.pname,
              description: apiData.description,
              client_id: apiData.client_id,
              estimated_hrs: apiData.estimated_hrs,
              team_name: this.capitalize(apiData.team_name),
              team_id: apiData.team_id,
              is_billable: apiData.is_billable,
              is_task_mandate: apiData.is_task_mandate,
              is_sprint_mandate: apiData.is_sprint_mandate,
              isDatePickerOpen: false,
              isEditEntry: true
            },
            () => {
              const { LoggedInUser } = this.state;
              if (LoggedInUser === "admin" || LoggedInUser === "superadmin") {
                this.setState({ lock_date: apiData.lock_date });
              }

              if (this.state.is_billable === "1") {
                this.setState({ r1firstChecked: true });
              } else {
                this.setState({ r1firstChecked: false });
              }

              if (this.state.is_sprint_mandate === "1") {
                this.setState({ r3firstChecked: true });
              } else {
                this.setState({ r3firstChecked: false });
              }

              if (this.state.is_task_mandate === "1") {
                this.setState({ r2firstChecked: true });
              } else {
                this.setState({ r2firstChecked: false });
              }
              if (this.state.team_id === "0" && this.state.teamsData[0]) {
                this.setState({ team_id: this.state.teamsData[0].id });
              }
            }
          );
        }
      }
    }
  }

  submitNewEntry = () => {
    const {
      pname,
      team_id,
      client_id,
      start_date,
      end_date,
      pm_assign
    } = this.state;
    const { editState, updateComponentState } = this.props;
    // const { dataOffset } = this.props;
    const entryID = editState.get(PROJECTS_EDIT_ENTRY_ID, "");

    if (pname === "") {
      this.setState({ validationMsg: "Please enter project name." });
    } else if (team_id === "0") {
      this.setState({ validationMsg: "Please select team." });
    } else if (moment(start_date) > moment(end_date)) {
      this.setState({ validationMsg: "Please select date properly." });
    } else if (pm_assign.length === 0) {
      this.setState({ validationMsg: "Please select Project Manager." });
    } else if (client_id === "") {
      this.setState({ validationMsg: "Please select Client." });
    } else {
      if (entryID) {
        updateProject(entryID, this.props, this.state).then(
          response => {
            if (response === true) {
              updateComponentState(SNACKBAR_ID, SNACKBAR_SHOW, {
                showSnackBar: true,
                snackMessage: PROJECT_DIALOG_MSG.update.success
              });
              this.updateStateAndRedux();
            } else if (response === "duplicate") {
              this.setState({ validationMsg: PROJECT_DIALOG_MSG.duplicate });
            } else {
              this.setState({
                snackIsOpen: true,
                snackMessage: PROJECT_DIALOG_MSG.update.fail
              });
            }
          }
        );
      } else {
        addNewProject(this.props, this.state).then(response => {
          if (response === true) {
            updateComponentState(SNACKBAR_ID, SNACKBAR_SHOW, {
              showSnackBar: true,
              snackMessage: PROJECT_DIALOG_MSG.add.success
            });
            this.updateStateAndRedux();
          } else if (response === "duplicate") {
            this.setState({ validationMsg: PROJECT_DIALOG_MSG.duplicate });
          } else {
            this.setState({
              snackIsOpen: true,
              snackMessage: PROJECT_DIALOG_MSG.add.fail
            });
          }
        });
      }
    }
  };

  updateStateAndRedux() {
    const { updateComponentState } = this.props;
    updateComponentState(
      UPDATE_PROJECTS_MODULE,
      PROJECTS_MODULE_SHOULD_UPDATE,
      "YES"
    );
    this.closeNewEntry(false);
    this.setState({ validationMsg: "" });
  }

  onChangeFieldValues = (id, updatedValue, updatedValue1, updatedValue2) => {
    if (id === "start_date") {
      this.setState({ isDatePickerOpen1: false });
    } else if (id === "end_date") {
      this.setState({ isDatePickerOpen2: false });
    } else {
      this.setState({ isDatePickerOpen3: false });
    }

    if (id === "PMData") {
      let arrValues = [];
      updatedValue.forEach(element => {
        // console.log("element in on change = ", element);
        arrValues.push(element);
      });
      this.setState({ pm_assign: arrValues });
    } else if (id === "team_name") {
      this.setState({ team_id: updatedValue, team_name: updatedValue2 });
    } else if (id === "start_date" || id === "end_date" || id === "lock_date") {
      this.setState({ [id]: updatedValue.format("YYYY-MM-DD") });
    } else if (
      id === "is_billable" ||
      id === "is_task_mandate" ||
      id === "is_sprint_mandate"
    ) {
      this.setState({ [id]: updatedValue }, () => {
        if (id === "is_billable") {
          if (updatedValue === "0") {
            this.setState({ r1firstChecked: false });
          } else {
            this.setState({ r1firstChecked: true });
          }
        } else if (id === "is_sprint_mandate") {
          if (updatedValue === "0") {
            this.setState({ r3firstChecked: false });
          } else {
            this.setState({ r3firstChecked: true });
          }
        } else {
          if (updatedValue === "0") {
            this.setState({ r2firstChecked: false });
          } else {
            this.setState({ r2firstChecked: true });
          }
        }
      });
    } else {
      this.setState({ [id]: updatedValue });
    }
  };

  onDatePickerIconClick = currentDateName => {
    if (currentDateName === "start_date") {
      this.setState({ isDatePickerOpen1: !this.state.isDatePickerOpen1 });
    } else if (currentDateName === "end_date") {
      this.setState({ isDatePickerOpen2: !this.state.isDatePickerOpen2 });
    } else {
      this.setState({ isDatePickerOpen3: !this.state.isDatePickerOpen3 });
    }
  };

  getAllPropsForComponent() {
    const spanLabel = getPropsspanLabel();
    const dropDown = getPropsDropdown();
    const multipleDropDown = getPropsMultipleDropdown();
    const datePicker = getPropsDatePicker();
    const closeButton = getPropsButtonClose();
    const submitButton = getPropsButtonSubmit();
    const textArea = getPropsTextArea();
    return {
      textArea,
      dropDown,
      multipleDropDown,
      datePicker,
      closeButton,
      submitButton,
      spanLabel
    };
  }

  closeNewEntry = isButtonPressed => {
    this.setState({
      description: "",
      start_date: "",
      end_date: "",
      lock_date: "",
      estimated_hrs: "0",
      tasksData: "",
      subTasksData: "",
      entryData: "",
      isDatePickerOpen: false
    });
    const { deleteComponentState } = this.props;
    deleteComponentState(PROJECTS_MODULE_ID);
  };

  onSnackClose() {
    this.setState({ snackIsOpen: false }, () => {
      this.updateStateAndRedux();
    });
  }

  render() {
    const props = this.getAllPropsForComponent();
    const { LoggedInUser } = this.state;
    return (
      <div className="pr-inner-div pr-center">
        <div className="pr-header-level">
          <div
            className="pr-col-inner-div-header-left"
            style={{ padding: "4px 0" }}
          >
            {this.state.isEditEntry === true ? (
              <span>Edit Project</span>
            ) : (
                <span>New Project</span>
              )}
          </div>
          <div className="pr-col-inner-div-header-right">
            <Icon
              icon="close"
              style={{
                fontSize: "20px",
                cursor: "pointer",
                margin: "3px",
                color: "black"
              }}
              title="close"
              onClick={() => this.closeNewEntry(false)}
            />
            <Snackbar
              snackIsOpen={this.state.snackIsOpen}
              snackMessage={this.state.snackMessage}
              onSnackClose={() => this.onSnackClose()}
            />
          </div>
        </div>

        <div className="pr-container" id="newEntry">
          {this.state.validationMsg !== "" ? (
            <div className="error-right-div" id="errDiv">
              <span style={{ color: "#FF0000" }}>
                {this.state.validationMsg}
              </span>
            </div>
          ) : null}
          <div className="pr-row">
            <div className="pr-col-3">
              <div className="pr-top-level-section1-comp">
                <SpanLabel {...props.spanLabel} data="Name" isRequired={true} />
                <TextField
                  classNames="pr-txtfield-lg"
                  id="pname"
                  data={this.state.pname}
                  onChange={this.onChangeFieldValues}
                  style={textFieldStyle.textfieldSmall}
                />
              </div>
            </div>

            <div className="pr-col-3">
              <div className="pr-top-level-section1-comp">
                <SpanLabel
                  {...props.spanLabel}
                  data="Select Team"
                  isRequired={true}
                />
                <DropdownList
                  id="team_name"
                  {...props.dropDown}
                  dropDownData={this.state.teamsData}
                  onChange={this.onChangeFieldValues}
                  defaultOption="Select Team"
                  selectedID={this.state.team_id}
                />
              </div>
            </div>

            <div className="pr-col-3">
              <div className="pr-top-level-section1-comp">
                <SpanLabel
                  {...props.spanLabel}
                  data="Client"
                  isRequired={true}
                />
                <DropdownList
                  id="client_id"
                  {...props.dropDown}
                  dropDownData={this.state.clientData}
                  onChange={this.onChangeFieldValues}
                  defaultOption="Select Client"
                  selectedID={this.state.client_id}
                />
              </div>
            </div>
          </div>

          <div className="pr-row">
            <div className="pr-col-3">
              <div className="pr-top-level-section1-comp">
                <SpanLabel {...props.spanLabel} data="Start Date" />

                <div
                  className="date-pcker-field-div"
                  style={{ width: "78%", marginLeft: "1px" }}
                >
                  <DatePicker
                    value={this.state.start_date}
                    isOpen={this.state.isDatePickerOpen1}
                    id="start_date"
                    onChange={this.onChangeFieldValues}
                    className="date-picker"
                  // isEnableFutureDates={true}
                  />
                </div>
              </div>
            </div>

            <div className="pr-col-3">
              <div className="pr-top-level-section1-comp">
                <SpanLabel {...props.spanLabel} data="End Date" />
                <div
                  className="date-pcker-field-div"
                  style={{ width: "78%", marginLeft: "1px" }}
                >
                  <DatePicker
                    value={this.state.end_date}
                    isOpen={this.state.isDatePickerOpen2}
                    id="end_date"
                    onChange={this.onChangeFieldValues}
                    className="date-picker"
                  // isEnableFutureDates={true}
                  />
                </div>
              </div>
            </div>

            {LoggedInUser === "admin" || LoggedInUser === "superadmin" ? (
              <div className="pr-col-3">
                <div className="pr-top-level-section1-comp">
                  <SpanLabel {...props.spanLabel} data="Lock Date" />
                  <div
                    className="date-pcker-field-div"
                    style={{ width: "78%", marginLeft: "1px" }}
                  >
                    <DatePicker
                      value={this.state.lock_date}
                      isOpen={this.state.isDatePickerOpen3}
                      id="lock_date"
                      onChange={this.onChangeFieldValues}
                      className="date-picker"
                      isEnablePastDates={true}
                    />
                  </div>
                </div>
              </div>
            ) : null}

            <div className="pr-col-3">
              <div className="pr-top-level-section1-comp">
                <SpanLabel {...props.spanLabel} data="Estimated Efforts" />
                <TextField
                  classNames="pr-txtfield-lg"
                  id="estimated_hrs"
                  data={this.state.estimated_hrs}
                  onChange={this.onChangeFieldValues}
                  style={textFieldStyle.textfieldSmall}
                />
              </div>
            </div>
          </div>

          <div className="pr-row">
            <div className="pr-col-6">
              <div className="pr-top-level-section1-comp">
                <SpanLabel {...props.spanLabel} data="Description" />
                <TextArea
                  id="description"
                  {...props.textArea}
                  data={this.state.description}
                  onChange={this.onChangeFieldValues}
                />
              </div>
            </div>

            <div className="pr-col-3">
              <div className="pr-top-level-section1-comp">
                <SpanLabel
                  {...props.spanLabel}
                  data="Assign PM"
                  isRequired={true}
                />

                <MultiSelect
                  id="pm_list"
                  data={this.state.PMData}
                  onChange={this.onChangeFieldValues}
                  multipleSelectedId={this.state.pm_assign}
                />
              </div>
            </div>
          </div>

          <div
            className="pr-row pr-table"
            style={{ paddingBottom: "15px", width: "unset" }}
          >
            <div
              className="pr-col-2 pr-table-cell"
              style={{ paddingRight: "0px" }}
            >
              <div className="pr-top-level-section1-comp">
                <SpanLabel {...props.spanLabel} data="Is Billable Project?" />
                <RadioButton
                  id="is_billable"
                  name="is_billable"
                  firstName="Yes"
                  secondName="No"
                  firstChecked={this.state.r1firstChecked}
                  onChange={this.onChangeFieldValues}
                />
              </div>
            </div>

            <div
              className="pr-col-2 pr-table-cell"
              style={{ paddingRight: "0px" }}
            >
              <div className="pr-top-level-section1-comp">
                <SpanLabel {...props.spanLabel} data="Task Mandatory?" />
                <RadioButton
                  id="is_task_mandate"
                  name="tsk_mand"
                  firstName="Yes"
                  secondName="No"
                  firstChecked={this.state.r2firstChecked}
                  onChange={this.onChangeFieldValues}
                />
              </div>
            </div>

            <div
              className="pr-col-2 pr-table-cell"
              style={{ paddingRight: "0px" }}
            >
              <div className="pr-top-level-section1-comp">
                <SpanLabel {...props.spanLabel} data="Sprint Mandatory?" />
                <RadioButton
                  id="is_sprint_mandate"
                  name="is_sprint_mandate"
                  firstName="Yes"
                  secondName="No"
                  firstChecked={this.state.r3firstChecked}
                  onChange={this.onChangeFieldValues}
                />
              </div>
            </div>

            <div
              className="pr-col-3 pr-table-cell"
              style={{ paddingRight: "18px" }}
            >
              <div
                className="pr-top-level-section1-comp"
                style={{ marginTop: "-24px", textAlign: "right" }}
              >
                <Button
                  {...props.closeButton}
                  onClick={() => this.closeNewEntry(false)}
                  className="button-cancel"
                />
                <Button
                  {...props.submitButton}
                  onClick={this.submitNewEntry}
                  className="button-submitEntry"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const { component, data, client } = state;
  const id = ownProps.id;
  return {
    componentState: component.get(id, Map()),
    appState: data.getIn([id, "apiData"], Map()),
    clientState: client.getIn([id, "apiData"], Map()),
    editState: component.get(PROJECTS_MODULE_ID, Map()),
    entryDataState: data.getIn([PROJECTS_MODULE_ID_2, "apiData"], null),
    teamsDataState: data.getIn([PROJECTS_MODULE_ID_3, "apiData"], null)
  };
}

export default connect(
  mapStateToProps,
  {
    clearComponentState,
    updateComponentState,
    deleteComponentState,
    updateData,
    requestData,
    clearData,
    requestClients,
    fetchAllProjects
  }
)(NewProject);
