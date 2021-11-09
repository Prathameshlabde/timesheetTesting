import React, { Component } from "react";
import PropTypes from "prop-types";
import "./switch.css";

class Switch extends Component {
  static propTypes = {
    title: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func,
    icon: PropTypes.string
  };

  handleClick = evt => {};

  render() {
    const { isChecked } = this.props;

    return (
      <label className="switch">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={this.props.onChange}
        />
        <span className="slider round" />
      </label>
    );
  }
}
export default Switch;
