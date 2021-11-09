import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Map } from "immutable";
import {
  clearComponentState,
  updateComponentState,
} from "../../../actions/component.actions.js";

import { fetchAllClients } from "../../../actions/client.actions";
import client_module_table from "../../json/Client/client_module_table.json";

import DiaglogBox from "../../widgets/AlertBox.js";
import SpanLabel from "../../widgets/SpanLabel";
import TextField from "../../widgets/TextField";
import Button from "../../widgets/Button";
import TableView from "../../widgets/TableView/TableView.js";
import Snackbar from "../../widgets/Snackbar";
import SearchModule from "../../widgets/SearchModule";

import {
  requestData,
  updateData,
  deleteData,
} from "../../../actions/data.actions.js";
import {
  APP_TITLE_SUBTITLE,
  EDIT_CLIENT_ID,
  TITLE_SUBTITLE_ID,
  NO_RECORDS_FOUND,
} from "../../../constants/app.constants";

import { CLIENT_DIALOG_MSG } from "../../../constants/dialog.constants";
import { dataAbstraction } from "../../utils/dataAbstraction.utils.js";

import {
  fetchClientFromUtils,
  addNewClient,
  updateClient,
  deleteClient,
  fetchSingleDataFromUtils,
} from "./Clients.utils";
import { getPageCount } from "../Projects/Projects.utils";

import "../Dashboard/dashboard.css";

class Clients extends Component {
  static propTypes = {
    id: PropTypes.string,
    componentState: PropTypes.object.isRequired,
    updateComponentState: PropTypes.func.isRequired,
  };

  state = {
    showdeleteDialog: false,
    validationMessage: "",
    isEdit: false,
    idToEdit: "",
    dataErrorMsg: NO_RECORDS_FOUND,
    clientId: "",
    firstName: "",
    lastName: "",
    companyName: "",
    userName: "",
    userPassword: "",
    clientDashBoardData: "",
    dataLimit: 10,
    dataOffset: 0,
    totalRowsCount: 0,
    currentPage: 1,
    buttonText: "Submit",
  };

  componentWillMount() {
    const { id, fetchAllClients, updateComponentState } = this.props;
    const { dataLimit, dataOffset, searchParameterKey } = this.state;

    let titleSub = {
      title: "Clients",
      subtitle: "",
    };
    updateComponentState(TITLE_SUBTITLE_ID, APP_TITLE_SUBTITLE, titleSub);

    fetchClientFromUtils(
      { fetchAllClients, updateComponentState, id },
      { dataLimit, dataOffset, searchParameterKey }
    );
  }

  componentWillReceiveProps(nextProps) {
    const { clientDataState, clientSingleDataState } = nextProps;

    // console.log("clientSingleDataState :-", clientSingleDataState);

    if (clientDataState !== this.props.clientDataState) {
      if (
        clientDataState &&
        clientDataState.apiData &&
        clientDataState.apiData !== true
      ) {
        const clientDashBoard = dataAbstraction(
          clientDataState.apiData.filteredData,
          client_module_table
        );

        this.setState({
          clientDashBoardData: clientDashBoard,
          totalRowsCount: parseInt(clientDataState.apiData.totalCount, 10),
          firstName: "",
          lastName: "",
          companyName: "",
          userName: "",
          userPassword: "",
          buttonText: "Submit",
          isEdit: false,
          idToEdit: "",
          dataErrorMsg: "",
          headText: "Add Client",
        });
      } else {
        this.setState({
          dataErrorMsg: NO_RECORDS_FOUND,
        });
      }
    }

    if (
      clientSingleDataState !== this.props.clientSingleDataState &&
      clientSingleDataState &&
      clientSingleDataState.apiData
    ) {
      let allData = clientSingleDataState.apiData;
      // console.log("allData :-", allData);

      this.setState(
        {
          firstName: "",
          lastName: "",
          companyName: "",
          userName: "",
          userPassword: "",
        },
        () => {
          this.setState(
            {
              firstName: allData.fname,
              lastName: allData.lname,
              companyName: allData.company,
              userName: allData.userid,
              userPassword: allData.password,
              buttonText: "Update",
            },
            () => {
              // console.log("userName :-", this.state.userName);
            }
          );
        }
      );
    }
  }

  onChangeFieldValues = (id, updatedValue) => {
    this.setState({
      [id]: updatedValue,
    });
  };

  submitNewEntry = () => {
    const {
      id,
      requestData,
      fetchAllClients,
      updateData,
      updateComponentState,
    } = this.props;
    // updateComponentState
    const {
      idToEdit,
      firstName,
      lastName,
      companyName,
      userName,
      userPassword,
      isEdit,
      dataLimit,
      dataOffset,
      searchParameterKey,
    } = this.state;

    // console.log("userName :-", userName, userPassword);

    if (firstName === "") {
      this.setState({
        validationMessage: "Please enter client first name.",
      });
    } else if (lastName === "") {
      this.setState({
        validationMessage: "Please enter client last name.",
      });
    } else if (companyName === "") {
      this.setState({
        validationMessage: "Please enter client's company name.",
      });
    } else if (userName === "" || userName === null) {
      this.setState({
        validationMessage: "Please enter client username.",
      });
    } else if (userPassword === "" || userPassword === null) {
      this.setState({
        validationMessage: "Please enter client password.",
      });
    } else {
      if (isEdit === false) {
        addNewClient(
          firstName,
          lastName,
          companyName,
          userName,
          userPassword,
          { requestData, fetchAllClients, updateComponentState, id },
          { dataLimit, dataOffset, searchParameterKey }
        ).then((response) => {
          if (response === true) {
            this.setState({
              snackIsOpen: true,
              snackMessage: CLIENT_DIALOG_MSG.add.success,
            });
          } else if (response === "duplicate") {
            this.setState({
              // snackIsOpen: true,
              // snackMessage: CLIENT_DIALOG_MSG.duplicate
              validationMessage: CLIENT_DIALOG_MSG.duplicate,
            });
          } else {
            this.setState({
              snackIsOpen: true,
              snackMessage: CLIENT_DIALOG_MSG.add.fail,
            });
          }
        });
      } else {
        updateClient(
          idToEdit,
          firstName,
          lastName,
          companyName,
          userName,
          userPassword,
          { updateData, fetchAllClients, updateComponentState, id },
          { dataLimit, dataOffset, searchParameterKey }
        ).then((response) => {
          if (response === true) {
            this.setState({
              snackIsOpen: true,
              snackMessage: CLIENT_DIALOG_MSG.update.success,
            });
          } else if (response === "duplicate") {
            this.setState({
              // snackIsOpen: true,
              // snackMessage: CLIENT_DIALOG_MSG.duplicate
              validationMessage: CLIENT_DIALOG_MSG.duplicate,
            });
          } else {
            this.setState({
              snackIsOpen: true,
              snackMessage: CLIENT_DIALOG_MSG.update.fail,
            });
          }
        });
      }
      this.setState({
        validationMessage: "",
      });
    }
  };

  onclickEdit = (idToEdit) => {
    const { requestData } = this.props;
    this.setState({
      idToEdit: idToEdit,
      isEdit: true,
      validationMessage: "",
      headText: "Edit Client",
    });
    fetchSingleDataFromUtils(idToEdit, EDIT_CLIENT_ID, { requestData });
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
    const {
      id,
      deleteData,
      fetchAllClients,
      updateComponentState,
    } = this.props;
    const { dataLimit, dataOffset, searchParameterKey } = this.state;
    deleteClient(idToDelete, { deleteData, id }).then((response) => {
      if (response === true) {
        this.setState(
          {
            snackIsOpen: true,
            snackMessage: CLIENT_DIALOG_MSG.detele.success,
            clientDashBoardData: "",
          },
          () => {
            fetchClientFromUtils(
              { fetchAllClients, updateComponentState, id },
              { dataLimit, dataOffset, searchParameterKey }
            );
          }
        );
      } else {
        this.setState({
          snackIsOpen: true,
          snackMessage: CLIENT_DIALOG_MSG.detele.fail,
        });
      }
    });

    this.setState({
      showdeleteDialog: false,
      idToDelete: null,
    });
  };

  onPageChangePagination = (selectedNumber) => {
    const { id, fetchAllClients, updateComponentState } = this.props;

    let tempNumber = selectedNumber - 1;

    this.setState(
      {
        dataOffset: tempNumber * this.state.dataLimit,
        currentPage: selectedNumber,
      },
      () => {
        const { dataLimit, dataOffset, searchParameterKey } = this.state;
        fetchClientFromUtils(
          { fetchAllClients, updateComponentState, id },
          { dataLimit, dataOffset, searchParameterKey }
        );
      }
    );
  };

  onSearchSubmit() {
    const { id, fetchAllClients, updateComponentState } = this.props;
    this.setState(
      {
        clientDashBoardData: "",
        dataLimit: 10,
        dataOffset: 0,
        totalRowsCount: 0,
        currentPage: 1,
      },
      () => {
        const { dataLimit, dataOffset, searchParameterKey } = this.state;
        fetchClientFromUtils(
          { fetchAllClients, updateComponentState, id },
          { dataLimit, dataOffset, searchParameterKey }
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
    const { id, fetchAllClients, updateComponentState } = this.props;
    this.setState(
      {
        searchParameterKey: "",
        dataLimit: 10,
        dataOffset: 0,
        totalRowsCount: 0,
        currentPage: 1,
      },
      () => {
        const { dataLimit, dataOffset, searchParameterKey } = this.state;
        fetchClientFromUtils(
          { fetchAllClients, updateComponentState, id },
          { dataLimit, dataOffset, searchParameterKey }
        );
      }
    );
  }

  onSnackClose() {
    this.setState({
      snackIsOpen: false,
    });
  }

  clearData = () => {
    this.setState({
      firstName: "",
      lastName: "",
      companyName: "",
      userName: "",
      userPassword: "",
      buttonText: "Submit",
      isEdit: false,
      headText: "Add Client",
    });
  };

  render() {
    const { currentPage } = this.state;
    let paginationObject = {
      totalPage: getPageCount(this.state.totalRowsCount, this.state.dataLimit),
      currentPage: currentPage,
      maxNumbersOnLeftRight: 4,
      onChange: this.onPageChangePagination,
    };

    return (
      <div className="page-content-client" id={this.props.id}>
        <DiaglogBox
          open={this.state.showdeleteDialog}
          title="Alert"
          onCancel={this.onClickcancelToDialog}
          onConfirm={() => this.onClickOkToDialog(this.state.idToDelete)}
          button1={"Cancel"}
          button2={"Ok"}
          alertMsg="Are you sure you want to delete?"
        />
        <div
          style={{ padding: "0px 2.8% 20px" }}
          className="pr-container"
          id="newEntry"
        >
          <div className="pr-row" style={{ padding: "0px" }}>
            <h4>{this.state.headText}</h4>
          </div>
          <div className="pr-row" style={{ padding: "0px" }}>
            <div className="pr-col-3">
              <SpanLabel
                data="First Name "
                className="span-label"
                isRequired={true}
              />
              <TextField
                id="firstName"
                data={this.state.firstName}
                onChange={this.onChangeFieldValues}
                classNames="pr-txtfield-lg w-90"
              />
            </div>
            <div className="pr-col-3">
              <SpanLabel
                data="Last Name"
                className="span-label"
                isRequired={true}
              />
              <TextField
                id="lastName"
                data={this.state.lastName}
                onChange={this.onChangeFieldValues}
                classNames="pr-txtfield-lg w-90"
              />
            </div>
            <div className="pr-col-3">
              <SpanLabel
                data="Company Name"
                className="span-label"
                isRequired={true}
              />
              <TextField
                id="companyName"
                data={this.state.companyName}
                onChange={this.onChangeFieldValues}
                classNames="pr-txtfield-lg w-90"
              />
            </div>
          </div>

          <div className="pr-row" style={{ padding: "0px" }}>
            <div className="pr-col-3">
              <SpanLabel
                data="User Name"
                className="span-label"
                isRequired={true}
              />
              <TextField
                id="userName"
                data={this.state.userName}
                onChange={this.onChangeFieldValues}
                classNames="pr-txtfield-lg w-90"
              />
            </div>
            <div className="pr-col-3">
              <SpanLabel
                data="Password"
                className="span-label"
                isRequired={true}
              />
              <TextField
                id="userPassword"
                fieldType="password"
                data={this.state.userPassword}
                onChange={this.onChangeFieldValues}
                classNames="pr-txtfield-lg w-90"
              />
            </div>
            <div className="pr-col-3">
              <div
                style={{ width: "83%", textAlign: "right", paddingTop: "18px" }}
              >
                {this.state.isEdit === true ? (
                  <Button
                    onClick={this.clearData}
                    className="clear-button-category"
                    data="Cancel"
                  />
                ) : null}
                <Button
                  onClick={this.submitNewEntry}
                  className="submit-button-category"
                  data={this.state.buttonText}
                  style={{ marginLeft: "15px" }}
                />
              </div>
            </div>
          </div>
          <div className="pr-row" style={{ padding: "0px" }}>
            <div className="pr-col-9" style={{ textAlign: "right" }}>
              {this.state.validationMessage !== "" ? (
                <span style={{ color: "#FF0000", paddingRight: "73px" }}>
                  {this.state.validationMessage}
                </span>
              ) : null}

              <div className="label-div">
                <Snackbar
                  snackIsOpen={this.state.snackIsOpen}
                  snackMessage={this.state.snackMessage}
                  onSnackClose={() => this.onSnackClose()}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className="dashboard-section-search"
          style={{ paddingLeft: "2.9%" }}
        >
          <SearchModule
            id="searchModule"
            onSubmit={() => this.onSearchSubmit()}
            onTextChange={(e, f) => this.textFieldSubmit(e, f)}
            onCancel={() => this.onSearchCancel()}
            data={this.state.searchParameterKey}
          />
        </div>
        <div className="dashboard-section4">
          {this.state.clientDashBoardData ? (
            <TableView
              {...this.state.clientDashBoardData}
              onclickEdt={(e) => this.onclickEdit(e)}
              onClickDel={(e) => this.onclickDelete(e)}
              paginationData={paginationObject}
            />
          ) : (
            this.state.dataErrorMsg
          )}
        </div>
      </div>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const { client, data } = state;
  return {
    componentState: state.component.get(ownProps.id, Map()),
    clientDataState: client.getIn([ownProps.id, "apiData"], null),
    clientSingleDataState: data.getIn([EDIT_CLIENT_ID, "apiData"], null),
  };
}

export default connect(
  mapStateToProps,
  {
    clearComponentState,
    updateComponentState,
    requestData,
    updateData,
    deleteData,
    fetchAllClients,
  }
)(Clients);
