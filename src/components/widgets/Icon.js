import React from "react";
import PropTypes from "prop-types";

class Icon extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func,
    onMouseOver: PropTypes.func,
    icon: PropTypes.string
  };

  handleClick = evt => {
    const fn = this.props.onClick;
    fn && fn(evt);
  };

  handleMouseOver = evt => {
    const fn = this.props.onMouseOver;
    fn && fn(evt);
  };

  render() {
    const { title = "", icon, style = {}, className = "" } = this.props;
    return (
      <i
        className={`material-icons ${className}`}
        style={style}
        title={title}
        onClick={this.handleClick}
        onMouseOver={this.handleMouseOver}
      >
        {icon}
      </i>
    );
  }
}

export default Icon;
