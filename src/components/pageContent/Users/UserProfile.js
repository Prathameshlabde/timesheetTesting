import React, { Component } from "react";
import { connect } from "react-redux";
import { Map } from "immutable";
import {
  requestData,
  updateData,
  fetchAllUsers
} from "../../../actions/users.actions";
import {
  deleteComponentState,
  updateComponentState
} from "../../../actions/component.actions.js";
import {
  USERS_MODULE_ID,
  USERS_NEW_ENTRY,
  USERS_EDIT_ENTRY_ID,
  USERS_MODULE_ID_2,
  SNACKBAR_ID,
  SNACKBAR_SHOW
} from "../../../constants/app.constants.js";
import {
  spanStyleHeader,
  addNewUser,
  updateUser,
  fetchEntryDataFromUtils,
  fetchEmployeeList
} from "./Users.utils";

import { USER_DIALOG_MSG } from "../../../constants/dialog.constants";
import Icon from "../../widgets/Icon";
import moment from "moment";
import { dateFormatter } from "../../utils/calender.utils";
import "./users.css";
import ProfileForm from "../UserProfile/ProfileForm";

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      team_emp: [],
      fname: "",
      lname: "",
      uname: "",
      password: "",
      role: "employee",
      team_name: "Filemaker",
      email_id: "",
      validationMsg: "",
      isDatePickerOpen: false,
      join_date: dateFormatter(moment(), "yyyy-MM-dd"),
      last_date: "",
      isEditEntry: false,
      snackIsOpen: false,
      snackMessage: "",
      isToFormClose: true,
      r1firstChecked: true,
      is_reminder: "1",
      UserRoleData: [
        {
          id: "employee",
          name: "Employee"
        },
        {
          id: "pm",
          name: "Project Manager"
        },
        {
          id: "admin",
          name: "Admin"
        },
        {
          id: "superadmin",
          name: "Super Admin"
        }
      ],

      TeamData: [
        {
          id: "filemaker",
          name: "Filemaker"
        },
        {
          id: "dotnet",
          name: "Dotnet"
        },
        {
          id: "iphone",
          name: "Iphone"
        },
        {
          id: "support",
          name: "Support"
        },
        {
          id: "salesforce",
          name: "Salesforce"
        },
        {
          id: "android",
          name: "Android"
        }
      ]
    };
  }

  componentWillMount() {
    const { editState } = this.props;
    const entryID = editState.get(USERS_EDIT_ENTRY_ID, "");
    if (entryID) {
      // console.log("entryID in componentWillMount = ", entryID);
      fetchEntryDataFromUtils(entryID, this.props);
    }

    fetchEmployeeList(this.props);
  }

  componentDidMount() {
    const { editState } = this.props;
    const entryID = editState.get(USERS_EDIT_ENTRY_ID, "");
    if (entryID === "") {
      setTimeout(
        function() {
          this.resetNewEntry(); //After 1 second, set render to true
        }.bind(this),
        100
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    const { editState } = this.props;
    const { employeesData } = nextProps;
    if (
      employeesData &&
      employeesData !== this.props.employeesData &&
      employeesData.apiData
    ) {
      this.setState({
        employeesData: employeesData.apiData
      });
    }

    const entryID = editState.get(USERS_EDIT_ENTRY_ID, "");

    if (entryID) {
      if (nextProps.entryDataState !== this.props.entryDataState) {
        const { entryDataState } = nextProps;

        this.setState(
          {
            fname: entryDataState.apiData.fname,
            lname: entryDataState.apiData.lname,
            uname: entryDataState.apiData.uname,
            password: entryDataState.apiData.password,
            role: entryDataState.apiData.role,
            team_name: entryDataState.apiData.team_name,
            email_id: entryDataState.apiData.email_id,
            isDatePickerOpen: false,
            join_date: entryDataState.apiData.join_date,
            last_date: entryDataState.apiData.last_date,
            is_reminder: entryDataState.apiData.is_reminder,
            isEditEntry: true,
            team_emp: entryDataState.apiData.pm_team
          },
          () => {
            if (this.state.is_reminder === "1") {
              this.setState({
                r1firstChecked: true
              });
            } else {
              this.setState({
                r1firstChecked: false
              });
            }
          }
        );
      }
    }
  }

  onDatePickerIconClick = () => {
    this.setState({
      isDatePickerOpen: !this.state.isDatePickerOpen
    });
  };

  closeNewEntry = isButtonPressed => {
    this.setState({
      description: "",
      start_date: "",
      end_date: "",
      estimated_hrs: "0",
      tasksData: "",
      subTasksData: "",
      entryData: "",
      join_date: "",
      last_date: "",
      email_id: "",
      isDatePickerOpen: false
    });

    const { deleteComponentState } = this.props;
    deleteComponentState(USERS_MODULE_ID);
  };

  resetNewEntry = () => {
    this.setState({
      uname: "",
      password: ""
    });
  };

  onChangeFieldValues = (id, updatedValue) => {
    this.setState({
      [id]: updatedValue
    });

    if (id === "is_reminder") {
      if (updatedValue === "0") {
        this.setState({
          r1firstChecked: false
        });
      } else {
        this.setState({
          r1firstChecked: true
        });
      }
    } else {
      this.setState({
        [id]: updatedValue
      });
    }
  };

  submitNewEntry = () => {
    const {
      fname,
      lname,
      uname,
      password,
      join_date,
      last_date,
      email_id
    } = this.state;
    let startDate = "";
    let endDate = "";
    if (typeof (join_date !== "string")) {
      startDate = moment(join_date);
    } else {
      startDate = join_date;
    }

    if (typeof (last_date !== "string")) {
      endDate = moment(last_date);
    } else {
      endDate = last_date;
    }
    const { editState, dataOffset, updateComponentState } = this.props;
    const entryID = editState.get(USERS_EDIT_ENTRY_ID, "");
    if (fname === "") {
      this.setState({
        validationMsg: "Please enter first name."
      });
    } else if (lname === "") {
      this.setState({
        validationMsg: "Please enter last name."
      });
    } else if (
      email_id !== null &&
      email_id.trim() !== "" &&
      email_id.trim().match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) === null
    ) {
      this.setState({
        validationMsg: "Please enter correct email id."
      });
    } else if (uname === "" || uname.length < 4) {
      this.setState({
        validationMsg: "Please enter username of min 4 character."
      });
    } else if (password === "" || password.length < 5) {
      this.setState({
        validationMsg: "Please enter password of min 5 character."
      });
    } else if (join_date === "") {
      this.setState({
        validationMsg: "Please select joining date."
      });
    } else if (endDate !== "" && startDate > endDate) {
      this.setState({
        validationMsg: "Please select last date properly."
      });
    } else {
      this.setState({
        validationMsg: ""
      });

      if (entryID) {
        updateUser(entryID, this.props, this.state, dataOffset).then(
          response => {
            if (response === true) {
              updateComponentState(SNACKBAR_ID, SNACKBAR_SHOW, {
                showSnackBar: true,
                snackMessage: USER_DIALOG_MSG.update.success
              });
              this.updateStateAndRedux();
              this.setState({
                isToFormClose: true
              });
            } else if (response === "duplicate") {
              this.setState({
                validationMsg: USER_DIALOG_MSG.duplicate,
                isToFormClose: false
              });
            } else {
              this.setState({
                snackIsOpen: true,
                snackMessage: USER_DIALOG_MSG.update.fail,
                isToFormClose: false
              });
            }
          }
        );
      } else {
        addNewUser(this.props, this.state, dataOffset).then(response => {
          if (response === true) {
            this.setState(
              {
                isToFormClose: true
              },
              () => {
                updateComponentState(SNACKBAR_ID, SNACKBAR_SHOW, {
                  showSnackBar: true,
                  snackMessage: USER_DIALOG_MSG.add.success
                });
                this.updateStateAndRedux();
              }
            );
          } else if (response === "duplicate") {
            this.setState({
              validationMsg: USER_DIALOG_MSG.duplicate,
              isToFormClose: false
            });
          } else {
            this.setState({
              snackIsOpen: true,
              snackMessage: USER_DIALOG_MSG.add.fail,
              isToFormClose: false
            });
          }
        });
      }
    }
  };

  updateStateAndRedux() {
    const { isToFormClose } = this.state;
    if (isToFormClose === true) {
      this.closeNewEntry(false);
    }
  }

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
    const { editState } = this.props;
    const empID = editState.get(USERS_EDIT_ENTRY_ID, "");
    return (
      <div className="pr-inner-div pr-center">
        <div className="pr-header-level">
          <div
            className="pr-col-inner-div-header-left"
            style={{ padding: "4px 0" }}
          >
            {this.state.isEditEntry === true ? (
              <span style={spanStyleHeader}>Profile Details</span>
            ) : (
              <span style={spanStyleHeader}>New User</span>
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
          </div>
        </div>

        <div
          className="pr-container"
          id="newEntry"
          style={{
            maxHeight: "75vh",
            overflow: "scroll"
          }}
        >
          <ProfileForm
            id={empID}
            viewOnly={true}
            style={{ pointerEvents: "none" }}
          />
        </div>
      </div>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const { component, users } = state;
  return {
    userState: users.getIn([USERS_NEW_ENTRY, "apiData"], Map()),
    editState: component.get(USERS_MODULE_ID, Map()),
    entryDataState: users.getIn([USERS_MODULE_ID_2, "apiData"], null),
    employeesData: users.getIn(["USERS_MODULE_ID_3", "apiData"], null)
  };
}

export default connect(
  mapStateToProps,
  {
    deleteComponentState,
    updateComponentState,
    requestData,
    updateData,
    fetchAllUsers
  }
)(UserProfile);
