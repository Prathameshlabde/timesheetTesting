import React from "react";
import propTypes from "prop-types";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "./Button";
import "./alertBox.css";

import { deepFreeze } from "../utils/common.utils";

const styles = deepFreeze({
  cancelBtn: {
    marginRight: "5px"
  },
  actions: {
    marginRight: "24px"
  },
  btn: {
    height: "30px",
    lineHeight: "30px"
  }
});

export default class AlertBox extends React.Component {
  static propTypes = {
    open: propTypes.bool,
    onCancel: propTypes.func.isRequired,
    onConfirm: propTypes.func.isRequired,
    button1: propTypes.string.isRequired,
    button2: propTypes.string.isRequired,
    alertMsg: propTypes.string.isRequired
  };

  onCancel = () => {
    this.props.onCancel && this.props.onCancel();
  };

  onConfirm = () => {
    this.props.onConfirm && this.props.onConfirm();
  };

  render() {
    const { button1, button2, alertMsg } = this.props;

    return (
      <Dialog classname="pr-alert" open={this.props.open}>
        <DialogContent style={{ padding: "0 24px 0px" }}>
          {/* <h3>Alert</h3> */}
          <p>{alertMsg}</p>
        </DialogContent>
        <DialogActions style={styles.actions}>
          <Button
            className={"button-cancel"}
            data={button1}
            onClick={this.onCancel}
          />
          <Button
            className={"button-submit"}
            data={button2}
            onClick={this.onConfirm}
          />
        </DialogActions>
      </Dialog>
    );
  }
}
