import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Map } from "immutable";
import Icon from "../widgets/Icon";
import {
  clearComponentState,
  updateComponentState,
} from "../../actions/component.actions.js";
import {
  APP_ID,
  LOADER_ID,
  LOADER_SHOW,
  SNACKBAR_ID,
  SNACKBAR_SHOW,
  BUILD_PATH,
  BUILD_PATH_COUNT,
} from "../../constants/app.constants";
import "./pageContent.css";
import access_permission from "../json/Access/access_permission.json";
import route_path from "../json/RoutePath/route_path.json";
import { isLoggedIn, getDataFromCookie } from "../utils/CheckLoginDetails";
import { browserHistory } from "react-router";
import Loader from "../widgets/Loader";
import Snackbar from "../widgets/Snackbar";
let lastScrollY = 0;

class PageContent extends Component {
  constructor() {
    super();

    this.state = {
      intervalId: 0,
      opacity: 0,
    };
  }

  static propTypes = {
    id: PropTypes.string,
    componentState: PropTypes.object.isRequired,
    updateComponentState: PropTypes.func.isRequired,
  };

  state = {
    isShowLoader: false,
    snackIsOpen: false,
    snackMessage: "",
  };

  capitalize(s) {
    return s && s[0].toUpperCase() + s.slice(1);
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  componentWillReceiveProps(nextProps) {
    const { loaderState, snackState } = nextProps;

    if (loaderState !== this.props.loaderState) {
      let loaderObject = loaderState.get(LOADER_SHOW, {
        showLoader: false,
      });

      this.setState({
        isShowLoader: loaderObject.showLoader,
      });
    }

    if (snackState !== this.props.snackState) {
      let snackBarObject = snackState.get(SNACKBAR_SHOW, {
        snackIsOpen: false,
        snackMessage: "",
      });

      this.setState({
        snackIsOpen: snackBarObject.showSnackBar,
        snackMessage: snackBarObject.snackMessage,
      });
    }
  }

  handleScroll = () => {
    lastScrollY = window.scrollY;
    if (lastScrollY > 120) {
      this.setState({
        opacity: 1,
      });
    } else {
      this.setState({
        opacity: 0,
      });
    }
  };

  renderMenuComponent = (componentName, componentProps) => {
    const currenrPageName2 = componentName;
    const singleChild = React.createElement(
      require("./" + currenrPageName2 + "/index.js").default,
      componentProps,
      null
    );
    return singleChild;
  };

  generateComponentID(componentId) {
    return componentId.toUpperCase() + "_ID";
  }

  onSnackClose() {
    const { updateComponentState } = this.props;

    updateComponentState(SNACKBAR_ID, SNACKBAR_SHOW, {
      showSnackBar: false,
      snackMessage: "",
    });
  }

  scrollStep() {
    if (window.pageYOffset === 0) {
      clearInterval(this.state.intervalId);
    }

    window.scroll(0, window.pageYOffset - 80);
  }

  gotoTop = () => {
    let intervalId = setInterval(this.scrollStep.bind(this), 20);

    this.setState({ intervalId: intervalId });
  };

  render() {
    let loggedinRole = "";
    if (getDataFromCookie() && getDataFromCookie().role) {
      loggedinRole = getDataFromCookie().role;
    }

    let currentPage;
    let currenrPageName;
    let secondUrl = "";
    const pageToLoad = this.props.contentName.substring(BUILD_PATH_COUNT);

    let finalPageToLoad = "/dashboard";
    let mappedUrl = route_path[pageToLoad.toUpperCase()];

    if (mappedUrl) {
      finalPageToLoad = mappedUrl;
    }

    let tempCurrenrPageName = finalPageToLoad.substring(1);
    let retrivedCurrentPage = this.capitalize(tempCurrenrPageName);
    let usersList = access_permission[retrivedCurrentPage];

    if (retrivedCurrentPage === "") {
      if (isLoggedIn() === true) {
        currenrPageName = "Dashboard";
      } else {
        browserHistory.push("/" + BUILD_PATH + "login");
      }
    } else if (retrivedCurrentPage.includes("/")) {
      let totalUrlArry = retrivedCurrentPage.split("/");

      usersList = access_permission[this.capitalize(totalUrlArry[1])];
      if (loggedinRole && usersList) {
        if (usersList.includes(loggedinRole)) {
          currenrPageName = totalUrlArry[0];
          secondUrl = this.capitalize(totalUrlArry[1]);
        } else {
          currenrPageName = "AccessDenied";
        }
      } else {
        currenrPageName = totalUrlArry[0];
        secondUrl = this.capitalize(totalUrlArry[1]);
      }
    } else {
      if (loggedinRole && usersList) {
        if (usersList.includes(loggedinRole)) {
          currenrPageName = retrivedCurrentPage;
        } else {
          currenrPageName = "AccessDenied";
        }
      } else {
        currenrPageName = retrivedCurrentPage;
      }
    }

    currentPage = this.renderMenuComponent(currenrPageName, {
      id: this.generateComponentID(currenrPageName),
      subMenu: secondUrl,
    });
    return (
      <div className="page-content">
        <Snackbar
          snackIsOpen={this.state.snackIsOpen}
          snackMessage={this.state.snackMessage}
          onSnackClose={() => this.onSnackClose()}
        />
        {this.state.isShowLoader === true ? <Loader /> : null}
        {currentPage}

        <div
          className="nav-top"
          onClick={() => this.gotoTop()}
          style={{
            opacity: this.state.opacity,
            transition: "opacity 0.3s cubic-bezier(0.7, 0.03, 1, 1)",
          }}
        >
          <Icon
            icon="arrow_upward"
            style={{
              fontSize: "28px",
              cursor: "pointer",
            }}
            title="Go To Top"
          />
        </div>
      </div>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  return {
    componentState: state.component.get(ownProps.id, Map()),
    appState: state.component.get(APP_ID, Map()),
    loaderState: state.component.get(LOADER_ID, Map()),
    snackState: state.component.get(SNACKBAR_ID, Map()),
  };
}

export default connect(
  mapStateToProps,
  {
    clearComponentState,
    updateComponentState,
  }
)(PageContent);
