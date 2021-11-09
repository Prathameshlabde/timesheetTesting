import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Map } from "immutable";
import {
  clearComponentState,
  updateComponentState,
  deleteComponentState,
} from "../../../actions/component.actions.js";

import {
  REPORT_SUBMENU,
  REPORT_SUBMENU_ID,
  ERROR_STR,
} from "../../../constants/app.constants";

import { getComponentPropsUserEntries } from "./UserEntries/userEntries.utils";
import { getComponentPropsCustomReport } from "./CustomReport/customReport.utils";
import { getComponentPropsReviewEntries } from "./ReviewEntries/reviewEntries.utils";
import { getComponentPropsRefReport } from "./ReferenceNumberReport/referenceNoReport.utils";
import { getComponentPropsTaskReport } from "./TaskReport/taskReport.utils";
import { getComponentPropsManReport } from "./ManagementReport/managementReport.utils";
import { getComponentPropsSummaryReport } from "./SummaryReport/summaryReport.utils";
import { getComponentPropsDefaulterList } from "./DefaulterList/defaulterList.utils";

import { getDataFromCookie } from "../../utils/CheckLoginDetails";

import Icon from "../../widgets/Icon";

let componentPropsFromUtils;

class RenderReport extends Component {
  static propTypes = {
    id: PropTypes.string,
    componentState: PropTypes.object.isRequired,
    updateComponentState: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      LoggedInUser: getDataFromCookie().role,
      isDateRangeFromSummaryReport: false,
    };
  }

  renderSubDivisions = (subDiv, reportStates, reportProps) => {
    {
      const { reportState } = this.props;
      const reportName = reportState.get(REPORT_SUBMENU, ERROR_STR);

      if (reportName === "UserEntries") {
        componentPropsFromUtils = getComponentPropsUserEntries;
      } else if (reportName === "CustomReport") {
        componentPropsFromUtils = getComponentPropsCustomReport;
      } else if (reportName === "ReviewEntries") {
        componentPropsFromUtils = getComponentPropsReviewEntries;
      } else if (reportName === "ReferenceNumberReport") {
        componentPropsFromUtils = getComponentPropsRefReport;
      } else if (reportName === "TaskReport") {
        componentPropsFromUtils = getComponentPropsTaskReport;
      } else if (reportName === "ManagementReport") {
        componentPropsFromUtils = getComponentPropsManReport;
      } else if (reportName === "SummaryReport") {
        componentPropsFromUtils = getComponentPropsSummaryReport;
      } else if (reportName === "DefaulterList") {
        componentPropsFromUtils = getComponentPropsDefaulterList;
      }

      return subDiv && subDiv.division
        ? subDiv.division.map(
            (item) =>
              item.accessTO.includes(this.state.LoggedInUser) ? (
                item.componentType === "CheckBox" ? (
                  <div className="report-Component-nowrap">
                    <div className="report-componentLabel">{item.label}</div>
                    <div className="report-widget">
                      {this.renderChildrenComponent(
                        item.componentType,
                        componentPropsFromUtils(
                          item.componentType,
                          item.label,
                          reportProps,
                          reportStates
                        )
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="report-Component">
                    {item.label && item.label !== "" ? (
                      <div className="report-componentLabel">
                        {item.label}
                        {item.Note && item.Note !== "" ? (
                          <div className="growContainer">
                            <div className="grow">
                              <Icon
                                icon="info"
                                className="outline"
                                style={{
                                  cursor: "default",
                                  paddingLeft: "1px",
                                  fontSize: "15px",
                                }}
                              />
                              <span>{item.Note}</span>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                    <div className="report-widget">
                      {this.renderChildrenComponent(
                        item.componentType,
                        componentPropsFromUtils(
                          item.componentType,
                          item.label,
                          reportProps,
                          reportStates
                        )
                      )}
                    </div>
                  </div>
                )
              ) : null
          )
        : null;
    }
  };

  //this.renderReportSingleComponent(item, reportStates, reportProps, reportName)

  renderChildrenComponent = (componentType, componentProps) => {
    // console.log("pathththt = ", "../../widgets/" + componentType + ".js");
    // console.log("componentType componentType = " + componentType);
    // console.log("componentProps componentProps = " + componentProps);

    const singleChild = React.createElement(
      require("../../widgets/" + componentType + ".js").default,
      componentProps,
      null
    );
    return singleChild;
  };

  render() {
    const { jsonFile, reportStates, reportProps } = this.props;

    return (
      <div
        style={{ marginBottom: "10px" }}
        className={"pr-container " + reportStates.classNameDiv}
        id="report-form"
      >
        <div className="pr-row">
          <div className="pr-col-3">
            {jsonFile.requiredComponents[0]
              ? this.renderSubDivisions(
                  jsonFile.requiredComponents[0],
                  reportStates,
                  reportProps
                )
              : null}
          </div>
          <div className="pr-col-3">
            {jsonFile.requiredComponents[1]
              ? this.renderSubDivisions(
                  jsonFile.requiredComponents[1],
                  reportStates,
                  reportProps
                )
              : null}
          </div>
          <div className="pr-col-3">
            {jsonFile.requiredComponents[2]
              ? this.renderSubDivisions(
                  jsonFile.requiredComponents[2],
                  reportStates,
                  reportProps
                )
              : null}
          </div>
        </div>
        <div className="pr-row">
          <div className="pr-col-3">
            {jsonFile.requiredComponents[3]
              ? this.renderSubDivisions(
                  jsonFile.requiredComponents[3],
                  reportStates,
                  reportProps
                )
              : null}
          </div>
        </div>
      </div>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const id = ownProps.id;
  return {
    componentState: state.component.get(id, Map()),
    reportState: state.component.get(REPORT_SUBMENU_ID, Map()),
  };
}

export default connect(
  mapStateToProps,
  {
    clearComponentState,
    updateComponentState,
    deleteComponentState,
  }
)(RenderReport);
