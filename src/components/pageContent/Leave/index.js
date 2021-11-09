import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Map } from "immutable";
import {
  clearComponentState,
  updateComponentState
} from "../../../actions/component.actions.js";

import "./leave.css";
import { LEAVE_SUBMENU_ID } from "../../../constants/app.constants.js";

class Leave extends Component {
  static propTypes = {
    id: PropTypes.string,
    componentState: PropTypes.object.isRequired,
    updateComponentState: PropTypes.func.isRequired
  };

  state = {};

  componentWillMount() {
    // console.log("subMenu in leave willmount = ", this.props.subMenu);
  }

  renderChildLeave = (moduleName, moduleProps) => {
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

  generateModuleID(subMenu) {
    // console.log("subMenu in generated = ", subMenu);
    let result = subMenu.toUpperCase() + "_ID";
    // console.log("generated id = ", result);
    return result;
  }

  render() {
    return (
      <div className="page-content-form">
        {this.props.subMenu !== ""
          ? this.renderChildLeave(this.props.subMenu, {
              id: this.generateModuleID(this.props.subMenu)
            })
          : null}
      </div>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  return {
    componentState: state.component.get(ownProps.id, Map()),
    projectState: state.component.get(LEAVE_SUBMENU_ID, Map())
  };
}

export default connect(
  mapStateToProps,
  {
    clearComponentState,
    updateComponentState
  }
)(Leave);
