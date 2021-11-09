import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { Map } from "immutable";
import {
  clearComponentState,
  updateComponentState,
  deleteComponentState,
} from "../../../../actions/component.actions.js";
import "../table-view.css";
import {
  DASHBOARD_TEAM_PROJECTS_DIV_ID,
  DASHBOARD_TEAM_EMPLOYEES_DIV_ID,
  DASHBOARD_CONTEXT_ID,
  DASHBOARD_NAVIGATE_ID,
  REPORT_OBJECT,
  BUILD_PATH,
} from "../../../../constants/app.constants";
import { getDataFromCookie } from "../../../utils/CheckLoginDetails";
// import { isEmpty } from "../../../utils/common.utils.js";
import {
  getGroupValuesArr,
  dashboardRowStyles,
  getDataObjectForDashboardRow,
} from "../../../pageContent/Dashboard/Dashboard.utils.js";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

class DashboardRows extends Component {
  getTextData(value) {
    if (value === "") {
      return <strong>&nbsp;</strong>;
    } else {
      return value;
    }
  }

  renderColumns(singleColumn, index, rowIndex) {
    switch (singleColumn.type) {
      case "text": {
        let dataTitle = "";
        if (singleColumn.dataTitle) {
          dataTitle = singleColumn.dataTitle;
        }

        return singleColumn.values.map((values, index) => (
          <span
            data-title={dataTitle}
            style={dashboardRowStyles.spanLabel}
            key={"coloumn" + index}
          >
            {this.getTextData(values.value)}
          </span>
        ));
      }

      default:
        return null;
    }
  }

  goToReport = (e, data) => {
    // console.log("e, data = ", e, data);
    const { fdate, tdate, rows, ogData, rowIndex } = this.props;
    const dataObject = getDataObjectForDashboardRow({
      fdate,
      tdate,
      rows,
      ogData,
      rowIndex,
    });

    // console.log("dataObject = ", dataObject);
    // console.log("updating component state ");

    const { updateComponentState } = this.props;
    updateComponentState(DASHBOARD_NAVIGATE_ID, REPORT_OBJECT, dataObject);
  };

  getSingleColumn(singleColumn, index, rowIndex) {
    return (
      <div
        className="div-table-col"
        key={"coloumn" + index}
        style={{ ...dashboardRowStyles.ColStyle, ...singleColumn.style }}
      >
        {this.renderColumns(singleColumn, index, rowIndex)}
      </div>
    );
  }

  getAllColumns(rows, rowIndex) {
    return rows.map((singleColumn, index) =>
      this.getSingleColumn(singleColumn, index, rowIndex)
    );
  }

  getContextMenu(contextId) {
    const role = getDataFromCookie().role;
    const menuArr = getGroupValuesArr(role);
    let retObject;

    // console.log("menuArr = ", menuArr);

    retObject = menuArr.map((element, index) => (
      <Link
        id={element.reportname}
        key={element.reportname}
        to={"/" + BUILD_PATH + element.linkTo}
        style={{ textDecoration: "none", color: "white" }}
      >
        <MenuItem
          onClick={this.goToReport}
          data={{ item: element.reportname }}
          className="contextMenuItem"
        >
          {element.reportname}
        </MenuItem>
      </Link>
    ));

    return (
      <ContextMenu className="contextMenu" id={contextId}>
        {retObject}
      </ContextMenu>
    );
  }

  render() {
    const { rows, rowIndex, cls } = this.props;
    let currentStatsDivID = DASHBOARD_TEAM_PROJECTS_DIV_ID;
    if (this.props.isEmployeeOrProjectStats === "emp")
      currentStatsDivID = DASHBOARD_TEAM_EMPLOYEES_DIV_ID;

    const contextId = DASHBOARD_CONTEXT_ID + currentStatsDivID + "_" + rowIndex;

    return (
      <div
        key={"Dash_row_key_inside_" + currentStatsDivID + "_" + rowIndex}
        id={"Dash_row_id_inside_" + currentStatsDivID + "_" + rowIndex}
      >
        <ContextMenuTrigger id={contextId} holdToDisplay={0}>
          <div
            className={"div-table-row " + cls}
            style={{ ...dashboardRowStyles.tableRow, cursor: "pointer" }}
          >
            {this.getAllColumns(rows, rowIndex)}
          </div>
        </ContextMenuTrigger>

        {this.getContextMenu(contextId)}
      </div>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const { component } = state;
  const id = ownProps.id;
  return {
    componentState: component.get(id, Map()),
  };
}

export default connect(
  mapStateToProps,
  {
    clearComponentState,
    updateComponentState,
    deleteComponentState,
  }
)(DashboardRows);
