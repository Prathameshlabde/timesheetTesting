import React, { Component } from "react";
import "./checkBox.css";

class CheckBox extends Component {
  state = {
    checked: this.props.isCheck
  };

  onClickCheckBox = e => {
    this.setState(
      {
        checked: e.target.checked,
        isCheck: e.target.checked
      },
      () => {
        if (this.props.dataSetIndex) {
          this.props.onClick(
            this.props.id,
            this.state.checked,
            this.props.dataSetIndex,
            this.props.dataSetID
          );
        } else {
          this.props.onClick(this.props.id, this.state.checked);
        }
      }
    );
  };

  render() {
    const { id, style } = this.props;
    // console.log("id = ", id, "this.props.isCheck = ", this.props.isCheck);
    return (
      // <label className="checkBox-container">
      <input
        id={id}
        type="checkbox"
        checked={this.props.isCheck}
        // checked={
        //   this.state.isChecked !== isCheck ? isCheck : this.state.isChecked
        // }
        onClick={e => this.onClickCheckBox(e)}
        style={style}
        className={this.props.className}
      />
      //  {/* <span className="checkmark" />
      // </label> */}
    );
  }
}
export default CheckBox;
