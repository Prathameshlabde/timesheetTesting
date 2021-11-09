import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Map } from "immutable";
import {
  clearComponentState,
  updateComponentState,
} from "../../../../actions/component.actions.js";
import {
  fetchSubTasksFromUtils,
  deleteSubTask,
} from "./subTasksModule.utils.js";
import {
  SUBTASKS_NEW_ENTRY,
  SUBTASKS_EDIT_ENTRY_ID,
  SUBTASKS_MODULE_ID,
  UPDATE_SUBTASKS_MODULE,
  SUBTASKS_NEW_ENTRY_ID,
  APP_TITLE_SUBTITLE,
  TITLE_SUBTITLE_ID,
  DEFAULT_OPTION,
  NO_RECORDS_FOUND,
} from "../../../../constants/app.constants.js";
import { fetchProjects } from "../../../../actions/projects.actions";
import { SUBTASK_DIALOG_MSG } from "../../../../constants/dialog.constants";
import "../../Dashboard/dashboard.css";
import "../../pageContent.css";
import NewSubTask from "./NewSubTask";
import sub_tasks_module_json from "../../../json/projects/subtasks_module_table.json";
import { dataAbstraction } from "../../../utils/dataAbstraction.utils.js";
import Icon from "../../../widgets/Icon.js";
import Overlay from "../../../widgets/Overlay/OverLay.js";
import TableView from "../../../widgets/TableView/TableView.js";
import Snackbar from "../../../widgets/Snackbar";
import SearchModule from "../../../widgets/SearchModule";
import DiaglogBox from "../../../widgets/AlertBox.js";
import DropdownList from "../../../widgets/DropdownList";
import { fetchAllSubTasks } from "../../../../actions/subTasks.actions.js";
import { deleteData } from "../../../../actions/data.actions.js";
import { getPageCount } from "../Projects.utils";
import { fetchProjectFromUtils } from "../Projects.utils.js";

class SubtasksModule extends Component {
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
      subtitle: "Subtask",
    };
    updateComponentState(TITLE_SUBTITLE_ID, APP_TITLE_SUBTITLE, titleSub);

    const { dataLimit, dataOffset, searchParameterKey } = this.state;
    fetchSubTasksFromUtils(
      this.props,
      dataLimit,
      dataOffset,
      searchParameterKey
    );

    fetchProjectFromUtils({ id, fetchProjects });
  }

  componentWillReceiveProps(nextProps) {
    const { subTasksDataState, projectsDataState } = nextProps;

    if (nextProps.projectsDataState !== this.props.projectsDataState) {
      if (projectsDataState && projectsDataState.apiData) {
        this.setState({
          projectData: projectsDataState.apiData,
        });
      }
    }

    if (this.props.subTasksDataState !== nextProps.subTasksDataState) {
      if (subTasksDataState && subTasksDataState.apiData) {
        const subTaskDashBoard = dataAbstraction(
          subTasksDataState.apiData.filteredData,
          sub_tasks_module_json
        );
        this.setState({
          subTaskDashBoardData: subTaskDashBoard,
          totalRowsCount: parseInt(subTasksDataState.apiData.totalCount, 10),
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
    updateComponentState(SUBTASKS_MODULE_ID, SUBTASKS_NEW_ENTRY, false);
  }

  showNewEntry = () => {
    const { updateComponentState } = this.props;
    updateComponentState(SUBTASKS_MODULE_ID, SUBTASKS_NEW_ENTRY, true);
  };

  onclickEdit = (idToEdit) => {
    // console.log("Edit Click ID :- ", idToEdit);
    const { updateComponentState } = this.props;
    updateComponentState(SUBTASKS_MODULE_ID, SUBTASKS_NEW_ENTRY, true);
    updateComponentState(SUBTASKS_MODULE_ID, SUBTASKS_EDIT_ENTRY_ID, idToEdit);
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
    // console.log("idToDelete :-", idToDelete);

    const { dataLimit, dataOffset, searchParameterKey } = this.state;
    deleteSubTask(
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
            snackMessage: SUBTASK_DIALOG_MSG.detele.success,
            subTaskDashBoardData: "",
          },
          () => {
            this.fetchAllSubtask();
          }
        );
      } else {
        this.setState({
          snackIsOpen: true,
          snackMessage: SUBTASK_DIALOG_MSG.detele.fail,
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
        subTaskDashBoardData: "",
        dataLimit: 10,
        dataOffset: 0,
        totalRowsCount: 0,
        currentPage: 1,
      },
      () => {
        this.fetchAllSubtask();
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
        this.fetchAllSubtask();
      }
    );
  };

  onSearchSubmit() {
    this.setState(
      {
        subTaskDashBoardData: "",
        dataLimit: 10,
        dataOffset: 0,
        totalRowsCount: 0,
        currentPage: 1,
      },
      () => {
        this.fetchAllSubtask();
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
        this.fetchAllSubtask();
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
        subTaskDashBoardData: "",
        dataLimit: 10,
        dataOffset: 0,
        totalRowsCount: 0,
        currentPage: 1,
        sortBy,
        sortType,
      },
      () => {
        this.fetchAllSubtask();
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

  fetchAllSubtask() {
    const {
      dataLimit,
      dataOffset,
      searchParameterKey,
      selectedProjectId,
      sortBy,
      sortType,
    } = this.state;

    fetchSubTasksFromUtils(
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
    const { subTasksModuleState } = this.props;
    const isNewAddition = subTasksModuleState.get(SUBTASKS_NEW_ENTRY, false);

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
      sortBy,
      sortType,
      selectedProjectId,
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
              <NewSubTask
                id={SUBTASKS_NEW_ENTRY_ID}
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
                title="New Sub Task"
                onClick={() => this.showNewEntry(true)}
              />
            </div>
          </div>

          <div className="dashboard-section4">
            {this.state.subTaskDashBoardData ? (
              <TableView
                {...this.state.subTaskDashBoardData}
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
  const { component, subTasks, projects } = state;
  const id = ownProps.id;
  return {
    componentState: state.component.get(ownProps.id, Map()),
    projectsDataState: projects.getIn([id, "apiData"], null),
    updateDashboardState: component.get(UPDATE_SUBTASKS_MODULE, Map()),
    subTasksModuleState: component.get(SUBTASKS_MODULE_ID, Map()),
    subTasksDataState: subTasks.getIn([SUBTASKS_MODULE_ID, "apiData"], null),
  };
}

export default connect(
  mapStateToProps,
  {
    clearComponentState,
    updateComponentState,
    fetchAllSubTasks,
    deleteData,
    fetchProjects,
  }
)(SubtasksModule);
