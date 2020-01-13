import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import LearnScreen from '../screens/LearnScreen';
import YoungScreen from '../screens/YoungScreen';
import InfoScreen from '../screens/InfoScreen';
import Quiz from '../components/quiz/screens/Quiz';
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import InsertInfoScreen from "../screens/InsertInfoScreen";

const config = Platform.select({
    web: { headerMode: 'screen' },
    default: {},
});

const loginNavigator = createStackNavigator(
    {
        Register: RegisterScreen,
        Login: LoginScreen,
        InsertInfo: InsertInfoScreen,
    },
    {
        initialRouteName: 'Login',
    }
);

export default loginNavigator;
