// Configuring and creating Redux store for the local state management
// Documentation: https://redux-toolkit.js.org/introduction/getting-started
import { configureStore } from '@reduxjs/toolkit'; //includes combined reducers, simplified way of configuring Redux store
import counterReducer from './features/counterSlice';

// Configuring the store with the function provided by Redux Toolkit
// Pre-configured version of Redux's 'createStore'
const store = configureStore({
  reducer: {
    counter: counterReducer
  }
});

export default store;