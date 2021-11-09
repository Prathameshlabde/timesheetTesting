import React, { Component } from "react";
import PropTypes from "prop-types";

import "./dialog-box.css";
import Icon from "../widgets/Icon";
class DiaglogBox extends Component {
  render() {
    // Render nothing if the "show" prop is false
    if (!this.props.show) {
      return null;
    }
    const { title, description, onClickCancel, onClickOk } = this.props;
    return (
      <div className="backdrop">
        <div className="modal">
          <div
            className="col-inner-div-header-right"
            style={{ paddingTop: "3px" }}
          >
            <Icon
              icon="close"
              style={{
                fontSize: "28px",
                cursor: "pointer"
              }}
              title="close"
              onClick={onClickCancel}
            />
          </div>
          <div className="alert-dialog-title">{title}</div>

          <div className="description-in-box">{description}</div>
          <div className="botom-in-dialog">
            <button className="button-style-cancel" onClick={onClickCancel}>
              Cancel
            </button>
            <button className="button-style-cancel" onClick={onClickOk}>
              Ok
            </button>
          </div>
        </div>
      </div>
    );
  }
}

DiaglogBox.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool,
  children: PropTypes.node
};
export default DiaglogBox;
