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
  LOGGED_IN_DATA
} from "../../constants/app.constants";
import { readCookie } from "../utils/common.utils";
import "material-icons-react";
import LoginPage from "./LoginPage";
import logo from "./logo.png";
import "./coreLayout.css";

class CoreLayout extends Component {
  static propTypes = {
    id: PropTypes.string,
    componentState: PropTypes.object.isRequired,
    updateComponentState: PropTypes.func.isRequired
  };
  state = {
    isLoggedIn: false
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
        this.setState({
          isLoggedIn: true
        });
      }
    }
  }

  funcIsloggedInCheck = loginStatus => {
    this.setState({
      isLoggedIn: loginStatus
    });
  };

  componentWillUpdate(nextProps, nextStates) {
    if (
      nextProps.loginState.get(LOGGED_IN_DATA, "NO") !==
      this.props.loginState.get(LOGGED_IN_DATA, "NO")
    ) {
      let allLoginDetails = nextProps.loginState.get(LOGGED_IN_DATA, "NO_DATA");
      if (allLoginDetails && allLoginDetails !== "NO_DATA") {
        if (allLoginDetails.emp_id) {
          this.setState({
            isLoggedIn: true
          });
        }
      } else {
        this.setState({
          isLoggedIn: false
        });
      }
    }
  }

  render() {
    return (
      <div className="login-main-div">
        <div className="login-main-div-logo">
          <img src={logo} className="logo-style" alt="Metasys software" />
        </div>
        <div className="loginpage-div">
          <LoginPage
            id="LOGIN_PAGE_ID"
            funcIsLoggedIn={e => this.funcIsloggedInCheck(e)}
          />
        </div>
        <div className="footer-div">Copyright © 2018 Metasyssoftware.com</div>
      </div>
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
