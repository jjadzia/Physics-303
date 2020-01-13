import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Alert} from 'react-native';
import MeasurementTable from '../components/MeasurementTable'
import SingleMeasure from "../components/SingleMeasure";
import CalculatedFromMeasures from "../components/CalculatedFromMeasures";
import Chart from "../components/Chart";
import * as firebase from "firebase";


export default class FirstLabScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            xToChart: [],
            yToChart: [],
            statisticsT: [],
            statisticsL: [],
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

    getTransferredUncertainty(){
        const { statisticsT, statisticsL} = this.state;

        if(statisticsT.length < 2 || statisticsL.length < 2) return [' - ', ' - '];

        const value = 4 * Math.PI * Math.PI * statisticsL[0] / statisticsT[0] / statisticsT[0];
        const uL = Math.pow(4 * Math.PI * Math.PI  * statisticsL[1] / statisticsT[0] / statisticsT[0],2);
        const uT = Math.pow(8 * Math.PI * Math.PI * statisticsL[0]/ Math.pow(statisticsT[0],3) * statisticsT[1] ,2);
        const uncertainty = Math.sqrt(uL + uT );
        return [parseFloat(value.toPrecision(4)), parseFloat(uncertainty.toPrecision(2))];
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

        const stats = this.getTransferredUncertainty();
        return (
            <ScrollView style={styles.container}>
                <Text style={styles.maxHeader} >
                    Opracowanie danych pomiarowych
                </Text>
                <Text style={styles.header} >
                    Pomiar długości wahadła
                </Text>
                <SingleMeasure
                    dataLocation={`/zero/${firebase.auth().currentUser.uid}/l`}
                    measureLabel={'Dł. wahadła'}
                    measureType={"length"}
                    inputStyle={{
                        marginHorizontal: 10,
                        width: 80,
                        fontSize: 12,
                    }}
                    getStatistics={(stats)=>this.setState({statisticsL: stats})}
                />
                <Text style={styles.header} >
                    Pomiar okresu wahdła przy ustalonej długości
                </Text>
                <View style={{flexDirection: 'row', paddingBottom: 20, justifyContent: 'space-around'}}>
                    <MeasurementTable
                        dataLocation={`/zero/${firebase.auth().currentUser.uid}/measurements`}
                        measureName={'k'}
                        measureType={"none"}
                        name={"Liczba okresów k"}
                    />
                    <MeasurementTable
                        dataLocation={`/zero/${firebase.auth().currentUser.uid}/measurements`}
                        measureName={'t'}
                        measureType={"time"}
                        name={"Czas k okresów"}
                    />
                    <CalculatedFromMeasures
                        dataLocation={`/zero/${firebase.auth().currentUser.uid}/measurements`}
                        firstMeasure={'t'}
                        secondMeasure={'k'}
                        calculateFunction={(x, y) => {
                            return (x/y).toPrecision(3);
                        }}
                        title={'T'}
                        measureType={"time"}
                        name={"Okres"}
                        setValuesFunction={()=>null}
                        withDelete
                        showStatistics
                        getStatistics={(val)=>this.setState({statisticsT: val})}
                    />
                </View>
                <TouchableOpacity onPress={()=>Alert.alert("Obliczono na podstawie średniej wartości pomiaru okresu, jego niepewności typu A, pomiaru długości wahadła i jego niepewności typu B. Niepewność wyznaczona została zgodnie z prawem przenosznia niepewności", "Więcej informacji znajdziesz w zakładce przygotowanie, w karcie statystyka danych pomiarowych")}>
                    <Text style={styles.calculatedValue} >
                        Przyśpieszenie ziemskie na podstawie powyższych pomiarów:
                    </Text>
                    <Text style={styles.calculatedValue} >
                        {`g=${stats[0]}, u(g)=${stats[1]}`}
                    </Text>
                </TouchableOpacity>

                <Text style={styles.header} >
                    Pomiar okresu przy zmiennej długości wahadła
                </Text>

                <View style={{flexDirection: 'row', paddingBottom: 20}}>
                    <MeasurementTable
                        dataLocation={`/zero/${firebase.auth().currentUser.uid}/measurements2`}
                        measureName={'l'}
                        inputStyle={{
                            marginHorizontal: 10,
                            width: 50,
                            fontSize: 9,
                        }}
                        measureType={"length"}
                        name={"Długoś"}
                        setValuesFunction={(xValues)=>{this.setState({xToChart: xValues})}}
                    />
                    <MeasurementTable
                        dataLocation={`/zero/${firebase.auth().currentUser.uid}/measurements2`}
                        measureName={'k'}
                        inputStyle={{
                            marginHorizontal: 10,
                            width: 50,
                            fontSize: 9,
                        }}
                        measureType={"none"}
                        name={"Okresy"}
                    />

                    <MeasurementTable
                        dataLocation={`/zero/${firebase.auth().currentUser.uid}/measurements2`}
                        measureName={'t'}
                        inputStyle={{
                            marginHorizontal: 10,
                            width: 50,
                            fontSize: 9,
                        }}
                        measureType={"time"}
                        name={"Czas"}
                    />
                    <CalculatedFromMeasures
                        dataLocation={`/zero/${firebase.auth().currentUser.uid}/measurements2`}
                        firstMeasure={'t'}
                        secondMeasure={'k'}
                        calculateFunction={(x, y) => {
                            return x / y;
                        }}
                        title={'T'}
                        inputStyle={{
                            marginHorizontal: 10,
                            width: 50,
                            fontSize: 9,
                        }}
                        measureType={"time"}
                        name={"Okres"}
                        setValuesFunction={(yValues)=>{this.setState({yToChart: yValues})}}

                    />
                    <CalculatedFromMeasures
                        dataLocation={`/zero/${firebase.auth().currentUser.uid}/measurements2`}
                        firstMeasure={'t'}
                        secondMeasure={'k'}
                        calculateFunction={(x, y) => {
                            return x/y * x/y;
                        }}
                        title={'t2'}
                        withDelete
                        inputStyle={{
                            marginHorizontal: 10,
                            width: 50,
                            fontSize: 9,
                        }}
                        measureType={"none"}
                        name={"Kwadrat długości"}
                        setValuesFunction={()=>null}

                    />
                </View>
                <Text style={styles.header} >
                    Wykres zależności okresu od długości wahadła
                </Text>
                <Chart
                    data={this.getArrayForChart()}
                    xAccessor={(item)=>{return item.item[0];}
                    }
                    yAccessor={(item)=>{return item.item[1]}}
                    formatXLabel={(value) => `${(value*100).toFixed(1)}cm`}
                    formatYLabel={(value) => `${(value*1).toFixed(1)}s`}

                />
                <View style={{height: 50}}/>
            </ScrollView>
        );
    }
}

FirstLabScreen.navigationOptions = {
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
    calculatedValue: {
        fontSize: 16,
        flex: 1,
        textAlign: 'center',
        fontWeight: 'bold',
    },
});
