import React, { Component } from "react";
// import colors from "../../../common/colors";
import PaginationWidget from "../../PaginationWidget";
import "../table-view.css";
import DashboardRows from "./DashboardRows.js";
import { tableOverFlowStyle } from "../../../pageContent/Dashboard/Dashboard.utils";

const defaultStyle = {
  table: {},
  tableHeaderRow: {},
  ColStyle: {
    display: "table-column",
    width: "7.5%",
    padding: "5px",
  },

  spanLabel: {
    display: "block",
  },
  headerBoldLabel: {
    fontWeight: "bold",
  },
  descriptionBotom: {
    // fontWeight: "bold",
  },
};

class DashboardTableView extends Component {
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

  isButtonFlag(singleColumn, index, rowIndex, ogData) {
    switch (singleColumn.type) {
      case "text": {
        let dataTitle = "";
        if (singleColumn.dataTitle) {
          dataTitle = singleColumn.dataTitle;
        }

        return singleColumn.values.map((values, index) => (
          <span
            data-title={dataTitle}
            style={defaultStyle.spanLabel}
            key={"coloumn" + index}
          >
            {this.getTextData(values.value)}
          </span>
        ));
      }
      case "headerBold": {
        return singleColumn.values.map((values, index) => (
          <span style={defaultStyle.headerBoldLabel} key={"coloumn" + index}>
            {values.value}
          </span>
        ));
      }

      default:
        return null;
    }
  }

  isSorting(singleColumn, index, rowIndex, ogData) {
    return (
      <div
        className="div-table-col"
        key={"coloumn" + index}
        style={{ ...defaultStyle.ColStyle, ...singleColumn.style }}
      >
        {this.isButtonFlag(singleColumn, index, rowIndex, ogData)}
      </div>
    );
  }

  getHeader(row, rowIndex, ogData) {
    return (
      <div key={"rows" + rowIndex}>
        <div
          className="div-table-row-header"
          style={{ ...defaultStyle.tableHeaderRow, ...row.style }}
        >
          {row.columns.map((singleColumn, index) =>
            this.isSorting(singleColumn, index, rowIndex, ogData)
          )}
        </div>
      </div>
    );
  }

  renderRows(row, rowIndex, ogData) {
    if (rowIndex === 0) return null;
    let retObj;

    const cls = this.getOddEvenRow(rowIndex);
    const { fdate, tdate } = this.props;
    retObj = (
      <DashboardRows
        key={"Dashboard_rows_" + rowIndex}
        rows={row.columns}
        rowIndex={rowIndex}
        ogData={ogData}
        cls={cls}
        fdate={fdate}
        tdate={tdate}
        isEmployeeOrProjectStats={this.props.isEmployeeOrProjectStats}
      />
    );

    return <div key={"rows" + rowIndex}>{retObj}</div>;
  }

  render() {
    const { rows, style, paginationData } = this.props;
    // const {  totalRowCount } = this.props;
    let ogData = [];
    if (this.props.ogData) {
      ogData = this.props.ogData;
    }
    return (
      <div style={{ width: "100%" }}>
        {/* {totalRowCount && totalRowCount > 0 ? (
          <div style={{ display: "block", textAlign: "right" }}>
            {"Total - " + totalRowCount}
          </div>
        ) : null} */}
        <div className="div-table" style={{ ...defaultStyle.table, style }}>
          {this.getHeader(rows[0], 0, ogData)}
          <div style={tableOverFlowStyle}>
            {rows.map((row, index) => this.renderRows(row, index, ogData))}
          </div>
        </div>

        {paginationData ? (
          <div style={{ marginLeft: "90%" }}>
            <PaginationWidget
              totalPage={paginationData.totalPage}
              currentPage={paginationData.currentPage}
              maxNumbersOnLeftRight={paginationData.maxNumbersOnLeftRight}
              onChange={paginationData.onChange}
              style={{ padding: "15px" }}
            />
          </div>
        ) : null}
      </div>
    );
  }
}

export default DashboardTableView;
