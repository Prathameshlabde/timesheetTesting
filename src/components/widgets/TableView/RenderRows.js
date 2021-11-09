import React, { Component } from "react";
// import colors from "../../common/colors";
import { connect } from "react-redux";
import { Map } from "immutable";
import {
  clearComponentState,
  updateComponentState,
} from "../../../actions/component.actions.js";

import {
  REPORT_SUBMENU_ID,
  REPORT_DEFAULTERLIST_ID,
  REPORT_DEFAULTERLIST_ID2,
  IS_RELOAD,
  DEFAULTERLIST_TAB1,
  DEFAULTERLIST_TAB2,
  DEFAULTERLIST_TAB3,
  SORT_BY_EMPLOYEE,
} from "../../../constants/app.constants";
import "./table-view.css";
import {
  ReportStyles,
  getDefaulterList,
  setNewTableData,
  setDefaultEmployeeData,
  getDefaulterListForEmployees,
  setDatesTableData,
} from "./tableView.utils";
import { requestData, clearData } from "../../../actions/data.actions";
import defaulterList_subTable_employee_date from "../../json/reports/defaulter list/defaulterList_subTable_employee_date.json";
import defaulterList_subTable_date_employee from "../../json/reports/defaulter list/defaulterList_subTable_date_employee.json";
import SubTableView from "./SubTableView";
import { getDataFromCookie } from "../../utils/CheckLoginDetails";
import {
  dataAbstraction,
  dataAbstractionForDefaulter,
} from "../../utils/dataAbstraction.utils";

var datesArrayToCheck = [];
var idArrayToCheck = [];

class RenderRows extends Component {
  state = {
    isShowLoader: false,
    datestyle: "active-tab",
    noentrystyle: "active-tab",
    leaveystyle: "",
    filledentrystyle: "",
    isOpen: false,
    isTableData: false,
    subTableData: {
      rows: [],
    },
    selectedDay: null, /// ajay
  };

  componentWillMount() {
    datesArrayToCheck = [];
    idArrayToCheck = [];

    if (getDataFromCookie().role) {
      this.setState({
        LoggedInUser: getDataFromCookie().role,
      });
    }
  }

  componentWillUnmount() {
    datesArrayToCheck = [];
    idArrayToCheck = [];

    const { updateComponentState } = this.props;
    updateComponentState(REPORT_SUBMENU_ID, IS_RELOAD, false);
    this.setState({
      tabname: DEFAULTERLIST_TAB1,
      selected_emp: "",
      isShowLoader: false,
      datestyle: "active-tab",
      noentrystyle: "active-tab",
      leaveystyle: "",
      filledentrystyle: "",
      isOpen: false,
      isTableData: false,
      subTableData: {
        rows: [],
      },
      employeeData: [],
    });
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.refreshState &&
      this.props.refreshState !== nextProps.refreshState
    ) {
      const { refreshState, updateComponentState } = nextProps;
      const is_reload = refreshState.get(IS_RELOAD, false);

      if (is_reload && is_reload === true) {
        this.setState(
          {
            isOpen: false,
            subTableData: {
              rows: [],
            },
          },
          () => {
            updateComponentState(REPORT_SUBMENU_ID, IS_RELOAD, false);
          }
        );
      }
    }

    if (this.props.employeeData !== nextProps.employeeData) {
      this.setState({
        employeeData: nextProps.employeeData.apiData,
      });
    }

    if (
      this.props.defaulterData !== nextProps.defaulterData &&
      nextProps.defaulterData &&
      nextProps.defaulterData.apiData
    ) {
      let reportDashBoard;

      reportDashBoard = dataAbstraction(
        nextProps.defaulterData.apiData,
        defaulterList_subTable_employee_date
      );

      let reportTableData = reportDashBoard;
      let finalEmpSet = [];
      if (reportTableData) {
        let reportTableDataRows = reportTableData.rows;
        let tempEmpIdArray = [];

        for (let i = 1; i < reportTableDataRows.length; i++) {
          tempEmpIdArray.push(
            reportTableDataRows[i].columns[0].values[0].value
          );
        }

        let tempEmpSet = [];
        if (this.props.employeeData && this.props.employeeData.length > 0) {
          let employeeDataTemp = this.props.employeeData;
          for (let i = 0; i < employeeDataTemp.length; i++) {
            let tempobj = {
              id: employeeDataTemp[i].id,
              emp_name: employeeDataTemp[i].name,
            };
            tempEmpSet.push(tempobj);
          }

          let ogData = nextProps.defaulterData.apiData.ogData;

          for (let i = 0; i < tempEmpSet.length; i++) {
            let tempObj;

            for (let j = 0; j < ogData.length; j++) {
              if (tempEmpSet[i].id === ogData[j].emp_id) {
                if (ogData[j].estimated_hrs === "0.00") {
                  //Leave Object
                  tempObj = {
                    billing_date: ogData[j].billing_date,
                    emp_id: ogData[j].emp_id,
                    available_hrs: "0.00",
                    estimated_hrs: "0.00",
                    bilable_hrs: "0.00",
                    nonbilable_hrs: "0.00",
                    emp_name: tempEmpSet[i].emp_name,
                  };
                } else if (ogData[j].estimated_hrs !== "0.00") {
                  //entry data object
                  tempObj = {
                    billing_date: ogData[j].billing_date,
                    emp_id: ogData[j].emp_id,
                    available_hrs: "8.00",
                    estimated_hrs: ogData[j].estimated_hrs,
                    bilable_hrs: ogData[j].bilable_hrs,
                    nonbilable_hrs: ogData[j].nonbilable_hrs,
                    emp_name: tempEmpSet[i].emp_name,
                  };
                }
                finalEmpSet.push(tempObj);
                break;
              }
            }

            if (finalEmpSet[i]) {
            } else {
              tempObj = {
                billing_date: "",
                emp_id: tempEmpSet[i].id,
                available_hrs:
                  this.state.selectedDay == 6 || this.state.selectedDay == 0 //// ajay21
                    ? "0.00"
                    : "8.00",
                estimated_hrs: "0.00",
                bilable_hrs: "0.00",
                nonbilable_hrs: "0.00",
                emp_name: tempEmpSet[i].emp_name,
              };

              finalEmpSet.push(tempObj);
            }
          }
        }

        let sortedSet = [];
        if (this.state.tabname === DEFAULTERLIST_TAB1) {
          sortedSet = [];
          for (let k = 0; k < finalEmpSet.length; k++) {
            if (
              finalEmpSet[k].available_hrs === "8.00" || /// ajay21
              finalEmpSet[k].estimated_hrs === "0.00"
            ) {
              sortedSet.push(finalEmpSet[k]);
            }
          }
        } else if (this.state.tabname === DEFAULTERLIST_TAB2) {
          sortedSet = [];
          for (let k = 0; k < finalEmpSet.length; k++) {
            if (finalEmpSet[k].available_hrs === "0.00") {
              sortedSet.push(finalEmpSet[k]);
            }
          }
        } else if (this.state.tabname === DEFAULTERLIST_TAB3) {
          sortedSet = [];
          for (let k = 0; k < finalEmpSet.length; k++) {
            if (
              finalEmpSet[k].available_hrs === "8.00" &&
              finalEmpSet[k].estimated_hrs !== "0.00"
            ) {
              sortedSet.push(finalEmpSet[k]);
            }
          }
        }

        let reportTableDataFinal = setNewTableData(
          sortedSet,
          this.props.dataObject.sort_by
        );

        if (reportTableDataFinal) {
          this.setState({
            isTableData: true,
            subTableData: reportTableDataFinal,
          });
        }
      }
    }

    if (this.props.setDatesState !== nextProps.setDatesState) {
      // console.log("nextProps.setDatesState = ", nextProps.setDatesState);
      if (
        nextProps.setDatesState.apiData &&
        nextProps.setDatesState.isFetching === false
      ) {
        if (
          nextProps.setDatesState.apiData !== "" &&
          this.state.selected_emp !== undefined &&
          idArrayToCheck.includes(this.state.selected_emp.emp_id)
        ) {
          // console.log(
          //   "this.state.selected_emp ================  ",
          //   this.state.selected_emp
          // );

          let newFormattedDatesData = setDatesTableData(
            nextProps.setDatesState.apiData.ogData,
            this.props.defaulterDateData,
            this.state.selected_emp,
            this.state.tabname
          );

          let reportTableDataFinal = dataAbstractionForDefaulter(
            newFormattedDatesData,
            defaulterList_subTable_date_employee
          );

          if (reportTableDataFinal) {
            this.setState(
              {
                isTableData: true,
                subTableData: reportTableDataFinal.tableData,
                isShowLoader: false,
              },
              () => {
                if (this.state.byRoworTab === "tab") {
                  this.setState({
                    isOpen: true,
                  });
                } else {
                  this.setState({
                    isOpen: true,
                  });
                }
              }
            );
          }
        } else {
          this.setState(
            {
              isShowLoader: false,
            },
            () => {
              if (this.state.byRoworTab === "tab") {
                this.setState({
                  isOpen: true,
                });
              } else {
                this.setState({
                  isOpen: !this.state.isOpen,
                });
              }
            }
          );
        }
      }
    }
  }

  fetchTabData(selectedValue, tabname, byRoworTab) {
    const { requestData, dataObject, employeeData } = this.props;
    // console.log("selectedValue in fetchdabdata = ", selectedValue);

    this.setState(
      {
        isShowLoader: true,
        tabname: tabname,
      },
      () => {
        if (dataObject.sort_by === SORT_BY_EMPLOYEE) {
          getDefaulterListForEmployees(
            { requestData },
            dataObject,
            this.state.LoggedInUser
          );
        } else {
          getDefaulterList(
            { requestData },
            selectedValue,
            this.state.LoggedInUser
          ).then((response) => {
            if (response.apiData && response.apiData.isFetching === false) {
              if (response.apiData.apiData === "") {
                let reportTableDataFinal = setDefaultEmployeeData(
                  employeeData,
                  dataObject.sort_by,
                  this.state.tabname
                );
                if (reportTableDataFinal) {
                  this.setState(
                    {
                      isTableData: true,
                      subTableData: reportTableDataFinal,
                      isShowLoader: false,
                    },
                    () => {
                      if (byRoworTab === "tab") {
                        this.setState({
                          isOpen: true,
                        });
                      } else {
                        if (this.state.isOpen === true) {
                          this.setState({
                            isOpen: true,
                          });
                        } else {
                          this.setState({
                            isOpen: !this.state.isOpen,
                          });
                        }
                      }
                    }
                  );
                }
              } else {
                this.setState(
                  {
                    isShowLoader: false,
                  },
                  () => {
                    if (byRoworTab === "tab") {
                      this.setState({
                        isOpen: true,
                      });
                    } else {
                      if (this.state.isOpen === true) {
                        this.setState({
                          isOpen: true,
                        });
                      } else {
                        this.setState({
                          isOpen: !this.state.isOpen,
                        });
                      }
                    }
                  }
                );
              }
            }
          });
        }
      }
    );
  }

  onClickRow = (e) => {
    this.setState({
      noentrystyle: "active-tab",
      leaveystyle: "",
      filledentrystyle: "",
    });

    if (e.target.dataset.tabname) {
    } else {
      if (this.props.dataObject.sort_by === SORT_BY_EMPLOYEE) {
        let selectedID = e.target.dataset.key;
        let selectedName = e.target.dataset.date; //here it is employee name

        let selectedEmp = {
          emp_id: selectedID,
          emp_name: selectedName,
        };

        let tabname = DEFAULTERLIST_TAB1;

        if (idArrayToCheck.includes(selectedID)) {
          this.setState({
            isOpen: !this.state.isOpen,
          });
        } else {
          // console.log("before pushing idArrayToCheck= ", idArrayToCheck);
          idArrayToCheck.pop();
          idArrayToCheck.push(selectedID);
          // console.log("after pushing idArrayToCheck = ", idArrayToCheck);
          this.setState(
            {
              selected_emp: selectedEmp,
            },
            () => {
              this.fetchTabData(this.state.selected_emp, tabname, "row");
            }
          );
        }
      } else {
        let selectedDate = e.target.dataset.date;

        const [year, month, day] = selectedDate.split("-"); /// ajay21
        const date = new Date(year, month - 1, day);
        const days = date.getDay();
        this.setState({ selectedDay: days }, () => {
          // console.log(
          //   this.state.selectedDay,
          //   typeof this.state.selectedDay,
          //   date,
          //   "selectedDat"
          // );
        }); /// ajay

        let tabname = DEFAULTERLIST_TAB1;

        if (datesArrayToCheck.includes(selectedDate)) {
          this.setState({
            isOpen: !this.state.isOpen,
          });
        } else {
          // console.log("before pushing = ", datesArrayToCheck);
          datesArrayToCheck.pop();
          datesArrayToCheck.push(selectedDate);
          // console.log("after pushing = ", datesArrayToCheck);
          this.fetchTabData(selectedDate, tabname, "row");
        }
      }
    }
  };

  onClickTab = (e) => {
    let tabname = e.target.dataset.tabname;
    if (tabname === DEFAULTERLIST_TAB1) {
      this.setState({
        noentrystyle: "active-tab",
        leaveystyle: "",
        filledentrystyle: "",
      });
    } else if (tabname === DEFAULTERLIST_TAB2) {
      this.setState({
        noentrystyle: "",
        leaveystyle: "active-tab",
        filledentrystyle: "",
      });
    } else if (tabname === DEFAULTERLIST_TAB3) {
      this.setState({
        noentrystyle: "",
        leaveystyle: "",
        filledentrystyle: "active-tab",
      });
    }

    let selectedValue;

    if (this.props.dataObject.sort_by === SORT_BY_EMPLOYEE) {
      //here it is employee name

      // console.log("tabname on tab click = ", tabname);
      // console.log("selectedEmp on tab click = ", this.state.selected_emp);
      // console.log("idArrayToCheck on tab = ", idArrayToCheck);
      selectedValue = this.state.selected_emp;
    } else {
      let selectedDate = this.props.row.columns[0].values[0].value;
      // console.log("tabname on tab click = ", tabname);
      // console.log("selectedDate on tab click = ", selectedDate);
      // console.log("datesArrayToCheck on tab = ", datesArrayToCheck);
      selectedValue = selectedDate;
    }

    this.setState(
      {
        isOpen: true,
      },
      () => {
        this.fetchTabData(selectedValue, tabname, "tab");
      }
    );
  };

  render() {
    return (
      <div>
        <div
          className={"div-table-row "}
          style={{
            ...ReportStyles.tableRow,
            flexDirection: "column",
            padding: "12px 2px",
          }}
          onClick={this.onClickRow}
          data-key={this.props.row.columns[1].values[0].value}
          data-date={this.props.row.columns[0].values[0].value}
          id="row-collapsible"
        >
          {this.props.row.columns[0].values[0].value}
        </div>
        {this.state.isOpen ? (
          <div>
            {this.state.isTableData === true &&
            (datesArrayToCheck.includes(
              this.props.row.columns[0].values[0].value
            ) ||
              idArrayToCheck.includes(
                this.props.row.columns[1].values[0].value
              )) ? (
              <div
                className="pr-container pr-collapse"
                style={{ padding: "0px", textAlign: "center", border: "0px" }}
              >
                <div
                  className="pr-row"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <div
                    className={"pr-col-3 pr-tabs " + this.state.noentrystyle}
                    data-tabName={DEFAULTERLIST_TAB1}
                    onClick={this.onClickTab}
                  >
                    {DEFAULTERLIST_TAB1}
                  </div>
                  <div
                    className={"pr-col-3 pr-tabs " + this.state.leaveystyle}
                    data-tabName={DEFAULTERLIST_TAB2}
                    onClick={this.onClickTab}
                  >
                    {DEFAULTERLIST_TAB2}
                  </div>
                  <div
                    className={
                      "pr-col-3 pr-tabs " + this.state.filledentrystyle
                    }
                    data-tabName={DEFAULTERLIST_TAB3}
                    onClick={this.onClickTab}
                  >
                    {DEFAULTERLIST_TAB3}
                  </div>
                </div>

                {this.state.subTableData.rows[1] ? (
                  <SubTableView
                    {...this.state.subTableData}
                    isFooterBold={false}
                    isShowLoader={this.state.isShowLoader}
                  />
                ) : (
                  <div className="pr-collapse">NO DATA FOUND</div>
                )}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const { data, component } = state;
  return {
    componentState: component.get(ownProps.id, Map()),
    defaulterData: data.getIn([REPORT_DEFAULTERLIST_ID, "apiData"], null),
    setDatesState: data.getIn([REPORT_DEFAULTERLIST_ID2, "apiData"], null),

    refreshState: component.get(REPORT_SUBMENU_ID, Map()),
  };
}

export default connect(
  mapStateToProps,
  {
    clearComponentState,
    updateComponentState,
    requestData,
    clearData,
  }
)(RenderRows);