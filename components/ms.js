import React, { Component } from 'react';
import {StyleSheet, TextInput, View, Text, Button, TouchableOpacity, Alert} from 'react-native';
import firebase from "firebase";

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
        };
    };


    componentDidMount(){

        let measurements = firebase.database().ref('/diffraction/user1/measurements');

        const mes=[];
        const keys=[];

        if(!this.state.fetched) measurements.on('value', snapshot => {
            mes.length = 0;
            keys.length = 0;
            console.log("fetching", snapshot.val());
            Object.keys(snapshot.val()).map((key)=>{
                mes.push(snapshot.val()[key]);
                keys.push(key)
                this.setState({fetched: true, measures: mes, keys: keys });
            })});
    }

    renderNumberBox(number, key){
        let numberToShow= number && this.state.editedField !== key ? number.toString() : null;
        console.log(this.state.tmpNumber);
        return (
            <TextInput
                key={key}
                style={styles.textInput}
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
                    firebase.database().ref('/diffraction/user1/measurements/'+this.state.keys[key]+'/x').set(this.state.tmpNumber).catch((err)=>console.log(err));
                    firebase.database().ref('/diffraction/user1/measurements/'+this.state.keys[key]+'/i').set(this.state.tmpNumber).catch((err)=>console.log(err));

                    this.setState({tmpNumber: null, editedField: null});
                    this.props.onChangeNumber;
                }}
            />
        )
    }

    renderNumberInput(){
        return (
            <TextInput
                style={styles.textInput}
                onChangeText={text => this.setState({ number: text })}
                value={this.state.number}
                placeholder={'0.00'}
                autoCapitalize={'none'}
                keyboardType={'decimal-pad'}
                onEndEditing={()=>{
                    this.props.onSubmitNumber;
                    firebase.database().ref('/diffraction/user1/measurements/').push({key: this.state.measures.length, x: this.state.number}).catch((err)=>console.log(err));
                    this.setState({number: null});
                }}
            />
        )
    }


    ble() {
        let measurements = firebase.database().ref('/diffraction/user1');
        measurements.once('value').then(snapshot => {
            console.log(snapshot.val());
            return snapshot.val().map((i)=>console.log("hej",i.name));
        })
    }

    render() {

        const { measures } = this.state;

        console.log(this.state.keys);
        return (
            <View style={styles.container}>
                <View>
                    {this.state.fetched && measures.map((measure) => {return this.renderNumberBox(measure.x, measure.key)})}
                    {this.state.fetched && this.renderNumberInput()}
                </View>
                <View>
                    {this.state.fetched && measures.map((measure) => {return this.renderNumberBox(measure.i, measure.key)})}
                    {this.state.fetched && this.renderNumberInput()}
                </View>
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
        flexDirection: 'row',
    }
});