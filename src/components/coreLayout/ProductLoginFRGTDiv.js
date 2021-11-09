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
import {
  createCookie,
  readCookie,
  isEmpty,
  isMetaProduct,
} from "../utils/common.utils";
import "./login-page.css";
import Colors from "../common/colors";
import {
  checkAndSetForgotNewPassword,
  checkLogin,
  isFromValidationDLGS,
} from "./login.utils";
import SpanLabel from "../widgets/SpanLabel";
import {
  LOGIN_DIALOGS,
  PRODUCT_VALIDATION_DLGS,
} from "../../constants/dialog.constants";
import { isMobile } from "react-device-detect";
import { dateFormatter } from "../utils/calender.utils";
import moment from "moment";
import ProductPopup from "./ProductPopup";
import { Modal } from "@material-ui/core";

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

class ProductLoginFRGTDiv extends Component {
  state = {
    //aditya 13 july removed the set data
    user_name: "",
    password_field: "",
    company_id: "",
    fdate: dateFormatter(moment(), "yyyy-MM-dd hh:mm:ss"),
    errorMessageShort: "",
    errorMessage: "",
    // isPopup: true,
    isBuyButton: true,
    isExtendButton: true,
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
            // console.log("responseObj = ", responseObj);

            if (isFromValidationDLGS(responseObj) === true && isMetaProduct()) {
              // console.log("responseObj error = ", responseObj);
              if (responseObj === PRODUCT_VALIDATION_DLGS.daysexpired1) {
                this.setState({
                  isPopup: true,
                  isBuyButton: true,
                  isExtendButton: true,
                });
              } else if (
                responseObj === PRODUCT_VALIDATION_DLGS.daysexpired2 ||
                responseObj === PRODUCT_VALIDATION_DLGS.completelyExpired
              ) {
                this.setState({
                  isPopup: true,
                  isBuyButton: true,
                  isExtendButton: false,
                });
              } else {
                this.displayLoginFailed();
              }
            } else if (responseObj.status_flag === "0") {
              let finalName = responseObj.fname + " " + responseObj.lname;
              createCookie("username", finalName, 1);
              createCookie("empId", responseObj.emp_id, 1);
              createCookie("uname", responseObj.uname, 1);
              createCookie("role", responseObj.role, 1);
              createCookie("imgurl", responseObj.profileurl, 1);
              createCookie("email_id", responseObj.email_id, 1);
              createCookie("company_id", this.state.company_id, 1);

              this.props.funcIsLoggedIn(true);
              updateComponentState(
                LOGGED_IN_DETAILS_ID,
                LOGGED_IN_DATA,
                responseObj
              );
              if (isMobile) browserHistory.push("/" + BUILD_PATH + "myEntries");
              else browserHistory.push("/" + BUILD_PATH + "dashboard");
            } else {
              this.setState(
                {
                  errorMessageShort: LOGIN_DIALOGS.loginFailed,
                  errorMessage: LOGIN_DIALOGS.accountDeactivate,
                  user_name: "",
                  password_field: "",
                  company_id: "",
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
        this.displayLoginFailed();
      }
    }
  }

  displayLoginFailed() {
    this.setState(
      {
        errorMessageShort: LOGIN_DIALOGS.loginFailed,
        errorMessage: LOGIN_DIALOGS.invalidLoginDetails,
        user_name: "",
        password_field: "",
        company_id: "",
        isForgotPasswordEnable: true,
        isSuccessMailMessage: false,
      },
      () => {
        updateComponentState(LOGGED_IN_DETAILS_ID, LOGGED_IN_DATA, null);
      }
    );
  }

  onChangeFieldValues = (id, updatedValue, updatedBillable) => {
    this.setState({
      [id]: updatedValue,
    });
  };

  //aditya 22-06-2020 next 1 line
  onSubmit() {
    const { user_name, password_field, company_id, fdate } = this.state;
    const { id, requestData } = this.props;
    this.setState(
      {
        errorMessageShort: "",
        errorMessage: "",
        isSuccessMailMessage: false,
      },
      () => {
        if (
          !isEmpty(user_name) &&
          !isEmpty(password_field) &&
          !isEmpty(company_id)
        ) {
          this.setState({ isForgotPasswordEnable: false }, () => {
            const loginProps = {
              id,
              requestData,
              username: user_name,
              password: password_field,
              company_id,
              fdate,
            };
            checkLogin(loginProps);
          });
        } else {
          if (isEmpty(user_name)) {
            this.setValidationErrors(LOGIN_DIALOGS.blankUserName);
          } else if (isEmpty(password_field)) {
            this.setValidationErrors(LOGIN_DIALOGS.blankPassword);
          } else if (isEmpty(company_id)) {
            this.setValidationErrors(LOGIN_DIALOGS.blankCompanyID);
          }
        }
      }
    );
  }

  setValidationErrors(errorMessageShort) {
    this.setState({ errorMessageShort, isForgotPasswordEnable: true });
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
    const { FRGTUserName, FRGTEmailID, FRGTcompany_id } = this.state;

    this.setState(
      {
        errorMessageFRGT: "",
        isShowLoader: true,
        isSuccessMailMessage: false,
      },
      () => {
        if (
          !isEmpty(FRGTUserName) &&
          !isEmpty(FRGTEmailID) &&
          !isEmpty(FRGTcompany_id)
        ) {
          checkAndSetForgotNewPassword({
            FRGTUserName,
            FRGTEmailID,
            FRGTcompany_id,
            id,
            requestDataDuplicate,
          }).then((response) => {
            if (response) {
              setTimeout(() => {
                this.setState({ isShowLoader: false });
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
              this.setState({ isShowLoader: false });
            }, 1000);
          });
        } else {
          if (isEmpty(FRGTUserName)) {
            this.setErrormsg(LOGIN_DIALOGS.blankUserName);
          } else if (isEmpty(FRGTcompany_id)) {
            this.setErrormsg(LOGIN_DIALOGS.blankCompanyID);
          } else if (isEmpty(FRGTEmailID)) {
            this.setErrormsg(LOGIN_DIALOGS.blankEmailID);
          }
        }
      }
    );
  }

  setErrormsg(errorMessageFRGT) {
    this.setState({ isShowLoader: false, errorMessageFRGT });
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
      FRGTcompany_id: "",
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

  closePopup() {
    // console.log("in closePopup");
    this.setState({ isPopup: false });
  }

  render() {
    let errorMessageStyle = errorMsgStyle;
    if (
      this.state.isSuccessMailMessage &&
      this.state.isSuccessMailMessage === true
    ) {
      errorMessageStyle = successMsgStyle;
    }

    const {
      FRGTUserName,
      FRGTEmailID,
      FRGTcompany_id,
      user_name,
      password_field,
      company_id,
      isPopup,
      fdate,
    } = this.state;
    return this.state.isForegetPasswordWindowOpen === true ? (
      <div className="login-div">
        {this.state.isShowLoader === true ? <Loader /> : null}

        <div style={{ paddingTop: "10px", textAlign: "center" }}>
          <span className="login-title">
            <b>Forget Password</b>
          </span>
        </div>

        <div className="container">
          <div className="login-container-upper">
            <div className="login-container-upper-left">
              {this.getSpanLabel("Username")}
              {this.getTextField("FRGTUserName", FRGTUserName, "text", true)}
            </div>
            <div className="login-container-upper-right">
              {this.getSpanLabel("Company ID")}
              {this.getTextField(
                "FRGTcompany_id",
                FRGTcompany_id,
                "text",
                true
              )}
            </div>
          </div>

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
        {isPopup && isMetaProduct() ? (
          <Modal
            style={{ padding: "8%" }}
            open={isPopup}
            // onClose={() => this.closePopup()}
          >
            <ProductPopup
              isBuyButton={this.state.isBuyButton}
              isExtendButton={this.state.isExtendButton}
              company_id={company_id}
              fdate={fdate}
              onClosePopup={() => this.closePopup()}
            />
          </Modal>
        ) : null}
        <div style={{ paddingTop: "10px", textAlign: "center" }}>
          <span className="login-title">
            <b>USER LOGIN</b>
          </span>
        </div>
        <div className="container">
          <div className="login-container-upper">
            <div className="login-container-upper-left">
              {/* //aditya 13 july spanlabel with asterick*/}
              <SpanLabel
                mainClassName="lbl-style"
                isRequired={true}
                data="Username"
              />
              {this.getTextField("user_name", user_name, "text", false)}
            </div>
            {/* //aditya 13 july spanlabel with asterick*/}
            <SpanLabel
              mainClassName="lbl-style"
              isRequired={true}
              data="Password"
            />
            {this.getTextField(
              "password_field",
              password_field,
              "password",
              false
            )}

            <div className="login-container-upper-right">
              {/* //aditya 13 july company code to company id and spanlabel with asterick*/}
              <SpanLabel
                mainClassName="lbl-style"
                isRequired={true}
                data="Company ID"
              />
              {this.getTextField("company_id", company_id, "text", false)}
            </div>
          </div>

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
)(ProductLoginFRGTDiv);
