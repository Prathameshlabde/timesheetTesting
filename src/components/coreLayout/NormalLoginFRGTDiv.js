import React, { Component } from "react";
import { connect } from "react-redux";
import { browserHistory } from "react-router";

import {
  LOGGED_IN_DETAILS_ID,
  LOGGED_IN_DATA,
  BUILD_PATH,
} from "../../constants/app.constants";
import Loader from "../widgets/Loader";
import { updateComponentState } from "../../actions/component.actions.js";
import { requestData } from "../../actions/login.actions";
import { requestDataDuplicate } from "../../actions/data.actions";
import TextField from "../widgets/TextField";
import { createCookie, readCookie } from "../utils/common.utils";
import "./login-page.css";
import Colors from "../common/colors";
import { checkAndSetForgotNewPassword, checkLogin } from "./login.utils";
import SpanLabel from "../widgets/SpanLabel";
import { LOGIN_DIALOGS } from "../../constants/dialog.constants";
import { isMobile } from "react-device-detect";

const errorMsgStyle = {
  color: Colors.redColor,
  display: "block",
  fontSize: "14px",
  fontWeight: "500",
};

const successMsgStyle = {
  color: Colors.whiteColor,
  display: "block",
  fontSize: "14px",
  fontWeight: "500",
};

class Content extends Component {
  state = {
    user_name: "",
    password_field: "",
    errorMessageShort: "",
    errorMessage: "",
    isForgotPasswordEnable: false,
    isForegotPasswordWindowOpen: false,
    isSuccessMailMessage: false,
    isFRGTwindow: false,
  };

  componentWillMount() {
    if (readCookie("username") && readCookie("empId") && readCookie("uname")) {
      let userNamefromCookie = readCookie("username").replace(/%20/g, " ");
      let empIDfromCookie = readCookie("empId");
      let unamefromCookie = readCookie("uname");

      if (userNamefromCookie && empIDfromCookie && unamefromCookie) {
        let userAndEmpID = {
          fullname: userNamefromCookie,
          emp_id: empIDfromCookie,
          uname: unamefromCookie,
        };
        updateComponentState(
          LOGGED_IN_DETAILS_ID,
          LOGGED_IN_DATA,
          userAndEmpID
        );
      }
      browserHistory.push("/" + BUILD_PATH + "dashboard");
    }
  }

  componentWillReceiveProps(nextProps) {
    const { loginDataState } = nextProps;
    const { updateComponentState } = this.props;

    if (loginDataState && loginDataState !== this.props.loginDataState) {
      if (loginDataState.apiData) {
        let responseObj = loginDataState.apiData;
        this.setState(
          {
            errorMessageShort: "",
            errorMessage: "",
            isForgotPasswordEnable: false,
            isSuccessMailMessage: false,
          },
          () => {
            if (responseObj.status_flag === "0") {
              let finalName = responseObj.fname + " " + responseObj.lname;
              createCookie("username", finalName, 1);
              createCookie("empId", responseObj.emp_id, 1);
              createCookie("uname", responseObj.uname, 1);
              createCookie("role", responseObj.role, 1);
              createCookie("imgurl", responseObj.profileurl, 1);
              createCookie("email_id", responseObj.email_id, 1);
              this.props.funcIsLoggedIn(true);
              updateComponentState(
                LOGGED_IN_DETAILS_ID,
                LOGGED_IN_DATA,
                responseObj
              );
              // console.log("isMobile = ", isMobile);
              if (isMobile) browserHistory.push("/" + BUILD_PATH + "myEntries");
              else browserHistory.push("/" + BUILD_PATH + "dashboard");
            } else {
              this.setState(
                {
                  errorMessageShort: LOGIN_DIALOGS.loginFailed,
                  errorMessage: LOGIN_DIALOGS.accountDeactivate,
                  user_name: "",
                  password_field: "",
                },
                () => {
                  updateComponentState(
                    LOGGED_IN_DETAILS_ID,
                    LOGGED_IN_DATA,
                    null
                  );
                }
              );
            }
          }
        );
      } else {
        this.setState(
          {
            errorMessageShort: LOGIN_DIALOGS.loginFailed,
            errorMessage: LOGIN_DIALOGS.invalidLoginDetails,
            user_name: "",
            password_field: "",
            isForgotPasswordEnable: true,
            isSuccessMailMessage: false,
          },
          () => {
            updateComponentState(LOGGED_IN_DETAILS_ID, LOGGED_IN_DATA, null);
          }
        );
      }
    }
  }

  onChangeFieldValues = (id, updatedValue, updatedBillable) => {
    this.setState({
      [id]: updatedValue,
    });
  };

  onSubmit() {
    const { user_name, password_field } = this.state;
    const { id, requestData } = this.props;
    this.setState({
      errorMessageShort: "",
      errorMessage: "",
      isSuccessMailMessage: false,
    });

    if (user_name === "" || password_field === "") {
      this.setState({
        errorMessageShort: LOGIN_DIALOGS.invalidLoginDetails,
        isForgotPasswordEnable: false,
      });
    } else if (user_name !== "" && password_field === "") {
      this.setState({
        errorMessageShort: LOGIN_DIALOGS.invalidLoginDetails,
        isForgotPasswordEnable: true,
      });
    } else {
      checkLogin({
        id,
        requestData,
        username: user_name,
        password: password_field,
      });
    }
  }

  handleKeyPress = (event) => {
    if (event.key === "Enter") {
      if (this.state.isFRGTwindow === true) {
        this.setForgotPassword();
      } else {
        this.onSubmit();
      }
    }
  };

  setForgotPassword() {
    const { id, requestDataDuplicate } = this.props;
    const { FRGTUserName, FRGTEmailID } = this.state;

    this.setState(
      {
        errorMessageFRGT: "",
        isShowLoader: true,
        isSuccessMailMessage: false,
      },
      () => {
        if (
          FRGTUserName === "" ||
          FRGTEmailID === "" ||
          FRGTUserName === undefined ||
          FRGTEmailID === undefined
        ) {
          this.setState({
            isShowLoader: false,
            errorMessageFRGT: LOGIN_DIALOGS.fillDetailsFRGT,
          });
        } else {
          checkAndSetForgotNewPassword({
            FRGTUserName,
            FRGTEmailID,
            id,
            requestDataDuplicate,
          }).then((response) => {
            if (response) {
              setTimeout(() => {
                this.setState({
                  isShowLoader: false,
                });
              }, 1000);

              if (response === "isNotValid") {
                this.setState({
                  errorMessageFRGT: LOGIN_DIALOGS.invalidFRGTDetails,
                  isSuccessMailMessage: false,
                });
              } else if (response === false) {
                this.setState({
                  errorMessageFRGT: LOGIN_DIALOGS.problemSendingEmail,
                  isSuccessMailMessage: false,
                });
              } else {
                this.setState({
                  errorMessageFRGT: "",
                  errorMessageShort: LOGIN_DIALOGS.emailSuccess,
                  isSuccessMailMessage: true,
                });

                this.cancelForgotPassword();
              }
            }

            setTimeout(() => {
              this.setState({
                isShowLoader: false,
              });
            }, 1000);
          });
        }
      }
    );
  }

  OpenForgotPasswordWindow() {
    this.setState({
      isForegetPasswordWindowOpen: true,
      isShowLoader: false,
      isFRGTwindow: true,
    });
  }

  cancelForgotPassword() {
    this.setState({
      isForgotPasswordEnable: false,
      isForegetPasswordWindowOpen: false,
      errorMessageFRGT: "",
      FRGTUserName: "",
      FRGTEmailID: "",
      errorMessage: "",
      isShowLoader: false,
      isFRGTwindow: false,
    });
  }

  getSpanLabel(data) {
    return (
      <SpanLabel
        mainDivStyle={{
          float: "left",
          fontSize: "14px",
          color: Colors.whiteColor,
        }}
        isRequired={true}
        data={data}
      />
    );
  }

  getTextField(id, stateVar, fieldType, isFRGT) {
    return (
      <TextField
        id={id}
        data={stateVar}
        onChange={this.onChangeFieldValues}
        onBlur={this.onBlurFieldValues}
        onKeyPress={this.handleKeyPress}
        classNames="text-field"
        fieldType={fieldType}
      />
    );
  }

  render() {
    let errorMessageStyle = errorMsgStyle;
    if (
      this.state.isSuccessMailMessage &&
      this.state.isSuccessMailMessage === true
    ) {
      errorMessageStyle = successMsgStyle;
    }

    const { FRGTUserName, FRGTEmailID, user_name, password_field } = this.state;
    return this.state.isForegetPasswordWindowOpen === true ? (
      <div className="login-div">
        {this.state.isShowLoader === true ? <Loader /> : null}

        <div style={{ paddingTop: "10px", textAlign: "center" }}>
          <span className="login-title">
            <b>Forget Password</b>
          </span>
        </div>

        <div className="container">
          {this.getSpanLabel("Username")}
          {this.getTextField("FRGTUserName", FRGTUserName, "text", true)}
          {this.getSpanLabel("Email ID")}
          {this.getTextField("FRGTEmailID", FRGTEmailID, "text", true)}

          <div className="FRGT-buttons">
            <div style={{ width: "100%" }}>
              <button
                type="button"
                className="btn-style-FRGT-cancel"
                onClick={() => this.cancelForgotPassword()}
              >
                Cancel
              </button>
            </div>
            <div style={{ width: "100%" }}>
              <button
                type="button"
                className="btn-style-FRGT-submit"
                onClick={() => this.setForgotPassword()}
              >
                Get New Password
              </button>
            </div>
          </div>
        </div>

        {this.state.errorMessageFRGT ? (
          <div
            style={{
              padding: "2%",
              textAlign: "center",
              color: Colors.redColor,
            }}
          >
            <span>{this.state.errorMessageFRGT}</span>
          </div>
        ) : null}
      </div>
    ) : (
      <div className="login-div">
        <div style={{ paddingTop: "10px", textAlign: "center" }}>
          <span className="login-title">
            <b>USER LOGIN</b>
          </span>
        </div>
        <div className="container">
          <span className="lbl-style">Username</span>

          {this.getTextField("user_name", user_name, "text", false)}
          <span className="lbl-style">Password</span>
          {this.getTextField(
            "password_field",
            password_field,
            "password",
            false
          )}
          <button
            type="button"
            className="btn-style"
            onClick={() => this.onSubmit()}
          >
            SIGN IN
          </button>

          <div
            style={{
              textAlign: "center",
            }}
          >
            <b>
              <span style={errorMessageStyle}>
                {this.state.errorMessageShort}
              </span>
            </b>

            <span style={errorMsgStyle}>{this.state.errorMessage}</span>

            <span
              style={{
                color: Colors.blueColor,
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => this.OpenForgotPasswordWindow()}
            >
              Forget password?
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const { login } = state;
  const id = ownProps.id;
  return {
    loginDataState: login.getIn([id, "apiData"], null),
  };
}

export default connect(
  mapStateToProps,
  {
    updateComponentState,
    requestData,
    requestDataDuplicate,
  }
)(Content);
