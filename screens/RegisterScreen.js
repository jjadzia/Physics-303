import React, { Component } from 'react';
import {StyleSheet, TextInput, View, Text, Button, TouchableOpacity, Alert, Platform } from 'react-native';
import firebase from "firebase";

export default class RegisterScreen extends Component {
    constructor(props) {
        super(props);
        this.state = { email: '', password: '' };
        this.onSubmitRegister=this.onSubmitRegister.bind(this);
        this.goToLogin=this.goToLogin.bind(this);

    }

    onSubmitRegister(){

        const { email, password } = this.state;
        if(this.validateEmail(email)) {
            if(!this.validatePassword(password)) {
                Alert.alert('Hasło musi mieć minum 6 znaków');
                return;
            }
                firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(()=> {
                    Alert.alert('Zarejestrowano użytkowinka')
                    const { navigation } = this.props;
                    navigation.navigate('InsertInfo');
                })
                .catch((err)=> {
                        Alert.alert('Wystąpił błąd poczas rejestracji. Sprawdź poprawność danych i spróbuj ponownie.')
                        console.log(err)
                    }
                )
        }
        else Alert.alert('Podano niepoprawny email')
    };

    validateEmail(email){
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
        return reg.test(email);
    }

    validatePassword(password){
        return password.length > 5;
    }

    goToLogin(){
        const { navigation } = this.props;

        navigation.navigate('Login');
    };

    render() {

        return (
            <View style={styles.container}>
                <Text style={styles.header}>Podaj e-mail i hasło:</Text>
                <TextInput
                    style={styles.textInput}
                    onChangeText={text => this.setState({ email: text })}
                    value={this.state.email}
                    placeholder={'e-mail'}
                    autoCapitalize={'none'}
                    textContentType={'emailAddress'}
                />
                <TextInput
                    style={styles.textInput}
                    onChangeText={text => this.setState({ password: text })}
                    value={this.state.password}
                    placeholder={'hasło'}
                    autoCapitalize={'none'}
                    textContentType={'password'}
                    secureTextEntry
                />
                <View style={styles.loginButton}>
                    <Button
                        onPress={this.onSubmitRegister}
                        title="ZAREJESTRUJ SIĘ!"
                        accessibilityLabel="Lea"
                    />
                </View>
                <TouchableOpacity onPress={this.goToLogin}>
                    <Text style={styles.signIn}>
                        {'Przejdź do logowania'}
                    </Text>
                </TouchableOpacity>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
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
    loginButton: {
        height: 40,
        marginTop: 40,
        paddingHorizontal: 20,
        backgroundColor: Platform.OS === 'ios' ? '#841584' : 'transparent',
        borderRadius: 10,
    },
    header: {
        fontSize: 22,
        marginBottom: 20,
    },
    signIn: {
        fontSize: 18,
        marginTop: 80,
        textAlign: 'center'
    },
});
