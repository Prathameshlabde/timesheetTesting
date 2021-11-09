import React, { Component } from "react";

class SpanLabel extends Component {
  render() {
    const {
      id,
      mainDivStyle,
      style,
      data,
      className,
      isRequired,
      mainClassName = "" /* //aditya 13 july classname for main division*/,
    } = this.props;
    return (
      <div className={mainClassName} style={mainDivStyle}>
        <span id={id} style={style} className={className}>
          {data}
        </span>
        {isRequired && data ? (
          <span id={id} style={{ color: "#e30606" }}>
            *
          </span>
        ) : null}
      </div>
    );
  }
}
export default SpanLabel;
