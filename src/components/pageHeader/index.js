import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Map } from "immutable";
import { browserHistory } from "react-router";
import Icon from "../widgets/Icon";
import moment from "moment";
import {
  clearComponentState,
  updateComponentState,
} from "../../actions/component.actions.js";
import "./pageHeader.css";
import { readCookie, eraseCookie } from "../utils/common.utils";
import {
  NOTIFICATION_MSG_EXPIRE_DATE,
  NEW_NOTIFICATION_MSG,
  LOGGED_IN_DETAILS_ID,
  LOGGED_IN_DATA,
  APP_TITLE_SUBTITLE,
  TITLE_SUBTITLE_ID,
  APP_BASE_URL,
  PROFILE_CHANGED_ID,
  PROFILE_URL,
  BUILD_PATH,
} from "../../constants/app.constants";
import { getReportInfo } from "./pageHeader.utils";

const accountNameStyle = {
  padding: "10px",
  textTransform: "capitalize",
};

const accountNameStyleExpanded = {
  padding: "5px",
  textTransform: "capitalize",
};
class PageHeader extends Component {
  static propTypes = {
    id: PropTypes.string,
    componentState: PropTypes.object.isRequired,
    updateComponentState: PropTypes.func.isRequired,
  };

  state = {
    userName: "",
    isVisibleLogOut: false,
    accountStyle: accountNameStyle,
    imageUrl: "",
    currentPage: {
      title: "Dashboard",
      subtitle: "",
    },
    showNotifyMsg: true,
    msgflag: false,
    blink_me: "",
    showBellIcon: false,
  };

  componentWillMount() {
    var todayDate = moment();
    var expDate = moment(NOTIFICATION_MSG_EXPIRE_DATE, "MM-DD-YYYY");

    if (todayDate.isAfter(expDate) || NOTIFICATION_MSG_EXPIRE_DATE === "") {
      this.setState({
        showNotifyMsg: false,
        blink_me: "",
        showBellIcon: false,
      });
    } else {
      this.setState({
        showNotifyMsg: true,
        blink_me: " blink_me ",
        showBellIcon: true,
      });
    }

    // console.log("ID is ", this.props.id);
    if (readCookie("username") && readCookie("empId")) {
      let userName = readCookie("username").replace(/%20/g, " ");
      let empIDfromCookie = readCookie("empId");
      if (userName && empIDfromCookie) {
        this.setState({
          userName: userName,
        });
      }
    }
    // console.log("cookie in will receive:-", readCookie("empId"));

    if (readCookie("imgurl")) {
      this.setState({
        imageUrl: readCookie("imgurl"),
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    // console.log("Something changed");
    const { appState, profileState } = nextProps;

    // console.log("Something changed profileState:-", profileState);
    let titleSub = {
      title: "Dashboard",
      subtitle: "",
    };

    if (appState && appState !== this.props.appState) {
      const currentTitleAndSubtitle = appState.get(
        APP_TITLE_SUBTITLE,
        titleSub
      );
      this.setState({ currentPage: currentTitleAndSubtitle }, () => {
        // console.log("Current Title N Subtitle :-", this.state.currentPage);
      });
    }

    if (profileState !== this.props.profileState) {
      let statusProfile = profileState.get(PROFILE_URL, "");

      this.setState({
        imageUrl: statusProfile,
      });
    }
  }

  onClickAccount() {
    if (this.state.isVisibleLogOut === false) {
      this.setState({
        isVisibleLogOut: true,
        accountStyle: accountNameStyleExpanded,
      });
    } else {
      this.setState({
        isVisibleLogOut: false,
        accountStyle: accountNameStyle,
      });
    }
  }
  onLogOutSubmit() {
    const { updateComponentState } = this.props;
    updateComponentState(LOGGED_IN_DETAILS_ID, LOGGED_IN_DATA, null);
    // console.log("Log Out Done");
    eraseCookie("username");
    eraseCookie("empId");
    eraseCookie("uname");
    eraseCookie("role");
    eraseCookie("imgurl");

    // console.log("cookie isDeleted :-", readCookie("empId"));
    browserHistory.push("/" + BUILD_PATH + "login");
  }

  capitalize(s) {
    return s && s[0].toUpperCase() + s.slice(1);
  }

  getCurrentHeader() {
    // console.log("window.location.pathname :-", window.location.pathname);
    let finalHeader = "Dashboard";
    finalHeader = this.capitalize(window.location.pathname.substring(1));

    if (finalHeader.includes("/")) {
      let totalUrlArry = finalHeader.split("/");
      finalHeader = this.capitalize(totalUrlArry[0]);
    }

    return finalHeader;
  }

  oprnProfilePage() {
    browserHistory.push("/" + BUILD_PATH + "user-profile");
  }

  // mouseOut() {
  //   setTimeout(() => {
  //     this.setState({
  //       showNotifyMsg: !this.state.showNotifyMsg
  //     });
  //   }, 6000);
  // }

  // mouseIn() {
  //   if (this.state.showNotifyMsg === false) {
  //     setTimeout(() => {
  //       this.setState({
  //         showNotifyMsg: true
  //       });
  //     }, 6000);
  //   }
  // }

  closeNotifyMsg = () => {
    this.setState({
      msgflag: !this.state.msgflag,
    });

    if (this.state.msgflag === true) {
      this.setState({
        msgflag: !this.state.msgflag,
      });
      setTimeout(() => {
        this.setState({
          showNotifyMsg: !this.state.showNotifyMsg,
        });
      }, 1000);
    } else {
      this.setState({
        msgflag: !this.state.msgflag,
        showNotifyMsg: !this.state.showNotifyMsg,
        blink_me: "",
      });
    }
  };

  getInfo(subtitle) {
    const reportObj = getReportInfo(subtitle);
    if (reportObj && reportObj.isReportInfo)
      return (
        <Icon
          icon="info"
          className="outline"
          style={{
            cursor: "default",
            paddingLeft: "1px",
            fontSize: "15px",
          }}
          title={reportObj.info}
        />
      );
    else return null;
  }

  getSubtitle(subtitle) {
    if (subtitle !== "") {
      return (
        <span style={{ color: "#767676", fontSize: "24px" }}>
          {" | "}
          {subtitle}
          {this.getInfo(subtitle)}
        </span>
      );
    } else return null;
  }

  render() {
    return (
      <div className="content-header">
        <div className="pr-row">
          <div className="pr-col-6" style={{ width: "66%" }}>
            <div className="content-header-title">
              <span style={{ color: "#0295DA" }}>
                {this.state.currentPage.title}
              </span>
              {this.getSubtitle(this.state.currentPage.subtitle)}
            </div>
          </div>
          <div className="pr-col-3" style={{ width: "33%" }}>
            <div
              className="content-header-login-section"
              onClick={() => this.onClickAccount()}
              style={{ display: "table" }}
            >
              {this.state.showBellIcon === true ? (
                <div
                  style={{
                    display: "table-cell",
                    verticalAlign: "middle",
                    width: "50px",
                  }}
                >
                  <Icon
                    className={"new-notification " + this.state.blink_me}
                    icon="notification_important"
                    title="New Notification"
                    onClick={() => this.closeNotifyMsg()}
                  />
                  {this.state.showNotifyMsg === false ? (
                    <div
                      // onBlur={this.mouseOut()}
                      // onMouseOver={this.mouseIn()}
                      className={
                        "show-" + this.state.msgflag + " notification-box"
                      }
                    >
                      <div style={{ textAlign: "center" }}>
                        {NEW_NOTIFICATION_MSG !== ""
                          ? "NEW FEATURES ADDED"
                          : "NEW FEATURE ADDED"}
                      </div>
                      {NEW_NOTIFICATION_MSG}
                      <Icon
                        className="notification-close"
                        icon="close"
                        title="Close"
                        onClick={() => this.closeNotifyMsg()}
                      />
                    </div>
                  ) : null}
                </div>
              ) : null}
              <div
                style={{
                  display: "table-cell",
                  verticalAlign: "middle",
                  width: "50px",
                }}
              >
                {this.state.imageUrl !== "" ? (
                  <img
                    src={APP_BASE_URL + this.state.imageUrl}
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                    }}
                    title="Edit Profile"
                    onClick={() => this.oprnProfilePage()}
                    alt={""}
                  />
                ) : (
                  <img
                    src={APP_BASE_URL + "media/account.png"}
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                    }}
                    title="Edit Profile"
                    onClick={() => this.oprnProfilePage()}
                    alt={""}
                  />
                )}
              </div>
              <div className="user-details">
                <span style={this.state.accountStyle}>
                  <b>{this.state.userName}</b>
                </span>
                <br />
                <button
                  className="logout"
                  onClick={() => this.onLogOutSubmit()}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  return {
    componentState: state.component.get(ownProps.id, Map()),
    appState: state.component.get(TITLE_SUBTITLE_ID, Map()),
    profileState: state.component.get(PROFILE_CHANGED_ID, Map()),
  };
}

export default connect(
  mapStateToProps,
  {
    clearComponentState,
    updateComponentState,
  }
)(PageHeader);
