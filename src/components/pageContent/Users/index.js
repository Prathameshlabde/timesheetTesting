import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Map } from "immutable";
import {
  clearComponentState,
  updateComponentState,
} from "../../../actions/component.actions.js";

import {
  fetchAllUsers,
  deleteData,
  activeUsers,
  inActiveUsers,
  requestData,
} from "../../../actions/users.actions.js";
import {
  APP_TITLE_SUBTITLE,
  PROJECTS_SUBMENU,
  PROJECTS_SUBMENU_ID,
  USERS_MODULE_ID,
  USERS_NEW_ENTRY,
  USERS_NEW_ENTRY_ID,
  USERS_PROFILE,
  USERS_EDIT_ENTRY_ID,
  USERS_ID,
  TITLE_SUBTITLE_ID,
  USERS_MODULE_ID_2,
} from "../../../constants/app.constants.js";
import Snackbar from "../../widgets/Snackbar";
import "../Dashboard/dashboard.css";
import "../pageContent.css";
import "./users.css";
import {
  fetchUsersFromUtils,
  getPageCount,
  deleteUser,
  fetchEntryDataFromUtils,
} from "./Users.utils";
import categories_module_json from "../../json/users/users_table.json";
import { dataAbstraction } from "../../utils/dataAbstraction.utils.js";
import TableView from "../../widgets/TableView/TableView.js";
import SearchModule from "../../widgets/SearchModule";
import { USER_DIALOG_MSG } from "../../../constants/dialog.constants";
import NewUser from "./NewUser";
import UserProfile from "./UserProfile";
import Icon from "../../widgets/Icon.js";
import Overlay from "../../widgets/Overlay/OverLay.js";
import DiaglogBox from "../../widgets/AlertBox.js";
import { isMetaProduct } from "../../utils/common.utils.js";
import { typeOf } from "react-is";

class Users extends Component {
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
    switched: false,
    userRole: null,
  };

  componentWillMount() {
    const { updateComponentState } = this.props;
    let titleSub = {
      title: "Users",
      subtitle: "",
    };
    updateComponentState(TITLE_SUBTITLE_ID, APP_TITLE_SUBTITLE, titleSub);
    const { dataLimit, dataOffset, searchParameterKey } = this.state;
    fetchUsersFromUtils(this.props, dataLimit, dataOffset, searchParameterKey);
  }

  componentWillReceiveProps(nextProps) {
    ////// ajay 24 june

    const { usersDataState } = nextProps;
    const { entryDataState } = nextProps;

    // console.log("nextProps entryDataState", entryDataState);
    // console.log("this.props entryDataState", this.props.entryDataState);

    if (
      entryDataState !== this.props.entryDataState &&
      entryDataState.apiData
    ) {
      // console.log("role", entryDataState.apiData);
      ///// ajay 26 june 220
      this.setState({ userRole: entryDataState.apiData.role });

      if (this.state.switched === true) {
        this.callSwitch(
          entryDataState.apiData.emp_id,
          entryDataState.apiData.role,
          entryDataState.apiData.status_flag
        );
        this.setState({ switched: false });
      }
    }

    if (this.props.usersDataState !== usersDataState) {
      if (usersDataState && usersDataState.apiData) {
        const userDashBoard = dataAbstraction(
          usersDataState.apiData.filteredData,
          categories_module_json
        );

        this.setState({
          userDashBoardData: userDashBoard,
          totalRowsCount: parseInt(usersDataState.apiData.totalCount, 10),
        });
      }
    }
  }

  renderChildReport = (moduleName, moduleProps) => {
    let trimmedModuleName = moduleName.replace(/\s/g, "");

    const singleChild = React.createElement(
      require("./" + trimmedModuleName + "/index.js").default,
      moduleProps,
      null
    );
    return singleChild;
  };
  capitalize(s) {
    return s && s[0].toUpperCase() + s.slice(1);
  }

  setCurrentReportComponentsate(subMenu) {
    const { updateComponentState } = this.props;

    updateComponentState(
      PROJECTS_SUBMENU_ID,
      PROJECTS_SUBMENU,
      this.capitalize(subMenu)
    );
  }

  generateModuleID(subMenu) {
    let result = subMenu.toUpperCase().slice(0, -6) + "_MODULE_ID";
    return result;
  }

  showNewEntry = () => {
    const { updateComponentState } = this.props;
    updateComponentState(USERS_MODULE_ID, USERS_NEW_ENTRY, true);
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
        // console.losg("dataOffset :-", this.state.dataOffset);
        const { dataLimit, dataOffset, searchParameterKey } = this.state;
        fetchUsersFromUtils(
          this.props,
          dataLimit,
          dataOffset,
          searchParameterKey
        );
      }
    );
  };

  onSearchSubmit() {
    this.setState(
      {
        userDashBoardData: "",
        dataLimit: 10,
        dataOffset: 0,
        totalRowsCount: 0,
        currentPage: 1,
      },
      () => {
        const { dataLimit, dataOffset, searchParameterKey } = this.state;
        fetchUsersFromUtils(
          this.props,
          dataLimit,
          dataOffset,
          searchParameterKey
        );
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
      },
      () => {
        const { dataLimit, dataOffset, searchParameterKey } = this.state;
        fetchUsersFromUtils(
          this.props,
          dataLimit,
          dataOffset,
          searchParameterKey
        );
      }
    );
  }

  onclickEdit = (idToEdit) => {
    // console.log("Edit Click ID :- ", idToEdit);
    const { updateComponentState } = this.props;
    updateComponentState(USERS_MODULE_ID, USERS_NEW_ENTRY, true);
    updateComponentState(USERS_MODULE_ID, USERS_EDIT_ENTRY_ID, idToEdit);
  };

  onclickView = (idToEdit) => {
    const { updateComponentState } = this.props;
    updateComponentState(USERS_MODULE_ID, USERS_PROFILE, true);
    updateComponentState(USERS_MODULE_ID, USERS_EDIT_ENTRY_ID, idToEdit);
  };

  onclickDelete = (idToDelete) => {
    ////// ajay 24 june
    fetchEntryDataFromUtils(idToDelete, this.props); ////// ajay 24 june
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

  onClickOkToDialog = () => {
    ////// ajay 24 june

    if (isMetaProduct) {
      // console.log("employees in ok to delet", this.state.userRole);
      if (
        this.state.userRole === "superadmin" ||
        this.state.userRole === "admin"
      ) {
        this.setState({
          showdeleteDialog: false,
          snackIsOpen: true,
          snackMessage: USER_DIALOG_MSG.detele.fail,
        });
      } else {
        deleteUser(this.state.idToDelete, this.props, this.state).then(
          (response) => {
            if (response === true) {
              const { dataLimit, dataOffset, searchParameterKey } = this.state;
              this.setState(
                {
                  snackIsOpen: true,
                  snackMessage: USER_DIALOG_MSG.detele.success,
                  userDashBoardData: "",
                },
                () => {
                  fetchUsersFromUtils(
                    this.props,
                    dataLimit,
                    dataOffset,
                    searchParameterKey
                  );
                }
              );
            } else {
              this.setState({
                snackIsOpen: true,
                snackMessage: USER_DIALOG_MSG.detele.fail,
              });
            }
          }
        );

        this.setState({
          showdeleteDialog: false,
          idToDelete: null,
        });
      }
    }
  };

  callSwitch = (idToEdit, role, currentStatus) => {
    //// ajay 26 june
    console.log("currentStatus = ", currentStatus);
    console.log("typeOf currentStatus = ", typeof currentStatus);
    console.log("idToEdit = ", idToEdit);

    if (isMetaProduct() && role === "superadmin") {
      // console.log("superadmin can not be deactivate or in activated")
      this.setState({
        snackIsOpen: true,
        snackMessage: USER_DIALOG_MSG.switch.fail,
      });
    } else {
      // console.log("in activated")
      const { id, activeUsers, inActiveUsers } = this.props;
      let BodyParams = new FormData();
      BodyParams.append("type", "updateData");

      const payload = {
        emp_id: idToEdit,
      };

      BodyParams.append("params", JSON.stringify(payload));
      if (currentStatus.toString() === "0") {
        console.log("o status ahe going to inactive");
        //Note :-, in contrue means project is in inactive state have to active.
        // 0 means acitve, so call deactivate
        BodyParams.append("command", "inActiveUser");
        const ParamsinActive = {
          id,
          api: {
            body: BodyParams,
          },
        };

        const { dataLimit, dataOffset, searchParameterKey } = this.state;
        inActiveUsers(ParamsinActive).then((result) => {
          if (result.response && result.response.apiData === true) {
            fetchUsersFromUtils(
              this.props,
              dataLimit,
              dataOffset,
              searchParameterKey
            );
            this.setState({
              snackIsOpen: true,
              snackMessage: USER_DIALOG_MSG.switch.success,
            });
          }
        });
      } else {
        console.log("1 status ahe going to active");
        BodyParams.append("command", "activeUser");
        const ParamsActive = {
          id,
          api: {
            body: BodyParams,
          },
        };

        const { dataLimit, dataOffset, searchParameterKey } = this.state;

        activeUsers(ParamsActive).then((result) => {
          if (result.response && result.response.apiData === true) {
            fetchUsersFromUtils(
              this.props,
              dataLimit,
              dataOffset,
              searchParameterKey
            );
            this.setState({
              snackIsOpen: true,
              snackMessage: "Use activeted successfully",
            });
          }
        });
      }
    }
  };

  switchChanged = (idToEdit, cussrentstatus) => {
    this.setState({ switched: true }, () => {
      fetchEntryDataFromUtils(idToEdit, this.props);
    }); /// ajay 26 june
  };

  onSnackClose() {
    this.setState({
      snackIsOpen: false,
    });
  }

  render() {
    // const { subMenu, id } = this.props;
    const { userState } = this.props;
    const isNewAddition = userState.get(USERS_NEW_ENTRY, false);
    const isViewProfile = userState.get(USERS_PROFILE, false);
    //aditya 24/07/2019
    // const empid = userState.get(USERS_EDIT_ENTRY_ID, false);

    const { currentPage } = this.state;

    const { dataLimit, dataOffset, searchParameterKey } = this.state;
    const objLimitOfseTONewEntry = {
      dataLimit,
      dataOffset,
      searchParameterKey,
    };

    let paginationObject = {
      totalPage: getPageCount(this.state.totalRowsCount, this.state.dataLimit),
      currentPage: currentPage,
      maxNumbersOnLeftRight: 4,
      onChange: this.onPageChangePagination,
    };

    return (
      <div className="page-content-form">
        {isNewAddition === true ? (
          <Overlay
            subComponent={
              <NewUser
                id={USERS_NEW_ENTRY_ID}
                dataOffset={objLimitOfseTONewEntry}
                // searchParameterKey: ""
              />
            }
          />
        ) : null}

        {isViewProfile === true ? (
          <Overlay
            subComponent={
              <UserProfile
                id={USERS_NEW_ENTRY_ID}
                dataOffset={objLimitOfseTONewEntry}
                // searchParameterKey: ""
              />
            }
          />
        ) : null}

        <DiaglogBox
          open={this.state.showdeleteDialog}
          title="Alert"
          onCancel={this.onClickcancelToDialog}
          onConfirm={this.onClickOkToDialog}
          button1={"Cancel"}
          button2={"Ok"}
          alertMsg="Are you sure you want to delete?"
        />
        <Snackbar
          snackIsOpen={this.state.snackIsOpen}
          snackMessage={this.state.snackMessage}
          onSnackClose={() => this.onSnackClose()}
        />
        <div className="dashboard-section2" style={{ height: "auto" }}>
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
              title="New User"
              onClick={() => this.showNewEntry(true)}
            />
          </div>
        </div>

        <div className="dashboard-section4 pr-user-table">
          {this.state.userDashBoardData ? (
            <TableView
              {...this.state.userDashBoardData}
              paginationData={paginationObject}
              onclickEdt={(e) => this.onclickEdit(e)}
              onClickDel={(e) => this.onclickDelete(e)}
              onclickView={(e) => this.onclickView(e)}
              onChngeSwitch={(e, f) => this.switchChanged(e, f)}
            />
          ) : (
            "No records found."
          )}
        </div>
      </div>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const { component, users } = state;

  return {
    componentState: state.component.get(ownProps.id, Map()),
    projectState: state.component.get(PROJECTS_SUBMENU_ID, Map()),
    usersDataState: users.getIn([USERS_ID, "apiData"], null),
    userState: component.get(USERS_MODULE_ID, Map()),
    editState: component.get(USERS_MODULE_ID, Map()), ////// ajay 24 june
    entryDataState: users.getIn([USERS_MODULE_ID_2, "apiData"], null), ////// ajay 24 june
    // employeesData: users.getIn(["USERS_MODULE_ID_3", "apiData"], null),////// ajay 24 june
  };
}

export default connect(
  ////// ajay 24 june
  mapStateToProps,
  {
    clearComponentState,
    updateComponentState,
    fetchAllUsers,
    deleteData,
    activeUsers,
    inActiveUsers,
    requestData,
  }
)(Users);
