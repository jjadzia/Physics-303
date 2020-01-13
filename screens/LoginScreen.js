import React, { Component } from 'react';
import {StyleSheet, TextInput, View, Text, Button, TouchableOpacity, Alert, Platform} from 'react-native';
import firebase from "firebase";

export default class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = { email: '', password: '' };

        this.onSubmitLogin=this.onSubmitLogin.bind(this);
        this.goToRegistration=this.goToRegistration.bind(this);
    }

    onSubmitLogin(){
        const { email, password } = this.state;
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then(()=> {
                    Alert.alert('Zalogowano pomyślnie');
                    const { navigation } = this.props;
                    navigation.navigate('Main');
                })
                .catch((err)=> {
                        Alert.alert('Wystąpił błąd poczas logowania. Sprawdź poprawność danych i spróbuj ponownie.');
                        console.log(err);
                    }
                )
        }

    goToRegistration(){
        const { navigation } = this.props;

        navigation.navigate('Register');
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
    register: {
        fontSize: 18,
        marginTop: 80,
        textAlign: 'center'
    },
});
