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
  LEAVE_EDIT_ENTRY,
  LEAVE_MODULE_ID,
  NO_RECORDS_FOUND,
} from "../../../../constants/app.constants.js";

import {
  fetchLeaveManagementFromUtils,
  fetchLeavesYearData,
  getPropsspanLabel,
  getAllFields,
  deleteLeave,
  updateLeave,
  updateLeaveAll,
  dataAbstractionForLeaveManagement,
  callApiToGenerateCaryForLeave,
} from "./LeaveManagement.utils";
import { LEAVE_DIALOG_MSG } from "../../../../constants/dialog.constants";
import LeaveEditForm from "./LeaveEditForm";
import { getDataFromCookie } from "../../../utils/CheckLoginDetails";
import leave_management_table from "../../../json/leave/leave_management_table.json";
import "../leave.css";
import LeaveManagementTable from "../../../widgets/TableView/LeaveManagementTable";
import SpanLabel from "../../../widgets/SpanLabel";
import DropdownList from "../../../widgets/DropdownList";
import Overlay from "../../../widgets/Overlay/OverLay.js";
import Button from "../../../widgets/Button";
import Snackbar from "../../../widgets/Snackbar";
import DiaglogBox from "../../../widgets/AlertBox.js";
import moment from "moment";

class LeaveManagement extends Component {
  state = {
    current_year: "",
    selectedYearID: "",
    showdeleteDialog: false,
    snackIsOpen: false,
    snackMessage: "",
    editEntryId: "",
    headerClassState: "",
    leaveApplicationsTableData: "",
    selectedListArray: [],
    tempRowData: [],
    dialogMessage: "",
    enableCarryForButton: false,
    yearData: [],
  };

  componentWillMount() {
    const current_year = this.getDateRange()

    const { updateComponentState, requestData, id } = this.props;

    fetchLeavesYearData({ id, requestData, updateComponentState });

    let LoggedInUserFromRedux = "employee";
    if (getDataFromCookie().role) {
      LoggedInUserFromRedux = getDataFromCookie().role; //from redux state
    }
    this.setState({
      LoggedInUser: LoggedInUserFromRedux,
    });

    this.setState(
      {
        current_year: current_year,
      },
      () => {
        fetchLeaveManagementFromUtils(
          { id, requestData, updateComponentState },
          this.state.current_year
        );
      }
    );

    // console.log("this.props.id of Leave Management = ", this.props.id);

    let titleSub = {
      title: "Leave",
      subtitle: "Leave Management",
    };

    updateComponentState(TITLE_SUBTITLE_ID, APP_TITLE_SUBTITLE, titleSub);
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll.bind(this));
  }

  setShouldVisibleCarryFor()
  {
    const {yearData} = this.state
    const lengthYearData = yearData.length;
    if (lengthYearData) {
    const lastDateFromDataBase = yearData[lengthYearData-1].name
    const dateArray = lastDateFromDataBase.split("-");

   const momDateFromDatabase =  moment(dateArray[1], "YYYY-MM-DD")

   if(moment().month() > 2 && moment() === momDateFromDatabase){
     this.setState({
      enableCarryForButton: true
     })
    }else{
      this.setState({
        enableCarryForButton: false
       })
    }

  }
}

  getDateRange()
  {
    let current_year =""
    if (moment().month() > 2) {
      current_year =
        moment().format("YYYY") +
        "-" +
        moment()
          .add(1, "years")
          .format("YYYY");
    } else {
      current_year =
        moment()
          .add(-1, "years")
          .format("YYYY") +
        "-" +
        moment().format("YYYY");
    }
    return current_year
  }

  handleScroll(event) {
    if (window.scrollY >= 155) {
      this.setState({
        headerClassState: "sticky",
      });
    } else {
      this.setState({
        headerClassState: "",
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { leaveManagementData } = nextProps;

    if (leaveManagementData !== this.props.leaveManagementData) {
      if (
        leaveManagementData &&
        leaveManagementData.apiData &&
        leaveManagementData.apiData !== true
      ) {
        let reportTitle;
        reportTitle = "Leave Management";

        if (leaveManagementData.apiData.columns) {
          if (leaveManagementData.apiData.rows.length === 0) {
            this.setState({
              dataErrorMsg: NO_RECORDS_FOUND,
            });
          } else {
            const balanceLeavesFromDataAbstraction = dataAbstractionForLeaveManagement(
              leaveManagementData.apiData,
              leave_management_table,
              this.props,
              reportTitle
            );

            let tempRowData = cloneDeep(
              balanceLeavesFromDataAbstraction.rows.slice(1)
            );
            this.setState({
              leaveApplicationsTableData: balanceLeavesFromDataAbstraction,
              tempRowData: tempRowData,
              selectedListArray: [],
              dataErrorMsg: "",
            });
          }
        } else {
          let lengthYearData = leaveManagementData.apiData.length;
          const { updateComponentState, requestData, id } = this.props;

          if (lengthYearData) {
            this.setState(
              {
                yearData: leaveManagementData.apiData,
                current_year:
                  leaveManagementData.apiData[lengthYearData - 1].name,
                selectedYearID: lengthYearData,
              },
              () => {
                fetchLeaveManagementFromUtils(
                  { id, requestData, updateComponentState },
                  this.state.current_year
                );
                this.setShouldVisibleCarryFor()
              }
            );
          }
        }
      } else {
        this.setState({
          dataErrorMsg: NO_RECORDS_FOUND,
        });
      }
    }
  }

  onChangeFieldValues = (id, updatedValue, updatedValue1, updatedValue2) => {
    this.setState(
      {
        selectedYearID: updatedValue,
        current_year: updatedValue2,
        leaveApplicationsTableData: "",
      },
      () => {
        const { updateComponentState, requestData, id } = this.props;
        fetchLeaveManagementFromUtils(
          { id, requestData, updateComponentState },
          this.state.current_year
        );
      }
    );
  };

  getAllPropsForComponent() {
    const spanLabel = getPropsspanLabel();
    return {
      spanLabel,
    };
  }

  onclickDelete = (idToDelete) => {
    // console.log("in Delete", idToDelete);
    this.setState(
      {
        idToDelete: idToDelete,
      },
      () => {
        this.setState({
          dialogMessage: "Are you sure you want to delete?",
          showdeleteDialog: true,
        });
      }
    );
  };

  onClickcancelToDialog = () => {
    this.setState({
      showdeleteDialog: false,
    });
  };

  onClickOkToDialog = (idToDelete) => {
    if (idToDelete !== "updateall") {
      this.deleteRecord(idToDelete);
    } else {
      this.updateAllRecords();
    }

    this.setState({
      showdeleteDialog: false,
      idToDelete: null,
    });
  };

  deleteRecord(idToDelete) {
    const { id, deleteData, updateComponentState, requestData } = this.props;
    deleteLeave(idToDelete, { id, deleteData }).then((response) => {
      if (response === true) {
        this.setState(
          {
            snackIsOpen: true,
            snackMessage: LEAVE_DIALOG_MSG.detele.success,
          },
          () => {
            fetchLeaveManagementFromUtils(
              { id, requestData, updateComponentState },
              this.state.current_year
            );
          }
        );
      } else {
        this.setState({
          snackIsOpen: true,
          snackMessage: LEAVE_DIALOG_MSG.detele.fail,
        });
      }
    });
  }

  onClickNoeEdit(mainIndex, fieldIndex) {
    const { tempRowData } = this.state;
    let currentNote =
      tempRowData[mainIndex].columns[fieldIndex].values[1].value;
    this.setState(
      {
        noteMainIndex: mainIndex,
        noteFieldIndex: fieldIndex,
        currentNote: currentNote,
      },
      () => {
        const { updateComponentState } = this.props;
        updateComponentState(LEAVE_MODULE_ID, LEAVE_EDIT_ENTRY, true);
      }
    );
  }

  onSnackClose() {
    this.setState({
      snackIsOpen: false,
    });
  }

  onclickDivEdit = (selectedIndex) => {
    const { selectedListArray } = this.state;

    if (selectedListArray.includes(selectedIndex)) {
      let tempArray = selectedListArray;
      let index = tempArray.indexOf(selectedIndex);
      tempArray.splice(index, 1);
      this.setState({
        selectedListArray: tempArray,
      });
    } else {
      let tempArray = selectedListArray;
      tempArray.push(selectedIndex);
      this.setState({
        selectedListArray: tempArray,
      });
    }
  };

  updateTempRow = (mainRowIndex, fieldIndex, finalValue) => {
    let updatedValue = finalValue;

    const { tempRowData } = this.state;
    tempRowData[mainRowIndex].columns[
      fieldIndex
    ].values[0].value = updatedValue;

    this.setState({
      tempRowData: tempRowData,
    });
  };

  updateNoteTempRecord(mainRowIndex, fieldIndex, updatedValue) {
    const { tempRowData } = this.state;
    tempRowData[mainRowIndex].columns[
      fieldIndex
    ].values[1].value = updatedValue;

    this.setState(
      {
        tempRowData: tempRowData,
      },
      () => {
        const { updateComponentState } = this.props;
        updateComponentState(LEAVE_MODULE_ID, LEAVE_EDIT_ENTRY, false);
      }
    );
  }

  clearSingleRow(selectedIndex) {
    const {
      selectedListArray,
      leaveApplicationsTableData,
      tempRowData,
    } = this.state;

    let ogData = cloneDeep(leaveApplicationsTableData.rows);
    let oldtempRowData = tempRowData;

    oldtempRowData[selectedIndex] = ogData[selectedIndex + 1];

    this.setState(
      {
        tempRowData: oldtempRowData,
      },
      () => {
        if (selectedListArray.includes(selectedIndex)) {
          let tempArray = selectedListArray;
          let index = tempArray.indexOf(selectedIndex);
          tempArray.splice(index, 1);
          this.setState({
            selectedListArray: tempArray,
          });
        }
      }
    );
  }

  onClickUpdate(indexToUpdate) {
    const { tempRowData } = this.state;
    const { id, updateData, updateComponentState, requestData } = this.props;

    let result = getAllFields(tempRowData[indexToUpdate].columns);
    updateLeave(result, { id, updateData }).then((response) => {
      if (response === true) {
        this.setState(
          {
            snackIsOpen: true,
            snackMessage: LEAVE_DIALOG_MSG.update.success,
          },
          () => {
            fetchLeaveManagementFromUtils(
              { id, requestData, updateComponentState },
              this.state.current_year
            );
          }
        );
      } else {
        this.setState({
          snackIsOpen: true,
          snackMessage: LEAVE_DIALOG_MSG.update.fail,
        });
      }
    });
  }

  updateAll() {
    this.setState({
      dialogMessage: "Are you sure you want to update all record?",
      showdeleteDialog: true,
      idToDelete: "updateall",
    });
  }

  updateAllRecords() {
    const { tempRowData, selectedListArray } = this.state;
    const { id, updateData, updateComponentState, requestData } = this.props;

    let finalParametersArray = [];
    for (let i = 0; i < selectedListArray.length; i++) {
      let selectedIndexValue = selectedListArray[i];
      let result = getAllFields(tempRowData[selectedIndexValue].columns);
      finalParametersArray.push(result);
    }

    updateLeaveAll(finalParametersArray, { id, updateData }).then(
      (response) => {
        if (response.apiData && response.apiData.apiData) {
          let totalResponse = response.apiData.apiData;

          if (totalResponse && totalResponse.result === true) {
            this.setState(
              {
                snackIsOpen: true,
                snackMessage: LEAVE_DIALOG_MSG.update.success,
              },
              () => {
                fetchLeaveManagementFromUtils(
                  { id, requestData, updateComponentState },
                  this.state.current_year
                );
              }
            );
          } else if (totalResponse && totalResponse.result === false) {
            let comaSeperatedList = totalResponse.failedList.join(", ");
            this.setState({
              snackIsOpen: true,
              snackMessage: LEAVE_DIALOG_MSG.update.partial + comaSeperatedList,
            });
          } else {
            this.setState({
              snackIsOpen: true,
              snackMessage: LEAVE_DIALOG_MSG.update.fail,
            });
          }
        } else {
          this.setState({
            snackIsOpen: true,
            snackMessage: LEAVE_DIALOG_MSG.update.fail,
          });
        }
      }
    );
  }

  clearAll() {
    const { updateComponentState, requestData, id } = this.props;

    this.setState(
      {
        selectedListArray: [],
        tempRowData: [],
      },
      () => {
        fetchLeaveManagementFromUtils(
          { id, requestData, updateComponentState },
          this.state.current_year
        );
      }
    );
  }

  generateCrFrLeave = ()=>{
    const { id, requestData, updateComponentState } = this.props
    callApiToGenerateCaryForLeave({ id, requestData, updateComponentState },
      this.state.current_year).then((response) => {
        const dataResponse = response.apiData
        if(dataResponse.apiData && dataResponse.apiData.isAllLeaveAdded ){
          window.location.reload();
        }
      })
  }

  render() {
    const props = this.getAllPropsForComponent();
    const { leaveModuleState } = this.props;
    const {
      noteMainIndex,
      noteFieldIndex,
      currentNote,
      selectedListArray,
      enableCarryForButton
    } = this.state;

    const isEditLeave = leaveModuleState.get(LEAVE_EDIT_ENTRY, false);
    const carryForwardLabel = `Generate carry forward leave for ${this.state.current_year}`;
    const carryForwardBtnStyle = {marginLeft: "0px", background: enableCarryForButton ? "#054770": "#C0C0C0"}

    return (
      <div className="page-content-leave">  
        <DiaglogBox
          open={this.state.showdeleteDialog}
          title="Alert"
          onCancel={this.onClickcancelToDialog}
          onConfirm={() => this.onClickOkToDialog(this.state.idToDelete)}
          button1={"Cancel"}
          button2={"Ok"}
          alertMsg={this.state.dialogMessage}
        />
        {isEditLeave === true ? (
          <Overlay
            subComponent={
              <LeaveEditForm
                id={LEAVE_MODULE_ID}
                mainIndex={noteMainIndex}
                fieldIndex={noteFieldIndex}
                currentNote={currentNote}
                updateNoteTempRecord={(e, f, g) =>
                  this.updateNoteTempRecord(e, f, g)
                }
              />
            }
          />
        ) : null}
        <div className="pr-container">
          <Snackbar
            snackIsOpen={this.state.snackIsOpen}
            snackMessage={this.state.snackMessage}
            onSnackClose={() => this.onSnackClose()}
          />

          <div className="pr-row">
            <div className="pr-col-3">
              <div className="pr-top-level-section1-comp">
                <SpanLabel {...props.spanLabel} data="Year" />
                <DropdownList
                  id="ddlYearsList"
                  dropDownData={this.state.yearData}
                  onChange={this.onChangeFieldValues}
                  selectedID={this.state.selectedYearID}
                />
              </div>
              {/* {this.state.enableCarryForButton ? ( */}
              <div className="pr-top-level-section1-comp">
                <SpanLabel {...props.spanLabel} data={carryForwardLabel} />
                <Button
                    onClick={this.generateCrFrLeave}
                    className="caryfor-leave-button"
                    data={"Generate"}
                    style={carryForwardBtnStyle}
                    disabled={!enableCarryForButton}
                  />
              </div>
              {/* // ):null} */}
            </div>
            <div className="pr-col-3" />
            <div className="pr-col-3">
              {selectedListArray.length > 1 ? (
                <div>
                  <Button
                    data="Cancel"
                    onClick={() => this.clearAll()}
                    className="button-clearAll-leave"
                  />
                  <Button
                    data="Update All"
                    onClick={() => this.updateAll()}
                    className="button-updateAll-leave"
                  />
                </div>
              ) : null}
            </div>
          </div>

          {this.state.leaveApplicationsTableData ? (
            <LeaveManagementTable
              {...this.state.leaveApplicationsTableData}
              // onclickEdt={e => this.onclickEdit(e)}
              onClickDivEdit={(e) => this.onclickDivEdit(e)}
              onClickDel={(e) => this.onclickDelete(e)}
              headerClassName={this.state.headerClassState}
              selectedListArray={this.state.selectedListArray}
              tempRowData={this.state.tempRowData}
              updateTempRow={(e, f, g) => this.updateTempRow(e, f, g)}
              onClickUpdate={(e) => this.onClickUpdate(e)}
              onClickNoeEdit={(e, f) => this.onClickNoeEdit(e, f)}
              onClickClear={(e) => this.clearSingleRow(e)}
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
  const { component, data } = state;
  return {
    componentState: state.component.get(ownProps.id, Map()),
    leaveManagementData: data.getIn([ownProps.id, "apiData"], null),
    leaveModuleState: component.get(LEAVE_MODULE_ID, Map()),
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
)(LeaveManagement);
