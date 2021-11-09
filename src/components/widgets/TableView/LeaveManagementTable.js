import React, { Component } from "react";
import { connect } from "react-redux";
import { Map } from "immutable";
import Icon from "../Icon";
import Switch from "../Switch";
import PaginationWidget from "../PaginationWidget";
import TextField from "../TextField";
import "./table-view.css";
import ReactExport from "react-data-export";
import {
  REPORT_SUBMENU_ID,
  EXPORT_DATA
} from "../../../constants/app.constants";
import {
  clearComponentState,
  updateComponentState
} from "../../../actions/component.actions.js";
import { defaultStyle } from "../../pageContent/Leave/LeaveManagement/leaveManagementStyles";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

class LeaveManagementTable extends Component {
  getOddEvenRow(index) {
    if (index % 2 === 0) {
      return "pr-odd";
    } else {
      return "pr-even";
    }
  }

  createSwitch = (values, idToedit, index) => {
    // console.log("what is value:-", values.value, "idToedit :-", idToedit.value);
    if (values.value === "1") {
      return (
        <Switch
          isChecked={false}
          onChange={() => this.props.onChngeSwitch(idToedit.value, false)}
        />
      );
    } else {
      return (
        <Switch
          isChecked={true}
          onChange={() => this.props.onChngeSwitch(idToedit.value, true)}
        />
      ); //this.props.onChngeSwitch()
    }
  };

  isNote(values, index) {
    if (index === 1 && values.value !== "") {
      return (
        <div className="tooltip">
          Note
          <span className="tooltiptext">{values.value}</span>
        </div>
      );
    } else {
      return (
        <span style={defaultStyle.spanLabel} key={"coloumn" + index}>
          {values.value}
        </span>
      );
    }
  }

  isButtonFlag(Columns, index, rowIndex = 0) {
    // console.log("Columns in buutton:-", Columns);
    switch (Columns.type) {
      case "editButton": {
        if (Columns.value && Columns.value !== "") {
          return (
            <div
              style={{ ...defaultStyle.buttonDiv }}
              onClick={() => this.props.onClickDivEdit(rowIndex)}
            >
              <Icon
                icon="edit"
                style={{
                  fontSize: "20px"
                }}
                title="edit"
              />
            </div>
          );
        } else {
          return (
            // console.log("index inside:-", index)
            <span style={defaultStyle.spanLabel} key={"coloumn" + index}>
              {""}
            </span>
          );
        }
      }

      case "deleteButton": {
        if (Columns.value && Columns.value !== "") {
          return (
            <div
              style={{ ...defaultStyle.buttonDiv }}
              onClick={() => this.props.onClickDel(Columns.value)}
            >
              <Icon
                icon="delete"
                style={{
                  fontSize: "20px"
                }}
                title="delete"
              />
            </div>
          );
        } else {
          return (
            <span style={defaultStyle.spanLabel} key={"coloumn" + index}>
              {""}
            </span>
          );
        }
      }
      case "switchButton": {
        return this.createSwitch(Columns.values[0], Columns.values[1], index);
      }
      case "text": {
        if (Columns.isNote === true) {
          return Columns.values.map((values, index) =>
            this.isNote(values, index)
          );
        } else {
          return Columns.values.map((values, index) => (
            <span style={defaultStyle.spanLabel} key={"coloumn" + index}>
              {values.value}
            </span>
          ));
        }
      }
      case "headerBold": {
        return Columns.values.map((values, index) => (
          <span style={defaultStyle.headerBoldLabel} key={"coloumn" + index}>
            {values.value}
          </span>
        ));
      }
      default:
        return null;
    }
  }

  createDescription(Columns) {
    return Columns.values.map((values, index) => (
      <span style={defaultStyle.spanLabel} key={"coloumn" + index}>
        {values.value}
      </span>
    ));
  }

  isToDeleteLastRow(columns, index, totalCountOfColumn) {
    if (index < totalCountOfColumn - 1) {
      return (
        <div
          className="div-table-col"
          key={"coloumn" + index}
          style={{ ...defaultStyle.ColStyle, ...columns.style }}
        >
          {this.isButtonFlag(columns, index)}
        </div>
      );
    }
  }

  renderFirstRow(row, styleClass) {
    return (
      <div
        className={"div-table-row-header " + styleClass}
        style={{ ...defaultStyle.tableHeaderRow, ...row.style }}
      >
        {row.columns.map((Columns, index) => (
          <div
            className="div-table-col"
            key={"coloumn" + index}
            style={{ ...defaultStyle.ColStyle, ...Columns.style }}
          >
            {this.isButtonFlag(Columns, index)}
          </div>
        ))}
      </div>
    );
  }
  onChangeFieldValues = (id, updatedValue, mainIndexRow) => {
    updatedValue = updatedValue.replace(/[^-?0-9]/g, "");

    this.props.updateTempRow(mainIndexRow, id, updatedValue);
  };

  editForm(Columns, fieldindex, indexRow) {
    // console.log("Columns edit form:-", Columns);
    switch (Columns.type) {
      case "text": {
        if (Columns.isNote === true) {
          return Columns.values.map((values, index) => (
            <div>
              {index === 0 ? (
                <TextField
                  classNames="pr-txtfield-lg"
                  id={fieldindex}
                  data={values.value}
                  onChange={this.onChangeFieldValues}
                  mainIndex={indexRow}
                  validateType="text"
                  maxLength={3}
                />
              ) : (
                <div
                  className="note-button"
                  onClick={() =>
                    this.props.onClickNoeEdit(indexRow, fieldindex)
                  }
                >
                  Note
                </div>
              )}
            </div>
          ));
        } else if (fieldindex === 0 || fieldindex === 1) {
          return Columns.values.map((values, index) => (
            <span style={defaultStyle.spanLabel} key={"coloumn" + index}>
              {""}
            </span>
          ));
        } else {
          return Columns.values.map((values, index) => (
            <span style={defaultStyle.spanLabel} key={"coloumn" + index}>
              {values.value}
            </span>
          ));
        }
      }
      case "editButton":
        if (Columns.value && Columns.value !== "") {
          return (
            <div
              style={{ ...defaultStyle.buttonDiv }}
              onClick={() => this.props.onClickClear(indexRow)}
            >
              <Icon
                icon="clear"
                style={{
                  fontSize: "22px"
                }}
                title="clear"
              />
            </div>
          );
        } else {
          return null;
        }

      case "saveButton":
        if (Columns.value && Columns.value !== "") {
          return (
            <div
              style={{ ...defaultStyle.buttonDiv }}
              onClick={() => this.props.onClickUpdate(indexRow)}
            >
              <Icon
                icon="save"
                style={{
                  fontSize: "22px"
                }}
                title="save"
              />
            </div>
          );
        } else return null;

      default:
        return null;
    }
  }

  renderRestRows(row, indexRow) {
    let selectIndexArray = this.props.selectedListArray;
    const { tempRowData } = this.props;

    let retObj;
    var cls = this.getOddEvenRow(indexRow);
    retObj = (
      <div>
        <div
          className={"div-table-row " + cls}
          style={{ ...defaultStyle.tableRow }}
        >
          {row.columns.map((Columns, index) => (
            <div
              className="div-table-col"
              key={"coloumn" + index}
              style={{ ...defaultStyle.ColStyle, ...Columns.style }}
            >
              {this.isButtonFlag(Columns, index, indexRow)}
            </div>
          ))}
        </div>
        {selectIndexArray.includes(indexRow) ? (
          <div
            className={"div-table-row leave-mennagement-selected-row"}
            style={{ ...defaultStyle.tableRow }}
          >
            {tempRowData[indexRow].columns.map((Columns, index) => (
              <div
                className="div-table-col"
                key={"coloumn" + index}
                style={{ ...defaultStyle.ColStyle, ...Columns.style }}
              >
                {this.editForm(Columns, index, indexRow)}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );

    return <div>{retObj}</div>;
  }

  render() {
    const { rows, style, paginationData, exportState } = this.props;
    let exportExcelData = exportState.get(EXPORT_DATA, "");
    let hideExcel = "false";

    if (this.props.hideExcel) {
      hideExcel = this.props.hideExcel;
    }

    return (
      <div style={{ width: "100%" }}>
        {hideExcel === "false" ? (
          <div className="row" style={{ textAlign: "right" }}>
            <ExcelFile
              element={
                <button className="report-submitButton">Export To Excel</button>
              }
              filename="Export To Excel"
              fileExtension="xlsx"
            >
              <ExcelSheet dataSet={exportExcelData} name="Export Data" />
            </ExcelFile>
          </div>
        ) : null}
        <div className="div-table" style={{ ...defaultStyle.table, style }}>
          <div>{this.renderFirstRow(rows[0], this.props.headerClassName)}</div>
          <div className="">
            {rows.slice(1).map((row, index) => this.renderRestRows(row, index))}
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

export function mapStateToProps(state, ownProps) {
  return {
    exportState: state.component.get(REPORT_SUBMENU_ID, Map())
  };
}

export default connect(
  mapStateToProps,
  {
    clearComponentState,
    updateComponentState
  }
)(LeaveManagementTable);
