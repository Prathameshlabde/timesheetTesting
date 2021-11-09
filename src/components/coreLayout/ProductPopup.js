import React, { Component } from "react";
import { connect } from "react-redux";
import { Map } from "immutable";
import {
  clearComponentState,
  updateComponentState,
} from "../../actions/component.actions.js";
import { requestData } from "../../actions/data.actions";
import { extendExpiryDate } from "./login.utils.js";
import { PRODUCT_EXTEND_ID } from "../../constants/app.constants.js";
import { PRODUCT_VALIDATION_DLGS } from "../../constants/dialog.constants.js";
import SpanLabel from "../widgets/SpanLabel.js";
import Colors from "../common/colors/index.js";
import { getButton } from "./login.ui.utils.js";

class ProductPopup extends Component {
  componentWillReceiveProps(nextProps) {
    const { extendState } = nextProps;
    if (this.props.extendState !== extendState) {
      // console.log("in rcv 1", extendState);
      const response = extendState.apiData;
      if (response === true) {
        //'Your subscription has been extended for 7 days. Enjoy!'
        this.props.onClosePopup();
      } else if (response === false) {
        //query failed
        //Please try again.
        //ok button -> this.props.onClosePopup();
      } else if (response === PRODUCT_VALIDATION_DLGS.notAuthorised) {
        //not authorised
        //ok button -> this.props.onClosePopup();
      } else if (response === PRODUCT_VALIDATION_DLGS.reachedMaximumLimit) {
        //reached maximum limit
        ///ok button -> this.props.onClosePopup();
      }
    }
  }

  onBuy() {
    // console.log("in buy click");
    ////---------//---------BUY URL---------//---------
    window.open("http://stage.metasyssoftware.com/buy-timesheet-tool", "_self");
  }

  onExtend() {
    // console.log("in extend click");
    const { requestData, company_id, fdate } = this.props;
    extendExpiryDate({ requestData, company_id, fdate });
  }

  onCancel() {
    this.props.onClosePopup();
  }

  getMessage(isBuyButton, isExtendButton) {
    if (isBuyButton === true && isExtendButton === true)
      return "Your subscription of 7 days is expired. You can extend for more 7 days or you can buy this.";
    else if (isBuyButton === true && isExtendButton === false)
      return "Your subscription has been expired. Please buy it to continue.";
  }

  render() {
    const { isBuyButton, isExtendButton } = this.props;
    return (
      <div
        className="pro-popup-main-div"
        style={{
          backgroundImage: `url(${"https://www.metasyssoftware.com/wp-content/uploads/revslider/homepage-2020/HomeBanner1.jpg"})`,
        }}
      >
        {/* <img
          src={
            "https://www.metasyssoftware.com/wp-content/uploads/revslider/homepage-2020/HomeBanner1.jpg"
          }
          alt=""
          style={{ width: "100%" }}
        /> */}
        <div className="pro-popup-sub-div1">
          <div className="pro-popup-sub-div1-upper">
            <div style={{ height: "100%" }}>
              <SpanLabel data={this.getMessage(isBuyButton, isExtendButton)} />
            </div>
          </div>
          <div className="pro-popup-sub-div1-contact">
            For immediate response, please contact us at{"  "}
            <a
              style={{ color: Colors.newBgColor, fontWeight: "bold" }}
              href="tel:+1 415 830 3674"
            >
              <b>+1 415 830 3674</b>
            </a>
            {"  "}
            or email us at{"  "}
            <a
              style={{ color: Colors.newBgColor, fontWeight: "bold" }}
              href="mailto: info@metasyssoftware.com"
            >
              info@metasyssoftware.com
            </a>
          </div>
        </div>
        <div className="pro-popup-sub-div2">
          {isBuyButton ? getButton("Buy", () => this.onBuy()) : null}

          {isExtendButton
            ? getButton("Extend for 7 Days", () => this.onExtend())
            : null}

          {getButton("Cancel", () => this.onCancel())}
        </div>
      </div>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const { component, data } = state;
  const id = ownProps.id;
  return {
    componentState: component.get(id, Map()),
    extendState: data.getIn([PRODUCT_EXTEND_ID, "apiData"], null),
  };
}

export default connect(
  mapStateToProps,
  {
    clearComponentState,
    updateComponentState,
    requestData,
  }
)(ProductPopup);
