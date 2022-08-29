import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import initStore from './config/store';
import ErrorBoundary from './shared/error/error-boundary';
import { loadIcons } from './config/icon-loader';
import 'styles/global.scss';

loadIcons();

const store = initStore();

ReactDOM.render(
  <ErrorBoundary>
    <Provider store={store}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Provider>
  </ErrorBoundary>,
  document.getElementById('root'),
);
