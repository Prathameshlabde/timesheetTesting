import React, { Component } from "react";
import { RadioGroup, RadioButton } from "react-radio-buttons";

class RadioGroupWidget extends Component {
  onChangeRadio = (e) => {
    this.props.onChange && this.props.onChange(this.props.id, e.target.value);
  };

  render() {
    const { groupValuesArr } = this.props;

    return (
      <RadioGroup
        value={groupValuesArr[0]}
        onChange={(e) => this.onChangeRadio(e)}
        horizontal
        // customStyle={{ backgroundColor: "black" }}
      >
        {groupValuesArr.map((value, index) => (
          <RadioButton key={"radio_" + value + index} value={value}>
            {value}
          </RadioButton>
        ))}

        {/* <RadioButton value="apple">
    Apple
  </RadioButton>
  <RadioButton value="orange">
    Orange
  </RadioButton>
  <RadioButton value="melon">
    Melon
  </RadioButton>
  <ReversedRadioButton value="melon">
    Melon
  </ReversedRadioButton> */}
      </RadioGroup>
    );
  }
}
export default RadioGroupWidget;
