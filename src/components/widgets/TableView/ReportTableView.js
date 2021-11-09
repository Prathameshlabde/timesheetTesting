import React, { Component } from "react";
import Icon from "../Icon";
import { connect } from "react-redux";
import { Map } from "immutable";
import {
  clearComponentState,
  updateComponentState
} from "../../../actions/component.actions.js";
import {
  APP_ID,
  EXPORT_DATA,
  REPORT_SUBMENU_ID,
  PR_NUM_TEXT,
  TASK_TITLE,
  TASK_UNKNOWN_TASKS,
  SUB_EXPORT_DATA
} from "../../../constants/app.constants";
import "./table-view.css";
import { ReportStyles, isLockedEntry } from "./tableView.utils";
import ReactExport from "react-data-export";
import { isEmpty } from "../../utils/common.utils";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

class ReportTableView extends Component {
  dataFormater(value, index) {
    if (index === 0) {
      return <span style={ReportStyles.styleTitle}> {value.value} </span>;
    } else if (index === 1) {
      return <span style={ReportStyles.styleSubtitle}> {value.value} </span>;
    } else {
      return <span style={ReportStyles.styleBody}> {value.value} </span>;
    }
  }

  renderSpanLabelsHeader(value, index) {
    return (
      <span style={ReportStyles.headerBoldLabel} key={"coloumn" + index}>
        {value}
      </span>
    );
  }

  renderSpanLabelsForTotal(value, index, columns) {
    let retObj;
    columns.className && columns.className === PR_NUM_TEXT
      ? (retObj = (
          <span
            className={columns.className}
            style={ReportStyles.spanLabelBoldNumber}
            key={"coloumn" + index}
          >
            {value}
          </span>
        ))
      : (retObj = (
          <span
            className=""
            style={ReportStyles.spanLabelBold}
            key={"coloumn" + index}
          >
            {value}
          </span>
        ));

    return retObj;
  }

  renderSpanLabelsOthers(value, index, columns, row) {
    let retObj;
    columns.isSerialNo && columns.isSerialNo === true
      ? (retObj = this.renderSpanLabel(value, index, columns, row))
      : columns.className && columns.className === PR_NUM_TEXT
        ? (retObj = this.renderSpanLabelNumber(value, index, columns.className))
        : (retObj = this.renderSpanLabel(value, index, columns, row));

    return retObj;
  }

  renderSpanLabel(value, index, columns, row) {
    let retobj;
    columns.isLink &&
    columns.isLink === true &&
    value !== TASK_TITLE &&
    value !== TASK_UNKNOWN_TASKS
      ? (retobj = (
          <a
            href=""
            style={ReportStyles.spanLabel}
            key={"coloumn" + index}
            onClick={e => {
              e.preventDefault();
              this.props.onclickEdt(row);
            }}
          >
            {value}
          </a>
        ))
      : (retobj = (
          <span style={ReportStyles.spanLabel} key={"coloumn" + index}>
            {value}
          </span>
        ));

    return retobj;
  }

  renderSpanLabelNumber(value, index, className) {
    return (
      <span
        className={className}
        style={ReportStyles.spanLabelNumber}
        key={"coloumn" + index}
      >
        {value}
      </span>
    );
  }

  isToDeleteLastRowForFooter(columns, index, totalCountOfColumn) {
    if (index < totalCountOfColumn - 1) {
      return (
        <div
          className="div-table-col"
          key={"coloumn" + index}
          style={{ ...ReportStyles.ColStyle, ...columns.style }}
        >
          {this.renderHeaderFooterRowColumns(columns, index)}
        </div>
      );
    }
  }

  isToDeleteLastRow(columns, index, totalCountOfColumn, row, rowIndex) {
    if (index < totalCountOfColumn - 1) {
      return (
        <div
          className="div-table-col"
          key={"coloumn" + index}
          style={{ ...ReportStyles.ColStyle, ...columns.style }}
        >
          {this.renderRowColumns(columns, index, row, rowIndex)}
        </div>
      );
    }
  }

  renderHeaderFooterRowColumns(Columns, index) {
    switch (Columns.type) {
      case "text": {
        if (Columns.isDescription === true) {
          return Columns.values.map((value, index) =>
            this.dataFormater(value, index)
          );
        } else {
          return Columns.values.map(
            (values, index) =>
              values.value === "Total"
                ? this.renderSpanLabelsForTotal(values.value, index, Columns)
                : this.renderSpanLabelsOthers(values.value, index, Columns, "")
          );
        }
      }
      case "headerBold": {
        return Columns.values.map((values, index) =>
          this.renderSpanLabelsHeader(values.value, index)
        );
      }
      default:
        return null;
    }
  }

  renderRowColumns(Columns, index, row, rowIndex) {
    switch (Columns.type) {
      case "editButton": {
        if(
          !isEmpty(this.props.ogData) &&
          !isLockedEntry(this.props.ogData, rowIndex) &&
          this.props.reportName === "Review Entries" 
        ) {
          return (
            <div
              style={{ ...ReportStyles.buttonDiv, ...Columns.style }}
              onClick={() => this.props.onclickEdt(Columns.value)}
            >
              <Icon
                icon="edit"
                style={{
                  padding: "2px",
                  fontSize: "20px"
                }}
              />
            </div>
          );
        } else {
          return null;
        }
      }
      case "deleteButton": {
        if (
          !isEmpty(this.props.ogData) &&
          !isLockedEntry(this.props.ogData, rowIndex) &&
          this.props.reportName === "Review Entries"
        ) {
          return (
            <div
              style={{ ...ReportStyles.buttonDiv, ...Columns.style }}
              onClick={() => this.props.onClickDel(Columns.value)}
            >
              <Icon
                icon="delete"
                style={{
                  padding: "2px",
                  fontSize: "20px"
                }}
              />
            </div>
          );
        } else {
          return (
            <div
              title={"Entries are locked"}
              style={{ ...ReportStyles.buttonDiv }}
            >
              <Icon
                title={"Entries are locked"}
                icon="lock"
                style={{
                  fontSize: "20px"
                }}
              />
            </div>
          );
        }
      }
      case "text": {
        if (Columns.isDescription === true) {
          return Columns.values.map((value, index) =>
            this.dataFormater(value, index)
          );
        } else {
          return Columns.values.map(
            (values, index) =>
              values.value === "Total"
                ? this.renderSpanLabelsForTotal(values.value, index, Columns)
                : this.renderSpanLabelsOthers(values.value, index, Columns, row)
          );
        }
      }
      case "headerBold": {
        return Columns.values.map((values, index) =>
          this.renderSpanLabelsHeader(values.value, index)
        );
      }
      default:
        return null;
    }
  }

  renderFooter(row, index) {
    let totalCountOfColumn = row.columns.length;

    return row.isDescriptionDetails === true ? (
      <div className="div-table-row-in-description div-table-row-footer">
        <div style={{ display: "flex" }}>
          {row.columns.map((Columns, index) =>
            this.isToDeleteLastRowForFooter(Columns, index, totalCountOfColumn)
          )}
        </div>
      </div>
    ) : (
      <div
        className="div-table-row-header"
        style={{ ...ReportStyles.tableHeaderRow, ...row.style }}
      >
        {row.columns.map((Columns, index) => (
          <div
            className="div-table-col"
            key={"coloumn" + index}
            style={{ ...ReportStyles.ColStyle, ...Columns.style }}
          >
            {this.renderHeaderFooterRowColumns(Columns, index)}
          </div>
        ))}
      </div>
    );
  }

  renderHeaderAndFooterRowBold(row, index) {
    return index === 0 ? (
      <div
        className="div-table-row-header"
        style={{ ...ReportStyles.tableHeaderRow, ...row.style }}
      >
        {row.columns.map((Columns, index) => (
          <div
            className="div-table-col"
            key={"coloumn" + index}
            style={{ ...ReportStyles.ColStyle, ...Columns.style }}
          >
            {this.renderHeaderFooterRowColumns(Columns, index)}
          </div>
        ))}
      </div>
    ) : (
      this.renderFooter(row, index)
    );
  }

  renderFillRow(row, renderClass, rowIndex) {
    return (
      <div
        className={"div-table-row" + renderClass}
        style={{ ...ReportStyles.tableRow }}
      >
        {row.columns.map((Columns, index) => (
          <div
            className="div-table-col"
            key={"coloumn" + index}
            style={{ ...ReportStyles.ColStyle, ...Columns.style }}
          >
            {this.renderRowColumns(Columns, index, "", rowIndex)}
          </div>
        ))}
      </div>
    );
  }

  renderSubTotalRow(row, rowIndex) {
    const columnsLength = row.columns.length;
    return (
      <div
        className={"div-table-row pr-even pr-subTotal"}
        style={{ ...ReportStyles.tableRow }}
      >
        {row.columns.map(
          (Columns, index) =>
            index < columnsLength - 1 ? (
              <div
                className="div-table-col"
                key={"coloumn" + index}
                style={{ ...ReportStyles.ColStyle, ...Columns.style }}
              >
                {this.renderRowColumns(Columns, index, "", rowIndex)}
              </div>
            ) : null
        )}
      </div>
    );
  }

  renderNormalRows(row, rowIndex) {
    let totalCountOfColumn = row.columns.length;
    return row.isDescriptionDetails === true ? (
      <div
        className="div-table-row-in-description"
        style={{ ...ReportStyles.tableRowDescription }}
      >
        <div style={{ display: "flex" }}>
          {row.columns.map((Columns, index) =>
            this.isToDeleteLastRow(
              Columns,
              index,
              totalCountOfColumn,
              row,
              rowIndex
            )
          )}
        </div>

        <div style={{ display: "flex" }}>
          <div style={{ width: "8%" }} />
          <div
            className="div-table-col"
            key={"coloumn" + rowIndex}
            style={{
              ...ReportStyles.ColStyleDescription
            }}
          >
            <span style={ReportStyles.descriptionBotom}>
              {row.columns[totalCountOfColumn - 1].values[0].value}
            </span>
          </div>
        </div>
      </div>
    ) : (
      <div className={"div-table-row "} style={{ ...ReportStyles.tableRow }}>
        {row.columns.map((Columns, index) => (
          <div
            className="div-table-col"
            key={"coloumn" + index}
            style={{ ...ReportStyles.ColStyle, ...Columns.style }}
          >
            {this.renderRowColumns(Columns, index, row, rowIndex)}
          </div>
        ))}
      </div>
    );
  }

  renderAllRows(row, rowIndex, lastIndex, headfix = "") {
    let firstRow, middleRows, lastRow;

    if (rowIndex === 0) {
      firstRow = this.renderHeaderAndFooterRowBold(row, rowIndex);
    } else if (rowIndex === lastIndex) {
      lastRow = this.renderHeaderAndFooterRowBold(row, rowIndex);
    } else {
      if (this.props.subTotalindexes && this.props.subTotalindexes.indexes) {
        const indexArr = this.props.subTotalindexes.indexes[0];
        if (indexArr.includes(rowIndex)) {
          middleRows = this.renderSubTotalRow(row, rowIndex);
        } else {
          middleRows = this.renderNormalRows(row, rowIndex);
        }
      } else {
        middleRows = this.renderNormalRows(row, rowIndex);
      }

      if (this.props.isFillIndexes && this.props.isFillIndexes.indexes) {
        const indexArr = this.props.isFillIndexes.indexes[0];
        const indexLeaveArr = this.props.leavesIndex.indexes[0];

        if (indexArr.includes(rowIndex)) {
          middleRows = this.renderFillRow(row, " pr-notFilled", rowIndex);
        } else {
          if (indexLeaveArr.includes(rowIndex)) {
            middleRows = this.renderFillRow(row, " pr-Filled-leave", rowIndex);
          } else {
            middleRows = this.renderFillRow(row, " pr-Filled", rowIndex);
          }
        }
        const indexSubArr = this.props.subTotalindexes.indexes[0];

        if (indexSubArr.includes(rowIndex)) {
          middleRows = this.renderSubTotalRow(row, rowIndex);
        }
      }
    }
    if (headfix === "headfix") {
      return <div key={"repTable" + rowIndex}>{firstRow}</div>;
    } else {
      return (
        <div key={"repTable" + rowIndex}>
          {middleRows}
          {lastRow}
        </div>
      );
    }
  }

  getReportFileName(exportExcelData) {
    if(exportExcelData.length > 0){
      if(exportExcelData[0].columns && exportExcelData[0].columns.length > 0){
        return exportExcelData[0].columns[0];
      }else{
        return "Export To Excel";
      }
    }else{
      return "Export To Excel";
    }
  }

  render() {
    // console.log("this.props.data  from task report === ", this.props.data);
    const { exportState, isSubReport } = this.props;

    let exportExcelData = exportState.get(EXPORT_DATA, "");

    let exportExcelData1 = "";
    if (isSubReport && isSubReport === true) {
      exportExcelData1 = exportState.get(SUB_EXPORT_DATA, "");
    }

    if (exportExcelData1 !== "") {
      exportExcelData = exportExcelData1;
    }

    let hideExcel = "false";

    if (this.props.hideExcel) {
      hideExcel = this.props.hideExcel;
    }

    let headFix = "";

    if (this.props.headFix && this.props.headFix === "true") {
      headFix = " head-fix ";
    }

    const { rows } = this.props;
    let lastIndex;
    for (let i = 0; i < rows.length; i++) {
      lastIndex = i;
    }
    return (
      <div style={{ width: "100%" }}>
        {hideExcel === "false" ? (
          <div className="row" style={{ textAlign: "right" }}>
            <ExcelFile
              element={
                <button className="report-submitButton">Export To Excel</button>
              }
              filename={this.getReportFileName(exportExcelData)}
              fileExtension="xlsx"
            >
              <ExcelSheet dataSet={exportExcelData} name="Export Data" />
            </ExcelFile>
          </div>
        ) : null}

        <div className="div-table" style={{ ...ReportStyles.table }}>
          {rows.map((row, index) =>
            this.renderAllRows(row, index, lastIndex, "headfix")
          )}
        </div>

        <div
          className={"div-table " + headFix}
          style={{ ...ReportStyles.table }}
        >
          {rows.map((row, index) => this.renderAllRows(row, index, lastIndex))}
        </div>
      </div>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  return {
    componentState: state.component.get(ownProps.id, Map()),
    appState: state.component.get(APP_ID, Map()),
    exportState: state.component.get(REPORT_SUBMENU_ID, Map())
  };
}

export default connect(
  mapStateToProps,
  {
    clearComponentState,
    updateComponentState
  }
)(ReportTableView);
