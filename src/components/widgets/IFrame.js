import React, { Component } from "react";
import PropTypes from "prop-types";

class IFrame extends Component {
  static propTypes = {
    title: PropTypes.string,
    className: PropTypes.string,
    src: PropTypes.string,
    width: PropTypes.string,
    height: PropTypes.string
  };

  render() {
    const { src, width, height, className, title } = this.props;

    return (
      <div
        className="pr-header-level"
        style={{ height: "100%", width: "100%" }}
      >
        <iframe
          src={src}
          width={width}
          height={height}
          title={title}
          className={className}
        />
      </div>
    );
  }
}
export default IFrame;
