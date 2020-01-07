import React, { Component } from 'react';
import {StyleSheet, TextInput, View, Text, Button, TouchableOpacity, Alert, ActivityIndicator} from 'react-native';
import firebase from "firebase";

const supportedUnits = {
    mass: ['kg', 'g', 'mg'],
    length: ['cm', 'nm', 'mm', 'm'],
    time: ['s', 'min', 'h'],
    none: [''],
};

export default class SingleMeasure extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            scale: '',
            editedField: null,
            fetched: false,
            measure: '',
            unit: '',
            newUnit: '',
        };
    };

    componentDidMount(){

        const { dataLocation, measureType } =this.props;
        let measurement = firebase.database().ref(dataLocation);

        let mes={};

        if(!this.state.fetched) measurement.on('value', snapshot => {
            mes = snapshot.val();
            if(mes) this.setState({ measure: mes, value: mes.value, scale: mes.scale });
            this.setState({ fetched: true });
        });
        this.setState({unit: supportedUnits[measureType][0], newUnit: supportedUnits[measureType][0]});

    }


    renderNumber(){
        const { dataLocation, measureLabel } =this.props;
        const { measure, value } =this.state;

        const numberToRender = measure ? (parseFloat(measure.value) / this.getUnitFactor()).toString() : null;

        return (
            <View>
                <Text style={styles.label}>{measureLabel}:</Text>
                <TextInput
                    style={styles.textInput}
                    onChangeText={text => {
                        this.setState({value: text});
                    }}
                    value={numberToRender}
                    placeholder={'0.00'}
                    autoCapitalize={'none'}
                    keyboardType={'decimal-pad'}
                    onEndEditing={()=>{
                        firebase.database().ref(dataLocation).update({"value": parseFloat(value) * this.getUnitFactor()}).catch((err)=>console.log(err));
                    }}
                />
            </View>
        )
    }

    renderScale(){
        const { dataLocation, measureName } =this.props;
        const { measure, scale } =this.state;

        const numberToRender = measure ? (parseFloat(measure.scale) / this.getUnitFactor()).toString() : null;

        return (
            <View>
                <Text style={styles.label}>Podziałka:</Text>
                <TextInput
                    style={styles.textInput}
                    onChangeText={text => this.setState({ scale: text })}
                    value={numberToRender}
                    placeholder={'0.00'}
                    autoCapitalize={'none'}
                    keyboardType={'decimal-pad'}
                    onEndEditing={()=>{
                        this.props.onSubmitNumber;
                        firebase.database().ref(dataLocation).update({"scale": parseFloat(scale) * this.getUnitFactor()}).catch((err)=>console.log(err));
                    }}
                />
            </View>
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

        const { unit, newUnit } = this.state;
        const { inputStyle, measureType } =this.props;

        if(!this.state.fetched) return (
            <ActivityIndicator style={{ flex: 1, justifyContent: 'center'}} size={"large"}/>
            );

        return (
            <View style={styles.container}>

                    {this.renderNumber()}
                    {this.renderScale()}
                    <View style={{flexDirection: 'column'}}>
                        <Text style={styles.label}>Jednostka:</Text>
                        <TextInput
                            style={[styles.unitInput, inputStyle]}
                            onChangeText={text => this.setState({newUnit: text})}
                            value={newUnit}
                            autoCapitalize={'none'}
                            onEndEditing={() => {
                                if (supportedUnits[measureType].includes(newUnit)) this.setState({unit: newUnit});
                                else {
                                    Alert.alert(`Jednostka jest niepoprawna lub nie jest obsługiwana.`, `Podaj jedną z: ${supportedUnits[measureType]}`);
                                    this.setState({newUnit: unit});
                                }
                            }}/>
                    </View>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    textInput: {
        marginHorizontal: 10,
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
        flexDirection: 'row',
    },
    label: {
        marginHorizontal: 10,
        marginVertical: 3,
        textAlign: 'left',
        fontSize: 16,
        width: 100,
    },
    unitInput: {
        marginHorizontal: 10,
        marginVertical: 3,
        height: 25,
        width: 40,
        borderColor: 'black',
        borderWidth: 1,
        padding: 5,
        textAlign: 'left',
        borderRadius: 3,
        fontSize: 16,
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
