import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Map } from "immutable";
import {
  clearComponentState,
  updateComponentState
} from "../../../actions/component.actions.js";

import "./projects.css";
import {
  PROJECTS_SUBMENU,
  PROJECTS_SUBMENU_ID
} from "../../../constants/app.constants.js";

class Projects extends Component {
  static propTypes = {
    id: PropTypes.string,
    componentState: PropTypes.object.isRequired,
    updateComponentState: PropTypes.func.isRequired
  };

  state = {};

  renderChildReport = (moduleName, moduleProps) => {
    let trimmedModuleName = moduleName.replace(/\s/g, "");

    const singleChild = React.createElement(
      require("./" + trimmedModuleName + "/index.js").default,
      moduleProps,
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
      PROJECTS_SUBMENU_ID,
      PROJECTS_SUBMENU,
      this.capitalize(subMenu)
    );
  }

  generateModuleID(subMenu) {
    let result = subMenu.toUpperCase().slice(0, -6) + "_MODULE_ID";
    return result;
  }

  render() {
    const { subMenu } = this.props;

    // console.log("subMenu in project:-", subMenu, "id:- ", id);
    this.setCurrentReportComponentsate(subMenu);

    return (
      <div className="page-content-projects">
        {subMenu !== ""
          ? this.renderChildReport(subMenu, {
              id: this.generateModuleID(subMenu)
            })
          : null}
      </div>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  return {
    componentState: state.component.get(ownProps.id, Map()),
    projectState: state.component.get(PROJECTS_SUBMENU_ID, Map())
  };
}

export default connect(
  mapStateToProps,
  {
    clearComponentState,
    updateComponentState
  }
)(Projects);
