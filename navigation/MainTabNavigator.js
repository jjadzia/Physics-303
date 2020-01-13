import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import LearnScreen from '../screens/LearnScreen';
import YoungScreen from '../screens/YoungScreen';
import InfoScreen from '../screens/InfoScreen';
import Quiz from '../components/quiz/screens/Quiz';
import FirstLabScreen from "../screens/FirstLabScreen";
import DiffractionScreen from "../screens/DiffractionScreen";
import ViscosityScreen from "../screens/ViscosityScreen"
import PickLabScreen from "../screens/PickLabScreen";

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const LearnStack = createStackNavigator(
    {
        Learn: LearnScreen,
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
    Lab: PickLabScreen,
      FirstLab: FirstLabScreen,
      Diffraction: DiffractionScreen,
      Young: YoungScreen,
      Viscosity: ViscosityScreen,
  },
    {
        initialRouteName: 'Lab',
    }
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
