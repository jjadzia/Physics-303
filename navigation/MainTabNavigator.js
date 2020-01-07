import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import LearnScreen from '../screens/LearnScreen';
import LabScreen from '../screens/LabScreen';
import InfoScreen from '../screens/InfoScreen';
import Quiz from '../components/react-native-quiz/App/screens/Quiz';
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import InsertInfoScreen from "../screens/InsertInfoScreen";

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const LearnStack = createStackNavigator(
    {
        Learn: LoginScreen,
        Quiz: Quiz,
    },
    {
        initialRouteName: 'Learn',
    }
);


LearnStack.navigationOptions = {
  tabBarLabel: 'Przygotowanie',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-school`
          : 'md-school'
      }
    />
  ),
};

LearnStack.path = '';

const LabStack = createStackNavigator(
  {
    Lab: LabScreen,
  },
  config
);

LabStack.navigationOptions = {
  tabBarLabel: 'Labolatoria',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-pulse' : 'md-pulse'} />
  ),
};

LabStack.path = '';

const InfoStack = createStackNavigator(
  {
    Info: InfoScreen,
  },
  config
);

InfoStack.navigationOptions = {
  tabBarLabel: 'Informacje',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-person' : 'md-person'} />
  ),
};

InfoStack.path = '';

const tabNavigator = createBottomTabNavigator({
  LearnStack: LearnStack,
  LabStack: LabStack,
  InfoStack: InfoStack,
},
    {
        tabBarOptions : {
            style: {
                backgroundColor: '#190033',
            }
        }
    }
    );

tabNavigator.path = '';

export default tabNavigator;
