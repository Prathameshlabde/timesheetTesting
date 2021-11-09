import React from 'react';
import { AppContainer } from 'react-hot-loader';
import { render } from 'react-dom';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import Root from './components/Root.js';
import configureStore from './redux/configureStore';

const initialState = window.__INITIAL_STATE__;
const store = configureStore(initialState, browserHistory);
const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: state => state.router
});

const renderComponent = Component => {
  render(
    <AppContainer>
      <Component history={history} store={store} />
    </AppContainer>,
    document.getElementById('root')
  );
};

if (module.hot) {
  module.hot.accept('./components/Root.js', () => {
    const NextRootContainer = require('./components/Root.js').default;
    renderComponent(NextRootContainer);
  });
}

renderComponent(Root);