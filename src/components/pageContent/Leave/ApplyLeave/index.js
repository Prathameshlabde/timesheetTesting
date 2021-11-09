import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Map } from "immutable";

import moment from "moment";
import {
  clearComponentState,
  updateComponentState,
} from "../../../../actions/component.actions.js";

import { requestData } from "../../../../actions/data.actions";

import "../leave.css";
import {
  TITLE_SUBTITLE_ID,
  APP_TITLE_SUBTITLE,
  CC_EMAIL_ID,
} from "../../../../constants/app.constants.js";

import { LEAVE_DIALOG_MSG } from "../../../../constants/dialog.constants";

import { fetchBalanceLeavesFromUtils, applyLeave } from "./applyLeave.utils";
import { readCookie, isEmpty } from "../../../utils/common.utils";

import TextField from "../../../widgets/TextField";
import DatePicker from "../../../widgets/DatePicker";
import Button from "../../../widgets/Button";
import TextArea from "../../../widgets/TextArea";
import SpanLabel from "../../../widgets/SpanLabel";
import Snackbar from "../../../widgets/Snackbar";
import Colors from "../../../common/colors/index.js";

const spanLabel = {
  id: "lbl",
  maxFont: 14,
  minFont: 5.5,
  className: "span-label",
};
const textAreaStyle = {
  width: "100%",
  boxShadow: `rgb(190, 190, 190) 0px 3px 10px -4px`,
  backgroundColor: "rgb(255, 255, 255)",
  border: `1px solid #E6EBED`,
  resize: "none",
  borderRadius: "3px",
  fontSize: "1em",
};

const textArea = {
  data: "",
  style: textAreaStyle,
  rows: "8",
  cols: "50",
};
class Leave extends Component {
  static propTypes = {
    id: PropTypes.string,
    componentState: PropTypes.object.isRequired,
    updateComponentState: PropTypes.func.isRequired,
  };

  state = {
    empId: "",
    current_year: moment().format("YYYY"),
    balanceLeave: "0",
    to: "",
    cc: CC_EMAIL_ID,
    start_date: "",
    end_date: "",
    contactNumber: "",
    description: "",
    validationMsg: "",
    userName: "",
    snackIsOpen: false,
    snackMessage: "",
  };

  componentWillMount() {
    const { updateComponentState, requestData, id } = this.props;

    if (
      readCookie("username") &&
      readCookie("empId") &&
      readCookie("email_id")
    ) {
      let userName = readCookie("username").replace(/%20/g, " ");
      let empIDfromCookie = readCookie("empId");

      if (userName && empIDfromCookie) {
        this.setState({
          userName: userName,
          empId: empIDfromCookie,
          from: readCookie("email_id"),
        });
      }
    }

    let titleSub = {
      title: "Leave",
      subtitle: "Apply Leaves",
    };
    updateComponentState(TITLE_SUBTITLE_ID, APP_TITLE_SUBTITLE, titleSub);

    fetchBalanceLeavesFromUtils(
      { id, requestData, updateComponentState },
      this.state.current_year
    );
  }

  componentWillReceiveProps(nextProps) {
    const { balanceLeavesData } = nextProps;

    if (balanceLeavesData !== this.props.balanceLeavesData) {
      if (
        balanceLeavesData &&
        balanceLeavesData.apiData &&
        balanceLeavesData.apiData !== true &&
        !isEmpty(balanceLeavesData.apiData.rows)
      ) {
        // console.log(
        //   "balanceLeavesData.apiData :-",
        //   balanceLeavesData.apiData.rows[17][1]
        // );
        this.setState({
          balanceLeave: balanceLeavesData.apiData.rows[17][1],
        });
      }
    }
  }

  capitalize(s) {
    return s && s[0].toUpperCase() + s.slice(1);
  }

  onChangeFieldValues = (id, updatedValue, updatedValue1, updatedValue2) => {
    this.setState({
      [id]: updatedValue,
    });
  };

  checkEmail(email) {
    let result = email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
    if (result === null) {
      return false;
    } else {
      return true;
    }
  }

  submitNewEntry = () => {
    const {
      to,
      cc,
      start_date,
      end_date,
      contactNumber,
      description,
      userName,
      balanceLeave,
      from,
      empId,
    } = this.state;

    const { requestData, updateComponentState } = this.props;

    let toFlag = true;
    let ccFlag = true;

    let toArray = to.trim().split(";");
    let ccArray = cc.trim().split(";");

    for (let i = 0; i < toArray.length; i++) {
      let result = this.checkEmail(toArray[i]);
      if (result === false) {
        toFlag = false;
      }
    }

    for (let i = 0; i < ccArray.length; i++) {
      let result = this.checkEmail(ccArray[i]);
      if (result === false) {
        ccFlag = false;
      }
    }
    if (to.trim() === "") {
      this.setState({
        validationMsg: "Please enter 'To' email address(s).",
      });
    } else if (toFlag === false) {
      this.setState({
        validationMsg: "Please enter 'To' email address(s) properly.",
      });
    } else if (ccFlag === false && cc.trim() !== "") {
      this.setState({
        validationMsg: "Please enter 'cc' email address(s) properly.",
      });
    } else if (start_date === "") {
      this.setState({
        validationMsg: "Please select Start date.",
      });
    } else if (end_date === "") {
      this.setState({
        validationMsg: "Please select End date.",
      });
    } else if (start_date > end_date) {
      this.setState({
        validationMsg: "Please select End date properly.",
      });
    } else {
      let finalCc = cc + ";" + to + ";" + from;

      let payload = {
        to,
        cc: finalCc,
        subject: "Leave Application - " + this.state.userName,
        start_date: start_date.format("YYYY-MM-DD"),
        end_date: end_date.format("YYYY-MM-DD"),
        description,
        contactNumber,
        userName,
        balanceLeave,
        from,
        empId,
      };

      this.setState({
        validationMsg: "",
      });
      applyLeave(payload, { requestData, updateComponentState }).then(
        (response) => {
          if (response.apiData && response.apiData.apiData === true) {
            this.setState({
              snackIsOpen: true,
              snackMessage: LEAVE_DIALOG_MSG.applicationSent,
              to: "",
              cc: CC_EMAIL_ID,
              start_date: moment(),
              end_date: moment(),
              contactNumber: "",
              description: "",
            });
          } else if (
            response.apiData &&
            response.apiData.apiData === "failEmail"
          ) {
            this.setState({
              snackIsOpen: true,
              snackMessage: LEAVE_DIALOG_MSG.applicationfail,
            });
          } else {
            this.setState({
              snackIsOpen: true,
              snackMessage: LEAVE_DIALOG_MSG.applicationfail,
            });
          }
        }
      );
    }
  };

  onSnackClose() {
    this.setState({
      snackIsOpen: false,
      snackMessage: "",
    });
  }

  render() {
    const {
      to,
      cc,
      start_date,
      end_date,
      contactNumber,
      description,
      userName,
    } = this.state;

    return (
      <div className="pr-container" style={{ padding: "10px 3%" }}>
        <Snackbar
          snackIsOpen={this.state.snackIsOpen}
          snackMessage={this.state.snackMessage}
          onSnackClose={() => this.onSnackClose()}
        />

        <div className="pr-row">
          <div className="pr-col-3">
            <div className="pr-top-level-section1-comp">
              <SpanLabel {...spanLabel} data="Subject :" />
              <SpanLabel
                {...spanLabel}
                data={"Leave Application - " + userName}
              />
            </div>
          </div>
          <div className="pr-col-2">
            <div className="pr-top-level-section1-comp">
              <SpanLabel {...spanLabel} data="Employee Name :" />
              <SpanLabel {...spanLabel} data={userName} />
            </div>
          </div>

          <div className="pr-col-3">
            <div className="pr-top-level-section1-comp">
              <div
                className="balance-leave"
                style={{ color: Colors.textColor }}
              >
                {"Balance leave: (" + this.state.balanceLeave + ")"}
              </div>
            </div>
          </div>
        </div>

        <div className="pr-row">
          <div className="pr-col-6">
            <div className="pr-top-level-section1-comp">
              <SpanLabel {...spanLabel} data="To :" isRequired={true} />
              <TextField
                classNames="pr-txtfield-lg"
                id="to"
                data={to}
                onChange={this.onChangeFieldValues}
              />
            </div>
            <div className="pr-top-level-section1-comp">
              <SpanLabel {...spanLabel} data="CC :" />
              <TextField
                classNames="pr-txtfield-lg"
                id="cc"
                data={cc}
                onChange={this.onChangeFieldValues}
              />
            </div>
          </div>
        </div>

        <div className="pr-row">
          <div className="pr-col-3">
            <div
              className="pr-top-level-section1-comp"
              style={{ width: "264px" }}
            >
              <SpanLabel {...spanLabel} data="Start Date :" isRequired={true} />
              <DatePicker
                value={start_date}
                // isOpen={this.state.isDatePickerOpen1}
                id="start_date"
                onChange={this.onChangeFieldValues}
                className="date-picker"
                isEnableFutureDates={true}
              />
            </div>
          </div>
          <div className="pr-col-3">
            <div
              className="pr-top-level-section1-comp"
              style={{ width: "264px" }}
            >
              <SpanLabel {...spanLabel} data="End Date :" isRequired={true} />
              <DatePicker
                value={end_date}
                // isOpen={this.state.isDatePickerOpen1}
                id="end_date"
                onChange={this.onChangeFieldValues}
                className="date-picker"
                isEnableFutureDates={true}
              />
            </div>
          </div>
        </div>

        <div className="pr-row">
          <div className="pr-col-6">
            <div className="pr-top-level-section1-comp">
              <SpanLabel {...spanLabel} data="Contact Number(s) :" />
              <TextField
                classNames="pr-txtfield-lg"
                id="contactNumber"
                data={contactNumber}
                onChange={this.onChangeFieldValues}
              />
            </div>
            <div className="pr-top-level-section1-comp">
              <SpanLabel {...spanLabel} data="Comments :" />
              <TextArea
                id="description"
                {...textArea}
                data={description}
                onChange={this.onChangeFieldValues}
              />
            </div>
            <div className="pr-top-level-section1-comp">
              <Button
                data="Apply Leave"
                onClick={this.submitNewEntry}
                className="button-submitEntry-applyLeave"
              />
            </div>

            {this.state.validationMsg !== "" ? (
              <div className="error-right-div" id="errDiv">
                <span style={{ color: "#FF0000" }}>
                  {this.state.validationMsg}
                </span>
              </div>
            ) : null}
          </div>
          <div className="pr-row">
            <span
              style={{ color: "#FF0000", fontSize: "12px", fontWeight: "600" }}
            >
              Please note: Enter multiple email addresses separated by
              semi-colon (;). Please do not use space in between.
              <br /> e.g. test_1@metasyssoftware.com;test_2@metasyssoftware.com
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const { data } = state;
  return {
    componentState: state.component.get(ownProps.id, Map()),
    balanceLeavesData: data.getIn([ownProps.id, "apiData"], null),
  };
}

export default connect(
  mapStateToProps,
  {
    clearComponentState,
    updateComponentState,
    requestData,
  }
)(Leave);
