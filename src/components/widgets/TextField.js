import React, { Component } from "react";
import { isNumberValidate } from "../utils/common.utils";
class TextField extends Component {
  state = {
    updatedText: this.props.data,
    updatedID: this.props.id
  };

  setUpdatedValuetoState(fieldValue) {
    this.setState({ updatedText: fieldValue }, () => {
      this.props.onChange &&
        this.props.onChange(
          this.props.id,
          this.state.updatedText,
          this.props.mainIndex
        );
    });
  }

  onChangetext = e => {
    const { validateType } = this.props;
    let fieldValue = e.target.value;
    if (validateType && validateType === "number") {
      if (fieldValue !== "") {
        if (isNumberValidate(fieldValue) === true) {
          this.setUpdatedValuetoState(fieldValue);
        }
      } else {
        this.setUpdatedValuetoState("");
      }
    } else {
      this.setUpdatedValuetoState(fieldValue);
    }
  };

  onBlurField = e => {
    this.props.onBlur &&
      this.props.onBlur(this.props.id, this.state.updatedTex);
  };

  componentWillReceiveProps(nextProps) {
    const { id, data } = nextProps;

    this.setState({
      updatedText: data,
      updatedID: id
    });
  }

  render() {
    const { style, fieldType } = this.props;
    // console.log("in textField :-", this.state.updatedText);

    return (
      <input
        id={this.state.updatedID}
        type={fieldType ? fieldType : "text"}
        style={style}
        value={this.state.updatedText}
        onChange={e => this.onChangetext(e)}
        onBlur={this.onBlurField}
        disabled={this.props.isDisable}
        className={this.props.classNames}
        onKeyPress={this.props.onKeyPress}
        maxLength={this.props.maxLength}
      />
    );
  }
}
export default TextField;
