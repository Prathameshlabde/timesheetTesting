import React, { Component } from "react";
import { connect } from "react-redux";
import { Map } from "immutable";
import DatePicker from "react-datepicker";
import moment from "moment";
import PropTypes from "prop-types";

import "react-datepicker/dist/react-datepicker.css";

import {
  clearComponentState,
  updateComponentState
} from "../../actions/component.actions.js";

class TimePicker extends Component {
  static propTypes = {
    id: PropTypes.string,
    componentState: PropTypes.object.isRequired,
    updateComponentState: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      startDate: moment()
    };
    // this.handleChange = this.handleChange.bind(this);
  }

  state = {
    latesttime: this.props.currTime
  };

  handleChange = date => {
    this.setState({
      startDate: date
    });
  };

  onChangetime = e => {
    var selectTime = e.target.value;

    const { id, updateComponentState } = this.props;
    updateComponentState(id, "selectTime", selectTime);

    this.setState({
      latesttime: selectTime
    });
  };

  render() {
    const { id, style, currTime } = this.props;
    return (
      <div>
        <style>
          {`.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list {
            padding-left: 0;
            padding-right: 0;
          }`}
        </style>
        <input
          id={id}
          type="time"
          name="datepicker"
          value={currTime}
          style={style}
          onChange={e => this.onChangetime(e)}
        />
        <DatePicker
          selected={this.state.startDate}
          onChange={this.handleChange}
          showTimeSelect
          showTimeSelectOnly
          dateFormat="LT"
          timeCaption="Time"
        />
      </div>
    );
  }
}
export function mapStateToProps(state, ownProps) {
  return {
    componentState: state.component.get(ownProps.id, Map())
  };
}

export default connect(
  mapStateToProps,
  {
    clearComponentState,
    updateComponentState
  }
)(TimePicker);
