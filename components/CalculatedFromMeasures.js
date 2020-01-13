import React, { Component } from 'react';
import {StyleSheet, TextInput, View, Text, Button, TouchableOpacity, Alert, ActivityIndicator} from 'react-native';
import firebase from "firebase";
import {parse} from "react-native-svg";
import PropTypes from "prop-types";

const supportedUnits = {
    mass: ['kg', 'g', 'mg'],
    length: ['cm', 'nm', 'mm', 'm'],
    time: ['s', 'min', 'h'],
    none: [''],
    force: ['N', 'kN'],
    viscosity: ['Pa*s'],
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

    static propTypes = {
        dataLocation: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        measureType: PropTypes.oneOf(['mass', 'length', 'time', 'none', 'force', 'viscosity']).isRequired,
        withDelete: PropTypes.bool,
        inputStyle: PropTypes.object,
        showStatistics: PropTypes.bool,
        getStatistics: PropTypes.func,
        setValuesFunction: PropTypes.func,
    };

    static defaultProps = {
        withDelete: false,
        inputStyle: {},
        showStatistics: false,
        getStatistics: ()=>null,
        setValuesFunction: ()=>null,
    };

    componentDidMount(){

        const { dataLocation, measureType, setValuesFunction, showStatistics } =this.props;
        let measurements = firebase.database().ref(dataLocation);


        const mes=[];
        const keys=[];

        if(!this.state.fetched) measurements.on('value', snapshot => {
            mes.length = 0;
            keys.length = 0;
             console.log("fetching measures");
            if (snapshot.val() != null) {
                Object.keys(snapshot.val()).map((key) => {
                    mes.push(snapshot.val()[key]);
                    keys.push(key)
                })
            }
            this.setState(
                {fetched: true, measures: mes, keys: keys},
                () => {
                    setValuesFunction(this.getCalculatedArray());
                    this.getStats();
                }
            )
        });
        this.setState({unit: supportedUnits[measureType][0], newUnit: supportedUnits[measureType][0]});
        this.getStats = this.getStats.bind(this);
    }

    renderNumberBox(firstNumber, secondNumber, thirdNumber){

        const { inputStyle, calculateFunction } = this.props;

        console.log("args",firstNumber, secondNumber, thirdNumber)

        const calculatedNumber = calculateFunction(firstNumber, secondNumber, thirdNumber)/this.getUnitFactor();
        const numberToShow = isNaN(calculatedNumber) ? ' - ' : calculatedNumber.toPrecision(4).toString();

        return (
            <TextInput
                style={[styles.textInput, inputStyle]}
                editable={false}
                value={numberToShow}
            />
        )
    }

    getCalculatedArray(){
        const { measures, fetched } = this.state;
        const { firstMeasure, secondMeasure, thirdMeasure, calculateFunction, setValuesFunction } = this.props;
        const calculatedValues = [];
        if(fetched && setValuesFunction ) {
            const thirdArgument = thirdMeasure || secondMeasure;
            measures.map((measure) => {
                if(measure[firstMeasure] && measure[secondMeasure] && measure[thirdArgument])calculatedValues.push(calculateFunction(parseFloat(measure[firstMeasure]), parseFloat(measure[secondMeasure]), parseFloat(measure[thirdArgument]) ))
            })
        }
        return calculatedValues;

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
        if (measureType == "viscosity") return 1;
        if (measureType == "force") {
            switch (unit){
                case 'N': return 1.0;
                case 'kN': return 1e3;
                default: return -1;
            }
        }
    else return -1;
    }

    getStats(){
        const { getStatistics } = this.props;
        const { measures } = this.state;

        const stats = this.getMeanAndStdev();
        if(measures.length > 1) getStatistics([stats[0]*this.getUnitFactor(), stats[1]*this.getUnitFactor()] );
    }

    getMeanAndStdev(){
        const { measures} = this.state;
        const { firstMeasure, secondMeasure, thirdMeasure, calculateFunction } =this.props;
        let sum = 0;
        measures.map((measure) => {
            sum+=calculateFunction(parseFloat(measure[firstMeasure]), parseFloat(measure[secondMeasure]), parseFloat(measure[thirdMeasure]))/this.getUnitFactor();
        });
        const mean=sum/measures.length;

        sum=0;
        this.state.fetched && measures.map((measure) => {
            sum+=Math.pow(calculateFunction(parseFloat(measure[firstMeasure]), parseFloat(measure[secondMeasure]), parseFloat(measure[thirdMeasure]))-mean,2);
        });
        const variance = measures.length>1 ? sum/measures.length/(measures.length-1) : 0;
        const stdev = Math.sqrt(variance);

        return [mean, stdev];
    }

    render() {

        const { measures, unit, newUnit } = this.state;
        const { firstMeasure, secondMeasure, thirdMeasure, withDelete, inputStyle, measureType, name, showStatistics, calculateFunction } =this.props;
        const statistics = this.getMeanAndStdev();

        const mean = statistics[0];
        const stdev = statistics[1];

        let sum =0;

        const shouldShowStatistics = showStatistics && !!mean;

        if(!this.state.fetched) return (<ActivityIndicator style={{ flex: 1, justifyContent: 'center'}}size={"large"}></ActivityIndicator>)

        return (
            <View style={styles.container}>
                <View style={{height: 100}}>
                <Text style={[styles.mean, inputStyle]}>{name}</Text>
                <Text style={[styles.unit, inputStyle, {fontSize: 10, height: 15}]}>{unit ? "Jednostka:" : "Bez jednostki"}</Text>
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
                </View>
                {<View>
                    {measures.map((measure) => {
                        sum+=parseFloat(measure[firstMeasure]);
                        return (
                            <View key={measures.indexOf(measure)} style={{flexDirection: 'row'}}>
                                {this.renderNumberBox(parseFloat(measure[firstMeasure]), parseFloat(measure[secondMeasure]), parseFloat(measure[thirdMeasure]))}
                                {withDelete ? this.renderDelete(measures.indexOf(measure)) : null}
                            </View>
                        )
                    })}
                    { shouldShowStatistics &&  <View style={{flexDirection: 'column'}}>
                        <TouchableOpacity onPress={()=>{
                            Alert.alert("Średnia obliczona zgodnie z estymatorem średniej, niepewność typu A - obliczona korzystając z estymatora odchylenia standardowego średniej", "Więcej informacji znajdziesz w zakładce przygotowanie, w karcie statystyka danych pomiarowych")
                        }}>
                        <Text style={[styles.mean, inputStyle]}>Średnia:</Text>
                        <Text style={[styles.mean, inputStyle]}>{parseFloat(mean.toPrecision(6))}</Text>

                        <Text style={[styles.mean, inputStyle]}>Niepewność:</Text>
                        <Text style={[styles.mean, inputStyle]}>{parseFloat(stdev.toPrecision(2))}</Text>
                        </TouchableOpacity>
                    </View>}
                </View>}
            </View>

        );
    }
}

const styles = StyleSheet.create({
    textInput: {
        marginVertical: 3,
        height: 30,
        width: 80,
        borderColor: 'black',
        borderWidth: 2,
        margin: 5,
        textAlign: 'right',
        backgroundColor: 'white',
        borderRadius: 3,
        fontSize: 16,
        padding: 5,
    },
    container: {
        flexDirection: 'column',
    },
    mean: {
        marginHorizontal: 5,
        marginVertical: 3,
        textAlign: 'left',
        fontSize: 13,
        width: 80,
    },
    removeButton: {
        backgroundColor: 'red',
        borderRadius: 30,
        width: 18,
        height: 18,
        alignSelf: 'center',
        marginLeft: 15,
    },
    unitInput: {
        marginHorizontal: 5,
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
        fontSize: 12,
        width: 80,
        textAlignVertical: 'bottom',
    },
});
