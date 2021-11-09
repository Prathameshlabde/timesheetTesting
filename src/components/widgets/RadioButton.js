import React, { Component } from "react";
import "./radioButton.css";
// import SpanLabel from "./SpanLabel";

class RadioButton extends Component {
  state = {
    firstCheckedState: true,
    secondCheckedState: false,
  };

  onChangetext = (e) => {
    this.setState(
      {
        firstCheckedState: !this.state.firstCheckedState,
        secondCheckedState: !this.state.secondCheckedState,
      },
      () => {
        let valToSend;
        if (this.state.firstCheckedState === true) {
          valToSend = "1";
        } else {
          valToSend = "0";
        }
        this.props.onChange && this.props.onChange(this.props.id, valToSend);
      }
    );
  };

  componentWillReceiveProps(nextProps) {
    const { firstChecked } = nextProps;

    if (firstChecked === true) {
      this.setState(
        {
          firstCheckedState: true,
          secondCheckedState: false,
        },
        () => {}
      );
    } else {
      this.setState(
        {
          firstCheckedState: false,
          secondCheckedState: true,
        },
        () => {}
      );
    }
  }

  render() {
    const { id, name, firstName, secondName } = this.props;
    // const { spanLabelDateProps } = this.props;

    return (
      <div
        className="radio-button-maindiv"
        onChange={(e) => this.onChangetext(e)}
      >
        <div>
          <input
            id={id}
            type="radio"
            name={name}
            onChange={(e) => this.onChangetext(e)}
            value={firstName}
            checked={this.state.firstCheckedState}
          />
          {/* {spanLabelDateProps ? (
            <SpanLabel {...spanLabelDateProps} data={firstName} />
          ) : (
            firstName
          )} */}

          {firstName}
        </div>
        <div>
          <input
            id={id}
            type="radio"
            name={name}
            onChange={(e) => this.onChangetext(e)}
            value={secondName}
            checked={this.state.secondCheckedState}
          />
          {/* {spanLabelDateProps ? (
            <SpanLabel {...spanLabelDateProps} data={secondName} />
          ) : (
            secondName
          )} */}
          {secondName}
        </div>
      </div>
    );
  }
}
export default RadioButton;
