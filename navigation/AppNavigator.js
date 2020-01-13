import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import loginNavigator from "./LoginNavigator";

import AuthLoadingScreen from '../screens/AuthLoadingScreen'

export default createAppContainer(
  createSwitchNavigator({
      Main: MainTabNavigator,
      Auth: loginNavigator,
      AuthLoading: AuthLoadingScreen,
  },
    {
        initialRouteName: 'AuthLoading',
    }
  )
);
