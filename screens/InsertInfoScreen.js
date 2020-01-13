import React, { Component } from 'react';
import {StyleSheet, TextInput, View, Text, Button, TouchableOpacity, Alert, Picker} from 'react-native';
import firebase from "firebase";


const inputsToRender = [{
        header: 'Imię',
        type: 'name'
    }, {header: 'Nazwisko',
        type: 'surname'
    }, {header: 'Nr indeksu',
        type: 'indexNo'
    }, {header: 'Prowadzący',
        type: 'teacher'
    },
]

export default class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            surname: '',
            indexNo: '',
            teacher: '1',
            teachers: []
        };

        this.onSubmit=this.onSubmit.bind(this);

    }

    componentDidMount(){

        const teachers = [];
        firebase.database().ref('teachers')
            .once('value', snapshot => {
                Object.keys(snapshot.val()).map((key)=> {
                    const teacherLabel = `${snapshot.val()[key].name} ${snapshot.val()[key].surname}`;
                    teachers.push({key, teacherLabel})
                })
            }).then(()=>
            this.setState({teachers: teachers}));
    }

    onSubmit(){
        const {
            name,
            surname,
            indexNo,
            teacher
        } = this.state;
        const { navigation } = this.props;

        if(name && surname && indexNo && teacher) {
            firebase.database().ref(`users/${firebase.auth().currentUser.uid}/name`).set(this.state.name).catch((err)=>console.log(err));
            firebase.database().ref(`users/${firebase.auth().currentUser.uid}/surname`).set(this.state.surname).catch((err)=>console.log(err));
            firebase.database().ref(`users/${firebase.auth().currentUser.uid}/indexNo`).set(this.state.indexNo).catch((err)=>console.log(err));
            firebase.database().ref(`users/${firebase.auth().currentUser.uid}/teacher`).set(this.state.teacher).catch((err)=>console.log(err));
            navigation.navigate('Main');
        }
        else {
            Alert.alert("Uzupełnij wszytskie dane!")
        }
    };


    renderInputField(fieldName){

        const {teachers} = this.state;

        const inputType = fieldName.type;
        let newState = Object.assign({}, this.state);

        return (
            <View key={inputType} style={[styles.inputField, {marginTop: inputType === 'teacher' ? 50 : 0 }]}>
                <Text styles={styles.inputHeader}>
                    {fieldName.header}:
                </Text>
                {inputType === 'teacher' ?
                    <Picker
                        selectedValue={this.state.teacher}
                        style={styles.picker}
                        onValueChange={(itemValue, itemPosition) =>
                            this.setState({teacher: itemValue})
                        }
                    >
                        {teachers.map((i) => {return <Picker.Item key={i.key} style={{fontSize: 10}}value={i.key.toString()} label={i.teacherLabel}/>})}
                    </Picker>
                    :
                    <TextInput
                    style={styles.textInput}
                    onChangeText={text => {
                        newState[inputType]=text;
                        this.setState(newState)
                    }}
                    value={this.state[inputType]}
                    textContentType={'name'}
                    keyboardType={inputType === 'indexNo' ? 'numeric' : 'default'}
                />
                }
            </View>
        );
    }

    render() {

        return (
            <View style={styles.container}>
                <Text style={styles.header}>Uzupełnij poniższe dane, aby kontynuuowac</Text>
                {inputsToRender.map((field)=>this.renderInputField(field))}
                <View style={{flex: 1, justifyContent: 'flex-end', marginBottom: 20, zIndex: 2}}>
                    <TouchableOpacity
                        onPress={this.onSubmit}
                        style={styles.submitButton}
                    >
                        <Text style={{fontSize: 16}}>POTWIERDŹ</Text>
                    </TouchableOpacity>
                </View>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        paddingHorizontal: 20,
        alignItems: 'center',
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: '#e6e6ff',
    },
    textInput: {
        height: 40,
        width: 300,
        margin: 10,
        paddingHorizontal: 20,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
    },
    submitButton: {
        height: 40,
        margin: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        backgroundColor: 'purple',
        justifyContent: 'center',

    },
    picker: {
        height: 150,
        width: 200,
        marginHorizontal: 10,
        paddingHorizontal: 20,
    },
    inputField: {
        flexDirection: 'column',
        justifyContent: 'space-around',
    },
    inputHeader: {
        fontSize: 18,
        textAlign: 'left',
    },
    loginButton: {
        height: 40,
        marginTop: 40,
        paddingHorizontal: 20,
        backgroundColor: '#841584',
        borderRadius: 10,
    },
    header: {
        fontSize: 22,
        marginBottom: 20,
        textAlign: 'center',
    },
    register: {
        fontSize: 18,
        marginTop: 80,
        textAlign: 'center'
    },
});
