import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Map } from "immutable";
import moment from "moment";

import Icon from "../../../widgets/Icon.js";
import Overlay from "../../../widgets/Overlay/OverLay.js";
import TableView from "../../../widgets/TableView/TableView.js";
import SearchModule from "../../../widgets/SearchModule";
import DiaglogBox from "../../../widgets/AlertBox.js";
import Snackbar from "../../../widgets/Snackbar";
import SpanLabel from "../../../widgets/SpanLabel.js";
import DropdownList from "../../../widgets/DropdownList.js";
import DatePicker from "../../../widgets/DatePicker.js";
import NewProject from "./NewProject";

import {
  clearComponentState,
  updateComponentState,
} from "../../../../actions/component.actions.js";
import {
  fetchAllProjects,
  activeProjects,
  inActiveProjects,
  deleteProjects,
} from "../../../../actions/projects.actions.js";
import { updateData, deleteData } from "../../../../actions/data.actions.js";

import {
  PROJECTS_NEW_ENTRY,
  PROJECTS_EDIT_ENTRY_ID,
  PROJECTS_MODULE_ID,
  UPDATE_PROJECTS_MODULE,
  PROJECTS_NEW_ENTRY_ID,
  APP_TITLE_SUBTITLE,
  TITLE_SUBTITLE_ID,
  NO_RECORDS_FOUND,
} from "../../../../constants/app.constants.js";
import { PROJECT_DIALOG_MSG } from "../../../../constants/dialog.constants";

import {
  fetchProjectsFromUtils,
  deleteProject,
  updateSelectedProjects
} from "./projectsModule.utils.js";
import { dataAbstraction } from "../../../utils/dataAbstraction.utils.js";
import { getPageCount } from "../Projects.utils";
import { removeValueFromArray } from "../../../utils/common.utils.js";
import { dateFormatter } from "../../../utils/calender.utils.js";

import projects_module_json from "../../../json/projects/projects_module_table.json";
import "../../Dashboard/dashboard.css";
import "../../pageContent.css";
import Button from "../../../widgets/Button.js";


const updateFieldsList = [
  {
    id: "lock_date",
    name: "Lock Date",
  }
];

class ProjectsModule extends Component {
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
    checkedProjects:[],
    updated_value: ''
  };

  componentWillMount() {
    const { updateComponentState } = this.props;
    let titleSub = {
      title: "Projects",
      subtitle: "",
    };
    updateComponentState(TITLE_SUBTITLE_ID, APP_TITLE_SUBTITLE, titleSub);
    this.fetchProjects(true);
  }

  fetchProjects(isNormalOrSort) {
    const { fetchAllProjects, updateComponentState } = this.props;
    const {
      dataLimit,
      dataOffset,
      searchParameterKey,
      sortBy,
      sortType,
    } = this.state;
    const fetchProps = {
      fetchAllProjects,
      updateComponentState,
      dataLimit,
      dataOffset,
      searchParameterKey,
      isNormalOrSort,
      sortBy,
      sortType,
    };
    fetchProjectsFromUtils(fetchProps);
  }

  componentWillReceiveProps(nextProps) {
    const { projectsDataState } = nextProps;
    if (this.props.projectsDataState !== nextProps.projectsDataState) {
      if (projectsDataState && projectsDataState.apiData) {
        const apiData = projectsDataState.apiData;
        const projectDashBoardData = dataAbstraction(
          apiData.filteredData,
          projects_module_json
        );
        this.setState({
          projectDashBoardData,
          totalRowsCount: parseInt(apiData.totalCount, 10),
          dataErrorMsg: "",
        });
      } else {
        this.setState({ dataErrorMsg: NO_RECORDS_FOUND });
      }
    }
  }
  componentWillUnmount() {
    const { updateComponentState } = this.props;
    updateComponentState(PROJECTS_MODULE_ID, PROJECTS_NEW_ENTRY, false);
  }

  showNewEntry = () => {
    const { updateComponentState } = this.props;
    updateComponentState(PROJECTS_MODULE_ID, PROJECTS_NEW_ENTRY, true);
  };

  onclickEdit = (idToEdit) => {
    const { updateComponentState } = this.props;
    updateComponentState(PROJECTS_MODULE_ID, PROJECTS_NEW_ENTRY, true);
    updateComponentState(PROJECTS_MODULE_ID, PROJECTS_EDIT_ENTRY_ID, idToEdit);
  };

  onclickDelete = (idToDelete) => {
    this.setState({ idToDelete }, () => {
      this.setState({ showdeleteDialog: true });
    });
  };

  onClickcancelToDialog = () => {
    this.setState({ showdeleteDialog: false });
  };

  onClickOkToDialog = (idToDelete) => {
    const { dataLimit, dataOffset, searchParameterKey } = this.state;
    deleteProject(
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
            snackMessage: PROJECT_DIALOG_MSG.detele.success,
            projectDashBoardData: "",
          },
          () => {
            this.fetchProjects(true);
          }
        );
      } else {
        this.setState({
          snackIsOpen: true,
          snackMessage: PROJECT_DIALOG_MSG.detele.fail,
        });
      }
    });

    this.setState({
      showdeleteDialog: false,
      idToDelete: null,
    });
  };

  switchChanged = (idToEdit, cussrentstatus) => {
    const { id, activeProjects, inActiveProjects } = this.props;
    let BodyParams = new FormData();
    BodyParams.append("type", "updateData");
    const payload = {
      pro_id: idToEdit,
    };
    BodyParams.append("params", JSON.stringify(payload));

    if (cussrentstatus === true) {
      //Note :- in true means project is in in-active state have to active.
      BodyParams.append("command", "activeProject");
      const ParamsActive = {
        id,
        api: {
          body: BodyParams,
        },
      };

      activeProjects(ParamsActive).then((result) => {
        // console.log("apiData status:-", result.response.apiData);
        if (result.response && result.response.apiData === true) {
          this.fetchProjects(true);
        }
      });
    } else {
      BodyParams.append("command", "inActiveProject");
      const ParamsinActive = {
        id,
        api: {
          body: BodyParams,
        },
      };
      inActiveProjects(ParamsinActive).then((result) => {
        if (result.response && result.response.apiData === true) {
          this.fetchProjects(true);
        }
      });
    }
  };

  onClickCheckBox = (selectedId, isCheck) => {
    let checkedIds = this.state.checkedProjects;
    if(isCheck){
      checkedIds.push(selectedId);
    }else{
      checkedIds = removeValueFromArray(checkedIds, selectedId);
    }

    this.setState({ checkedProjects : checkedIds });
  };

  onPageChangePagination = (selectedNumber) => {
    this.setState(
      {
        dataOffset: (selectedNumber - 1) * this.state.dataLimit,
        currentPage: selectedNumber,
      },
      () => {
        this.fetchProjects(false);
      }
    );
  };

  onSearchSubmit() {
    this.setState(
      {
        projectDashBoardData: "",
        dataLimit: 10,
        dataOffset: 0,
        totalRowsCount: 0,
        currentPage: 1,
      },
      () => {
        this.fetchProjects(true);
      }
    );
  }

  textFieldSubmit(id, updatedValue) {
    this.setState({ searchParameterKey: updatedValue });
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
        this.fetchProjects(true);
      }
    );
  }

  onSnackClose() {
    this.setState({ snackIsOpen: false });
  }

  onSort(sortBy, sortType) {
    this.setState(
      {
        projectDashBoardData: "",
        dataLimit: 10,
        dataOffset: 0,
        totalRowsCount: 0,
        currentPage: 1,
        sortBy,
        sortType,
      },
      () => {
        this.fetchProjects(false);
      }
    );
  }

  sortData(sortBy) {
    const { sort, fieldNameToSort } = this.state;

    if (sortBy !== fieldNameToSort) {
      this.setState({ sort: false }, () => {
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
      });
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

  onChangeFieldValues = (id, updatedValue) => {
    if (id === "update_field_type") {
      this.setState({ 
        updateFieldId: updatedValue,
        updateLockDate: true,
        updated_value: dateFormatter(moment(), "yyyy-MM-dd") 
      });
    }else if(id === "update_lock_date" ){
      this.setState({ updated_value: dateFormatter(updatedValue, "yyyy-MM-dd") });
    }
  };

  updateProjects = () => {
    updateSelectedProjects(this.props,this.state).then(
      response => {
        if (response === true) {
          this.setState(
            {
              snackIsOpen: true,
              snackMessage: PROJECT_DIALOG_MSG.update.success,
              projectDashBoardData: "",
              checkedProjects:[],
              updateFieldId:'',
              updateLockDate:false
            },
            () => {
              this.fetchProjects(true);
            }
          );
        } else {
          this.setState({
            snackIsOpen: true,
            snackMessage: PROJECT_DIALOG_MSG.update.fail,
          });
        }
      }
    );
  };

  

  updateSelectedSection(){
    return (
      <Fragment>
        <div className="pr-col-2">
          <SpanLabel data="Select Field Type" />
          <DropdownList
            id="update_field_type"
            dropDownData={updateFieldsList}
            onChange={this.onChangeFieldValues}
            defaultOption="Select Field"
            selectedID={this.state.updateFieldId}
          />
        </div>
        {this.state.updateLockDate ? 
        <div className="pr-col-5">
          <SpanLabel data="Select Lock Date" />
          <div className="pr-row" style={{ flexWrap:'nowrap', marginTop: '0px' }}>
            <div className="pr-col-3">
              <div
                className="date-pcker-field-div"
                style={{ width: "78%", marginLeft: "1px" }}
              >
                <DatePicker
                  value={this.state.updated_value}
                  id="update_lock_date"
                  onChange={this.onChangeFieldValues}
                  className="date-picker"
                  isEnablePastDates={true}
                />
              </div>
            </div>
            <div className="pr-col-5">
              <Button
                data = "Update Selected Projects"
                onClick={() => this.updateProjects()}
                className="button-submitEntry"
                style={{ width:'190px',margin:'0px' }}
              />
            </div>
          </div>
        </div>:null}
      </Fragment>
      );
  }

  render() {
    const { projectsModuleState } = this.props;
    const isNewAddition = projectsModuleState.get(PROJECTS_NEW_ENTRY, false);

    const { currentPage } = this.state;
    let paginationObject = {
      totalPage: getPageCount(this.state.totalRowsCount, this.state.dataLimit),
      currentPage: currentPage,
      maxNumbersOnLeftRight: 4,
      onChange: this.onPageChangePagination,
    };

    const { dataLimit, dataOffset, searchParameterKey } = this.state;
    return (
      <div className="page-content-form">
        {isNewAddition === true ? (
          <Overlay
            subComponent={
              <NewProject
                id={PROJECTS_NEW_ENTRY_ID}
                dataLimit={dataLimit}
                dataOffset={dataOffset}
                searchParameterKey={searchParameterKey}
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
            </div>
            <div className="dashboard-section2-right">
              <Icon
                icon="add_box"
                title="New Project"
                onClick={() => this.showNewEntry(true)}
              />
            </div>
          </div>
          <div className="dashboard-section4">
            {this.state.checkedProjects.length > 0 ? this.updateSelectedSection() : null}
          </div>
          <div className="dashboard-section4">
            {this.state.projectDashBoardData ? (
                <div className="pr-col-9">
                  <TableView
                    {...this.state.projectDashBoardData}
                    onclickEdt={(e) => this.onclickEdit(e)}
                    onClickDel={(e) => this.onclickDelete(e)}
                    onChngeSwitch={(e, f) => this.switchChanged(e, f)}
                    onClickCheckBox={(e, f) => this.onClickCheckBox(e, f)}
                    paginationData={paginationObject}
                    sortData={(e) => this.sortData(e)}
                    sortFlag={this.state.sort}
                    fieldNameToSort={this.state.fieldNameToSort}
                    totalRowCount={this.state.totalRowsCount}
                    checkedItems={this.state.checkedProjects}
                  />
                </div>
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
  const { component, projects } = state;

  return {
    componentState: state.component.get(ownProps.id, Map()),
    updateDashboardState: component.get(UPDATE_PROJECTS_MODULE, Map()),
    projectsModuleState: component.get(PROJECTS_MODULE_ID, Map()),
    projectsDataState: projects.getIn([PROJECTS_MODULE_ID, "apiData"], null),
  };
}

export default connect(
  mapStateToProps,
  {
    clearComponentState,
    updateComponentState,
    fetchAllProjects,
    activeProjects,
    inActiveProjects,
    deleteProjects,
    updateData,
    deleteData,
  }
)(ProjectsModule);
