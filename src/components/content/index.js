import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Map } from "immutable";
import {
  clearComponentState,
  updateComponentState
} from "../../actions/component.actions.js";
import { browserHistory } from "react-router";

import "./content.css";
import PageHeader from "../pageHeader";
import PageContent from "../pageContent";
import { readCookie } from "../utils/common.utils";
import { BUILD_PATH } from "../../constants/app.constants.js";

class Content extends Component {
  static propTypes = {
    id: PropTypes.string,
    componentState: PropTypes.object.isRequired,
    updateComponentState: PropTypes.func.isRequired
  };

  /// Start
  // This state is only updating for re-render please do not change.
  state = {
    location: "/"
  };

  componentDidMount() {
    browserHistory.listen(location => {
      this.setState({
        location: location
      });
    });
  }
  /////End

  getCurrentPage() {
    // console.log("in Content location:-", window.location.pathname);
    // console.log("IN getCurrent");
    if (readCookie("username") && readCookie("empId") && readCookie("uname")) {
      let userNamefromCookie = readCookie("username").replace(/%20/g, " ");
      let empIDfromCookie = readCookie("empId");
      let unamefromCookie = readCookie("uname");

      if (userNamefromCookie && empIDfromCookie && unamefromCookie) {
        if (window.location.pathname === "/") {
          browserHistory.push("/" + BUILD_PATH + "dashboard");
          return "/" + BUILD_PATH + "dashboard";
        } else {
          return window.location.pathname;
        }
      }
    } else {
      browserHistory.push("/" + BUILD_PATH + "login");
      return "/" + BUILD_PATH + "login";
    }
  }

  render() {
    // console.log("this.getCurrentPage() :-=", this.getCurrentPage());

    return (
      <div className="app-content">
        <PageHeader />
        <PageContent contentName={this.getCurrentPage()} />

        <div
          className=""
          style={{
            position: "fixed",
            transition: "opacity 0.3s cubic-bezier(0.7, 0.03, 1, 1) 0s",
            bottom: "0",
            width: "100%",
            background: "#151718",
            color: "#d2d2d2",
            textAlign: "center",
            fontSize: "12px",
            left: "0"
          }}
        >
          Copyright © 2018 Metasyssoftware.com
        </div>
      </div>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  return {
    componentState: state.component.get(ownProps.id, Map())
  };
}

export default connect(
  mapStateToProps,
  {
    clearComponentState,
    updateComponentState
  }
)(Content);
