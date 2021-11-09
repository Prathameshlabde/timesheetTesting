import React, { Component } from "react";
import { connect } from "react-redux";
import { Map } from "immutable";
import {
  clearComponentState,
  updateComponentState,
} from "../../../actions/component.actions.js";
import "./table-view.css";
import { ReportStyles } from "./tableView.utils";
import ReactExport from "react-data-export";
import { isEmpty, stringDateToMoment } from "../../utils/common.utils";
import { DATE_FORMAT } from "../../../constants/app.constants.js";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const styles = {
  defaultColumn: {
    display: "table-column",
    padding: "5px",
  },
};

class SummaryReportTableView extends Component {
  getTootTipForColumn(index, rowValue, columnValue) {
    const { tableData } = this.props;

    const allColumnToolTips = tableData.tooolTipDates;
    const columnNames = tableData.titleRow;

    const shouldShowTootTip =
      !isEmpty(columnValue) &&
      !isEmpty(rowValue) &&
      !isEmpty(allColumnToolTips[index]);

    if (shouldShowTootTip) {
      const valueToReturn = `${rowValue} - ${columnNames[index]}\nFrom : ${
        allColumnToolTips[index].fromDate
      } - To : ${allColumnToolTips[index].toDate}`;
      return valueToReturn;
    } else if (rowValue === "Total") {
      const valueToReturn = `${rowValue} - ${columnNames[index]}\nFrom : ${
        allColumnToolTips[index].fromDate
      } - To : ${allColumnToolTips[index].toDate}`;
      return valueToReturn;
    } else {
      return "";
    }
  }

  getColumns(singleColumn, index, tootlTip) {
    const { tableData } = this.props;
    return (
      <div
        className="div-table-col"
        key={"coloumn" + index}
        style={{
          ...styles.defaultColumn,
          ...tableData.getColumnStyleList[index],
        }}
        title={this.getTootTipForColumn(index, tootlTip, singleColumn)}
      >
        <span> {singleColumn} </span>
      </div>
    );
  }

  getSingleRows(singleRow, className, style = {}, tootlTip) {
    return (
      <div
        className={className}
        style={{ ...ReportStyles.tableHeaderRow, ...style }}
      >
        {singleRow.map((singleColumn, index) =>
          this.getColumns(singleColumn, index, tootlTip)
        )}
      </div>
    );
  }

  renderHeader(tableHeader) {
    return this.getSingleRows(tableHeader, "div-table-row-blank");
  }

  renderTitle(titleRow) {
    return this.getSingleRows(titleRow, "div-table-row-header-footer");
  }

  renderDataRow(tableRows) {
    return tableRows.map((dataRow, index) => {
      return this.getSingleRows(
        dataRow,
        "div-table-row-blank div-table-row",
        ReportStyles.tableRow,
        dataRow[1] //Tool tip ..
      );
    });
  }

  renderCalculatedLastRow(monthTotalCalculation) {
    return this.getSingleRows(
      monthTotalCalculation,
      "div-table-row-header-footer",
      {},
      monthTotalCalculation[0]
    );
  }

  getReportFileName() {
    const { tableData } = this.props;
    const dataObj = tableData.dataObject;
    if (!dataObj) {
      return "";
    }
    const fileName = `${dataObj.reportTitle}_${stringDateToMoment(
      dataObj.fromDate
    ).format(DATE_FORMAT)}-To-${stringDateToMoment(dataObj.toDate).format(
      DATE_FORMAT
    )}`;

    return fileName;
  }

  render() {
    const { tableData } = this.props;

    return (
      <div style={{ display: "inline-block" }}>
        <div>
          <div className="row" style={{ position: "absolute" }}>
            <ExcelFile
              element={
                <button className="report-submitButton">Export To Excel</button>
              }
              filename={this.getReportFileName()}
              fileExtension="xlsx"
            >
              <ExcelSheet dataSet={tableData.excelData} name="Export Data" />
            </ExcelFile>
          </div>
        </div>
        <div style={{ marginTop: "36px", height: "400px", overflow: "auto" }}>
          <div style={{ display: "inline-block" }}>
            {this.renderHeader(tableData.tableHeader)}
            {this.renderTitle(tableData.titleRow)}
            {this.renderDataRow(tableData.tableRows)}
            {this.renderCalculatedLastRow(tableData.monthTotalCalculation)}
          </div>
        </div>
      </div>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  return {
    componentState: state.component.get(ownProps.id, Map()),
  };
}

export default connect(
  mapStateToProps,
  {
    clearComponentState,
    updateComponentState,
  }
)(SummaryReportTableView);
