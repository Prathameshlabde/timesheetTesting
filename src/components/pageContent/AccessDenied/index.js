import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Map } from "immutable";
import { updateComponentState } from "../../../actions/component.actions";

import {
  APP_TITLE_SUBTITLE,
  TITLE_SUBTITLE_ID,
  ACCESS_TITLE_SUBTITLE
} from "../../../constants/app.constants";

class AccessDenied extends Component {
  static propTypes = {
    id: PropTypes.string,
    componentState: PropTypes.object.isRequired,
    updateComponentState: PropTypes.func.isRequired
  };

  componentWillMount() {
    const { updateComponentState } = this.props;
    let titleSub = {
      title: "Access Denied",
      subtitle: ""
    };
    updateComponentState(TITLE_SUBTITLE_ID, APP_TITLE_SUBTITLE, titleSub);
  }
  render() {
    return (
      <div className="access-denied-main">
        <div className="access-denied-inner">
          <span className="access-title">{ACCESS_TITLE_SUBTITLE.title}</span>
          <span className="access-subtitle">
            {ACCESS_TITLE_SUBTITLE.subttle}
          </span>
        </div>
      </div>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const { component } = state;
  const id = ownProps.id;
  return {
    componentState: component.get(id, Map())
  };
}

export default connect(
  mapStateToProps,
  {
    updateComponentState
  }
)(AccessDenied);
