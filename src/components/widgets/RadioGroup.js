import React, { Component } from "react";
import SpanLabel from "./SpanLabel";

class RadioGroup extends Component {
  // componentWillMount() {
  //   console.log("id = ", this.props.id);
  //   console.log("in will mount of RadioGroup");
  //   const { groupValuesArr, rowIndex, name } = this.props;
  //   let finalArr = [];
  //   groupValuesArr &&
  //     groupValuesArr.forEach((element, index) => {
  //       if (index === 0)
  //         finalArr.push({
  //           radioName: name,
  //           radioValue: element,
  //           selected: true,
  //         });
  //       else
  //         finalArr.push({
  //           radioName: name,
  //           radioValue: element,
  //           selected: false,
  //         });
  //     });

  //   this.setState({ groupValuesArr: finalArr, rowIndex, name }, () => {
  //     console.log(
  //       "final willmount groupValuesArr = ",
  //       this.state.groupValuesArr
  //     );
  //   });
  // }

  onChangeRadio = (e) => {
    // console.log("onchange value in radio = ", e.target.value);
    const selectedValue = e.target.value;
    const groupValuesArr = this.props.groupValuesArr;
    // groupValuesArr &&
    //   groupValuesArr.forEach((element) => {
    //     if (element.radioValue === selectedValue) {
    //       element.selected = true;
    //     } else {
    //       element.selected = false;
    //     }
    //   });

    const { id } = this.props;
    this.props.onChange &&
      this.props.onChange(id, selectedValue, groupValuesArr);
  };

  render() {
    const { id, groupValuesArr, name, rowIndex } = this.props;
    return (
      <div
        id={id}
        key={"radio_opt_stats_" + rowIndex + "_" + id}
        style={{ display: "flex", width: "100%", paddingTop: "1%" }}
      >
        {groupValuesArr.map((element, index) => (
          <div
            id={"radio_opt_stats_child_id_" + id + "_" + index}
            key={"radio_opt_stats_child_key_" + id + "_" + index}
            style={{ display: "flex", width: "13%" }}
          >
            <SpanLabel data={element} className="span-label" />
            <input
              style={{ marginLeft: "6%" }}
              onChange={(e) => this.onChangeRadio(e)}
              type="radio"
              value={element}
              name={name}
              // defaultChecked={index === 0 ? true : false}
              // checked={element.selected}
            />
          </div>
        ))}
      </div>
    );
  }
}
export default RadioGroup;
