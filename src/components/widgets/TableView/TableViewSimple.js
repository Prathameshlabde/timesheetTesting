import React, { Component } from "react";
// import colors from "../../common/colors";
// import moment from "moment";
// import PaginationWidget from "../PaginationWidget";
// import DropdownList from "../DropdownList";
// import TextArea from "../TextArea";
// import Icon from "../Icon";
// import Switch from "../Switch";
// "isDescriptionDetails": true,
import "./table-view.css";
import { tableOverFlowStyle } from "../../pageContent/Dashboard/Dashboard.utils";

const defaultStyle = {
  table: {},
  tableHeaderRow: {},
  tableRow: {
    display: "flex",
    padding: "0px 2px",
    borderBottom: `1px solid #E6EBED`,
    textAlign: "center",
  },
  ColStyle: {
    display: "table-column",
    width: "15%",
    padding: "5px",
  },
  buttonDiv: {
    cursor: "pointer",
  },
  spanLabel: {
    display: "block",
  },
  headerBoldLabel: {
    fontWeight: "bold",
  },
};

class TableViewSimple extends Component {
  getOddEvenRow(index) {
    if (index % 2 === 0) {
      return "pr-even";
    } else {
      return "pr-odd";
    }
  }

  getTextData(value) {
    if (value === "") {
      return <strong>&nbsp;</strong>;
    } else {
      return value;
    }
  }

  getTootTipForColumn(item, index, rowIndex, row) {
    // console.log("item = ", item);
    // console.log("index = ", index);
    // console.log("finalhoursData = ", this.props.finalhoursData);
    // console.log("rowIndex = ", rowIndex);
    // console.log("row = ", row);
    return (
      "Billable Hrs: " +
      row.bilable_hours[index] +
      "\nNon Billable Hrs: " +
      row.non_bilable_hours[index]
    );
  }

  renderRows(row, rowIndex) {
    let retObj;
    const cls = this.getOddEvenRow(rowIndex);
    let labelStyle = {};
    if (this.props.isFromStats === true) labelStyle = { textAlign: "left" };

    retObj = (
      <div
        className={"div-table-row " + cls}
        style={{
          ...defaultStyle.tableRow,
          ...labelStyle,
        }}
      >
        <div
          className="div-table-col"
          key={"coloumn" + rowIndex}
          style={{ ...defaultStyle.ColStyle, width: "20%", cursor: "default" }}
        >
          <span style={defaultStyle.spanLabel}>{row.ename}</span>
        </div>
        {row.hours.map((item, index) => (
          <div
            className="div-table-col"
            key={"coloumn" + index}
            style={{ ...defaultStyle.ColStyle, cursor: "default" }}
            title={this.getTootTipForColumn(item, index, rowIndex, row)}
          >
            <span
              // data-title={dataTitle}
              style={defaultStyle.spanLabel}
              key={"coloumn" + index}
            >
              {this.getTextData(item)}
            </span>
          </div>
        ))}
      </div>
    );

    return <div key={"rows" + rowIndex}>{retObj}</div>;
  }

  getHeaderRow(headerArr) {
    let labelStyle = {};
    if (this.props.isFromStats === true) labelStyle = { textAlign: "left" };

    let firstRow = (
      <div
        className={"div-table-row pr-odd"}
        style={{
          ...defaultStyle.tableRow,
          ...labelStyle,
          backgroundColor: "#E6EBED;",
        }}
      >
        <div
          className="div-table-col"
          key={"coloumn 0"}
          style={{ ...defaultStyle.ColStyle, width: "20%" }}
        >
          <span style={defaultStyle.headerBoldLabel}>{"Name"}</span>
        </div>

        {headerArr.map((item, index) => (
          <div
            className="div-table-col"
            key={"coloumn" + index}
            style={{ ...defaultStyle.ColStyle }}
          >
            <span style={defaultStyle.headerBoldLabel}>{item}</span>
          </div>
        ))}
      </div>
    );

    return <div key={"rows"}>{firstRow}</div>;
  }

  render() {
    const { style, headerArr, finalhoursData } = this.props;
    //paginationData, from state
    // let rowstyles = {};
    // if (this.props.statName === "companystats") {
    //   rowstyles = {
    //     maxHeight: "35vh",
    //   };
    // }

    return (
      <div style={{ width: "100%" }}>
        <div className="div-table" style={{ ...defaultStyle.table, style }}>
          {this.getHeaderRow(headerArr)}
          <div style={tableOverFlowStyle}>
            {finalhoursData.map((row, index) => this.renderRows(row, index))}
          </div>
        </div>

        {/* {paginationData ? (
          <div style={{ marginLeft: "90%" }}>
            <PaginationWidget
              totalPage={paginationData.totalPage}
              currentPage={paginationData.currentPage}
              maxNumbersOnLeftRight={paginationData.maxNumbersOnLeftRight}
              onChange={paginationData.onChange}
              style={{ padding: "15px" }}
            />
          </div>
        ) : null} */}
      </div>
    );
  }
}
export default TableViewSimple;
