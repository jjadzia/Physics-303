import React from 'react';
import {Button, Linking, ScrollView, StyleSheet} from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import * as WebBrowser from 'expo-web-browser';
import MeasurementTable from '../components/MeasurementTable'
import SingleMeasure from "../components/SingleMeasure";
import * as firebase from "firebase";


export default function LabScreen() {
    return (
        <ScrollView style={styles.container}>
            <SingleMeasure dataLocation={`/diffraction/${firebase.auth().currentUser.uid}/d`} measureLabel={'Dl szczeliny'}/>

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
            <MeasurementTable dataLocation={`/diffraction/${firebase.auth().currentUser.uid}/measurements`} measureName={'x'} withDelete/>
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
