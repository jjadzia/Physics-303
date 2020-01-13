import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Alert} from 'react-native';
import MeasurementTable from '../components/MeasurementTable'
import SingleMeasure from "../components/SingleMeasure";
import CalculatedFromMeasures from "../components/CalculatedFromMeasures";
import Chart from "../components/Chart";
import * as firebase from "firebase";

export default class ViscosityScreen extends Component {

        constructor(props){
        super(props);
        this.state = {
            xToChart: [],
            yToChart: [],
            statsT: [],
            statsL: [],
            statsD: [],
            statsN: [' - ', ' - '],
        };
    }

    calculateViscosity(d, m, t){
            const { statsD, statsL } = this.state;

            const pi = Math.PI;
            const ro = 1257.0;
            const g = 9.81;

            const D = statsD[0];
            const L = statsL[0];


            return ((m-pi*ro*d*d*d/6.0)*g*t/(3.0*pi*L*d*(1 + 2.4*d/D)));
    }

    render() {
            const { statsN, statsL, statsD } = this.state;
            console.log("nnnn", statsN )
        return (
            <ScrollView style={styles.container}>
                <Text style={styles.maxHeader} >
                    Współczynnik lepkości
                </Text>
                <Text style={styles.header} >
                    Pomiar drogi spadania
                </Text>
                <SingleMeasure
                    dataLocation={`/viscosity/${firebase.auth().currentUser.uid}/l`}
                    measureLabel={'Droga'}
                    measureType={"length"}
                    getStatistics={(stats)=>this.setState({statsL: stats})}
                />
                <Text style={styles.header} >
                    Pomiar średnicy cylindra
                </Text>
                <SingleMeasure
                    dataLocation={`/viscosity/${firebase.auth().currentUser.uid}/D`}
                    measureLabel={'Średnica'}
                    measureType={"length"}
                    getStatistics={(stats)=>this.setState({statsD: stats})}
                />
                <Text style={styles.header} >
                    Pomiar temperatury
                </Text>
                <SingleMeasure
                    dataLocation={`/viscosity/${firebase.auth().currentUser.uid}/T`}
                    measureLabel={'Temperatura'}
                    measureType={"temperature"}
                    getStatistics={(stats)=>this.setState({statsT: stats})}
                />
                <Text style={styles.header} >
                    Pomiar czasu spadania kulki
                </Text>
                <View style={{flexDirection: 'row', paddingBottom: 20, justifyContent: 'space-between', flex: 1}}>
                    <MeasurementTable
                        dataLocation={`/viscosity/${firebase.auth().currentUser.uid}/measurements`}
                        measureName={'d'}
                        inputStyle={styles.inputStyle}
                        measureType={"length"}
                        name={"Śr. kulki"}
                    />
                    <MeasurementTable
                        dataLocation={`/viscosity/${firebase.auth().currentUser.uid}/measurements`}
                        measureName={'m'}
                        inputStyle={styles.inputStyle}
                        measureType={"mass"}
                        name={"Masa"}
                    />
                    <MeasurementTable
                        dataLocation={`/viscosity/${firebase.auth().currentUser.uid}/measurements`}
                        measureName={'t'}
                        inputStyle={styles.inputStyle}
                        measureType={"time"}
                        name={"Czas spadania"}
                    />
                    <CalculatedFromMeasures
                        dataLocation={`/viscosity/${firebase.auth().currentUser.uid}/measurements`}
                        firstMeasure={'d'}
                        secondMeasure={'m'}
                        thirdMeasure={'t'}
                        calculateFunction={(d, m, t) => this.calculateViscosity(d,m,t)}
                        title={'n'}
                        withDelete
                        inputStyle={styles.inputStyle}
                        measureType={"viscosity"}
                        name={"Wspł lepkości"}
                        getStatistics={(stats)=>this.setState({statsN: stats})}
                    />
                </View>
                <TouchableOpacity onPress={()=>Alert.alert("Obliczono na podstawie średniej wartości współczynnika lepkości oraz estymatora odchylenia standardowego średniej", "Więcej informacji znajdziesz w zakładce przygotowanie, w karcie statystyka danych pomiarowych")}>
                    <Text style={styles.calculatedValue} >
                        Średni współczynnik lepkości gliceryny:
                    </Text>
                    <Text style={styles.calculatedValue} >
                        { statsN[0].isNaN ?
                            `n=${statsN[0]}, u(n)=${statsN[1]}`
                            : `n=${parseFloat(statsN[0]).toPrecision(4)}, u(n)=${parseFloat(statsN[1]).toPrecision(2)}`}
                    </Text>
                </TouchableOpacity>
                <View style={{height: 50}}/>
            </ScrollView>
        );
    }
}

ViscosityScreen.navigationOptions = {
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
    calculatedValue: {
        fontSize: 16,
        flex: 1,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    inputStyle: {
        marginHorizontal: 10,
        width: 60,
        fontSize: 13,
        paddingVertical: 2,
    }
});
