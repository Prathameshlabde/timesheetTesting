import React, { Component } from "react";
import { connect } from "react-redux";
import { Map } from "immutable";
import Icon from "../Icon";
import colors from "../../common/colors";
import Switch from "../Switch";
import PaginationWidget from "../PaginationWidget";
import DropdownList from "../DropdownList";
import TextArea from "../TextArea";
import "./table-view.css";
import ReactExport from "react-data-export";
import {
  REPORT_SUBMENU_ID,
  EXPORT_DATA,
} from "../../../constants/app.constants";
import {
  clearComponentState,
  updateComponentState,
} from "../../../actions/component.actions.js";
import Colors from "../../common/colors";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const defaultStyle = {
  styleTitle: {
    display: "flex",
    textTransform: "capitalize",
    fontWeight: "bold",
  },
  styleSubtitle: {
    display: "flex",
    fontSize: "18px",
  },
  styleBody: {
    display: "flex",
    fontSize: "12px",
  },
  table: {},
  tableHeaderRow: {},
  tableRow: {
    display: "flex",
    padding: "0px 2px",
    borderBottom: `1px solid #E6EBED`,
  },
  tableRowDescription: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: colors.whiteColor,
    borderBottom: `1px solid #E6EBED`,
  },
  ColStyle: {
    display: "table-column",
    width: "7.5%",
    padding: "5px",
  },
  ColStyleDescription: {
    display: "table-column",
    width: "100%",
    padding: "6px 10px 6px 10px",
    // height: "50px",
    backgroundColor: Colors.headerSubColor,
    borderRadius: "3%",
  },
  buttonDiv: {
    cursor: "pointer",
  },
  spanLabel: {
    display: "block",
  },
  spanLabelNote: {
    display: "block",
    color: colors.blueColor,
    textDecoration: "underline",
    cursor: "pointer",
  },
  headerBoldLabel: {
    fontWeight: "bold",
  },
  descriptionBotom: {
    // fontWeight: "bold",
  },
};

class TableView extends Component {
  dataFormater(value, index) {
    if (index === 0) {
      return <span style={defaultStyle.styleTitle}> {value.value} </span>;
    } else if (index === 1) {
      return <span style={defaultStyle.styleSubtitle}> {value.value} </span>;
    } else if (index === 2) {
      return <span style={defaultStyle.styleBody}> {value.value} </span>;
    } else {
      return <span style={defaultStyle.styleBody}> {value.value} </span>;
    }
  }

  getOddEvenRow(index) {
    if (index % 2 === 0) {
      return "pr-even";
    } else {
      return "pr-odd";
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
      );
    }
  };

  isButtonFlag(Columns, index) {
    switch (Columns.type) {
      case "editButton": {
        return (
          <div
            style={{ ...defaultStyle.buttonDiv }}
            onClick={() => this.props.onclickEdt(Columns.value)}
          >
            <Icon
              icon="edit"
              style={{
                fontSize: "20px",
                color: "#192028",
              }}
            />
          </div>
        );
      }

      case "deleteButton": {
        return (
          <div
            style={{ ...defaultStyle.buttonDiv }}
            onClick={() => this.props.onClickDel(Columns.value)}
          >
            <Icon
              icon="delete"
              style={{
                fontSize: "20px",
                color: "#192028",
              }}
            />
          </div>
        );
      }
      case "switchButton": {
        return this.createSwitch(Columns.values[0], Columns.values[1], index);
      }
      case "text": {
        if (Columns.isDescription === true) {
          return Columns.values.map((values, index) =>
            this.dataFormater(values, index)
          );
        } else {
          return Columns.values.map((values, index) => (
            // console.log("index inside:-", index)
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
      case "dropDown": {
        return (
          <DropdownList
            id="pro_id"
            dropDownData={this.props.dropdownData}
            onChange={this.onChangeFieldValues}
            selectedID={this.props.selectedDropdown}
            mainIndex={""}
            fieldIndex={""}
          />
        );
      }
      case "textArea": {
        return (
          <TextArea
            id="description"
            data="" //{this.state.description}
            onChange={this.onChangeFieldValues}
            mainIndex={""}
            fieldIndex={""}
          />
        );
      }

      case "updateDelete": {
        return (
          <div>
            <div
              style={{ ...defaultStyle.buttonDiv }}
              onClick={() => this.props.onClickUpdate(Columns.value)}
            >
              <Icon
                icon="save"
                style={{
                  fontSize: "22px",
                  color: "#192028",
                }}
                title="save"
              />
            </div>
            <div
              style={{ ...defaultStyle.buttonDiv }}
              onClick={() => this.props.onClickDel(Columns.value)}
            >
              <Icon
                icon="delete"
                style={{
                  fontSize: "20px",
                  color: "#192028",
                }}
                title="delete"
              />
            </div>
          </div>
        );
      }
      default:
        return null;
    }
  }

  createDescription(Columns, index) {
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

  renderRows(row, rowIndex) {
    let firstRow;
    let retObj;
    if (rowIndex === 0) {
      firstRow = (
        <div
          className="div-table-row-header"
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
    } else {
      if (row.isDescriptionDetails === true) {
        let totalCountOfColumn = row.columns.length;
        retObj = (
          <div
            className="div-table-row-in-description"
            style={{ ...defaultStyle.tableRowDescription }}
          >
            <div style={{ display: "flex" }}>
              {row.columns.map((Columns, index) =>
                this.isToDeleteLastRow(Columns, index, totalCountOfColumn)
              )}
            </div>
            <div style={{ display: "flex" }}>
              <div
                className="div-table-col"
                key={"coloumn" + rowIndex}
                style={{
                  ...defaultStyle.ColStyleDescription,
                }}
              >
                <span style={defaultStyle.descriptionBotom}>
                  {row.columns[totalCountOfColumn - 1].values[0].value}
                </span>
              </div>
            </div>
          </div>
        );
      } else {
        var cls = this.getOddEvenRow(rowIndex);
        retObj = (
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
                {this.isButtonFlag(Columns, index)}
              </div>
            ))}
          </div>
        );
      }
    }

    return (
      <div>
        {firstRow}
        {retObj}
      </div>
    );
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
          {rows.map((row, index) => this.renderRows(row, index))}
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
    exportState: state.component.get(REPORT_SUBMENU_ID, Map()),
  };
}

export default connect(
  mapStateToProps,
  {
    clearComponentState,
    updateComponentState,
  }
)(TableView);
