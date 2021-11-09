import React, { Component } from "react";
import { connect } from "react-redux";
import { Map } from "immutable";
import {
  clearComponentState,
  updateComponentState
} from "../../../actions/component.actions.js";
import {
  APP_ID,
  REPORT_SUBMENU_ID,
  PR_NUM_TEXT
} from "../../../constants/app.constants";
import "./table-view.css";
import { ReportStyles, setNewTableDataDuplicate } from "./tableView.utils";
import RenderRows from "./RenderRows";

class ReportTableViewDefaulterList extends Component {
  state = {
    newEmployeeData: []
  };

  dataFormater(value, index) {
    if (index === 0) {
      return <span style={ReportStyles.styleTitle}> {value.value} </span>;
    } else if (index === 1) {
      return <span style={ReportStyles.styleSubtitle}> {value.value} </span>;
    } else if (index === 2) {
      return <span style={ReportStyles.styleBody}> {value.value} </span>;
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

  renderSpanLabelsOthers(value, index, columns) {
    let retObj;
    columns.className && columns.className === PR_NUM_TEXT
      ? (retObj = this.renderSpanLabelNumber(value, index, columns.className))
      : (retObj = this.renderSpanLabel(value, index, columns));

    return retObj;
  }

  renderSpanLabel(value, index, columns) {
    let retobj;
    columns.isLink && columns.isLink === true
      ? (retobj = (
          <a
            href=""
            style={ReportStyles.spanLabel}
            key={"coloumn" + index}
            onClick={e => {
              e.preventDefault();
              this.props.onclickEdt(columns.value);
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

  isToDeleteLastRow(columns, index, totalCountOfColumn) {
    if (index < totalCountOfColumn - 1) {
      return (
        <div
          className="div-table-col"
          key={"coloumn" + index}
          style={{ ...ReportStyles.ColStyle, ...columns.style }}
        >
          {this.renderRowColumns(columns, index)}
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
                : this.renderSpanLabelsOthers(values.value, index, Columns)
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

  renderRowColumns(Columns, index) {
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
                : this.renderSpanLabelsOthers(values.value, index, Columns)
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
      <div
        className="div-table-row-in-description div-table-row-footer"
        // style={{ ...ReportStyles.tableRowDescription }}
      >
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

  componentWillReceiveProps(nextProps) {
    if (this.props.dataObject.sort_by === "employee") {
      let newEmployeeData = setNewTableDataDuplicate(
        this.props.employeeData,
        this.props.dataObject.sort_by
      );
      this.setState({
        newEmployeeData: newEmployeeData
      });
    }
  }

  renderNormalRows(row, index) {
    let totalCountOfColumn = row.columns.length;
    return row.isDescriptionDetails === true ? (
      <div
        className="div-table-row-in-description"
        style={{ ...ReportStyles.tableRowDescription }}
      >
        <div style={{ display: "flex" }}>
          {row.columns.map((Columns, index) =>
            this.isToDeleteLastRow(Columns, index, totalCountOfColumn)
          )}
        </div>

        <div style={{ display: "flex" }}>
          <div style={{ width: "8%" }} />
          <div
            className="div-table-col"
            key={"coloumn" + index}
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
            {this.renderRowColumns(Columns, index)}
          </div>
        ))}
      </div>
    );
  }

  renderAllRows(row, index, lastIndex) {
    let firstRow, otherRows;

    if (index === 0) {
      firstRow = this.renderHeaderAndFooterRowBold(row, index);
    } else {
      otherRows = (
        <RenderRows
          row={row}
          index={index}
          employeeData={this.props.employeeData}
          dataObject={this.props.dataObject}
          defaulterDateData={this.props.defaulterDateData}
        />
      );
    }

    return (
      <div>
        {firstRow}
        {otherRows}
      </div>
    );
  }

  render() {
    const { rows } = this.props;
    let lastIndex;
    for (var i = 0; i < rows.length; i++) {
      lastIndex = i;
    }

    return (
      <div className="div-table" style={{ ...ReportStyles.table }}>
        {this.props.dataObject.sort_by === "date"
          ? rows.map((row, index) => this.renderAllRows(row, index, lastIndex))
          : this.state.newEmployeeData && this.state.newEmployeeData.rows
            ? this.state.newEmployeeData.rows.map((row, index) =>
                this.renderAllRows(row, index, lastIndex)
              )
            : null}
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
)(ReportTableViewDefaulterList);
