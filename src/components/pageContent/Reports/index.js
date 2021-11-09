import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Map } from "immutable";
import {
  clearComponentState,
  updateComponentState,
  deleteComponentState
} from "../../../actions/component.actions.js";

import {
  REPORT_SUBMENU,
  REPORT_SUBMENU_ID,
  REPORT_JSONFILE,
  REPORT_TEMP_BOOL,
  REPORT_TEMP_BOOL2,
  REPORT_TEMP_BOOL3
} from "../../../constants/app.constants.js";
import { getDataFromCookie } from "../../utils/CheckLoginDetails";

import { setRespectiveJsonFileForReport } from "./Reports.utils";
class Reports extends Component {
  static propTypes = {
    id: PropTypes.string,
    componentState: PropTypes.object.isRequired,
    updateComponentState: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      LoggedInUser: getDataFromCookie().role
    };
  }

  renderChildReport = reportName => {
    const { updateComponentState } = this.props;
    updateComponentState(REPORT_SUBMENU_ID, REPORT_TEMP_BOOL, "");
    updateComponentState(REPORT_SUBMENU_ID, REPORT_TEMP_BOOL2, "");
    updateComponentState(REPORT_SUBMENU_ID, REPORT_TEMP_BOOL3, "");

    let trimmedReportName = reportName.replace(/\s/g, "");
    // console.log("trimmedReportName :-", trimmedReportName);
    const singleChild = React.createElement(
      require("./" + trimmedReportName + "/index.js").default,
      null,
      null
    );
    return singleChild;
  };

  capitalize(s) {
    return s && s[0].toUpperCase() + s.slice(1);
  }

  setCurrentReportComponentsate(subMenu) {
    const { updateComponentState } = this.props;

    updateComponentState(
      REPORT_SUBMENU_ID,
      REPORT_SUBMENU,
      this.capitalize(subMenu)
    );

    updateComponentState(
      REPORT_SUBMENU_ID,
      REPORT_JSONFILE,
      setRespectiveJsonFileForReport(this.capitalize(subMenu))
    );
  }

  render() {
    const { subMenu } = this.props;
    this.setCurrentReportComponentsate(subMenu);

    return (
      <div className="page-content-report">
        {subMenu !== "" ? this.renderChildReport(subMenu) : null}
      </div>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const id = ownProps.id;
  return {
    componentState: state.component.get(id, Map()),
    reportState: state.component.get(REPORT_SUBMENU_ID, Map())
  };
}

export default connect(
  mapStateToProps,
  {
    clearComponentState,
    updateComponentState,
    deleteComponentState
  }
)(Reports);
