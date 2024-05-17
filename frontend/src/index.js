import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './store';

// Documentation: https://react-redux.js.org/api/provider
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // I chose to work with strict mode to easily identify and highlight potential problems
  <React.StrictMode> 
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
reportWebVitals();

