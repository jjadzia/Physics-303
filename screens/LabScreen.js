import React from 'react';
import {Button, Linking, Picker, ScrollView, StyleSheet, View} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import MeasurementTable from '../components/MeasurementTable'
import SingleMeasure from "../components/SingleMeasure";
import CalculatedFromMeasures from "../components/CalculatedFromMeasures";
import AreaChartExample from "../components/AreaChartExample";
import * as firebase from "firebase";


export default function LabScreen() {
  return (
    <ScrollView style={styles.container}>
        <SingleMeasure
            dataLocation={`/diffraction/${firebase.auth().currentUser.uid}/d`}
            measureLabel={'Dł szczeliny'}
            measureType={"length"}
        />

        <Button
          onPress={() =>
              WebBrowser.openBrowserAsync(`https://fis.agh.edu.pl/~pracownia_fizyczna/cwiczenia/11_opis.pdf`)
          }
          title={'11. Moduł Younga'}
          style={styles.textboxValue}
      />
      <Button
          onPress={() =>
              WebBrowser.openBrowserAsync(`https://www.fis.agh.edu.pl/~pracownia_fizyczna/cwiczenia/01_opis.pdf`)
          }
          title={'a'}
          style={styles.textboxValue}
      />
      <View style={{flexDirection: 'row'}}>
          <MeasurementTable
              dataLocation={`/diffraction/${firebase.auth().currentUser.uid}/measurements`}
              measureName={'x'}
              inputStyle={{
                  marginHorizontal: 10,
                  width: 50,
                  fontSize: 13,
              }}
              measureType={"length"}
              name={"Nazw wielkosci"}
          />
          <MeasurementTable
              dataLocation={`/diffraction/${firebase.auth().currentUser.uid}/measurements`}
              measureName={'x'}
              inputStyle={{
                  marginHorizontal: 10,
                  width: 50,
                  fontSize: 13,
              }}
              measureType={"length"}
              name={"Nazw wielkosci"}
          />
          <MeasurementTable
              dataLocation={`/diffraction/${firebase.auth().currentUser.uid}/measurements`}
              measureName={'x'}
              inputStyle={{
                  marginHorizontal: 10,
                  width: 50,
                  fontSize: 13,
              }}
              measureType={"none"}
              name={"Nazw wielkosci"}
          />
          <MeasurementTable
              dataLocation={`/diffraction/${firebase.auth().currentUser.uid}/measurements`}
              measureName={'x'}
              inputStyle={{
                  marginHorizontal: 10,
                  width: 50,
                  fontSize: 13,
              }}
              measureType={"length"}
              name={"Nazwa wielkosci"}
          />
          <CalculatedFromMeasures
              dataLocation={`/diffraction/${firebase.auth().currentUser.uid}/measurements`}
              firstMeasure={'x'}
              secondMeasure={'x'}
              calculateFunction={(x, y)=> {return x+y}}
              title={'x'}
              withDelete
              inputStyle={{
                  marginHorizontal: 10,
                  width: 50,
                  fontSize: 13,
              }}
              measureType={"length"}
              name={"Nazwa wielkosci"}
          />
      </View>
        <AreaChartExample/>

    </ScrollView>
  );
}

LabScreen.navigationOptions = {
  title: 'Twoje ćwiczenia',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#e6e6ff',
      paddingHorizontal: 20,
  },
});
