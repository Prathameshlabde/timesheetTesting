import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Map } from "immutable";
import {
  clearComponentState,
  updateComponentState
} from "../../actions/component.actions.js";
import {
  LOGGED_IN_DETAILS_ID,
  LOGGED_IN_DATA,
  BUILD_PATH
} from "../../constants/app.constants";
import { readCookie } from "../utils/common.utils";
import "material-icons-react";
import Content from "../content";
import NavigationBar from "../navigation";
import { browserHistory } from "react-router";
import "./coreLayout.css";

class CoreLayout extends Component {
  static propTypes = {
    id: PropTypes.string,
    componentState: PropTypes.object.isRequired,
    updateComponentState: PropTypes.func.isRequired
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
          uname: unamefromCookie
        };
        updateComponentState(
          LOGGED_IN_DETAILS_ID,
          LOGGED_IN_DATA,
          userAndEmpID
        );
      }
    } else {
      browserHistory.push("/" + BUILD_PATH + "login");
    }
  }

  funcIsloggedInCheck = loginStatus => {
    // console.log("loginStatus :-", loginStatus);
    this.setState({
      isLoggedIn: loginStatus
    });
  };

  componentWillUpdate(nextProps, nextStates) {
    // console.log("IN Mount in core layout update:-");
    if (
      nextProps.loginState.get(LOGGED_IN_DATA, "NO") !==
      this.props.loginState.get(LOGGED_IN_DATA, "NO")
    ) {
      let allLoginDetails = nextProps.loginState.get(LOGGED_IN_DATA, "NO_DATA");
      // console.log("allLoginDetails:-", allLoginDetails);
      if (allLoginDetails && allLoginDetails !== "NO_DATA") {
        if (allLoginDetails.emp_id) {
        }
      } else {
      }
    }
  }

  render() {
    return (
      // <div>
      //   {this.state.isLoggedIn === false ? (
      //     <div className="login-main-div">
      //       <img
      //         src={logo}
      //         style={{ width: "200px", height: "150px", position: "absolute" }}
      //         alt="Metasys software"
      //       />

      //       <LoginPage
      //         id="LOGIN_PAGE_ID"
      //         funcIsLoggedIn={e => this.funcIsloggedInCheck(e)}
      //       />
      //     </div>
      //   ) : (
      <div className="app-master">
        <NavigationBar id="APP_ID" />
        <Content />
      </div>
      //   )}
      // </div>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  return {
    componentState: state.component.get(ownProps.id, Map()),
    loginState: state.component.get(LOGGED_IN_DETAILS_ID, Map())
  };
}

export default connect(
  mapStateToProps,
  {
    clearComponentState,
    updateComponentState
  }
)(CoreLayout);
