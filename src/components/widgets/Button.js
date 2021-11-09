import React, { Component } from "react";
import PropTypes from "prop-types";

class Button extends Component {
  static propTypes = {
    title: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func,
    icon: PropTypes.string,
    disabled: PropTypes.bool
  };

  handleClick = evt => {
    const fn = this.props.onClick;
    fn && fn(evt);
  };

  render() {
    const { id, style, data, className, type, disabled } = this.props;

    return (
      <button
        id={id}
        onClick={this.handleClick}
        style={style}
        className={className}
        type={type}
        disabled={disabled}
      >
        {data}
      </button>
    );
  }
}
export default Button;
