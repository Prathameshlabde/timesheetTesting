import React, { Component } from "react";
import { connect } from "react-redux";
import { Map } from "immutable";
import PropTypes from "prop-types";

import {
  clearComponentState,
  updateComponentState,
} from "../../actions/component.actions";
import { DEFAULT_OPTION } from "../../constants/app.constants";

class DropdownList extends Component {
  static propTypes = {
    id: PropTypes.string,
    componentState: PropTypes.object.isRequired,
    updateComponentState: PropTypes.func.isRequired,
  };

  state = {
    isMultipleList: this.props.isMultipleList,
    updatedID: this.props.id,
    updatedValue: this.props.data,
    updatedBillable: "",
    updatedName: "", //test for report
    parssedObject: "",
  };

  onChangeDropDown = (e) => {
    if (this.props.isMultipleList === true) {
      let options = e.target.options;

      let value = [];
      for (let i = 0, l = options.length; i < l; i++) {
        if (options[i].selected) {
          value.push(options[i].id);
        }
      }

      this.props.onChange(this.props.id, value);
    } else {
      let selectedIndex = e.target.value;

      if (e.target.value !== DEFAULT_OPTION) {
        // console.log("in default....");
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
            parssedObject: parsedObj,
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
        // console.log("in else......");
        this.setState(
          {
            updatedID: e.target.key,
            updatedValue: e.target.value,
            updatedBillable: "",
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

  isSelectedInMultiple = (currentId) => {
    const { multipleSelectedId } = this.props;
    if (multipleSelectedId) {
      if (multipleSelectedId.includes(currentId)) {
        return true;
      } else {
        return false;
      }
    }
  };

  render() {
    const {
      id,
      dropDownData,
      style,
      defaultOption,
      selectedID,
      className,
      isMultipleList,
    } = this.props;

    // console.log("id, selected id in dropdown = ", id, selectedID);

    let alloptions = dropDownData;
    let alloptionlist;
    if (alloptions && alloptions.apiData) {
      alloptionlist = alloptions.apiData.map((alloptionsObj, index) => (
        <option
          id={alloptionsObj.id}
          key={alloptionsObj.id}
          value={index} //{alloptionsObj.id} //{JSON.stringify(alloptionsObj)}
          selected={alloptionsObj.id === selectedID}
          className={
            alloptionsObj.status_flag === "1" ||
            (alloptionsObj.sprint_status &&
              alloptionsObj.sprint_status === "close")
              ? "red-color-class"
              : "default-color-class"
          }
        >
          {alloptionsObj.name}
        </option>
      ));
    } else if (alloptions && alloptions[0]) {
      if (isMultipleList) {
        alloptionlist = alloptions.map((alloptionsObj, index) => (
          <option
            id={alloptionsObj.id}
            key={alloptionsObj.id}
            value={index} //{alloptionsObj.id} //{JSON.stringify(alloptionsObj)}
            selected={this.isSelectedInMultiple(alloptionsObj.id)}
          >
            {alloptionsObj.name}
          </option>
        ));
      } else {
        alloptionlist = alloptions.map((alloptionsObj, index) => (
          <option
            id={alloptionsObj.id}
            key={alloptionsObj.id}
            value={index} //{alloptionsObj.id} //{JSON.stringify(alloptionsObj)}
            selected={alloptionsObj.id === selectedID}
            className={
              alloptionsObj.status_flag === "1"
                ? "red-color-class"
                : "default-color-class"
            }
          >
            {alloptionsObj.name}
          </option>
        ));
      }
    }

    return (
      <div>
        {isMultipleList ? (
          <select
            id={id}
            onChange={(e) => this.onChangeDropDown(e)}
            style={style}
            className={className}
            multiple={true}
          >
            {alloptionlist}
          </select>
        ) : defaultOption && defaultOption !== "null" ? (
          <select
            id={id}
            onChange={(e) => this.onChangeDropDown(e)}
            style={style}
            className={className}
          >
            <option id="" value={DEFAULT_OPTION}>
              {defaultOption}
            </option>
            {alloptionlist}
          </select>
        ) : (
          <select
            id={id}
            onChange={(e) => this.onChangeDropDown(e)}
            style={style}
            className={className}
          >
            {alloptionlist}
          </select>
        )}
      </div>
    );
  }
}
export function mapStateToProps(state, ownProps) {
  return {
    componentState: state.component.get(ownProps.id, Map()),
  };
}

export default connect(
  mapStateToProps,
  {
    clearComponentState,
    updateComponentState,
  }
)(DropdownList);
