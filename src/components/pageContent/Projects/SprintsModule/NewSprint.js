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

import { fetchCategories } from "../../../../actions/categories.actions";
import { fetchProjects } from "../../../../actions/projects.actions";
import { fetchAllSprints } from "../../../../actions/sprints.actions.js";

import {
  UPDATE_SPRINTS_MODULE,
  SPRINTS_MODULE_SHOULD_UPDATE,
  SPRINTS_EDIT_ENTRY_ID,
  SPRINTS_MODULE_ID,
  SPRINTS_MODULE_ID_2,
  SNACKBAR_ID,
  SNACKBAR_SHOW
} from "../../../../constants/app.constants";
import { SPRINT_DIALOG_MSG } from "../../../../constants/dialog.constants";

import {
  getPropsDatePicker,
  getPropsButtonClose,
  getPropsButtonSubmit,
  getPropsTextArea,
  getPropsspanLabel,
  getPropsDropdown,
  getPropsMultipleDropdown,
  fetchEntryDataFromUtils,
  fetchCategoriesFromUtils,
  addNewSprint,
  updateSprint
} from "./sprintsModule.utils";

import TextField from "../../../widgets/TextField";
import DropdownList from "../../../widgets/DropdownList";
import DatePicker from "../../../widgets/DatePicker";
import Button from "../../../widgets/Button";
import TextArea from "../../../widgets/TextArea";
import SpanLabel from "../../../widgets/SpanLabel";
import Icon from "../../../widgets/Icon";
import RadioButton from "../../../widgets/RadioButton";
import Snackbar from "../../../widgets/Snackbar";
import "../projects.css";
import { dateFormatter } from "../../../utils/calender.utils";
import moment from "moment";
import { fetchProjectFromUtils } from "../Projects.utils.js";

class NewSprint extends Component {
  constructor(props) {
    super(props);
    let todaysDate = dateFormatter(moment(), "yyyy-MM-dd");
    this.state = {
      sprint_title: "",
      short_description: "",
      estimated_hours: "",
      start_date: todaysDate,
      end_date: todaysDate,
      sprint_refno: "",
      sprint_status: "open",
      project_id: "",
      category_id: "",
      validationMsg: "",
      sprint_status_bool: true,
      isEditEntry: false,
      snackIsOpen: false,
      snackMessage: "",
      isToFormClose: true
    };
  }

  componentWillMount() {
    const { updateComponentState } = this.props;
    updateComponentState(
      UPDATE_SPRINTS_MODULE,
      SPRINTS_MODULE_SHOULD_UPDATE,
      "NO"
    );

    const { editState } = this.props;
    const entryID = editState.get(SPRINTS_EDIT_ENTRY_ID, "");
    // console.log("editState in componentWillMount = ", editState);
    // console.log("entryID in componentWillMount = ", entryID);
    if (entryID) {
      fetchProjectFromUtils(this.props);
      fetchCategoriesFromUtils(this.props);
      fetchEntryDataFromUtils(entryID, this.props);
    } else {
      fetchProjectFromUtils(this.props);
      fetchCategoriesFromUtils(this.props);
    }
  }

  componentWillUnmount() {
    const { id, clearData } = this.props;
    const clearParams = {
      id
    };
    clearData(clearParams);

    const { deleteComponentState } = this.props;
    deleteComponentState(this.props.id);
  }

  componentWillReceiveProps(nextProps) {
    const { editState } = this.props;
    const { entryDataState, categoryState, projectsDataState } = nextProps;

    if (nextProps.projectsDataState !== this.props.projectsDataState) {
      if (projectsDataState && projectsDataState.apiData) {
        this.setState({
          projectData: projectsDataState.apiData
        });
      }
    }

    if (nextProps.categoryState !== this.props.categoryState) {
      if (categoryState && categoryState.apiData) {
        this.setState({
          categoryData: categoryState.apiData
        });
      }
    }

    const entryID = editState.get(SPRINTS_EDIT_ENTRY_ID, "");
    if (entryID) {
      if (nextProps.entryDataState !== this.props.entryDataState) {
        if (entryDataState) {
          this.setState(
            {
              category_id: entryDataState.apiData.category_id,
              sprint_title: entryDataState.apiData.sprint_title,
              short_description: entryDataState.apiData.short_desc,
              estimated_hours: entryDataState.apiData.estimated_hours,
              start_date: moment(entryDataState.apiData.sprint_start_date),
              end_date: moment(entryDataState.apiData.sprint_end_date),
              sprint_refno: entryDataState.apiData.sprint_ref_no,
              sprint_status: entryDataState.apiData.sprint_status,
              project_id: entryDataState.apiData.sprint_project_id,
              isDatePickerOpen: false,
              isEditEntry: true
            },
            () => {
              if (this.state.sprint_status === "open") {
                this.setState({
                  sprint_status_bool: true
                });
              } else {
                this.setState({
                  sprint_status_bool: false
                });
              }
            }
          );
        }
      }
    }
  }

  submitNewEntry = () => {
    const {
      sprint_title,
      sprint_refno,
      project_id,
      start_date,
      end_date
    } = this.state;
    const { editState, dataOffset, updateComponentState } = this.props;

    const entryID = editState.get(SPRINTS_EDIT_ENTRY_ID, "");

    if (sprint_title === "") {
      this.setState({
        validationMsg: "Please enter sprint name."
      });
    } else if (moment(start_date) > moment(end_date)) {
      this.setState({
        validationMsg: "Please select date properly."
      });
    } else if (sprint_refno === "") {
      this.setState({
        validationMsg: "Please enter sprint reference number."
      });
    } else if (project_id === "") {
      this.setState({
        validationMsg: "Please select project."
      });
    } else {
      if (entryID) {
        updateSprint(entryID, this.props, this.state, dataOffset).then(
          response => {
            if (response === true) {
              this.setState(
                {
                  isToFormClose: true
                },
                () => {
                  updateComponentState(SNACKBAR_ID, SNACKBAR_SHOW, {
                    showSnackBar: true,
                    snackMessage: SPRINT_DIALOG_MSG.update.success
                  });
                  this.updateStateAndRedux();
                }
              );

              // this.setState({
              //   snackIsOpen: true,
              //   snackMessage: SPRINT_DIALOG_MSG.update.success,
              //   isToFormClose: true
              // });
            } else if (response === "duplicate") {
              this.setState({
                validationMsg: SPRINT_DIALOG_MSG.duplicate,
                isToFormClose: false
              });
            } else {
              this.setState({
                snackIsOpen: true,
                snackMessage: SPRINT_DIALOG_MSG.update.fail,
                isToFormClose: false
              });
            }
          }
        );
      } else {
        addNewSprint(this.props, this.state, dataOffset).then(response => {
          if (response === true) {
            this.setState(
              {
                isToFormClose: true
              },
              () => {
                updateComponentState(SNACKBAR_ID, SNACKBAR_SHOW, {
                  showSnackBar: true,
                  snackMessage: SPRINT_DIALOG_MSG.add.success
                });
                this.updateStateAndRedux();
              }
            );

            // this.setState({
            //   snackIsOpen: true,
            //   snackMessage: SPRINT_DIALOG_MSG.add.success,
            //   isToFormClose: true
            // });
          } else if (response === "duplicate") {
            this.setState({
              validationMsg: SPRINT_DIALOG_MSG.duplicate,
              isToFormClose: false
            });
          } else {
            this.setState({
              snackIsOpen: true,
              snackMessage: SPRINT_DIALOG_MSG.add.fail,
              isToFormClose: false
            });
          }
        });
      }
    }
  };

  updateStateAndRedux() {
    const { updateComponentState } = this.props;
    const { isToFormClose } = this.state;
    if (isToFormClose === true) {
      updateComponentState(
        UPDATE_SPRINTS_MODULE,
        SPRINTS_MODULE_SHOULD_UPDATE,
        "YES"
      );
      this.closeNewEntry(false);
    }
  }

  onChangeFieldValues = (id, updatedValue, updatedValue1, updatedValue2) => {
    //for Hiding date picker panel
    // this.onDatePickerIconClick(id);

    if (id === "start_date") {
      this.setState({
        isDatePickerOpen1: false
      });
    } else {
      this.setState({
        isDatePickerOpen2: false
      });
    }

    if (id === "sprint_status") {
      if (updatedValue === "0") {
        this.setState({
          sprint_status: "close",
          sprint_status_bool: false
        });
      } else {
        this.setState({
          sprint_status: "open",
          sprint_status_bool: true
        });
      }
    } else if (id === "start_date" || id === "end_date") {
      this.setState({
        [id]: updatedValue.format("YYYY-MM-DD")
      });
    } else {
      this.setState({
        [id]: updatedValue
      });
    }
  };

  onDatePickerIconClick = currentDateName => {
    if (currentDateName === "start_date") {
      this.setState({
        isDatePickerOpen1: !this.state.isDatePickerOpen1
      });
    } else {
      this.setState({
        isDatePickerOpen2: !this.state.isDatePickerOpen2
      });
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
      sprint_title: "",
      short_description: "",
      estimated_hours: "",
      start_date: "",
      end_date: "",
      sprint_refno: "",
      sprint_status: "open",
      project_id: "",
      category_id: "",

      sprint_status_bool: true,
      isDatePickerOpen: false
    });
    const { deleteComponentState } = this.props;
    deleteComponentState(SPRINTS_MODULE_ID);
  };

  onSnackClose() {
    this.setState(
      {
        snackIsOpen: false
      },
      () => {
        this.updateStateAndRedux();
      }
    );
  }

  render() {
    const props = this.getAllPropsForComponent();

    return (
      <div className="pr-inner-div pr-center">
        <div className="pr-header-level">
          <div className="pr-col-inner-div-header-left">
            {this.state.isEditEntry === true ? (
              <span>Edit Sprint</span>
            ) : (
              <span>New Sprint</span>
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
                <SpanLabel
                  {...props.spanLabel}
                  data="Title"
                  isRequired={true}
                />
                <TextField
                  id="sprint_title"
                  data={this.state.sprint_title}
                  onChange={this.onChangeFieldValues}
                  // style={textFieldStyle.textfieldSmall}
                  classNames="pr-txtfield-lg"
                  style={{ width: "92%" }}
                />
              </div>
            </div>

            <div className="pr-col-3">
              <div className="pr-top-level-section1-comp">
                <SpanLabel
                  {...props.spanLabel}
                  data="Reference No."
                  isRequired={true}
                />
                <TextField
                  id="sprint_refno"
                  data={this.state.sprint_refno}
                  onChange={this.onChangeFieldValues}
                  // style={textFieldStyle.textfieldSmall}
                  classNames="pr-txtfield-lg"
                  style={{ width: "92%" }}
                />
              </div>
            </div>

            <div className="pr-col-3">
              <div className="pr-top-level-section1-comp">
                <SpanLabel
                  {...props.spanLabel}
                  data="Project"
                  isRequired={true}
                />
                <DropdownList
                  id="project_id"
                  {...props.dropDown}
                  dropDownData={this.state.projectData}
                  onChange={this.onChangeFieldValues}
                  defaultOption="Select Project"
                  selectedID={this.state.project_id}
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

            <div className="pr-col-3">
              <div className="pr-top-level-section1-comp">
                <SpanLabel {...props.spanLabel} data="Category" />
                <DropdownList
                  id="category_id"
                  {...props.dropDown}
                  dropDownData={this.state.categoryData}
                  onChange={this.onChangeFieldValues}
                  defaultOption="Select Category"
                  selectedID={this.state.category_id}
                />
              </div>
            </div>
          </div>

          <div className="pr-row">
            <div className="pr-col-6">
              <div className="pr-top-level-section1-comp pr-textarea-div">
                <SpanLabel {...props.spanLabel} data="Description" />
                <TextArea
                  id="short_description"
                  {...props.textArea}
                  data={this.state.short_description}
                  onChange={this.onChangeFieldValues}
                />
              </div>
            </div>
            <div className="pr-col-3">
              <div className="pr-top-level-section1-comp">
                <SpanLabel {...props.spanLabel} data="Status:" />
                <RadioButton
                  id="sprint_status"
                  name="sprint_status"
                  firstName="Open"
                  secondName="Close"
                  firstChecked={this.state.sprint_status_bool}
                  onChange={this.onChangeFieldValues}
                />
              </div>
              <div className="pr-top-level-section1-comp">
                <SpanLabel {...props.spanLabel} data="Estimated Hours" />
                <TextField
                  id="estimated_hours"
                  data={this.state.estimated_hours}
                  onChange={this.onChangeFieldValues}
                  // style={textFieldStyle.textfieldSmall}
                  classNames="pr-txtfield-lg"
                  style={{ width: "92%" }}
                />
              </div>
              <div
                className="pr-top-level-section1-comp"
                style={{
                  marginTop: "15px",
                  textAlign: "right",
                  marginRight: "5px"
                }}
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
  const { component, data, projects, categories } = state;
  const id = ownProps.id;
  return {
    componentState: component.get(id, Map()),
    projectsDataState: projects.getIn([id, "apiData"], null),
    categoryState: categories.getIn([id, "apiData"], Map()),
    editState: component.get(SPRINTS_MODULE_ID, Map()),
    entryDataState: data.getIn([SPRINTS_MODULE_ID_2, "apiData"], null)
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
    fetchCategories,
    fetchProjects,
    fetchAllSprints
  }
)(NewSprint);
