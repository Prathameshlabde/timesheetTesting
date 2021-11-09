import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Map } from "immutable";
import {
  clearComponentState,
  updateComponentState,
} from "../../../../actions/component.actions.js";

import {
  TASKS_NEW_ENTRY,
  TASKS_EDIT_ENTRY_ID,
  TASKS_MODULE_ID,
  UPDATE_TASKS_MODULE,
  TASKS_NEW_ENTRY_ID,
  APP_TITLE_SUBTITLE,
  TITLE_SUBTITLE_ID,
  DEFAULT_OPTION,
  NO_RECORDS_FOUND,
} from "../../../../constants/app.constants.js";

import { TASK_DIALOG_MSG } from "../../../../constants/dialog.constants";

import "../../Dashboard/dashboard.css";
import "../../pageContent.css";

import NewTask from "./NewTask";
import tasks_module_json from "../../../json/projects/tasks_module_table.json";
import { dataAbstraction } from "../../../utils/dataAbstraction.utils.js";
import Icon from "../../../widgets/Icon.js";
import Overlay from "../../../widgets/Overlay/OverLay.js";
import TableView from "../../../widgets/TableView/TableView.js";
import Snackbar from "../../../widgets/Snackbar";
import DiaglogBox from "../../../widgets/AlertBox.js";
import DropdownList from "../../../widgets/DropdownList";

import { fetchAllTasks } from "../../../../actions/tasks.actions.js";
import { fetchTasksFromUtils, deleteTask } from "./tasksModule.utils.js";
import { deleteData } from "../../../../actions/data.actions.js";
import { getPageCount } from "../Projects.utils";
import SearchModule from "../../../widgets/SearchModule";
import { fetchProjects } from "../../../../actions/projects.actions";
import { fetchProjectFromUtils } from "../Projects.utils.js";

class TasksModule extends Component {
  static propTypes = {
    id: PropTypes.string,
    componentState: PropTypes.object.isRequired,
    updateComponentState: PropTypes.func.isRequired,
  };

  state = {
    showdeleteDialog: false,
    dataLimit: 10,
    dataOffset: 0,
    totalRowsCount: 0,
    currentPage: 1,
    searchParameterKey: "",
    snackIsOpen: false,
    snackMessage: "",
    sort: false,
    fieldNameToSort: "",
    projectData: "",
    selectedProjectId: "",
  };

  componentWillMount() {
    const { updateComponentState, id, fetchProjects } = this.props;
    let titleSub = {
      title: "Projects",
      subtitle: "Task",
    };
    updateComponentState(TITLE_SUBTITLE_ID, APP_TITLE_SUBTITLE, titleSub);
    const { dataLimit, dataOffset, searchParameterKey } = this.state;
    fetchTasksFromUtils(this.props, dataLimit, dataOffset, searchParameterKey);
    fetchProjectFromUtils({ id, fetchProjects });
  }

  componentWillReceiveProps(nextProps) {
    const { tasksDataState, projectsDataState } = nextProps;

    if (nextProps.projectsDataState !== this.props.projectsDataState) {
      if (projectsDataState && projectsDataState.apiData) {
        this.setState({
          projectData: projectsDataState.apiData,
        });
      }
    }

    if (this.props.tasksDataState !== nextProps.tasksDataState) {
      if (tasksDataState && tasksDataState.apiData) {
        const taskDashBoard = dataAbstraction(
          tasksDataState.apiData.filteredData,
          tasks_module_json
        );
        this.setState({
          taskDashBoardData: taskDashBoard,
          totalRowsCount: parseInt(tasksDataState.apiData.totalCount, 10),
          dataErrorMsg: "",
        });
      } else {
        this.setState({
          dataErrorMsg: NO_RECORDS_FOUND,
        });
      }
    }
  }

  componentWillUnmount() {
    const { updateComponentState } = this.props;
    updateComponentState(TASKS_MODULE_ID, TASKS_NEW_ENTRY, false);
  }

  showNewEntry = () => {
    const { updateComponentState } = this.props;
    updateComponentState(TASKS_MODULE_ID, TASKS_NEW_ENTRY, true);
  };

  onclickEdit = (idToEdit) => {
    const { updateComponentState } = this.props;
    updateComponentState(TASKS_MODULE_ID, TASKS_NEW_ENTRY, true);
    updateComponentState(TASKS_MODULE_ID, TASKS_EDIT_ENTRY_ID, idToEdit);
  };

  onclickDelete = (idToDelete) => {
    this.setState({
      showdeleteDialog: true,
      idToDelete: idToDelete,
    });
  };

  onClickcancelToDialog = () => {
    this.setState({
      showdeleteDialog: false,
    });
  };

  onClickOkToDialog = (idToDelete) => {
    const { dataLimit, dataOffset, searchParameterKey } = this.state;
    deleteTask(
      idToDelete,
      this.props,
      dataLimit,
      dataOffset,
      searchParameterKey
    ).then((response) => {
      if (response === true) {
        this.setState(
          {
            snackIsOpen: true,
            snackMessage: TASK_DIALOG_MSG.detele.success,
            taskDashBoardData: "",
          },
          () => {
            this.fetchAllTask();
          }
        );
      } else {
        this.setState({
          snackIsOpen: true,
          snackMessage: TASK_DIALOG_MSG.detele.fail,
        });
      }
    });

    this.setState({
      showdeleteDialog: false,
      idToDelete: null,
    });
  };
  onChangeFieldValues = (id, updatedValue, updatedValue1, updatedValue2) => {
    // console.log("id :-", id, "updatedValue :-", updatedValue, "updatedValue1 ;-", updatedValue1, "updatedValue2 :-", updatedValue2)
    let idTosearch = "";
    if (updatedValue === DEFAULT_OPTION) {
      idTosearch = "";
    } else {
      idTosearch = updatedValue;
    }

    this.setState(
      {
        searchParameterKey: "",
        selectedProjectId: idTosearch,
        taskDashBoardData: "",
        dataLimit: 10,
        dataOffset: 0,
        totalRowsCount: 0,
        currentPage: 1,
      },
      () => {
        this.fetchAllTask();
      }
    );
  };

  onPageChangePagination = (selectedNumber) => {
    // console.log("selected page number is:-", selectedNumber);
    let tempNumber = selectedNumber - 1;

    this.setState(
      {
        dataOffset: tempNumber * this.state.dataLimit,
        currentPage: selectedNumber,
      },
      () => {
        this.fetchAllTask();
      }
    );
  };

  onSearchSubmit() {
    this.setState(
      {
        taskDashBoardData: "",
        dataLimit: 10,
        dataOffset: 0,
        totalRowsCount: 0,
        currentPage: 1,
      },
      () => {
        this.fetchAllTask();
      }
    );
  }

  textFieldSubmit(id, updatedValue) {
    // console.log("updatedValue is:-", id, "Value :-", updatedValue);
    this.setState({
      searchParameterKey: updatedValue,
    });
  }

  onSearchCancel() {
    this.setState(
      {
        searchParameterKey: "",
        dataLimit: 10,
        dataOffset: 0,
        totalRowsCount: 0,
        currentPage: 1,
      },
      () => {
        this.fetchAllTask();
      }
    );
  }

  onSnackClose() {
    this.setState({
      snackIsOpen: false,
    });
  }

  onSort(sortBy, sortType) {
    this.setState(
      {
        taskDashBoardData: "",
        dataLimit: 10,
        dataOffset: 0,
        totalRowsCount: 0,
        currentPage: 1,
        sortBy,
        sortType,
      },
      () => {
        this.fetchAllTask();
      }
    );
  }
  sortData(sortBy) {
    const { sort, fieldNameToSort } = this.state;

    if (sortBy !== fieldNameToSort) {
      this.setState(
        {
          sort: false,
        },
        () => {
          if (this.state.sort === true) {
            this.setState(
              {
                sort: false,
                fieldNameToSort: sortBy,
              },
              () => {
                this.onSort(sortBy, "asc");
              }
            );
          } else {
            this.setState(
              {
                sort: true,
                fieldNameToSort: sortBy,
              },
              () => {
                this.onSort(sortBy, "desc");
              }
            );
          }
        }
      );
    } else {
      if (sort === true) {
        this.setState(
          {
            sort: false,
            fieldNameToSort: sortBy,
          },
          () => {
            this.onSort(sortBy, "asc");
          }
        );
      } else {
        this.setState(
          {
            sort: true,
            fieldNameToSort: sortBy,
          },
          () => {
            this.onSort(sortBy, "desc");
          }
        );
      }
    }
  }

  fetchAllTask() {
    const {
      dataLimit,
      dataOffset,
      searchParameterKey,
      selectedProjectId,
      sortBy,
      sortType,
    } = this.state;
    fetchTasksFromUtils(
      this.props,
      dataLimit,
      dataOffset,
      searchParameterKey,
      sortBy,
      sortType,
      selectedProjectId
    );
  }

  render() {
    const { tasksModuleState } = this.props;
    const isNewAddition = tasksModuleState.get(TASKS_NEW_ENTRY, false);

    const { currentPage } = this.state;
    let paginationObject = {
      totalPage: getPageCount(this.state.totalRowsCount, this.state.dataLimit),
      currentPage: currentPage,
      maxNumbersOnLeftRight: 4,
      onChange: this.onPageChangePagination,
    };

    const {
      dataLimit,
      dataOffset,
      searchParameterKey,
      selectedProjectId,
      sortBy,
      sortType,
    } = this.state;
    const objLimitOfseTONewEntry = {
      dataLimit,
      dataOffset,
      searchParameterKey,
      sortBy,
      sortType,
      searchedProjectId: selectedProjectId,
    };

    return (
      <div className="page-content-form">
        {isNewAddition === true ? (
          <Overlay
            subComponent={
              <NewTask
                id={TASKS_NEW_ENTRY_ID}
                dataOffset={objLimitOfseTONewEntry}
              />
            }
          />
        ) : null}
        <div className="page-content-dashboard" id={this.props.id}>
          <DiaglogBox
            open={this.state.showdeleteDialog}
            title="Alert"
            onCancel={this.onClickcancelToDialog}
            onConfirm={() => this.onClickOkToDialog(this.state.idToDelete)}
            button1={"Cancel"}
            button2={"Ok"}
            alertMsg="Are you sure you want to delete?"
          />
          <Snackbar
            snackIsOpen={this.state.snackIsOpen}
            snackMessage={this.state.snackMessage}
            onSnackClose={() => this.onSnackClose()}
          />
          <div className="dashboard-section2">
            <div className="dashboard-section2-left">
              <SearchModule
                id="searchModule"
                onSubmit={() => this.onSearchSubmit()}
                onTextChange={(e, f) => this.textFieldSubmit(e, f)}
                onCancel={() => this.onSearchCancel()}
                data={this.state.searchParameterKey}
              />
              <div className="prject-filter">
                <DropdownList
                  id="project_id"
                  dropDownData={this.state.projectData}
                  onChange={this.onChangeFieldValues}
                  defaultOption="Select Project"
                />
              </div>
            </div>
            <div className="dashboard-section2-right">
              <Icon
                icon="add_box"
                title="New Task"
                onClick={() => this.showNewEntry(true)}
              />
            </div>
          </div>
          <div className="dashboard-section4">
            {this.state.taskDashBoardData ? (
              <TableView
                {...this.state.taskDashBoardData}
                onclickEdt={(e) => this.onclickEdit(e)}
                onClickDel={(e) => this.onclickDelete(e)}
                paginationData={paginationObject}
                sortData={(e) => this.sortData(e)}
                sortFlag={this.state.sort}
                fieldNameToSort={this.state.fieldNameToSort}
                totalRowCount={this.state.totalRowsCount}
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
  const { component, tasks, projects } = state;
  const id = ownProps.id;

  return {
    componentState: state.component.get(ownProps.id, Map()),
    projectsDataState: projects.getIn([id, "apiData"], null),
    updateDashboardState: component.get(UPDATE_TASKS_MODULE, Map()),
    tasksModuleState: component.get(TASKS_MODULE_ID, Map()),
    tasksDataState: tasks.getIn([TASKS_MODULE_ID, "apiData"], null),
  };
}

export default connect(
  mapStateToProps,
  {
    clearComponentState,
    updateComponentState,
    fetchAllTasks,
    deleteData,
    fetchProjects,
  }
)(TasksModule);
