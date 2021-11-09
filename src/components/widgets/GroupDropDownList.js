import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Map } from "immutable";
import {
  clearComponentState,
  updateComponentState
} from "../../actions/component.actions";
import { DEFAULT_OPTION } from "../../constants/app.constants";
class GroupDropdownList extends Component {
  static propTypes = {
    id: PropTypes.string,
    componentState: PropTypes.object.isRequired
  };

  state = {
    isMultipleList: this.props.isMultipleList,
    updatedID: this.props.id,
    updatedValue: this.props.data,
    updatedBillable: "",
    updatedName: "", //test for report
    parssedObject: ""
  };

  onChangeDropDown = e => {
    if (this.props.isMultipleList === true) {
      var options = e.target.options;

      var value = [];
      for (var i = 0, l = options.length; i < l; i++) {
        if (options[i].selected) {
          value.push(options[i].id);
        }
      }

      this.props.onChange(this.props.id, value);
    } else {
      let selectedIndex = e.target.value;

      if (e.target.value !== DEFAULT_OPTION) {
        let parsedObj;
        if (this.props.dropDownData.apiData) {
          parsedObj = this.props.dropDownData.apiData[selectedIndex];
        } else {
          parsedObj = this.props.dropDownData[selectedIndex];
        }
        this.setState(
          {
            updatedID: e.target.key,
            updatedValue: parsedObj.id,
            updatedBillable: parsedObj.is_billable,
            updatedName: parsedObj.name,
            parssedObject: parsedObj
          },
          () => {
            this.props.onChange(
              this.props.id,
              this.state.updatedValue,
              this.state.updatedBillable,
              this.state.updatedName,
              this.state.parssedObject,
              this.props.rowAndFieldIndex
            );
          }
        );
      } else {
        this.setState(
          {
            updatedID: e.target.key,
            updatedValue: e.target.value,
            updatedBillable: ""
          },
          () => {
            this.props.onChange(
              this.props.id,
              this.state.updatedValue,
              this.state.updatedBillable
            );
          }
        );
      }
    }
  };

  getSingleOption(singleObj, index, selectedID) {
    return (
      <option
        id={singleObj.id}
        key={singleObj.id}
        value={index}
        selected={singleObj.id === selectedID}
        className={
          singleObj.status_flag === "1" ||
            (singleObj.sprint_status && singleObj.sprint_status === "close")
            ? "red-color-class"
            : "default-color-class"
        }
      >
        {singleObj.name}
      </option>
    );
  }

  getOptionList(dropDownData, selectedID, checkValue) {
    let alloptionlist;
    if (dropDownData && dropDownData.apiData) {
      alloptionlist = dropDownData.apiData.map(
        (singleObj, index) =>
          singleObj.isDefaultProject &&
            singleObj.isDefaultProject === checkValue
            ? this.getSingleOption(singleObj, index, selectedID)
            : null
      );
    } else if (dropDownData && dropDownData[0]) {
      alloptionlist = dropDownData.map(
        (singleObj, index) =>
          singleObj.isDefaultProject &&
            singleObj.isDefaultProject === checkValue
            ? this.getSingleOption(singleObj, index, selectedID)
            : null
      );
    }
    return alloptionlist;
  }

  getOptGroup(labelName, data) {
    return <optgroup label={labelName}>{data}</optgroup>;
  }
  getSelectTag() {
    const {
      id,
      dropDownData,
      style,
      defaultOption,
      selectedID,
      className
    } = this.props;

    return (
      <select
        id={id}
        onChange={e => this.onChangeDropDown(e)}
        style={style}
        className={className}
      >
        {defaultOption && defaultOption !== "null" ? (
          <option id="" value={DEFAULT_OPTION}>
            {defaultOption}
          </option>
        ) : null}
        {this.getOptGroup(
          "Bookmarked Projects",
          this.getOptionList(dropDownData, selectedID, "1")
        )}
        {this.getOptGroup(
          "Other",
          this.getOptionList(dropDownData, selectedID, "0")
        )}
      </select>
    );
  }

  render() {
    return <div>{this.getSelectTag()}</div>;
  }
}

export function mapStateToProps(state, ownProps) {
  const { component } = state;
  const id = ownProps.id;
  return {
    componentState: component.get(id, Map())
  };
}

export default connect(
  mapStateToProps,
  {
    clearComponentState,
    updateComponentState
  }
)(GroupDropdownList);
