import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';
import firebase from "firebase";


export default class AuthLoadingScreen extends React.Component {
    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            let userInfoSet = false;
            if (user) {
                firebase.database().ref(`users/${firebase.auth().currentUser.uid}`)
                    .once('value', snapshot => {
                        if(snapshot.val()) {
                            userInfoSet = snapshot.val().teacher &&
                                snapshot.val().name &&
                                snapshot.val().surname &&
                                snapshot.val().indexNo;
                        }
                    }).then(()=>{
                        if (!userInfoSet) {
                            this.props.navigation.navigate('InsertInfo');
                            return;
                        } else {
                            this.props.navigation.navigate('Main');
                            return;
                        }
                    })
            } else {
                this.props.navigation.navigate('Auth');
                return;
            }
        })    }

    render() {
        return (
            <View>
                <ActivityIndicator />
                <StatusBar barStyle="default" />
            </View>
        );
    }
}
