import React, { Component } from 'react';
import {Button, Linking, Picker, ScrollView, StyleSheet, View} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import MeasurementTable from '../components/MeasurementTable'
import SingleMeasure from "../components/SingleMeasure";
import CalculatedFromMeasures from "../components/CalculatedFromMeasures";
import Chart from "../components/Chart";
import * as firebase from "firebase";
import {XAxis} from "react-native-svg-charts";


export default class LabScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            xToChart: [],
            yToChart: []
        };
    }

    getArrayForChart(){
        const { xToChart, yToChart } = this.state;
        const data = [];

        xToChart.map((value, index)=>{
            data.push([value, yToChart[index]])
        })
        return data;
    }

    render() {
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
                        dataLocation={`/young/${firebase.auth().currentUser.uid}/measurements`}
                        measureName={'m'}
                        inputStyle={{
                            marginHorizontal: 10,
                            width: 50,
                            fontSize: 13,
                        }}
                        measureType={"mass"}
                        name={"Masa"}
                    />
                    <CalculatedFromMeasures
                        dataLocation={`/young/${firebase.auth().currentUser.uid}/measurements`}
                        firstMeasure={'m'}
                        secondMeasure={'m'}
                        calculateFunction={(x, y) => {
                            return x * 9.80665
                        }}
                        title={'x'}
                        inputStyle={{
                            marginHorizontal: 10,
                            width: 50,
                            fontSize: 13,
                        }}
                        measureType={"force"}
                        name={"Siła"}
                        setValuesFunction={(xValues)=>{this.setState({xToChart: xValues})}}
                    />
                    <MeasurementTable
                        dataLocation={`/young/${firebase.auth().currentUser.uid}/measurements`}
                        measureName={'x1'}
                        inputStyle={{
                            marginHorizontal: 10,
                            width: 50,
                            fontSize: 13,
                        }}
                        measureType={"length"}
                        name={"Wychylenie ^"}
                    />
                    <MeasurementTable
                        dataLocation={`/young/${firebase.auth().currentUser.uid}/measurements`}
                        measureName={'x2'}
                        inputStyle={{
                            marginHorizontal: 10,
                            width: 50,
                            fontSize: 13,
                        }}
                        measureType={"length"}
                        name={"Wychylenie v"}
                    />
                    <CalculatedFromMeasures
                        dataLocation={`/young/${firebase.auth().currentUser.uid}/measurements`}
                        firstMeasure={'x1'}
                        secondMeasure={'x2'}
                        calculateFunction={(x, y) => {
                            return (x + y) / 4
                        }}
                        title={'x'}
                        withDelete
                        inputStyle={{
                            marginHorizontal: 10,
                            width: 50,
                            fontSize: 13,
                        }}
                        measureType={"length"}
                        name={"Śr wydłużenie"}
                        setValuesFunction={(yValues)=>{this.setState({yToChart: yValues})}}
                    />
                </View>
                <Chart
                    data={this.getArrayForChart()}
                    xAccessor={(item)=>{return item.item[0];}
                    }
                    yAccessor={(item)=>{return item.item[1]}}
                    formatXLabel={(value) => `${value}N`}
                    formatYLabel={(value) => `${(value*1000)}mm`}

                />
                <View style={{height: 50}}/>
            </ScrollView>
        );
    }
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
