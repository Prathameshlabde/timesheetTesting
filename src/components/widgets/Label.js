import React, { Component } from "react";

class Label extends Component {
  render() {
    const { id, style, data } = this.props;
    return (
      <label id={id} style={style}>
        {data}
      </label>
    );
  }
}
export default Label;
