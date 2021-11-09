import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Map } from "immutable";
import {
  clearComponentState,
  updateComponentState
} from "../../../../actions/component.actions.js";
import {
  updateData,
  requestData,
  deleteData
} from "../../../../actions/data.actions";

import {
  activeSwitch,
  inActiveSwitch
} from "../../../../actions/projects.actions";

import {
  APP_TITLE_SUBTITLE,
  TITLE_SUBTITLE_ID,
  TEAMS_ID,
  TEAMS_MODULE_ID,
  ADD_NEW_TECHNOLOGY,
  EDIT_TECHNOLOGY,
  NO_RECORDS_FOUND,
  SUBMIT,
  UPDATE
} from "../../../../constants/app.constants";
import {
  fetchTechnologies,
  fetchSingleTechnologyDataFromUtils,
  addNewTechnology,
  updateTechnology
} from "./technologies.utils";
import { TECHNOLOGIES_DIALOG_MSG } from "../../../../constants/dialog.constants";
import { getDataFromCookie } from "../../../utils/CheckLoginDetails";
import { dataAbstraction } from "../../../utils/dataAbstraction.utils";
import Snackbar from "../../../widgets/Snackbar";
import SpanLabel from "../../../widgets/SpanLabel";
import TextField from "../../../widgets/TextField";
import Button from "../../../widgets/Button";
import TableView from "../../../widgets/TableView/TableView";
import "../../pageContent.css";
import "../../Dashboard/dashboard.css";
import technologies_module_table from "../../../json/projects/technologies_module_table.json";

class TechnologiesModule extends Component {
  static propTypes = {
    id: PropTypes.string,
    componentState: PropTypes.object.isRequired,
    updateComponentState: PropTypes.func.isRequired
  };

  state = {
    headText: ADD_NEW_TECHNOLOGY,
    subMenuTitle: ADD_NEW_TECHNOLOGY,
    name: "",
    buttonText: SUBMIT,
    isEdit: false,
    idToEdit: "",
    validationMessage: "",
    snackIsOpen: false,
    snackMessage: "",
    LoggedInUser: ""
  };

  componentWillMount() {
    let LoggedInUserFromRedux = "employee";
    if (getDataFromCookie().role) {
      LoggedInUserFromRedux = getDataFromCookie().role; //from redux state
    }
    this.setState({
      LoggedInUser: LoggedInUserFromRedux
    });

    const { requestData, updateComponentState } = this.props;
    let titleSub = {
      title: "Technologies",
      subtitle: ""
    };
    updateComponentState(TITLE_SUBTITLE_ID, APP_TITLE_SUBTITLE, titleSub);
    fetchTechnologies({ requestData, updateComponentState }, this.state.name);
  }

  componentWillUnmount() {}

  componentWillReceiveProps(nextProps) {
    const { technologiesData, editState } = nextProps;

    if (technologiesData !== this.props.technologiesData) {
      if (
        technologiesData &&
        technologiesData.apiData &&
        technologiesData.apiData !== true &&
        technologiesData.apiData !== "duplicate"
      ) {
        this.setState({
          technologiesTableData: dataAbstraction(
            technologiesData.apiData,
            technologies_module_table
          ),
          totalRowsCount: parseInt(technologiesData.apiData.totalCount, 10),
          name: "",
          buttonText: SUBMIT,
          isEdit: false,
          idToEdit: "",
          subMenuTitle: ADD_NEW_TECHNOLOGY,
          dataErrorMsg: ""
        });
      } else {
        this.setState({
          dataErrorMsg: NO_RECORDS_FOUND
        });
      }
    }

    if (editState !== this.props.editState && editState && editState.apiData) {
      let data = editState.apiData[0];
      // console.log("data editState = ", data);
      this.setState({
        name: data.name,
        status_flag: data.status_flag,
        isEdit: true,
        buttonText: UPDATE,
        subMenuTitle: EDIT_TECHNOLOGY
      });
    }
  }

  onclickEdit = idToEdit => {
    // console.log("idToEdit = ", idToEdit);

    this.setState({
      idToEdit: idToEdit,
      headText: EDIT_TECHNOLOGY,
      validationMessage: ""
    });
    const { requestData, updateComponentState } = this.props;
    fetchSingleTechnologyDataFromUtils(
      { requestData, updateComponentState },
      idToEdit
    );
  };

  onChangeFieldValues = (id, updatedValue, updatedValue2, updatedValue3) => {
    // console.log("id == ", id);
    // console.log("updatedValue == ", updatedValue);
    // console.log("updatedValue2 == ", updatedValue2);
    // console.log("updatedValue3 == ", updatedValue3);

    this.setState({
      [id]: updatedValue
    });
  };

  onClickSearch = () => {
    const { id, requestData, updateComponentState } = this.props;
    fetchTechnologies(
      { id, requestData, updateComponentState },
      this.state.name
    );
  };

  submitNewEntry = () => {
    const { name, isEdit } = this.state;
    const { id, requestData, updateComponentState } = this.props;

    if (name === "") {
      this.setState({
        validationMessage: TECHNOLOGIES_DIALOG_MSG.validation
      });
    } else if (name.length > 60) {
      this.setState({
        validationMessage: TECHNOLOGIES_DIALOG_MSG.validation_char_limit
      });
    } else {
      if (isEdit === false) {
        addNewTechnology(
          { id, requestData, updateComponentState },
          this.state.name
        ).then(response => {
          this.setState(
            {
              snackIsOpen: true
            },
            () => {
              if (response === true) {
                this.setState({
                  snackMessage: TECHNOLOGIES_DIALOG_MSG.add.success
                });
              } else if (response === "duplicate") {
                this.setState({
                  snackMessage: TECHNOLOGIES_DIALOG_MSG.duplicate
                });
              } else {
                this.setState({
                  snackMessage: TECHNOLOGIES_DIALOG_MSG.add.fail
                });
              }
            }
          );
        });
      } else {
        const { idToEdit, name, status_flag } = this.state;
        updateTechnology(
          { id, requestData, updateComponentState },
          { idToEdit, name, status_flag }
        ).then(response => {
          this.setState(
            {
              snackIsOpen: true
            },
            () => {
              if (response === true) {
                this.setState({
                  snackMessage: TECHNOLOGIES_DIALOG_MSG.update.success,
                  headText: ADD_NEW_TECHNOLOGY
                });
              } else if (response === "duplicate") {
                this.setState({
                  snackMessage: TECHNOLOGIES_DIALOG_MSG.duplicate
                });
              } else {
                this.setState({
                  snackMessage: TECHNOLOGIES_DIALOG_MSG.update.fail
                });
              }
            }
          );
        });
      }
      this.setState({
        validationMessage: ""
      });
    }
  };

  clearData = () => {
    this.setState({
      name: "",
      buttonText: SUBMIT,
      isEdit: false,
      headText: ADD_NEW_TECHNOLOGY,
      validationMessage: ""
    });
  };

  onSnackClose() {
    this.setState({
      snackIsOpen: false
    });
  }

  switchChanged = (idToEdit, currentstatus) => {
    // console.log("idToEdit switchChanged= ", idToEdit);
    // console.log("currentstatus = ", currentstatus);
    const { activeSwitch, inActiveSwitch } = this.props;
    let BodyParams = new FormData();
    BodyParams.append("type", "updateData");
    const payload = {
      tech_id: idToEdit
    };
    BodyParams.append("params", JSON.stringify(payload));
    const Params = {
      id: TEAMS_ID,
      api: {
        body: BodyParams
      }
    };
    const { requestData, updateComponentState } = this.props;
    if (currentstatus === true) {
      BodyParams.append("command", "inActiveTechnology");
      inActiveSwitch(Params).then(result => {
        if (result.response && result.response.apiData === true) {
          fetchTechnologies({ requestData, updateComponentState });
        }
      });
    } else {
      BodyParams.append("command", "activeTechnology");
      activeSwitch(Params).then(result => {
        if (result.response && result.response.apiData === true) {
          fetchTechnologies({ requestData, updateComponentState });
        }
      });
    }
  };

  render() {
    return (
      <div className="page-content-form">
        <div id={this.props.id}>
          <div
            style={{ padding: "0px 2.8% 0px", border: "unset" }}
            className="pr-container"
            id="newEntry"
          >
            <div class="pr-row" style={{ padding: "0px" }}>
              <h4>{this.state.headText}</h4>
            </div>
            <div class="pr-row" style={{ padding: "0px" }}>
              <div className="pr-col-2">
                <div>
                  <SpanLabel
                    data="Name"
                    className="span-label"
                    isRequired={true}
                  />
                  <TextField
                    id="name"
                    data={this.state.name}
                    onChange={this.onChangeFieldValues}
                    classNames="pr-txtfield-lg w-90"
                    style={{ width: "95%" }}
                  />
                </div>
              </div>
            </div>
            <div class="pr-row" style={{ padding: "0px" }}>
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
              <div className="search-field-year-left">List of Technologies</div>
            </div>
          </div>

          <div className="dashboard-section4">
            {this.state.technologiesTableData ? (
              <TableView
                {...this.state.technologiesTableData}
                onclickEdt={e => this.onclickEdit(e)}
                onClickDel={e => this.onclickDelete(e)}
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
    technologiesData: data.getIn([TEAMS_ID, "apiData"], null)
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
    inActiveSwitch
  }
)(TechnologiesModule);
