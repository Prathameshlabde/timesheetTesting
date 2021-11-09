import React from "react";
import PropTypes from "prop-types";
import { Provider } from "react-redux";
import { Router } from "react-router";
import getRoutes from "../Routes";
// import GlobalStyle from "./styledComponent.js";
// import Colors from "./common/colors";

class Root extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
  };

  render() {
    const routes = getRoutes(this.props.store);

    return (
      <div>
        {/* <GlobalStyle btnBackgroundColor={Colors.btn} /> */}
        <Provider store={this.props.store}>
          <Router history={this.props.history}>{routes}</Router>
        </Provider>
      </div>
    );
  }
}

export default Root;
