import React, { Component } from "react";
import Icon from "../Icon";
import colors from "../../common/colors";
import Switch from "../Switch";
import PaginationWidget from "../PaginationWidget";
import DropdownList from "../DropdownList";
import TextArea from "../TextArea";
import "./table-view.css";
import { isLockedEntry } from "./tableView.utils";
import Colors from "../../common/colors";

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
  headerBoldLabel: {
    fontWeight: "bold",
  },
  descriptionBotom: {
    // fontWeight: "bold",
  },
};

class MyEntriesTableView extends Component {
  onChangeFieldValues = (
    id,
    updatedValue,
    updatedValue1,
    updatedValue2,
    updatedValue3,
    rowAndFieldIndex
  ) => {
    if (id === "dropDown") {
      this.props.updateTempRow(updatedValue, rowAndFieldIndex);
    } else if (id === "textArea") {
      this.props.updateTempRow(updatedValue, updatedValue1);
    }
  };

  dataFormater(value, index) {
    return (
      <span
        key={"spInd" + index}
        style={
          index === 0
            ? defaultStyle.styleTitle
            : index === 1
              ? defaultStyle.styleSubtitle
              : defaultStyle.styleBody
        }
      >
        {value.value}
      </span>
    );
  }

  getOddEvenRow(index) {
    if (index % 2 === 0) {
      return "pr-even";
    } else {
      return "pr-odd";
    }
  }

  createSwitch = (values, idToedit, index) => {
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

  getTextData(value) {
    if (value === "") {
      return <strong>&nbsp;</strong>;
    } else {
      return value;
    }
  }

  isButtonFlag(singleColumn, index, rowIndex, ogData) {
    let rowAndFieldIndex = {
      rowIndex: rowIndex,
      fieldIndex: index,
    };

    switch (singleColumn.type) {
      case "editButton": {
        if (!isLockedEntry(ogData, rowIndex)) {
          return (
            <div
              style={{ ...defaultStyle.buttonDiv }}
              onClick={() => this.props.onclickEdt(singleColumn.value)}
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
        } else {
          return null;
        }
      }

      case "deleteButton": {
        if (!isLockedEntry(ogData, rowIndex)) {
          return (
            <div
              style={{ ...defaultStyle.buttonDiv }}
              onClick={() => this.props.onClickDel(singleColumn.value)}
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
        } else {
          return null;
        }
      }

      case "duplicateButton": {
        if (!isLockedEntry(ogData, rowIndex)) {
          return (
            <div
              style={{ ...defaultStyle.buttonDiv }}
              onClick={() => this.props.onClickDup(singleColumn.value)}
            >
              <Icon
                icon="content_copy" //"control_point_duplicate"
                style={{
                  fontSize: "20px",
                  color: "#192028",
                }}
              />
            </div>
          );
        } else {
          return (
            <div
              title={"Entries are locked"}
              style={{ ...defaultStyle.buttonDiv }}
            >
              <Icon
                title={"Entries are locked"}
                icon="lock"
                style={{
                  fontSize: "20px",
                  color: "#192028",
                }}
              />
            </div>
          );
        }
      }
      case "viewButton": {
        return (
          <div
            style={{ ...defaultStyle.buttonDiv }}
            onClick={() => this.props.onclickView(singleColumn.value)}
          >
            <Icon
              title="View Profile Details"
              icon="account_circle"
              style={{
                fontSize: "20px",
                color: "#192028",
              }}
            />
          </div>
        );
      }

      case "switchButton": {
        return this.createSwitch(
          singleColumn.values[0],
          singleColumn.values[1],
          index
        );
      }
      case "text": {
        if (singleColumn.isDescription === true) {
          return singleColumn.values.map((values, index) =>
            this.dataFormater(values, index)
          );
        } else {
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
      }
      case "headerBold": {
        return singleColumn.values.map((values, index) => (
          <span style={defaultStyle.headerBoldLabel} key={"coloumn" + index}>
            {values.value}
          </span>
        ));
      }
      case "dropDown": {
        return (
          <DropdownList
            id="dropDown"
            dropDownData={this.props.dropdownData}
            onChange={this.onChangeFieldValues}
            selectedID={this.props.selectedDropdown}
            rowAndFieldIndex={rowAndFieldIndex}
          />
        );
      }
      case "textArea": {
        return (
          <TextArea
            id="textArea"
            data={singleColumn.values[0].value} //{this.state.description}
            onChange={this.onChangeFieldValues}
            rowAndFieldIndex={rowAndFieldIndex}
          />
        );
      }

      case "updateDelete": {
        return (
          <div>
            <div
              style={{ ...defaultStyle.buttonDiv }}
              className="pr-div-icon"
              onClick={() =>
                this.props.onSaveClick(singleColumn.value, rowIndex)
              }
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
              className="pr-div-icon"
              onClick={() =>
                this.props.onDeleteClick(singleColumn.value, rowIndex)
              }
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

  createDescription(singleColumn, index) {
    return singleColumn.values.map((values, index) => (
      <span style={defaultStyle.spanLabel} key={"coloumn" + index}>
        {values.value}
      </span>
    ));
  }

  isToDeleteLastRow(columns, index, totalCountOfColumn, rowIndex, ogData) {
    if (index < totalCountOfColumn - 1) {
      return (
        <div
          className="div-table-col"
          key={"coloumn" + index}
          style={{ ...defaultStyle.ColStyle, ...columns.style }}
        >
          {this.isButtonFlag(columns, index, rowIndex, ogData)}
        </div>
      );
    }
  }

  arrowToggle(fieldName) {
    const { sortFlag, fieldNameToSort } = this.props;
    if (fieldName === fieldNameToSort) {
      if (sortFlag === false) {
        return <Icon icon="arrow_drop_down" className="filter-arrow-table" />;
      } else {
        return <Icon icon="arrow_drop_up" className="filter-arrow-table" />;
      }
    } else {
      return <Icon icon="arrow_drop_down" className="filter-arrow-table" />;
    }
  }

  isSorting(singleColumn, index, rowIndex, ogData) {
    if (singleColumn.sortBy) {
      return (
        <div
          className="div-table-col"
          key={"coloumn" + index}
          style={{ ...defaultStyle.ColStyle, ...singleColumn.style }}
          onClick={() => this.props.sortData(singleColumn.sortBy)}
        >
          {this.isButtonFlag(singleColumn, index, rowIndex, ogData)}
          {this.arrowToggle(singleColumn.sortBy)}
        </div>
      );
    } else {
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
  }

  renderRows(row, rowIndex, ogData) {
    let firstRow;
    let retObj;
    if (rowIndex === 0) {
      firstRow = (
        <div
          className="div-table-row-header"
          style={{ ...defaultStyle.tableHeaderRow, ...row.style }}
        >
          {row.columns.map((singleColumn, index) =>
            this.isSorting(singleColumn, index, rowIndex, ogData)
          )}
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
              {row.columns.map((singleColumn, index) =>
                this.isToDeleteLastRow(
                  singleColumn,
                  index,
                  totalCountOfColumn,
                  rowIndex,
                  ogData
                )
              )}
            </div>
            <div style={{ display: "flex" }}>
              <div
                className="div-table-col pr-desc"
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
        const { heighlightRowIndex } = this.props;

        let tempClassName = "";
        if (heighlightRowIndex && heighlightRowIndex === rowIndex) {
          tempClassName = " bold-row ";
        }

        const cls = this.getOddEvenRow(rowIndex);
        retObj = (
          <div
            className={"div-table-row " + cls + tempClassName}
            style={{ ...defaultStyle.tableRow }}
          >
            {row.columns.map((singleColumn, index) => (
              <div
                className="div-table-col"
                key={"coloumn" + index}
                style={{ ...defaultStyle.ColStyle, ...singleColumn.style }}
              >
                {this.isButtonFlag(singleColumn, index, rowIndex, ogData)}
              </div>
            ))}
          </div>
        );
      }
    }

    return (
      <div key={"rows" + rowIndex}>
        {firstRow}
        {retObj}
      </div>
    );
  }

  render() {
    const { rows, style, paginationData, totalRowCount } = this.props;
    let ogData = [];
    if (this.props.ogData) {
      ogData = this.props.ogData;
    }
    return (
      <div style={{ width: "100%" }}>
        {totalRowCount && totalRowCount > 0 ? (
          <div style={{ display: "block", textAlign: "right" }}>
            {"Total - " + totalRowCount}
          </div>
        ) : null}
        <div className="div-table" style={{ ...defaultStyle.table, style }}>
          {rows.map((row, index) => this.renderRows(row, index, ogData))}
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
export default MyEntriesTableView;
