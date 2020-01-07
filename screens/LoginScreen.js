import React, { Component } from 'react';
import {StyleSheet, TextInput, View, Text, Button, TouchableOpacity, Alert} from 'react-native';
import firebase from "firebase";

export default class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = { email: '', password: '' };

        this.onSubmitLogin=this.onSubmitLogin.bind(this);

    }

    onSubmitLogin(){
        const { email, password } = this.state;
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then(()=> {
                    Alert.alert('Zalogowano pomyślnie');
                    //TO-DO add handling logging in
                })
                .catch((err)=> {
                        Alert.alert('Wystąpił błąd poczas rejestracji. Sprawdź poprawność danych i spróbuj ponownie.');
                        console.log(err);
                    }
                )
        }

    goToRegistration(){
        //TO-DO add navigating to register
        return null;
    };

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.header}>Zaloguj się:
                </Text>
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
                        onPress={this.onSubmitLogin}
                        title="ZALOGUJ"
                        color="white"
                        accessibilityLabel="Lea"
                    />
                </View>
                <TouchableOpacity onPress={this.goToRegistration}>
                    <Text style={styles.register}>
                        {'Nie masz jeszcze konta?\nPrzejdź do rejestracji!'}
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
        backgroundColor: '#841584',
        borderRadius: 10,
    },
    header: {
        fontSize: 22,
        marginBottom: 20,
    },
    register: {
        fontSize: 18,
        marginTop: 80,
        textAlign: 'center'
    },
});
