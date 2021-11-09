import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Map } from "immutable";
import {
  clearComponentState,
  updateComponentState
} from "../../../actions/component.actions.js";
import {
  APP_TITLE_SUBTITLE,
  TITLE_SUBTITLE_ID
} from "../../../constants/app.constants";

import "../Dashboard/dashboard.css";

class Requisition extends Component {
  static propTypes = {
    id: PropTypes.string,
    componentState: PropTypes.object.isRequired,
    updateComponentState: PropTypes.func.isRequired
  };
  componentWillMount() {
    const { updateComponentState } = this.props;
    let titleSub = {
      title: "Requisition",
      subtitle: ""
    };
    updateComponentState(TITLE_SUBTITLE_ID, APP_TITLE_SUBTITLE, titleSub);
  }
  render() {
    return (
      <div className="page-content-form">
        <div className="page-content-requisition">
          <div className="timesheet-content" />
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
)(Requisition);
