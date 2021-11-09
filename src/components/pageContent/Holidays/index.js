import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Map } from "immutable";
import {
  clearComponentState,
  updateComponentState,
} from "../../../actions/component.actions.js";
import {
  updateData,
  requestData,
  deleteData,
} from "../../../actions/data.actions";
import {
  APP_TITLE_SUBTITLE,
  TITLE_SUBTITLE_ID,
  HOLIDAYS_MODULE_ID,
  DEFAULT_OPTION,
  NO_RECORDS_FOUND,
} from "../../../constants/app.constants";
import {
  fetchHolidayListFromUtils,
  fetchHolidayDataFromUtils,
  addNewHoliday,
  updateHoliday,
  deleteHoliday,
} from "./holidays.utils";
import { HOLIDAY_DIALOG_MSG } from "../../../constants/dialog.constants";
import { getDataFromCookie } from "../../utils/CheckLoginDetails";
import { dataAbstraction } from "../../utils/dataAbstraction.utils";
import DiaglogBox from "../../widgets/AlertBox";
import Snackbar from "../../widgets/Snackbar";
import SpanLabel from "../../widgets/SpanLabel";
import TextField from "../../widgets/TextField";
import DropdownList from "../../widgets/DropdownList";
import Button from "../../widgets/Button";
import DatePicker from "../../widgets/DatePicker";
import TableView from "../../widgets/TableView/TableView";
import "../pageContent.css";
import "../Dashboard/dashboard.css";
import moment from "moment";
import holidays_ad_superad_table from "../../json/holidays/holidays_ad_superad_table.json";
import holidays_emp_pm_client_table from "../../json/holidays/holidays_emp_pm_client_table.json";
import Colors from "../../common/colors/index.js";

class Holidays extends Component {
  static propTypes = {
    id: PropTypes.string,
    componentState: PropTypes.object.isRequired,
    updateComponentState: PropTypes.func.isRequired,
  };

  state = {
    headText: "Add New Holiday",
    subMenuTitle: "Add New Holiday",
    description: "",
    holiday_date: moment(),
    buttonText: "Submit",
    isEdit: false,
    idToEdit: "",
    showdeleteDialog: false,
    validationMessage: "",
    snackIsOpen: false,
    snackMessage: "",
    year: moment().format("YYYY"),
    selectedYear: moment().format("YYYY"),
    LoggedInUser: "",
    showForm: false,
    yearData: "",
    typeData: [
      {
        id: "1",
        name: "Normal",
      },
      {
        id: "2",
        name: "Optional",
      },
    ],
    selectedType: "1",
  };

  componentWillMount() {
    let yearList = [];
    for (let index = 0; index < 8; index++) {
      if (index === 0) {
        let obj = {
          id: index + "",
          name: moment()
            .add(1, "years")
            .format("YYYY"),
        };

        yearList.push(obj);
      } else if (index === 1) {
        let obj = {
          id: index + "",
          name: moment().format("YYYY"),
        };
        yearList.push(obj);
      } else {
        // console.log("index :-", index)
        let obj = {
          id: index + "",
          name: moment()
            .subtract(index - 1, "year")
            .format("YYYY"),
        };
        yearList.push(obj);
      }
    }

    this.setState({
      yearData: yearList,
    });

    let LoggedInUserFromRedux = "employee";
    if (getDataFromCookie().role) {
      LoggedInUserFromRedux = getDataFromCookie().role; //from redux state
    }
    this.setState(
      {
        LoggedInUser: LoggedInUserFromRedux,
      },
      () => {
        if (
          this.state.LoggedInUser === "admin" ||
          this.state.LoggedInUser === "superadmin"
        ) {
          this.setState({
            holidays_json: holidays_ad_superad_table,
            showForm: true,
          });
        } else {
          this.setState({
            holidays_json: holidays_emp_pm_client_table,
            showForm: false,
          });
        }
      }
    );

    const { updateComponentState } = this.props;
    let titleSub = {
      title: "Holidays",
      subtitle: "",
    };
    updateComponentState(TITLE_SUBTITLE_ID, APP_TITLE_SUBTITLE, titleSub);
    const { id, requestData } = this.props;
    fetchHolidayListFromUtils(
      { id, requestData, updateComponentState },
      this.state.year
    );
  }

  componentWillUnmount() {
    this.setState({
      headText: "Add New Holiday",
      subMenuTitle: "Add New Holiday",
      idToEdit: "",
      showdeleteDialog: false,
      validationMessage: "",
      snackIsOpen: false,
      snackMessage: "",
      year: moment().format("YYYY"),
      description: "",
      selectedType: "1",
      selectedYear: moment().format("YYYY"),
      holiday_date: moment(),
      buttonText: "Submit",
      isEdit: false,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { holidaysData, editState } = nextProps;

    if (holidaysData !== this.props.holidaysData) {
      if (
        holidaysData &&
        holidaysData.apiData &&
        holidaysData.apiData !== true &&
        holidaysData.apiData !== "duplicate"
      ) {
        const holidaysFromDataAbstraction = dataAbstraction(
          holidaysData.apiData,
          this.state.holidays_json
        );
        this.setState({
          holidaysTableData: holidaysFromDataAbstraction,
          totalRowsCount: parseInt(holidaysData.apiData.totalCount, 10),
          description: "",

          buttonText: "Submit",
          isEdit: false,
          idToEdit: "",
          subMenuTitle: "Add New Holiday",
          dataErrorMsg: "",
        });
      } else {
        this.setState({
          dataErrorMsg: NO_RECORDS_FOUND,
        });
      }
    }

    if (editState !== this.props.editState && editState && editState.apiData) {
      let data = editState.apiData;
      let selectedtypIDForEdit;
      if (data.type === "Optional") {
        selectedtypIDForEdit = "2";
      } else {
        selectedtypIDForEdit = "1";
      }

      this.setState({
        description: data.holi_desc,
        selectedType: selectedtypIDForEdit,
        holiday_date: moment(data.holi_date),
        isEdit: true,
        buttonText: "Update",
        subMenuTitle: "Edit Holiday",
      });
    }
  }

  onclickEdit = (idToEdit) => {
    this.setState({
      idToEdit: idToEdit,
      headText: "Edit Holiday",
      validationMessage: "",
    });
    const { requestData, updateComponentState } = this.props;
    fetchHolidayDataFromUtils({ requestData, updateComponentState }, idToEdit);
  };

  onclickDelete = (idToDelete) => {
    // console.log("idToDelete = ", idToDelete);
    this.setState(
      {
        showdeleteDialog: true,
        idToDelete: idToDelete,
      },
      () => {
        // console.log(
        //   "showdeleteDialog in onclickDelete = ",
        //   this.state.showdeleteDialog
        // );
      }
    );
  };

  onClickOkToDialog = (idToDelete) => {
    deleteHoliday(idToDelete, this.props).then((response) => {
      if (response === true) {
        this.setState(
          {
            snackIsOpen: true,
            snackMessage: HOLIDAY_DIALOG_MSG.detele.success,
            holidaysTableData: "",
          },
          () => {
            const { id, requestData, updateComponentState } = this.props;
            fetchHolidayListFromUtils(
              { id, requestData, updateComponentState },
              this.state.year
            );
          }
        );
      } else {
        this.setState({
          snackIsOpen: true,
          snackMessage: HOLIDAY_DIALOG_MSG.detele.fail,
        });
      }
    });

    this.setState({
      showdeleteDialog: false,
      idToDelete: null,
    });
  };

  onClickcancelToDialog = () => {
    this.setState({
      showdeleteDialog: false,
    });
  };

  onChangeFieldValues = (id, updatedValue, updatedValue2, updatedValue3) => {
    // console.log("id == ", id);
    // console.log("updatedValue == ", updatedValue);
    // console.log("updatedValue2 == ", updatedValue2);
    // console.log("updatedValue3 == ", updatedValue3);
    if (id === "holiday_type") {
      this.setState({
        selectedType: updatedValue,
      });
    } else if (id === "ddlYearsList") {
      if (updatedValue === DEFAULT_OPTION) {
        this.setState(
          {
            selectedYear: moment().format("YYYY"),
          },
          () => {
            this.onClickSearch();
          }
        );
      } else {
        this.setState(
          {
            selectedYear: updatedValue3,
          },
          () => {
            this.onClickSearch();
          }
        );
      }
    } else {
      this.setState({
        [id]: updatedValue,
      });
    }
  };

  onClickSearch = () => {
    const { id, requestData, updateComponentState } = this.props;
    fetchHolidayListFromUtils(
      { id, requestData, updateComponentState },
      this.state.selectedYear
    );
  };

  submitNewEntry = () => {
    const { description, isEdit } = this.state;
    const { id, requestData, updateComponentState } = this.props;

    if (description === "") {
      this.setState({
        validationMessage: "Please enter holiday description.",
      });
    } else if (description.length > 60) {
      this.setState({
        validationMessage: "Holiday name should be less than 60 characters.",
      });
    } else {
      if (isEdit === false) {
        addNewHoliday(
          { id, requestData, updateComponentState },
          this.state
        ).then((response) => {
          if (response === true) {
            this.setState({
              snackIsOpen: true,
              snackMessage: HOLIDAY_DIALOG_MSG.add.success,
              holiday_date: moment(),
              selectedType: "1",
            });
          } else if (response === "duplicate") {
            this.setState({
              snackIsOpen: true,
              snackMessage: HOLIDAY_DIALOG_MSG.duplicate,
            });
          } else {
            this.setState({
              snackIsOpen: true,
              snackMessage: HOLIDAY_DIALOG_MSG.add.fail,
            });
          }
        });
      } else {
        updateHoliday(
          { id, requestData, updateComponentState },
          this.state
        ).then((response) => {
          if (response === true) {
            this.setState({
              snackIsOpen: true,
              snackMessage: HOLIDAY_DIALOG_MSG.update.success,
              headText: "Add New Holiday",
              holiday_date: moment(),
              selectedType: "1",
            });
          } else if (response === "duplicate") {
            this.setState({
              snackIsOpen: true,
              snackMessage: HOLIDAY_DIALOG_MSG.duplicate,
            });
          } else {
            this.setState({
              snackIsOpen: true,
              snackMessage: HOLIDAY_DIALOG_MSG.update.fail,
            });
          }
        });
      }
      this.setState({
        validationMessage: "",
      });
    }
  };

  clearData = () => {
    this.setState({
      description: "",
      selectedType: "1",
      selectedYear: moment().format("YYYY"),
      holiday_date: moment(),
      buttonText: "Submit",
      isEdit: false,
      headText: "Add New Holiday",
      validationMessage: "",
    });
  };

  onSnackClose() {
    this.setState({
      snackIsOpen: false,
    });
  }

  render() {
    return (
      <div className="page-content-form">
        <div id={this.props.id}>
          <DiaglogBox
            open={this.state.showdeleteDialog}
            title="Alert"
            onCancel={this.onClickcancelToDialog}
            onConfirm={() => this.onClickOkToDialog(this.state.idToDelete)}
            button1={"Cancel"}
            button2={"Ok"}
            alertMsg="Are you sure you want to delete?"
          />
          {this.state.showForm === true ? (
            <div
              style={{ padding: "0px 2.8% 0px", border: "unset" }}
              className="pr-container"
              id="newEntry"
            >
              <div className="pr-row" style={{ padding: "0px" }}>
                <h4>{this.state.headText}</h4>
              </div>
              <div className="pr-row" style={{ padding: "0px" }}>
                <div className="pr-col-2">
                  <div>
                    <SpanLabel data="Date" className="span-label" />
                    <div style={{ width: "60%", marginLeft: "1px" }}>
                      <DatePicker
                        value={this.state.holiday_date}
                        isOpen={this.state.isDatePickerOpen}
                        id="holiday_date"
                        onChange={this.onChangeFieldValues}
                        className="date-picker"
                        // isEnableFutureDates={true}
                        // ref={ip => (this.myInp = ip)}
                      />
                    </div>
                  </div>
                </div>
                <div className="pr-col-2">
                  <div>
                    <SpanLabel
                      data="Description"
                      className="span-label"
                      isRequired={true}
                    />
                    <TextField
                      id="description"
                      data={this.state.description}
                      onChange={this.onChangeFieldValues}
                      classNames="pr-txtfield-lg w-90"
                      style={{ width: "95%", borderColor: Colors.newBgColor }}
                    />
                  </div>
                </div>
                <div className="pr-col-2">
                  <div>
                    {this.state.LoggedInUser === "admin" ||
                    this.state.LoggedInUser === "superadmin" ? (
                      <div className="">
                        <SpanLabel data="Type" className="span-label" />
                        <DropdownList
                          id="holiday_type"
                          dropDownData={this.state.typeData}
                          onChange={this.onChangeFieldValues}
                          defaultOption=""
                          selectedID={this.state.selectedType}
                          style={{ width: "97%" }}
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="pr-row" style={{ padding: "0px" }}>
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
          ) : null}

          <div className="pr-row" style={{ padding: "0px 2.8%" }}>
            <div className="pr-col-6">
              <div className="search-field-year-left">List of holidays</div>
            </div>
            <div className="pr-col-3">
              <div
                className="search-field-year-right"
                style={{ float: "right" }}
              >
                <div style={{ paddingRight: "7px" }}>
                  <span>Year</span>
                </div>
                <DropdownList
                  id="ddlYearsList"
                  dropDownData={this.state.yearData}
                  onChange={this.onChangeFieldValues}
                  // defaultOption={this.state.year}
                  selectedID="1"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </div>

          <div className="dashboard-section4">
            {this.state.holidaysTableData ? (
              <TableView
                {...this.state.holidaysTableData}
                onclickEdt={(e) => this.onclickEdit(e)}
                onClickDel={(e) => this.onclickDelete(e)}
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
    editState: data.getIn([HOLIDAYS_MODULE_ID, "apiData"], null),
    holidaysData: data.getIn([ownProps.id, "apiData"], null),
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
)(Holidays);
