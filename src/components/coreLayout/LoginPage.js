import React, { Component } from "react";
import { connect } from "react-redux";
import { updateComponentState } from "../../actions/component.actions.js";
import { requestData } from "../../actions/login.actions";
import { requestDataDuplicate } from "../../actions/data.actions";
import { isMetaProduct } from "../utils/common.utils";
import "./login-page.css";
import ProductLoginFRGTDiv from "./ProductLoginFRGTDiv";
import NormalLoginFRGTDiv from "./NormalLoginFRGTDiv";

class Content extends Component {
  render() {
    if (isMetaProduct())
      return (
        <ProductLoginFRGTDiv
          id={this.props.id}
          funcIsLoggedIn={this.props.funcIsLoggedIn}
        />
      );
    else
      return (
        <NormalLoginFRGTDiv
          id={this.props.id}
          funcIsLoggedIn={this.props.funcIsLoggedIn}
        />
      );
  }
}

export function mapStateToProps(state, ownProps) {
  const { login } = state;
  const id = ownProps.id;
  return {
    loginDataState: login.getIn([id, "apiData"], null),
  };
}

export default connect(
  mapStateToProps,
  {
    updateComponentState,
    requestData,
    requestDataDuplicate,
  }
)(Content);
