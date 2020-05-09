import React from "react";
import { AppearanceProvider } from 'react-native-appearance';
import Setup from "./src/boot/setup";
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import userReducer from './src/reducers/userReducer/userReducer';
import profileReducer from './src/reducers/profileReducer/profileReducer';
import routeReducer from './src/reducers/routeReducer/routeReducer';

const store = createStore(combineReducers({
    userReducer:userReducer,
    profileReducer:profileReducer,
    routeReducer:routeReducer
  }
));

export default class App extends React.Component {
  render() {
    return (
      <AppearanceProvider>
        <Provider store={store}>
          <Setup />
        </Provider>
      </AppearanceProvider>
    );
  }
}

