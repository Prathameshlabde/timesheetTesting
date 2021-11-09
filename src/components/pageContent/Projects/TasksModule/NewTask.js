import React, { Component } from "react";
import { connect } from "react-redux";
import { Map } from "immutable";
import {
  clearComponentState,
  updateComponentState,
  deleteComponentState
} from "../../../../actions/component.actions";
import { fetchSprints } from "../../../../actions/sprints.actions";
import {
  updateData,
  requestData,
  clearData
} from "../../../../actions/data.actions";
import {
  UPDATE_TASKS_MODULE,
  TASKS_MODULE_SHOULD_UPDATE,
  TASKS_EDIT_ENTRY_ID,
  TASKS_MODULE_ID,
  TASKS_MODULE_ID_2,
  SNACKBAR_ID,
  SNACKBAR_SHOW,
  DEFAULT_OPTION
} from "../../../../constants/app.constants";
import {
  fetchSprintsAndTasksList,
  getPropsDatePicker,
  getPropsButtonClose,
  getPropsButtonSubmit,
  getPropsTextArea,
  getPropsspanLabel,
  getPropsDropdown,
  getPropsMultipleDropdown,
  addNewTask,
  updateTask,
  fetchCategoriesFromUtils,
  fetchEntryDataFromUtils
} from "./tasksModule.utils";
import { fetchCategories } from "../../../../actions/categories.actions";
import { fetchProjects } from "../../../../actions/projects.actions";
import { TASK_DIALOG_MSG } from "../../../../constants/dialog.constants";
import { fetchProjectFromUtils } from "../Projects.utils.js";
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
import { fetchAllTasks } from "../../../../actions/tasks.actions.js";
import moment from "moment";

class NewTask extends Component {
  constructor(props) {
    super(props);
    let todaysDate = dateFormatter(moment(), "yyyy-MM-dd");
    this.state = {
      start_date: todaysDate,
      end_date: todaysDate,
      category_id: "",
      task_title: "",
      short_description: "",
      estimated_hours: "",
      task_refno: "",
      task_status: "open",
      project_id: "",
      sprint_id: "",
      is_billable: "0",
      categoryData: [],
      sprintsData: "",
      isDatePickerOpen: false,
      task_status_bool: true,
      validationMsg: "",
      isEditEntry: false,
      snackIsOpen: false,
      snackMessage: "",
      isToFormClose: true
    };
  }

  componentWillMount() {
    const { updateComponentState } = this.props;
    updateComponentState(UPDATE_TASKS_MODULE, TASKS_MODULE_SHOULD_UPDATE, "NO");

    const { editState } = this.props;
    const entryID = editState.get(TASKS_EDIT_ENTRY_ID, "");

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
    const {
      entryDataState,
      categoryState,
      projectsDataState,
      sprintsDataState
    } = nextProps;

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

    if (nextProps.sprintsDataState !== this.props.sprintsDataState) {
      if (sprintsDataState && sprintsDataState.apiData) {
        this.setState({
          sprintsData: sprintsDataState.apiData
        });
      }
    }

    const entryID = editState.get(TASKS_EDIT_ENTRY_ID, "");
    if (entryID) {
      if (nextProps.entryDataState !== this.props.entryDataState) {
        if (entryDataState) {
          this.setState(
            {
              sprint_id: entryDataState.apiData.sprint_id,
              category_id: entryDataState.apiData.category_id,
              task_title: entryDataState.apiData.task_title,
              short_description: entryDataState.apiData.short_desc,
              estimated_hours: entryDataState.apiData.estimated_hours,

              start_date: moment(entryDataState.apiData.task_start_date),
              end_date: moment(entryDataState.apiData.task_end_date),

              task_refno: entryDataState.apiData.task_ref_no,
              task_status: entryDataState.apiData.task_status,
              project_id: entryDataState.apiData.task_project_id,
              is_billable: entryDataState.apiData.is_billable,
              isDatePickerOpen: false,
              isEditEntry: true
            },
            () => {
              if (this.state.task_status === "open") {
                this.setState({
                  task_status_bool: true
                });
              } else {
                this.setState({
                  task_status_bool: false
                });
              }
            }
          );
        }
      }
    }
  }

  componentWillUpdate(nextProps, nextStates) {
    if (nextStates.project_id !== this.state.project_id) {
      if (nextStates.project_id !== DEFAULT_OPTION) {
        this.setState(
          {
            sprintsData: ""
          },
          () => {
            fetchSprintsAndTasksList(nextStates.project_id, this.props);
          }
        );
      } else {
        this.setState({
          sprintsData: ""
        });
      }
    }
  }

  submitNewEntry = () => {
    const {
      task_title,
      task_refno,
      project_id,
      start_date,
      end_date
    } = this.state;
    const { editState, dataOffset, updateComponentState } = this.props;
    const entryID = editState.get(TASKS_EDIT_ENTRY_ID, "");

    if (task_title === "") {
      this.setState({
        validationMsg: "Please enter title."
      });
    } else if (moment(start_date) > moment(end_date)) {
      this.setState({
        validationMsg: "Please select date properly."
      });
    } else if (task_refno === "") {
      this.setState({
        validationMsg: "Please enter reference number."
      });
    } else if (project_id === "") {
      this.setState({
        validationMsg: "Please select project."
      });
    } else {
      if (entryID) {
        updateTask(entryID, this.props, this.state, dataOffset).then(
          response => {
            if (response === true) {
              this.setState(
                {
                  isToFormClose: true
                },
                () => {
                  updateComponentState(SNACKBAR_ID, SNACKBAR_SHOW, {
                    showSnackBar: true,
                    snackMessage: TASK_DIALOG_MSG.update.success
                  });
                  this.updateStateAndRedux();
                }
              );
            } else if (response === "duplicate") {
              this.setState({
                validationMsg: TASK_DIALOG_MSG.duplicate,
                isToFormClose: false
              });
            } else {
              this.setState({
                snackIsOpen: true,
                snackMessage: TASK_DIALOG_MSG.update.fail,
                isToFormClose: false
              });
            }
          }
        );
      } else {
        addNewTask(this.props, this.state, dataOffset).then(response => {
          if (response === true) {
            this.setState(
              {
                isToFormClose: true
              },
              () => {
                updateComponentState(SNACKBAR_ID, SNACKBAR_SHOW, {
                  showSnackBar: true,
                  snackMessage: TASK_DIALOG_MSG.add.success
                });
                this.updateStateAndRedux();
              }
            );
          } else if (response === "duplicate") {
            this.setState({
              validationMsg: TASK_DIALOG_MSG.duplicate,
              isToFormClose: false
            });
          } else {
            this.setState({
              snackIsOpen: true,
              snackMessage: TASK_DIALOG_MSG.add.fail,
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
        UPDATE_TASKS_MODULE,
        TASKS_MODULE_SHOULD_UPDATE,
        "YES"
      );

      this.closeNewEntry(false);
    }
  }

  onChangeFieldValues = (id, updatedValue, updatedValue1, updatedValue2) => {
    if (id === "start_date") {
      this.setState({
        isDatePickerOpen1: false
      });
    } else {
      this.setState({
        isDatePickerOpen2: false
      });
    }

    if (id === "pro_id" || id === "task_id") {
      this.setState({
        pro_id: updatedValue
      });
      if (updatedValue1 && updatedValue1 === "1") {
        this.setState({
          is_billable: "1"
        });
      } else {
        this.setState({
          is_billable: "0"
        });
      }
    } else if (id === "sprint_id") {
      this.setState({
        sprint_id: updatedValue
      });
    } else if (id === "task_status") {
      if (updatedValue === "1") {
        this.setState({
          task_status: "open",
          task_status_bool: true
        });
      } else {
        this.setState({
          task_status: "close",
          task_status_bool: false
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
      start_date: "",
      end_date: "",
      category_id: "",
      sprint_id: "",
      task_title: "",
      short_description: "",
      estimated_hours: "",
      task_refno: "",
      task_status: "",
      project_id: "",
      is_billable: "0",
      isDatePickerOpen: false,
      task_status_bool: true
    });
    const { deleteComponentState } = this.props;
    deleteComponentState(TASKS_MODULE_ID);
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
              <span>Edit Task</span>
            ) : (
                <span>New Task</span>
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
                  id="task_title"
                  data={this.state.task_title}
                  onChange={this.onChangeFieldValues}
                  classNames="pr-txtfield-lg"
                  style={{ width: "92%" }}
                // style={textFieldStyle.textfieldSmall}
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
                  id="task_refno"
                  data={this.state.task_refno}
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
                  isRequired={true}
                  data="Project"
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
                <SpanLabel {...props.spanLabel} data="Sprint" />
                <DropdownList
                  id="sprint_id"
                  {...props.dropDown}
                  dropDownData={this.state.sprintsData}
                  onChange={this.onChangeFieldValues}
                  defaultOption="Select Sprint"
                  selectedID={this.state.sprint_id}
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
              <div className="pr-top-level-section1-comp">
                <SpanLabel {...props.spanLabel} data="Status" />
                <RadioButton
                  id="task_status"
                  name="task_status"
                  firstName="Open"
                  secondName="Close"
                  firstChecked={this.state.task_status_bool}
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
            </div>
          </div>
          <div className="pr-row">
            <div className="pr-col-6" />
            <div className="pr-col-3">
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
  const { component, sprints, data, categories, projects } = state;
  const id = ownProps.id;
  // console.log("id in mapto states :-", id);
  return {
    componentState: component.get(id, Map()),

    projectsDataState: projects.getIn([id, "apiData"], null),
    sprintsDataState: sprints.getIn([id, "apiData"], null),
    categoryState: categories.getIn([id, "apiData"], Map()),
    editState: component.get(TASKS_MODULE_ID, Map()),
    entryDataState: data.getIn([TASKS_MODULE_ID_2, "apiData"], null)
  };
}

export default connect(
  mapStateToProps,
  {
    clearComponentState,
    updateComponentState,
    deleteComponentState,
    updateData,
    fetchSprints,
    requestData,
    clearData,
    fetchCategories,
    fetchProjects,
    fetchAllTasks
  }
)(NewTask);
