import React, {Component} from 'react';
import {Button, Linking, ScrollView, StyleSheet, Text, View} from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import * as WebBrowser from 'expo-web-browser';
import MeasurementTable from '../components/MeasurementTable'
import SingleMeasure from "../components/SingleMeasure";
import * as firebase from "firebase";
import CalculatedFromMeasures from "../components/CalculatedFromMeasures";
import Chart from "../components/Chart";


export default class LabScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            xToChart: [],
            yToChart: [],
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
                <Text style={styles.maxHeader} >
                    Dyfrakcja
                </Text>
                <Text style={styles.header} >
                    Odległość szczlina-fotodioda
                </Text>
                <SingleMeasure
                    dataLocation={`/diffraction/${firebase.auth().currentUser.uid}/d`}
                    measureLabel={'Odległość'}
                    measureType={"length"}
                />
                <Text style={styles.header} >
                    Pomiar natężenia w zależności od położenia
                </Text>
                <View style={{flexDirection: 'row', paddingBottom: 20, justifyContent: 'center', flex: 1}}>
                    <MeasurementTable
                        dataLocation={`/diffraction/${firebase.auth().currentUser.uid}/measurements`}
                        measureName={'x'}
                        measureType={"length"}
                        name={"Położenie"}
                        setValuesFunction={(yValues) => {
                            this.setState({xToChart: yValues})
                        }}
                    />
                    <MeasurementTable
                        dataLocation={`/diffraction/${firebase.auth().currentUser.uid}/measurements`}
                        measureName={'I'}
                        withDelete
                        measureType={"time"}
                        name={"Natężenie"}
                        setValuesFunction={(yValues) => {
                            this.setState({yToChart: yValues})
                        }}
                    />
                </View>
                <Chart
                    data={this.getArrayForChart()}
                    xAccessor={(item)=>{return item.item[0];}
                    }
                    yAccessor={(item)=>{return item.item[1]}}
                    formatXLabel={(value) => `${(value*1000).toPrecision(3)}mm`}
                    formatYLabel={(value) => `${(value).toPrecision(3)}`}
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
    header: {
        fontSize: 18,
        flex: 1,
        textAlign: 'center',
        paddingBottom: 10,
        paddingTop: 20,
        fontWeight: 'bold',
    },
    maxHeader: {
        fontSize: 22,
        flex: 1,
        textAlign: 'center',
        paddingBottom: 10,
        paddingTop: 15,
        fontWeight: 'bold',
    },
});
