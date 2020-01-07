import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState, useEffect } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as firebase from 'firebase';
import { AppAuth } from 'expo-app-auth';

// This value should contain your REVERSE_CLIENT_ID

import AppNavigator from './navigation/AppNavigator';

export default function App(props) {

  useEffect(()=>{

    const firebaseConfig = {
      apiKey: "AIzaSyCGIs-t6Wvru25Q0X0CMX6LaRfbDwooNOc",
      authDomain: "physics-labolatory-app.firebaseapp.com",
      databaseURL: "https://physics-labolatory-app.firebaseio.com",
      projectId: "physics-labolatory-app",
      storageBucket: "physics-labolatory-app.appspot.com",
      messagingSenderId: "917882509114",
      appId: "1:917882509114:web:72b04b8bcba89bbdc72203",
      measurementId: "G-942HFFDWKF"
    };
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
  });

  const [isLoadingComplete, setLoadingComplete] = useState(false);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  } else {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <AppNavigator />
      </View>
    );
  }
}

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      require('./assets/images/robot-dev.png'),
      require('./assets/images/robot-prod.png'),
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      // We include SpaceMono because we use it in LearnScreenn.js. Feel free to
      // remove this if you are not using it in your app
      'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
    }),
  ]);
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
