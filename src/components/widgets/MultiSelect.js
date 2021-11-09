import React, { Component } from "react";
import PropTypes from "prop-types";
import "./multi-select.css";
import Select from "react-select";

class MultiSelect extends Component {
  static propTypes = {
    title: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func,
    icon: PropTypes.string
  };

  state = {
    finaldata: this.props.multipleSelectedId,
    finalSearchBoxData: null
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.multipleSelectedId !== nextProps.multipleSelectedId) {
      this.setState({
        finaldata: nextProps.multipleSelectedId,
        finalSearchBoxData: nextProps.multipleSelectedId
      });
    }
  }

  onClickCheckBox = obj => {
    if (this.state.finaldata) {
      let finaldatafromState = this.state.finaldata;
      if (finaldatafromState.includes(obj.id)) {
        var index = finaldatafromState.indexOf(obj.id);
        if (index !== -1) {
          finaldatafromState.splice(index, 1);
        }

        this.setState(
          {
            finaldata: finaldatafromState
          },
          () => {
            if (this.props.isFromReport && this.props.isFromReport === true) {
              this.props.onChange(
                this.props.id,
                this.state.finaldata,
                this.props.dataSetIndex,
                ""
              );
            } else {
              this.props.onChange(this.props.id, this.state.finaldata, obj, "");
            }
          }
        );
      } else {
        finaldatafromState.push(obj.id);

        this.setState(
          {
            finaldata: finaldatafromState
          },
          () => {
            if (this.props.isFromReport && this.props.isFromReport === true) {
              this.props.onChange(
                this.props.id,
                this.state.finaldata,
                this.props.dataSetIndex,
                ""
              );
            } else {
              this.props.onChange(this.props.id, this.state.finaldata, "", "");
            }
          }
        );
      }
    }
  };
  isToselect = (id, multipleData) => {
    if (multipleData && multipleData.includes(id)) {
      return true;
    } else {
      return false;
    }
  };

  getClassname = (id, multipleData, statusFlag) => {
    if (multipleData && multipleData.includes(id)) {
      if (this.props.isSelectionColor === false) {
        return "";
      } else {
        return "multi-list-main-div selected-class";
      }
    } else if (statusFlag === "1") {
      return "multi-list-main-div red-color-class";
    } else {
      return "";
    }
  };

  generateList = (data, multipleData) => {
    let list;
    if (data && data !== true && data !== false) {
      list = data.map(value => (
        <div
          key={value.name}
          className={this.getClassname(
            value.id,
            multipleData,
            value.status_flag
          )}
          style={{ paddingRight: "1%", display: "flex" }}
          onClick={() => this.onClickCheckBox(value)}
        >
          <div>
            <input
              type="checkbox"
              checked={this.isToselect(value.id, multipleData)}
            />
          </div>
          <div>
            <span className="mlti-list-label-style">{value.name}</span>
          </div>
        </div>
      ));
    }
    return list;
  };

  generateSearchableDropdown = data => {
    let list;
    if (this.state.finalSearchBoxData) {
      list = (
        <Select
          defaultValue={this.state.finalSearchBoxData}
          isMulti
          name="colors"
          options={this.getMultiData(data)}
          className="basic-multi-select"
          classNamePrefix="select"
          onChange={this.props.onChange}
        />
      );
      return list;
    }
  };

  getMultiData = data => {
    let dataMulti = [];
    if (data && data !== true && data !== false) {
      data.map(obj => {
        dataMulti.push({
          value: obj.id,
          label: obj.name
        });
        //aditya 24/07/2019
        return null;
      });
    }
    return dataMulti;
  };

  getSelected = data => {
    let dataMulti = [];
    if (data && data !== true && data !== false) {
      data.map(obj => {
        dataMulti.push({
          value: obj.value,
          label: obj.label
        });
        //aditya 24/07/2019
        return null;
      });
    }
    return dataMulti;
  };

  render() {
    const { data, multipleSelectedId, style } = this.props;

    let styleMultiselect = style;
    let classname = "multiselect-main-div";
    if (this.props.isSearchDropdown && this.props.isSearchDropdown === true) {
      styleMultiselect = {};
      classname = "";
    }
    return (
      <div className={classname} style={styleMultiselect}>
        {this.props.isSearchDropdown && this.props.isSearchDropdown === true
          ? this.generateSearchableDropdown(data)
          : this.generateList(data, multipleSelectedId)}
      </div>

      // <div className="multiselect-main-div" style={this.props.style}>
      //   {this.generateList(data, multipleSelectedId)}
      // </div>
    );
  }
}
export default MultiSelect;
