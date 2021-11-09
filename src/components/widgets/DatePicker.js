import React, { Component } from "react";
import { connect } from "react-redux";
import { Map } from "immutable";
import PropTypes from "prop-types";
import ReactDatePicker from "react-datetime";
import "./date-picker.css";
import moment from "moment";

import {
  clearComponentState,
  updateComponentState
} from "../../actions/component.actions";

class DatePicker extends Component {
  static propTypes = {
    id: PropTypes.string,
    componentState: PropTypes.object.isRequired,
    updateComponentState: PropTypes.func.isRequired
  };

  state = {
    id: this.props.id,
    currentDate: moment(this.props.value)
  };

  componentWillReceiveProps(nextProps) {
    const { id, value } = nextProps;

    this.setState({
      id: id,
      currentDate: moment(value)
    });
  }

  handleChange = date => {
    this.setState({ currentDate: date }, () => {
      this.props.onChange(this.props.id, date, "");
    });
  };

  getDateParameters(date) {
    const { isEnableFutureDates, isEnablePastDates } = this.props;
    if (isEnableFutureDates) {
      return moment() < date;
    } else if (isEnablePastDates) {
      return moment() > date;
    } else {
      return date;
    }
  }

  isEnableCheckMethod() {
    const { className, isOpen, dateFormat, showMonthYearPicker } = this.props;
    return (
      <ReactDatePicker
        id={this.state.id}
        input={true}
        viewMode={this.props.viewMode ? this.props.viewMode : 'days'}
        onChange={e => this.handleChange(e)}
        value={this.state.currentDate}
        timeFormat={false}
        closeOnSelect={true}
        inputProps={{ readOnly: true }}
        className={className}
        open={isOpen}
        isValidDate={date => this.getDateParameters(date)}
        dateFormat={dateFormat}
        showMonthYearPicker={showMonthYearPicker}
      />

    );
  }

  render() {
    return <div className="pr-date-div">{this.isEnableCheckMethod()}</div>;
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
)(DatePicker);
