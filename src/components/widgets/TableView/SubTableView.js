import React, { Component } from "react";
import Icon from "../Icon";
// import colors from "../../common/colors";
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
import { ReportStyles } from "./tableView.utils";
import Loader from "../Loader";
class SubTableView extends Component {
  state = {
    isShowLoader: false
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.isFooterBold === false) {
      this.setState({ isShowLoader: this.props.isShowLoader });
    }
  }

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
    columns.isSerialNo && columns.isSerialNo === true
      ? (retObj = this.renderSpanLabel(value, index, columns))
      : columns.className && columns.className === PR_NUM_TEXT
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
      case "editButton": {
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
      }
      case "deleteButton": {
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

  renderSubTotalRow(row) {
    return (
      <div
        className={"div-table-row  pr-even"}
        style={{ ...ReportStyles.tableRow }}
      >
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
    let firstRow, middleRows, lastRow;

    if (index === 0) {
      firstRow = this.renderHeaderAndFooterRowBold(row, index);
    } else if (index === lastIndex) {
      this.props.isFooterBold === false
        ? (lastRow = this.renderNormalRows(row, index))
        : (lastRow = this.renderHeaderAndFooterRowBold(row, index));
    } else {
      if (this.props.subTotalindexes && this.props.subTotalindexes.indexes) {
        let indexArr = this.props.subTotalindexes.indexes[0];
        if (indexArr.includes(index)) {
          middleRows = this.renderSubTotalRow(row);
        } else {
          middleRows = this.renderNormalRows(row, index);
        }
      } else {
        middleRows = this.renderNormalRows(row, index);
      }
    }

    return (
      <div>
        {firstRow}
        {middleRows}
        {lastRow}
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
        {this.props.isShowLoader === true ? (
          <Loader style={{ position: "relative" }} />
        ) : (
          <div className="pr-collapse">
            {rows.map((row, index) =>
              this.renderAllRows(row, index, lastIndex)
            )}
          </div>
        )}
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
)(SubTableView);
