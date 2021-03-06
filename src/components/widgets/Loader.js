// @flow
import React from "react";
// import PropTypes from "prop-types";
// import { Colors } from "Commons/colors";

const styles = {
  loader: {
    position: "fixed",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: "flex",
    zIndex: 2,
    backgroundColor: "rgba(0,0,0, 0.3)",
  },
  text: {
    fontSize: "14px",
    paddingLeft: "10px",
    color: "#54161f", //Colors.garnet,
    fontWeight: "lighter",
    width: "300px",
  },
};

class Loader extends React.Component {
  loadLoader() {
    const { props } = this;
    return (
      <svg
        style={{ margin: "auto" }}
        version="1.1"
        x="0px"
        y="0px"
        width={props.width || "30px"}
        height={props.height || "30px"}
        viewBox="0 0 40 40"
        enableBackground="new 0 0 40 40"
      >
        <path
          opacity="0.5"
          fill="#000"
          d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946 s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634 c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"
        />
        <path
          fill="#000"
          d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0 C22.32,8.481,24.301,9.057,26.013,10.047z"
        >
          <animateTransform
            attributeType="xml"
            attributeName="transform"
            type="rotate"
            from="0 20 20"
            to="360 20 20"
            dur="0.5s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    );
  }

  render() {
    const { style, text, loaderStyle } = this.props;
    return (
      <div className="pr-loader" style={{ ...styles.loader, ...style }}>
        {text ? (
          <div style={loaderStyle}>
            {this.loadLoader()}
            <div style={styles.text}>{text}</div>
          </div>
        ) : (
          this.loadLoader()
        )}
      </div>
    );
  }
}

export default Loader;
