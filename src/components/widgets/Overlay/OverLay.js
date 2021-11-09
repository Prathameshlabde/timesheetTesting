import React, { Component } from "react";

import "./over-lay.css";

class Overlay extends Component {
  render() {
    const { subComponent } = this.props;
    let classNameForOverlay = "main-container";
    if (this.props.classNameOverride) {
      classNameForOverlay = this.props.classNameOverride;
    }
    return <div className={classNameForOverlay}>{subComponent}</div>;
  }
}
export default Overlay;
