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
import {
  UPDATE_SUBTASKS_MODULE,
  SUBTASKS_MODULE_SHOULD_UPDATE,
  SUBTASKS_EDIT_ENTRY_ID,
  SUBTASKS_MODULE_ID,
  SUBTASKS_MODULE_ID_2,
  SNACKBAR_ID,
  SNACKBAR_SHOW,
  DEFAULT_OPTION
} from "../../../../constants/app.constants";
import {
  getPropsDatePicker,
  getPropsButtonClose,
  getPropsButtonSubmit,
  getPropsTextArea,
  getPropsspanLabel,
  getPropsDropdown,
  getPropsMultipleDropdown,
  fetchCategoriesFromUtils,
  fetchTasksListFromUtils,
  fetchEntryDataFromUtils,
  addNewSubTask,
  updateSubTask,
  fetchSprintList,
  fetchTasksListFromSprint
} from "./subTasksModule.utils";
import { fetchSprints } from "../../../../actions/sprints.actions";
import { SUBTASK_DIALOG_MSG } from "../../../../constants/dialog.constants";
import { fetchTasks, clearTasks } from "../../../../actions/tasks.actions";
import { fetchCategories } from "../../../../actions/categories.actions";
import { fetchProjects } from "../../../../actions/projects.actions";
import { fetchAllSubTasks } from "../../../../actions/subTasks.actions";
import Snackbar from "../../../widgets/Snackbar";
import TextField from "../../../widgets/TextField";
import DropdownList from "../../../widgets/DropdownList";
import DatePicker from "../../../widgets/DatePicker";
import Button from "../../../widgets/Button";
import TextArea from "../../../widgets/TextArea";
import SpanLabel from "../../../widgets/SpanLabel";
import Icon from "../../../widgets/Icon";
import RadioButton from "../../../widgets/RadioButton";
import "../projects.css";
import { dateFormatter } from "../../../utils/calender.utils";
import moment from "moment";
import { fetchProjectFromUtils } from "../Projects.utils.js";

class NewSubTask extends Component {
  constructor(props) {
    super(props);
    let todaysDate = dateFormatter(moment(), "yyyy-MM-dd");
    this.state = {
      category_id: "",
      task_title: "",
      short_description: "",
      estimated_hours: "",
      start_date: todaysDate,
      end_date: todaysDate,
      task_refno: "",
      task_status: "open",
      project_id: "",
      sprint_id: "",
      sprintsData: "",
      parent_task_id: "",
      is_billable: "1",
      tasksData: "",
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
    updateComponentState(
      UPDATE_SUBTASKS_MODULE,
      SUBTASKS_MODULE_SHOULD_UPDATE,
      "NO"
    );

    const { editState } = this.props;
    const entryID = editState.get(SUBTASKS_EDIT_ENTRY_ID, "");

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
    const { id, clearData, clearTasks } = this.props;
    const clearParams = {
      id
    };
    clearData(clearParams);
    clearTasks(clearParams);
    const { deleteComponentState } = this.props;
    deleteComponentState(this.props.id);
  }

  componentWillReceiveProps(nextProps) {
    const { editState } = this.props;
    const {
      entryDataState,
      projectsDataState,
      tasksDataState,
      sprintsDataState,
      categoryState
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

    if (nextProps.tasksDataState !== this.props.tasksDataState) {
      if (tasksDataState && tasksDataState.apiData) {
        this.setState({
          tasksData: tasksDataState.apiData
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

    const entryID = editState.get(SUBTASKS_EDIT_ENTRY_ID, "");
    if (entryID) {
      if (nextProps.entryDataState !== this.props.entryDataState) {
        if (entryDataState) {
          // console.log("entryDataState :-", entryDataState);
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
              parent_task_id: entryDataState.apiData.parent_task_id,
              is_billable: entryDataState.apiData.is_billable,
              // tasksData: entryDataState.apiData[0],
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

              if (this.state.sprint_id !== DEFAULT_OPTION) {
                fetchTasksListFromSprint(
                  this.state.project_id,
                  this.state.sprint_id,
                  this.props
                );
              } else {
                fetchTasksListFromSprint(
                  this.state.project_id,
                  "0",
                  this.props
                );
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
        fetchTasksListFromUtils(nextStates.project_id, this.props);
        fetchSprintList(nextStates.project_id, this.props);
      } else {
        this.setState({
          sprint_id: "",
          project_id: "",
          parent_task_id: "",
          tasksData: "",
          sprintsData: ""
        });
      }
    }

    if (nextStates.sprint_id !== this.state.sprint_id) {
      let sprint_id = "0";
      if (nextStates.sprint_id !== DEFAULT_OPTION) {
        sprint_id = nextStates.sprint_id;
        fetchTasksListFromSprint(nextStates.project_id, sprint_id, this.props);
      } else {
        this.setState(
          {
            parent_task_id: "",
            tasksData: ""
          },
          () => {
            fetchTasksListFromSprint(
              nextStates.project_id,
              sprint_id,
              this.props
            );
          }
        );
      }
    }
  }

  submitNewEntry = () => {
    const {
      task_title,
      task_refno,
      project_id,
      parent_task_id,
      start_date,
      end_date
    } = this.state;

    const { editState, dataOffset, updateComponentState } = this.props;
    const entryID = editState.get(SUBTASKS_EDIT_ENTRY_ID, "");
    if (task_title === "") {
      this.setState({
        validationMsg: "Please enter sub task title."
      });
    } else if (moment(start_date) > moment(end_date)) {
      this.setState({
        validationMsg: "Please select date properly."
      });
    } else if (task_refno === "") {
      this.setState({
        validationMsg: "Please enter the reference number."
      });
    } else if (project_id === "") {
      this.setState({
        validationMsg: "Please select project."
      });
    } else if (parent_task_id === "" || parent_task_id === DEFAULT_OPTION) {
      this.setState({
        validationMsg: "Please select Parent Task."
      });
    } else {
      if (entryID) {
        updateSubTask(entryID, this.props, this.state, dataOffset).then(
          response => {
            if (response === true) {
              this.setState(
                {
                  isToFormClose: true
                },
                () => {
                  updateComponentState(SNACKBAR_ID, SNACKBAR_SHOW, {
                    showSnackBar: true,
                    snackMessage: SUBTASK_DIALOG_MSG.update.success
                  });
                  this.updateStateAndRedux();
                }
              );

              // this.setState({
              //   snackIsOpen: true,
              //   snackMessage: SUBTASK_DIALOG_MSG.update.success,
              //   isToFormClose: true
              // });
            } else if (
              response === "titleduplicate" ||
              response === "refduplicate" ||
              response === "titlerefduplicate"
            ) {
              let dialogMessage = "Fail to call api";
              if (response === "titleduplicate") {
                dialogMessage = SUBTASK_DIALOG_MSG.duplicate.titleExist;
              } else if (response === "refduplicate") {
                dialogMessage = SUBTASK_DIALOG_MSG.duplicate.refNumber;
              } else if (response === "titlerefduplicate") {
                dialogMessage = SUBTASK_DIALOG_MSG.duplicate.bothExist;
              }
              this.setState({
                validationMsg: dialogMessage,
                isToFormClose: false
              });
            } else {
              this.setState({
                snackIsOpen: true,
                snackMessage: SUBTASK_DIALOG_MSG.update.fail,
                isToFormClose: false
              });
            }
          }
        );
      } else {
        addNewSubTask(this.props, this.state, dataOffset).then(response => {
          if (response === true) {
            this.setState(
              {
                isToFormClose: true
              },
              () => {
                updateComponentState(SNACKBAR_ID, SNACKBAR_SHOW, {
                  showSnackBar: true,
                  snackMessage: SUBTASK_DIALOG_MSG.add.success
                });
                this.updateStateAndRedux();
              }
            );
            // this.setState({
            //   snackIsOpen: true,
            //   snackMessage: SUBTASK_DIALOG_MSG.add.success,
            //   isToFormClose: true
            // });
          } else if (
            response === "titleduplicate" ||
            response === "refduplicate" ||
            response === "titlerefduplicate"
          ) {
            let dialogMessage = "Fail to call api";
            if (response === "titleduplicate") {
              dialogMessage = SUBTASK_DIALOG_MSG.duplicate.titleExist;
            } else if (response === "refduplicate") {
              dialogMessage = SUBTASK_DIALOG_MSG.duplicate.refNumber;
            } else if (response === "titlerefduplicate") {
              dialogMessage = SUBTASK_DIALOG_MSG.duplicate.bothExist;
            }

            this.setState({
              validationMsg: dialogMessage,
              isToFormClose: false
            });
          } else {
            this.setState({
              snackIsOpen: true,
              snackMessage: SUBTASK_DIALOG_MSG.add.fail,
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
        UPDATE_SUBTASKS_MODULE,
        SUBTASKS_MODULE_SHOULD_UPDATE,
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

    if (id === "project_id") {
      this.setState({
        project_id: updatedValue
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
    }
    if (id === "sprint_id") {
      this.setState(
        {
          parent_task_id: "",
          tasksData: "",
          sprint_id: updatedValue
        },
        () => {
          if (this.state.sprint_id === DEFAULT_OPTION) {
            this.setState({
              sprint_id: "0"
            });
          }
        }
      );
    } else if (id === "task_status") {
      if (updatedValue === "0") {
        this.setState({
          task_status: "close",
          task_status_bool: false
        });
      } else {
        this.setState({
          task_status: "open",
          task_status_bool: true
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
      category_id: "",
      task_title: "",
      short_description: "",
      estimated_hours: "",
      start_date: "",
      end_date: "",
      task_refno: "",
      task_status: "open",
      project_id: "",
      parent_task_id: "",
      is_billable: "1",
      tasksData: "",
      isDatePickerOpen: false,
      task_status_bool: true
    });

    const { deleteComponentState } = this.props;
    deleteComponentState(SUBTASKS_MODULE_ID);
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
              <span>Edit Subtask</span>
            ) : (
                <span>New Subtask</span>
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
                  defaultOption="Select Project:"
                  selectedID={this.state.project_id}
                />
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

            <div className="pr-col-3">
              <div className="pr-top-level-section1-comp">
                <SpanLabel
                  {...props.spanLabel}
                  data="Parent Task"
                  isRequired={true}
                />
                <DropdownList
                  id="parent_task_id"
                  {...props.dropDown}
                  dropDownData={this.state.tasksData}
                  onChange={this.onChangeFieldValues}
                  defaultOption="Select Parent Task"
                  selectedID={this.state.parent_task_id}
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

          <div className="pr-row ">
            <div className="pr-col-6">
              <div className="pr-top-level-section1-comp pr-textarea-div">
                <SpanLabel {...props.spanLabel} data="Description" />
                <TextArea
                  id="short_description"
                  {...props.textArea}
                  style={{ width: "97%" }}
                  data={this.state.short_description}
                  onChange={this.onChangeFieldValues}
                />
              </div>
            </div>
            <div className="pr-col-3">
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
            </div>
          </div>

          <div className="pr-row pr-table">
            <div className="pr-col-3 pr-table-cell">
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
  const { component, data, projects, tasks, categories, sprints } = state;
  const id = ownProps.id;
  return {
    componentState: component.get(id, Map()),
    projectsDataState: projects.getIn([id, "apiData"], null),
    tasksDataState: tasks.getIn([id, "apiData"], null),
    categoryState: categories.getIn([id, "apiData"], Map()),
    editState: component.get(SUBTASKS_MODULE_ID, Map()),
    entryDataState: data.getIn([SUBTASKS_MODULE_ID_2, "apiData"], null),
    sprintsDataState: sprints.getIn([id, "apiData"], null)
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
    clearTasks,
    fetchCategories,
    fetchProjects,
    fetchTasks,
    fetchAllSubTasks,
    fetchSprints
  }
)(NewSubTask);
