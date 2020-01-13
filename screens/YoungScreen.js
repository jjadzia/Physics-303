import React, { Component } from 'react';
import {Button, Linking, Picker, ScrollView, StyleSheet, View, Text} from 'react-native';
import MeasurementTable from '../components/MeasurementTable'
import SingleMeasure from "../components/SingleMeasure";
import CalculatedFromMeasures from "../components/CalculatedFromMeasures";
import Chart from "../components/Chart";
import * as firebase from "firebase";


export default class YoungScreen extends Component {
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
        console.log(this.state.yToChart);

        return (
            <ScrollView style={styles.container}>
                <Text style={styles.maxHeader} >
                    Moduł Younga
                </Text>
                <Text style={styles.header} >
                    Pomiar średnicy druta
                </Text>
                <SingleMeasure
                    dataLocation={`/young/${firebase.auth().currentUser.uid}/d`}
                    measureLabel={'Średnica'}
                    measureType={"length"}
                />
                <Text style={styles.header} >
                    Pomiar wydłużenia od masy
                </Text>
                <View style={{flexDirection: 'row', paddingBottom: 20}}>
                    <MeasurementTable
                        dataLocation={`/young/${firebase.auth().currentUser.uid}/measurements`}
                        measureName={'m'}
                        inputStyle={styles.inputStyle}
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
                        inputStyle={styles.inputStyle}
                        measureType={"force"}
                        name={"Siła"}
                        setValuesFunction={(xValues)=>{this.setState({xToChart: xValues})}}
                    />
                    <MeasurementTable
                        dataLocation={`/young/${firebase.auth().currentUser.uid}/measurements`}
                        measureName={'x1'}
                        inputStyle={styles.inputStyle}
                        measureType={"length"}
                        name={"Wychyl. ^"}
                    />
                    <MeasurementTable
                        dataLocation={`/young/${firebase.auth().currentUser.uid}/measurements`}
                        measureName={'x2'}
                        inputStyle={styles.inputStyle}
                        measureType={"length"}
                        name={"Wychyl. v"}
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
                        inputStyle={styles.inputStyle}
                        measureType={"length"}
                        name={"Śr. wydł."}
                        setValuesFunction={(yValues)=>{this.setState({yToChart: yValues})}}
                    />
                </View>
                <Text style={styles.header} >
                    Wykres średniego wydłużenia od siły
                </Text>
                <Chart
                    data={this.getArrayForChart()}
                    xAccessor={(item)=>{return item.item[0];}
                    }
                    yAccessor={(item)=>{return item.item[1]}}
                    formatXLabel={(value) => `${(value).toPrecision(3)}N`}
                    formatYLabel={(value) => `${(value*1000).toPrecision(3)}mm`}
                />
                <View style={{height: 50}}/>
            </ScrollView>
        );
    }
}

YoungScreen.navigationOptions = {
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
        paddingBottom: 20,
        paddingTop: 30,
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
    inputStyle: {
        marginHorizontal: 10,
        width: 50,
        fontSize: 13,
        paddingVertical: 2,
    }
});
