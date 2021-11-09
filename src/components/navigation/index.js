import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Map } from "immutable";
import {
  clearComponentState,
  updateComponentState,
} from "../../actions/component.actions.js";
import { requestData } from "../../actions/data.actions.js";

import "./navigationBar.css";

import MenuItems from "./menuItems.js";
import { isMetaProduct, readCookie } from "../utils/common.utils.js";
import {
  BUILD_PATH,
  APP_BASE_URL,
  COMPANY_PROFILE_URL,
  COMPANY_PROFILE_CHANGED_ID,
} from "../../constants/app.constants.js";
import { fetchCompanyData } from "./menuItems.utils.js";
import { getDataFromCookie } from "../utils/CheckLoginDetails.js";

class Navigation extends Component {
  state = {
    compLogo: null,
    companyName: null,
  };
  static propTypes = {
    id: PropTypes.string,
    componentState: PropTypes.object.isRequired,
    updateComponentState: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { requestData } = this.props;

    if (isMetaProduct()) {
      const company_id = getDataFromCookie().company_id;
      fetchCompanyData({ requestData, company_id });

      if (readCookie("companyImgurl")) {
        this.setState({
          compLogo: readCookie("companyImgurl"),
        });
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { compDataState } = nextProps;

    if (this.props.compDataState !== compDataState && compDataState.apiData) {
      this.setState({ companyName: compDataState.apiData[0].comapny_name });
    }

    const { companyState } = nextProps;
    if (companyState !== this.props.companyState) {
      const compLogo = companyState.get(COMPANY_PROFILE_URL, "");
      this.setState({ compLogo });
    }
  }

  static Menu = () => {
    return <MenuItems id="MenuItems" />;
  };

  render() {
    const { compLogo, companyName } = this.state;

    return (
      <div className="app-sideBar" style={{ color: "#ffffff" }}>
        <a
          href={"/" + BUILD_PATH}
          style={{ color: "white", textDecoration: "unset" }}
        >
          <div className="app-sideBar-upperDrawer">
            <div>
              {/* {/ ajay 25 june /} */}
              {isMetaProduct() === true ? (
                compLogo !== null ? (
                  <img
                    src={APP_BASE_URL + compLogo}
                    style={{ width: "100%", height: "125px" }}
                    alt={""}
                  />
                ) : (
                  <div
                    style={{
                      color: "#0295DA",
                      wordBreak: "break-word",
                      fontSize: "30px",
                    }}
                  >
                    {companyName}
                  </div>
                )
              ) : (
                <div>
                  <div>
                    <span>Meta</span>
                    <span style={{ color: "#0295DA" }}>Sys</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </a>
        <div className="app-sideBar-lowerDrawer">
          {/* <Navigation.Menu /> */}
          <MenuItems id="MenuItems" />
        </div>
      </div>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const { login, data } = state;
  const id = ownProps.id;
  return {
    componentState: state.component.get(ownProps.id, Map()),
    loginDataState: login.getIn([id, "apiData"], null),
    companyState: state.component.get(COMPANY_PROFILE_CHANGED_ID, Map()),
    compDataState: data.getIn(["PRODUCT_COMPANY_DATA_ID", "apiData"], null),
  };
}

export default connect(
  mapStateToProps,
  {
    clearComponentState,
    updateComponentState,
    requestData,
  }
)(Navigation);
