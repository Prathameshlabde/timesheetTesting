import React, { Component } from "react";
import "./TableView/table-view.css";

class Collapsible extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.togglePanel = this.togglePanel.bind(this);
  }

  togglePanel(e) {
    this.setState({ open: !this.state.open });
  }

  render() {
    return (
      <div>
        <div
          onClick={(e) => this.togglePanel(e)}
          // style={{
          //   // cursor: "pointer",
          //   // border: "solid 1px #f2f2f2",
          //   // padding: "15px",
          // }}
          // className="header"
        >
          {this.props.parent}
          {this.props.subParent}
        </div>
        {this.state.open ? (
          <div
            style={{
              cursor: "pointer",
              padding: "1%",
              animation: "0.2s ease-in 0s 1 slideInFromTop",
            }}
          >
            {this.props.child}
          </div>
        ) : null}
      </div>
    );
  }
}
export default Collapsible;
