import React, { Component } from "react";
import { connect } from "react-redux";
import { Map } from "immutable";
import {
  clearComponentState,
  updateComponentState,
  deleteComponentState
} from "../../../../actions/component.actions";
import {
  updateData,
  requestData,
  clearData
} from "../../../../actions/data.actions";

import {
  LEAVE_MODULE_ID,
  LEAVE_EDIT_ENTRY
} from "../../../../constants/app.constants";

import Button from "../../../widgets/Button";
import TextArea from "../../../widgets/TextArea";

import Icon from "../../../widgets/Icon";

import Snackbar from "../../../widgets/Snackbar";

class LeaveEditForm extends Component {
  state = {
    snackIsOpen: false,
    snackMessage: "",
    validationMsg: ""
  };

  onChangeFieldValues = (id, updatedValue, updatedValue1, updatedValue2) => {
    this.setState({
      [id]: updatedValue
    });
  };

  closeNewEntry = () => {
    const { updateComponentState } = this.props;
    updateComponentState(LEAVE_MODULE_ID, LEAVE_EDIT_ENTRY, false);
  };

  onSnackClose() {
    this.setState(
      {
        snackIsOpen: false
      },
      () => {
        // this.updateStateAndRedux();
      }
    );
  }

  onChangesNote = (id, updatedText) => {
    this.setState({
      currentNote: updatedText.trim()
    });
  };
  updateSubmit = () => {
    const { mainIndex, fieldIndex } = this.props;
    const { currentNote } = this.state;
    this.props.updateNoteTempRecord(mainIndex, fieldIndex, currentNote);
  };
  calcelForm() {}
  render() {
    const { currentNote } = this.props;
    return (
      <div className="pr-inner-div pr-center">
        <div className="pr-header-level" style={{ display: "flex" }}>
          <div
            className="pr-col-inner-div-header-left"
            style={{ padding: "4px", width: "95%" }}
          >
            <span style={{ fontSize: "18px" }}>Note</span>
          </div>
          <div
            className="pr-col-inner-div-header-right"
            style={{ padding: "4px" }}
          >
            <Icon
              icon="close"
              style={{
                fontSize: "20px",
                cursor: "pointer",
                margin: "3px",
                color: "black"
              }}
              title="close"
              onClick={() => this.closeNewEntry()}
            />
            <Snackbar
              snackIsOpen={this.state.snackIsOpen}
              snackMessage={this.state.snackMessage}
              onSnackClose={() => this.onSnackClose()}
            />
          </div>
        </div>

        <div
          className="pr-container"
          id="pr-leave-note"
          style={{ padding: "5px" }}
        >
          {/* <div className="pr-row">
            <span>Note Text:</span>
          </div> */}
          <div className="pr-row">
            <TextArea
              id="note"
              value={currentNote}
              onChange={(e, f) => this.onChangesNote(e, f)}
              rows="6"
              cols="50"
            />
          </div>
          <div className="pr-row">
            <Button
              data="Save"
              onClick={() => this.updateSubmit()}
              className="button-submitEntry"
            />

            <Button
              data="Cancel"
              onClick={() => this.closeNewEntry()}
              className="button-cancel"
            />
          </div>
          {this.state.validationMsg !== "" ? (
            <div className="error-right-div" id="errDiv">
              <span style={{ color: "#FF0000" }}>
                {this.state.validationMsg}
              </span>
            </div>
          ) : null}
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
    clearComponentState,
    updateComponentState,
    deleteComponentState,
    updateData,
    requestData,
    clearData
  }
)(LeaveEditForm);
