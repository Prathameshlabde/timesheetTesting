import React, { Component } from "react";
import { getHeaderText, spanStyleHeader } from "../newEntry.utils";
import "../newEntry-div.css";

class NewEntryHeaderDate extends Component {
  render() {
    return (
      <div className="col-inner-div-header-left" style={{ paddingTop: "4px" }}>
        <span style={spanStyleHeader}>
          {getHeaderText(this.props.isEditEntry, this.props.isDuplicateEntry)}
          <span className="newEntryHeaderDate">
            {" (" + this.props.newEntryStr + ")"}
          </span>
        </span>
      </div>
    );
  }
}
export default NewEntryHeaderDate;
