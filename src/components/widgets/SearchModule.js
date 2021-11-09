import React, { Component } from "react";
import "./search-module.css";
import Icon from "../widgets/Icon";

class SearchModule extends Component {
  state = {
    updatedText: this.props.data,
    updatedID: ""
  };

  onChangetext = e => {
    this.setState({ updatedText: e.target.value }, () => {
      this.props.onTextChange &&
        this.props.onTextChange(this.props.id, this.state.updatedText);
    });
  };

  onCancel = () => {
    this.setState(
      {
        updatedText: ""
      },
      () => {

        this.props.onCancel();
      }
    );
  };

  onEnterKey = event => {
    if (event.key === "Enter") {
      this.props.onSubmit();
    }
  };

  render() {
    const { id, onSubmit } = this.props;

    return (
      <div className="search-module-div" id={id}>
        <input
          type="text"
          name="focus"
          className="search-box"
          value={this.props.data}
          onChange={e => this.onChangetext(e)}
          onKeyPress={e => this.onEnterKey(e)}
          placeholder="Search"
        />
        <button
          className="close-icon"
          type="reset"
          onClick={() => this.onCancel()}
        />
        <Icon
          icon="search"
          style={{
            fontSize: "26px",
            paddingLeft: "0px",
            color: "#767676",
            cursor: "pointer",
            position: "relative",
            left: "-51px"
          }}
          title="Search"
          onClick={onSubmit}
        />
      </div>
    );
  }
}
export default SearchModule;
