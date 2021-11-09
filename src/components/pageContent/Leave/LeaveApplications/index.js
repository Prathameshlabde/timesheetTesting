import React, { Component } from "react";
import { connect } from "react-redux";
import { Map } from "immutable";
import cloneDeep from "lodash/cloneDeep";
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
  TITLE_SUBTITLE_ID,
  APP_TITLE_SUBTITLE,
  NO_RECORDS_FOUND,
} from "../../../../constants/app.constants.js";
import {
  fetchLeaveApplicationsFromUtils,
  updateLeave,
  deleteLeaveApplication,
} from "./LeaveApplications.utils";
import "../leave.css";
import { LEAVE_APPLICATION_DIALOG_MSG } from "../../../../constants/dialog.constants";
import { teamDropDownData } from "../../../utils/common.utils";
import { getDataFromCookie } from "../../../utils/CheckLoginDetails";
import leave_applications_table from "../../../json/leave/leave_applications_table.json";
import leave_applications_table_admin from "../../../json/leave/leave_applications_table_admin.json";
import { dataAbstraction } from "../../../utils/dataAbstraction.utils";
import TableView from "../../../widgets/TableView/TableView";
import SpanLabel from "../../../widgets/SpanLabel";
import DropdownList from "../../../widgets/DropdownList";
import Snackbar from "../../../widgets/Snackbar";
import DiaglogBox from "../../../widgets/AlertBox.js";

const dropDownStatus = [
  {
    id: "0",
    name: "Approved",
  },
  {
    id: "1",
    name: "Partially Approved",
  },
  {
    id: "3",
    name: "Not Approved",
  },
];
class LeaveApplications extends Component {
  state = {
    team_name: "All",
    team_id: "1",
    teamsData: teamDropDownData,
    statusList: dropDownStatus,
    snackIsOpen: false,
    snackMessage: "",
    showdeleteDialog: false,
  };

  componentWillMount() {
    const { updateComponentState } = this.props;
    let LoggedInUserFromRedux = "employee";
    if (getDataFromCookie().role) {
      LoggedInUserFromRedux = getDataFromCookie().role; //from redux state
    }
    this.setState(
      {
        LoggedInUser: LoggedInUserFromRedux,
      },
      () => {
        this.fetchData();
      }
    );

    let titleSub = {
      title: "Leave",
      subtitle: "Leave Applications",
    };

    updateComponentState(TITLE_SUBTITLE_ID, APP_TITLE_SUBTITLE, titleSub);
  }

  componentWillReceiveProps(nextProps) {
    const { leaveApplicationsData } = nextProps;

    if (leaveApplicationsData !== this.props.leaveApplicationsData) {
      if (
        leaveApplicationsData &&
        leaveApplicationsData.apiData &&
        leaveApplicationsData.apiData !== true
      ) {
        let tableJson = leave_applications_table;
        if (this.state.LoggedInUser === "admin") {
          tableJson = leave_applications_table_admin;
        }

        const balanceLeavesFromDataAbstraction = dataAbstraction(
          leaveApplicationsData.apiData,
          tableJson
        );

        let tempRowData = cloneDeep(balanceLeavesFromDataAbstraction);

        this.setState({
          leaveApplicationsTableData: tempRowData,
          dataErrorMsg: "",
        });
      } else {
        this.setState({
          dataErrorMsg: NO_RECORDS_FOUND,
        });
      }
    }
  }

  onChangeFieldValues = (id, updatedValue, updatedValue1, updatedValue2) => {
    if (id === "team_name") {
      this.setState(
        {
          team_id: updatedValue,
          team_name: updatedValue2,
          leaveApplicationsTableData: "",
        },
        () => {
          this.fetchData();
        }
      );
    }
  };

  fetchData() {
    const { updateComponentState, requestData, id } = this.props;

    this.setState(
      {
        leaveApplicationsTableData: "",
      },
      () => {
        if (
          this.state.LoggedInUser === "pm" ||
          this.state.LoggedInUser === "admin" ||
          this.state.LoggedInUser === "superadmin"
        ) {
          fetchLeaveApplicationsFromUtils(
            { id, requestData, updateComponentState },
            this.state.team_name
          );
        } else {
          fetchLeaveApplicationsFromUtils(
            { id, requestData, updateComponentState },
            ""
          );
        }
      }
    );
  }

  updateTempRow = (value, rowFieldIndex) => {
    let tempRowdata = this.state.leaveApplicationsTableData;
    tempRowdata.rows[rowFieldIndex.rowIndex].columns[
      rowFieldIndex.fieldIndex
    ].values[0].value = value;

    this.setState({
      leaveApplicationsTableData: tempRowdata,
    });
  };

  saveClicked(idToSave, rowIndex) {
    const { leaveApplicationsTableData } = this.state;
    const { updateComponentState, requestData, id } = this.props;
    updateLeave(idToSave, leaveApplicationsTableData.rows[rowIndex], {
      updateComponentState,
      requestData,
      id,
    }).then((response) => {
      let result = response.apiData;

      if (result.apiData && result.apiData === true) {
        this.setState(
          {
            snackIsOpen: true,
            snackMessage: LEAVE_APPLICATION_DIALOG_MSG.update.success,
          },
          () => {
            this.fetchData();
          }
        );
      } else {
        this.setState({
          snackIsOpen: true,
          snackMessage: LEAVE_APPLICATION_DIALOG_MSG.update.fail,
        });
      }
    });
  }

  deleteClicked(idToDelete) {
    this.setState(
      {
        idToDelete: idToDelete,
      },
      () => {
        this.setState({
          showdeleteDialog: true,
        });
      }
    );
  }

  onClickOkToDialog = (idToDelete) => {
    {
      const { id, deleteData } = this.props;
      deleteLeaveApplication(idToDelete, { id, deleteData }).then(
        (response) => {
          if (response === true) {
            this.setState(
              {
                snackIsOpen: true,
                snackMessage: LEAVE_APPLICATION_DIALOG_MSG.detele.success,
              },
              () => {
                this.fetchData();
              }
            );
          } else {
            this.setState({
              snackIsOpen: true,
              snackMessage: LEAVE_APPLICATION_DIALOG_MSG.detele.fail,
            });
          }
        }
      );

      this.setState({
        showdeleteDialog: false,
        idToDelete: null,
      });
    }
  };

  onSnackClose() {
    this.setState({
      snackIsOpen: false,
      snackMessage: "",
    });
  }

  onClickcancelToDialog = () => {
    this.setState({
      showdeleteDialog: false,
    });
  };

  render() {
    return (
      <div className="page-content-leave">
        <Snackbar
          snackIsOpen={this.state.snackIsOpen}
          snackMessage={this.state.snackMessage}
          onSnackClose={() => this.onSnackClose()}
        />
        <DiaglogBox
          open={this.state.showdeleteDialog}
          title="Alert"
          onCancel={this.onClickcancelToDialog}
          onConfirm={() => this.onClickOkToDialog(this.state.idToDelete)}
          button1={"Cancel"}
          button2={"Ok"}
          alertMsg="Are you sure you want to delete?"
        />
        <div className="pr-container">
          {this.state.LoggedInUser === "pm" ||
          this.state.LoggedInUser === "admin" ||
          this.state.LoggedInUser === "superadmin" ? (
            <div className="pr-row">
              <div className="pr-col-3">
                <div className="pr-top-level-section1-comp">
                  <SpanLabel className="span-table-leave" data="Select Team" />
                  <DropdownList
                    id="team_name"
                    dropDownData={this.state.teamsData}
                    onChange={this.onChangeFieldValues}
                    // defaultOption="Select Technology"
                    selectedID={this.state.team_id}
                  />
                </div>
              </div>
            </div>
          ) : null}

          {this.state.leaveApplicationsTableData ? (
            <TableView
              {...this.state.leaveApplicationsTableData}
              dropdownData={this.state.statusList}
              selectedDropdown={"3"}
              updateTempRow={(e, f) => this.updateTempRow(e, f)}
              onSaveClick={(e, f) => this.saveClicked(e, f)}
              onDeleteClick={(e, f) => this.deleteClicked(e, f)}
            />
          ) : (
            <div className="pr-row">{this.state.dataErrorMsg}</div>
          )}
        </div>
      </div>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const { data } = state;
  return {
    componentState: state.component.get(ownProps.id, Map()),
    leaveApplicationsData: data.getIn([ownProps.id, "apiData"], null),
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
  }
)(LeaveApplications);
