import React, { Component } from "react";
import { browserHistory } from "react-router";

import Icon from "../Icon";
import colors from "../../common/colors";
import Switch from "../Switch";
import PaginationWidget from "../PaginationWidget";
import DropdownList from "../DropdownList";
import TextArea from "../TextArea";
import CheckBox from "../CheckBox";


// "isDescriptionDetails": true,
import "./table-view.css";
import { BUILD_PATH } from "../../../constants/app.constants";
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

class TableView extends Component {
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
      ); //this.props.onChngeSwitch()
    }
  };

  getCheckbox = (checkBoxId) => {
    return <CheckBox 
              id={checkBoxId} 
              isCheck={this.props.checkedItems.includes(checkBoxId)} 
              onClick={this.props.onClickCheckBox} 
            />;
  };

  getTextData(value) {
    if (value === "") {
      return <strong>&nbsp;</strong>;
    } else {
      return value;
    }
  }

  isButtonFlag(Columns, index, rowIndex) {
    let rowAndFieldIndex = {
      rowIndex: rowIndex,
      fieldIndex: index,
    };

    let labelStyle = {};
    if (this.props.isFromStats === true) labelStyle = { textAlign: "left" };

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

      case "duplicateButton": {
        return (
          <div
            style={{ ...defaultStyle.buttonDiv }}
            onClick={() => this.props.onClickDup(Columns.value)}
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
      }
      case "viewButton": {
        return (
          <div
            style={{ ...defaultStyle.buttonDiv }}
            onClick={() => this.props.onclickView(Columns.value)}
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

      case "checkbox":{
        return this.getCheckbox(Columns.value);
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
          let dataTitle = "";
          if (Columns.dataTitle) {
            dataTitle = Columns.dataTitle;
          }
          return Columns.values.map((values, index) => (
            <span
              data-title={dataTitle}
              style={{ ...defaultStyle.spanLabel, ...labelStyle }}
              key={"coloumn" + index}
            >
              {this.getTextData(values.value)}
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
            data={Columns.values[0].value} //{this.state.description}
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
              onClick={() => this.props.onSaveClick(Columns.value, rowIndex)}
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
              onClick={() => this.props.onDeleteClick(Columns.value, rowIndex)}
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

  isToDeleteLastRow(columns, index, totalCountOfColumn, rowIndex) {
    if (index < totalCountOfColumn - 1) {
      return (
        <div
          className="div-table-col"
          key={"coloumn" + index}
          style={{ ...defaultStyle.ColStyle, ...columns.style }}
        >
          {this.isButtonFlag(columns, index, rowIndex)}
        </div>
      );
    }
  }

  arrowToggle(fieldName) {
    const { sortFlag, fieldNameToSort } = this.props;
    if (fieldName === fieldNameToSort) {
      // console.log("fieldNameToSort :-", fieldNameToSort);

      if (sortFlag === false) {
        return <Icon icon="arrow_drop_down" className="filter-arrow-table" />;
      } else {
        return <Icon icon="arrow_drop_up" className="filter-arrow-table" />;
      }
    } else {
      return <Icon icon="arrow_drop_down" className="filter-arrow-table" />;
    }
  }

  isSorting(Columns, index, rowIndex) {
    if (Columns.sortBy) {
      return (
        <div
          className="div-table-col"
          key={"coloumn" + index}
          style={{ ...defaultStyle.ColStyle, ...Columns.style }}
          onClick={() => this.props.sortData(Columns.sortBy)}
        >
          {this.isButtonFlag(Columns, index, rowIndex)}
          {this.arrowToggle(Columns.sortBy)}
        </div>
      );
    } else {
      return (
        <div
          className="div-table-col"
          key={"coloumn" + index}
          style={{ ...defaultStyle.ColStyle, ...Columns.style }}
        >
          {this.isButtonFlag(Columns, index, rowIndex)}
        </div>
      );
    }
  }

  goToLeaveApplications() {
    if (this.props.isFromStats === true) {
      browserHistory.push("/" + BUILD_PATH + "leave-applications");
    }
  }

  renderRows(row, rowIndex) {
    let retObj;
    if (rowIndex === 0) return null;
    if (row.isDescriptionDetails === true) {
      let totalCountOfColumn = row.columns.length;
      retObj = (
        <div
          className="div-table-row-in-description"
          style={{ ...defaultStyle.tableRowDescription }}
        >
          <div style={{ display: "flex" }}>
            {row.columns.map((Columns, index) =>
              this.isToDeleteLastRow(
                Columns,
                index,
                totalCountOfColumn,
                rowIndex
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

      let cls = this.getOddEvenRow(rowIndex);
      let rowPointer = {};
      if (this.props.isFromStats === true) rowPointer = { cursor: "pointer" };
      retObj = (
        <div
          onClick={() => this.goToLeaveApplications()}
          className={"div-table-row " + cls + tempClassName}
          style={{ ...defaultStyle.tableRow, ...rowPointer }}
        >
          {row.columns.map((Columns, index) => (
            <div
              className="div-table-col"
              key={"coloumn" + index}
              style={{ ...defaultStyle.ColStyle, ...Columns.style }}
            >
              {this.isButtonFlag(Columns, index, rowIndex)}
            </div>
          ))}
        </div>
      );
    }

    return <div key={"rows" + rowIndex}>{retObj}</div>;
  }

  getHeaderRow(row, rowIndex) {
    let labelStyle = {};
    if (this.props.isFromStats === true) labelStyle = { textAlign: "left" };
    return (
      <div key={"rows" + rowIndex}>
        <div
          className="div-table-row-header"
          style={{
            ...defaultStyle.tableHeaderRow,
            ...row.style,
            ...labelStyle,
          }}
        >
          {row.columns.map((Columns, index) =>
            this.isSorting(Columns, index, rowIndex)
          )}
        </div>
      </div>
    );
  }

  render() {
    const { rows, style, paginationData, totalRowCount } = this.props;

    return (
      <div style={{ width: "100%" }}>
        {totalRowCount && totalRowCount > 0 ? (
          <div style={{ display: "block", textAlign: "right" }}>
            {"Total - " + totalRowCount}
          </div>
        ) : null}
        <div className="div-table" style={{ ...defaultStyle.table, style }}>
          {this.getHeaderRow(rows[0], 0)}
          <div
            style={
              this.props.tableOverFlowStyle ? this.props.tableOverFlowStyle : {}
            }
          >
            {rows.map((row, index) => this.renderRows(row, index))}
          </div>

          {/* {rows.map((row, index) => this.renderRows(row, index))} */}
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
export default TableView;
