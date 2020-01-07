import React, { Component } from 'react';
import {StyleSheet, TextInput, View, Text, Button, TouchableOpacity, Alert, ActivityIndicator} from 'react-native';
import firebase from "firebase";

const supportedUnits = {
    mass: ['kg', 'g', 'mg'],
    length: ['cm', 'nm', 'mm', 'm'],
    time: ['s', 'min', 'h'],
    none: [''],
};

export default class MeasurementTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            number: '',
            tmpNumber: null,
            editedField: null,
            fetched: false,
            measures: [],
            keys: [],
            unit: '',
            newUnit: '',
        };
    };

    componentDidMount(){

        const { dataLocation, measureType } =this.props;
        let measurements = firebase.database().ref(dataLocation);

        const mes=[];
        const keys=[];

        if(!this.state.fetched) measurements.on('value', snapshot => {
            mes.length = 0;
            keys.length = 0;
            console.log("fetching measures");
            if(snapshot.val() != null){
                Object.keys(snapshot.val()).map((key)=>{
                    mes.push(snapshot.val()[key]);
                    keys.push(key)
                })
            }
            this.setState({fetched: true, measures: mes, keys: keys });
        });
        this.setState({unit: supportedUnits[measureType][0], newUnit: supportedUnits[measureType][0]});

    }

    renderNumberBox(firstNumber, secondNumber){

        const { inputStyle, calculateFunction } = this.props;

        const numberToShow= (calculateFunction(firstNumber, secondNumber)/this.getUnitFactor()).toString();

        return (
            <TextInput
                style={[styles.textInput, inputStyle]}
                editable={false}
                value={numberToShow}
            />
        )
    }

    renderDelete(key){

        const { dataLocation } =this.props;
        const { keys } =this.state;

        const path = `${dataLocation}/${keys[key]}`;
        return (
            <TouchableOpacity
                key={key}
                style={styles.removeButton}
                onPress={()=>firebase.database().ref(path).remove().catch((err)=>console.log(err))}
            >
                <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold'}}>x</Text>
            </TouchableOpacity>
        )
    }

    getUnitFactor(){
        const { measureType } = this.props;
        const { unit } = this.state;

        if (measureType == "mass") {
            switch (unit){
                case 'kg': return 1.0;
                case 'g': return 1e-3;
                case 'mg': return 1e-3;
                default: return -1;
            }
        }
        if (measureType == "length") {
            switch (unit){
                case 'cm': return 1e-2;
                case 'nm': return 1e-9;
                case 'mm': return 1e-3;
                case 'm': return 1.0;
                default: return -1;
            }
        }
        if (measureType == "time") {
            switch (unit){
                case 's': return 1.0;
                case 'min': return 60;
                case 'h': return 3600;
                default: return -1;
            }
        }
        if (measureType == "none") return 1;
        else return -1;
    }

    render() {

        const { measures, unit, newUnit } = this.state;
        const { firstMeasure, secondMeasure, withDelete, inputStyle, measureType, name } =this.props;
        let sum = 0;
        this.state.fetched && measures.map((measure) => {
            sum+=parseFloat(measure[firstMeasure]);
        });
        const mean=sum/measures.length;
        sum=0;
        this.state.fetched && measures.map((measure) => {
            sum+=Math.pow(parseFloat(measure[firstMeasure])-mean,2);
        });
        const variance = sum/measures.length/(measures.length-1);
        const stdev = Math.sqrt(variance);

        if(!this.state.fetched) return (<ActivityIndicator style={{ flex: 1, justifyContent: 'center'}}size={"large"}></ActivityIndicator>)

        return (
            <View style={styles.container}>
                <Text style={[styles.mean, inputStyle]}>{name}</Text>
                <Text style={[styles.unit, inputStyle, {fontSize: 8, height: 20}]}>{unit ? "Jednostka:" : "Bez jednostki"}</Text>
                { unit ? <TextInput
                    style={[styles.unitInput, inputStyle]}
                    onChangeText={text => this.setState({ newUnit: text })}
                    value={newUnit}
                    autoCapitalize={'none'}
                    onEndEditing={()=>{
                        if(supportedUnits[measureType].includes(newUnit)) this.setState({unit: newUnit});
                        else {
                            Alert.alert(`Jednostka jest niepoprawna lub nie jest obsługiwana.`,`Podaj jedną z: ${supportedUnits[measureType]}` );
                            this.setState({newUnit: unit});
                        }
                    }}
                /> : <View style={[styles.unitSpace, inputStyle]}/>}
                {<View>
                    {measures.map((measure) => {
                        sum+=parseFloat(measure[firstMeasure]);
                        return (
                            <View key={measures.indexOf(measure)} style={{flexDirection: 'row', justifyContent: 'center'}}>
                                {this.renderNumberBox(parseFloat(measure[firstMeasure]), parseFloat(measure[secondMeasure]))}
                                {withDelete ? this.renderDelete(measures.indexOf(measure)) : null}
                            </View>
                        )
                    })}
                    <Text style={[styles.mean, inputStyle]}>Średnia:</Text>
                    <Text style={[styles.mean, inputStyle]}>{parseFloat(mean.toPrecision(6))}</Text>

                    <Text style={[styles.mean, inputStyle]}>Stdev:</Text>
                    <Text style={[styles.mean, inputStyle]}>{parseFloat(stdev.toPrecision(2))}</Text>

                </View>}
            </View>

        );
    }
}

const styles = StyleSheet.create({
    textInput: {
        marginHorizontal: 20,
        marginVertical: 3,
        height: 30,
        width: 80,
        borderColor: 'black',
        borderWidth: 2,
        padding: 5,
        textAlign: 'right',
        backgroundColor: 'white',
        borderRadius: 3,
        fontSize: 16,
    },
    container: {
        flexDirection: 'column',
    },
    mean: {
        marginHorizontal: 20,
        marginVertical: 3,
        textAlign: 'left',
        fontSize: 16,
        width: 80,
    },
    removeButton: {
        backgroundColor: 'red',
        borderRadius: 30,
        width: 18,
        height: 18,
        alignSelf: 'center',
    },
    unitInput: {
        marginHorizontal: 20,
        marginBottom: 20,
        marginVertical: 3,
        height: 25,
        width: 80,
        borderColor: 'black',
        borderWidth: 1,
        padding: 5,
        textAlign: 'left',
        borderRadius: 3,
        fontSize: 16,
    },
    unitSpace: {
        marginHorizontal: 20,
        marginBottom: 20,
        marginVertical: 3,
        height: 25,
        width: 80,
        padding: 5,
    },
    unit: {
        marginHorizontal: 20,
        marginVertical: 3,
        textAlign: 'left',
        fontSize: 11,
        width: 80,
        textAlignVertical: 'bottom',
    },
});
