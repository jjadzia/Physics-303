import React, { Component } from 'react';
import {StyleSheet, TextInput, View, Text, Button, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import firebase from "firebase";
import PropTypes from 'prop-types';

const supportedUnits = {
    mass: ['kg', 'g', 'mg'],
    length: ['cm', 'nm', 'mm', 'm'],
    time: ['s', 'min', 'h'],
    time2: ['s^2'],
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


    static propTypes = {
        dataLocation: PropTypes.string.isRequired,
        measureName: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        measureType: PropTypes.oneOf(['mass', 'length', 'time', 'none']).isRequired,
        withDelete: PropTypes.bool,
        inputStyle: PropTypes.object,
        showStatistics: PropTypes.bool,
        getStatistics: PropTypes.func,
    };

    static defaultProps = {
        withDelete: false,
        inputStyle: {},
        showStatistics: false,
        getStatistics: ()=>null,
    };

    componentDidMount(){

        const { dataLocation, measureType, showStatistics } =this.props;
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
                this.setState(
                    {fetched: true, measures: mes, keys: keys },
                    ()=>{
                        if(showStatistics) {
                            this.getStats();
                        }
                        this.getValuesArray();
                    });
            }
            else this.setState({fetched: true });
        });
        this.setState({unit: supportedUnits[measureType][0], newUnit: supportedUnits[measureType][0]});

        this.getValuesArray=this.getValuesArray.bind(this);
        this.getMeanAndStdev=this.getMeanAndStdev.bind(this);

    }

    renderNumberBox(number, key){

        const { dataLocation, measureName, inputStyle } =this.props;
        const path = `${dataLocation}`+'/'+this.state.keys[key]+'/'+`${measureName}`;
        const numberInUnit = parseFloat(number)/this.getUnitFactor();
        let numberToShow= numberInUnit && this.state.editedField !== key ? numberInUnit.toString() : null;
        return (
            <TextInput
                style={[styles.textInput, inputStyle]}
                onFocus={() => {
                    this.setState({tmpNumber: numberToShow, editedField: key});
                    numberToShow=null;
                }}
                onChangeText={text => {
                    this.setState({tmpNumber: text});
                }}
                value={numberToShow || this.state.tmpNumber}
                autoCapitalize={'none'}
                keyboardType={'decimal-pad'}
                onEndEditing={()=>{
                    const numberInDefaultUnit = parseFloat(this.state.tmpNumber) * this.getUnitFactor();
                    if(numberInDefaultUnit) firebase.database().ref(path).set(numberInDefaultUnit).catch((err)=>console.log(err));
                    //firebase.database().ref('/diffraction/user1/measurements/'+this.state.keys[key]+'/i').set(this.state.tmpNumber).catch((err)=>console.log(err));

                    this.setState({tmpNumber: null, editedField: null});
                    this.props.onChangeNumber;
                }}
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

    renderNumberInput(){
        const { dataLocation, measureName, inputStyle, withDelete } = this.props;

        const { number, unit } = this.state;
        let newMeasure = Object.assign({}, {});

        return (
            <TextInput
                style={[styles.textInput, inputStyle, {alignSelf: withDelete ? 'flex-start' : 'center'}]}
                onChangeText={text => this.setState({ number: text })}
                value={this.state.number}
                placeholder={'0.00'}
                autoCapitalize={'none'}
                keyboardType={'decimal-pad'}
                onEndEditing={()=>{
                    this.props.onSubmitNumber;
                    newMeasure['key']=this.state.measures.length;
                    newMeasure[measureName]=parseFloat(number) * this.getUnitFactor();
                    if(this.state.number)firebase.database().ref(dataLocation).push(newMeasure).catch((err)=>console.log(err));
                    this.setState({number: null});
                }}
            />
        )
    }


    getValuesArray(){
        const { measures } = this.state;
        const { measureName, setValuesFunction } = this.props;

        console.log("fakens");
        if(!!setValuesFunction) {

            const calculatedValues = [];
            {measures.map((measure) => {
                if(measure[measureName]) calculatedValues.push(measure[measureName]);
            })}
            setValuesFunction(calculatedValues);
        }
    }

    getStats(){
        const { getStatistics, measures } = this.props;

        console.log('robie mes', this.getMeanAndStdev());
        if(measures.length > 1) getStatistics( this.getMeanAndStdev());
    }

    getMeanAndStdev(){
        const { measures} = this.state;
        const { measureName } =this.props;

        let sum = 0;
        this.state.fetched && measures.map((measure) => {
            sum+=parseFloat(measure[measureName]);
        });
        const mean = sum/measures.length / this.getUnitFactor();
        sum=0;
        this.state.fetched && measures.map((measure) => {
            sum+=Math.pow((parseFloat(measure[measureName])) / this.getUnitFactor()-mean,2);
        });
        const variance = sum/measures.length/(measures.length-1);
        const stdev = Math.sqrt(variance);
        return [mean, stdev];
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
        if (measureType == "time2") return 1.0;
        if (measureType == "none") return 1;
        else return -1;
    }

    render() {


        const { measures, unit, newUnit } = this.state;
        const { measureName, withDelete, inputStyle, measureType, name, showStatistics } =this.props;

        const statistics = this.getMeanAndStdev();

        const mean = statistics[0];
        const stdev = statistics[1];

        let sum = 0;

        if(!this.state.fetched) return (<ActivityIndicator style={{ flex: 1, justifyContent: 'center'}}size={"large"}></ActivityIndicator>)

        return (
                <View style={styles.container}>
                    <View style={{height: 100}}>
                    <Text style={[styles.mean, inputStyle]}>{name}</Text>
                    <Text style={[styles.unit, inputStyle, {fontSize: 10, height: 15}]}>{unit ? "Jednostka:" : "Bez jednostki"}</Text>
                    { unit ? <TextInput
                        style={[styles.unitInput, inputStyle]}
                        onChangeText={text => this.setState({ newUnit: text })}
                        value={this.state.newUnit}
                        autoCapitalize={'none'}
                        onEndEditing={()=>{
                            if(supportedUnits[measureType].includes(newUnit)) {
                                this.setState({unit: newUnit});
                            }
                            else {
                                Alert.alert(`Jednostka jest niepoprawna lub nie jest obsługiwana.`,`Podaj jedną z: ${supportedUnits[measureType]}` );
                                this.setState({newUnit: unit});
                            }
                        }}
                    /> : <View style={[styles.unitSpace, inputStyle]}/>}
                    </View>
                    {measures.map((measure) => {
                            sum+=parseFloat(measure[measureName]);
                            return (
                                <View key={measures.indexOf(measure)} style={{flexDirection: 'row', justifyContent: 'center'}}>
                                    {this.renderNumberBox(measure[measureName], measures.indexOf(measure))}
                                    {withDelete ? this.renderDelete(measures.indexOf(measure)) : null}
                                </View>
                            )
                        })}
                        {this.state.fetched && this.renderNumberInput()}

                    { showStatistics && <View style={{flexDirection: 'column'}}>
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
        marginHorizontal: 5,
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
        marginHorizontal:5,
        marginBottom: 20,
        marginVertical: 3,
        height: 25,
        width: 80,
        padding: 5,
    },
    unit: {
        marginHorizontal: 5,
        marginVertical: 3,
        textAlign: 'left',
        fontSize: 12,
        width: 80,
        textAlignVertical: 'bottom',
    },
});
