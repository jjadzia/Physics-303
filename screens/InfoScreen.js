import React, { Component } from 'react';
import {View, Text, StyleSheet, Button, Alert, ActivityIndicator, TouchableOpacity} from 'react-native';
import { Linking } from 'react-native'
import firebase from "firebase";
import * as MailComposer from 'expo-mail-composer';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    paddingHorizontal: 20,
      backgroundColor: '#e6e6ff',
      flex: 1,
  },
    studentContainer: {
      flexDirection: 'column',
      paddingHorizontal: 20,
      justifyContent: 'space-between',
      marginVertical: 30,
    },
  textboxItem: {
    fontSize: 16,
    paddingVertical: 10,
  },
  textboxValue: {
    fontSize: 15,
    paddingVertical: 10,
      paddingLeft: 20,
    fontWeight: 'bold',

  },
});

const studentInformation ={
  'name': {
    key: 1,
    name: "Imię",
    value: 'cat',
  },
  'surname': {
    key: 1,
    name: "Nazwisko",
    value: 'cat',
  },
  'index_no': {
    key: 1,
    name: "Nr. indeksu",
    value: 'cat',
  },
  'department': {
    key: 1,
    name: "Wydział i kierunek",
    value: 'cat',
  }
};

const teacherInformation ={
  'name': {
    key: 1,
    name: "Prowadzący",
    value: 'dog',
  },
  'consultation': {
    key: 1,
    name: "Konsultacje",
    value: 'dog',
  },
  'room': {
    key: 1,
    name: "Pokój",
    value: 'dog',
  },
  'email': {
    key: 1,
    name: "Adres e-mail",
    value: 'dog',
  }
};

export default class InfoScreen extends Component {

  constructor(props){
    super(props);
    this.state = {
      teacherInfo: null,
      fetched: false,
    }
  }

  componentDidMount(){

    let teacherInfo;
    let teacherLabel;
    let name;
    let surname;
    let indexNo;

    firebase.database().ref(`users/${firebase.auth().currentUser.uid}`)
        .once('value', snapshot => {
            teacherLabel = snapshot.val().teacher;
            name = snapshot.val().name;
          surname = snapshot.val().surname;
          indexNo = snapshot.val().indexNo;
        }).then(()=>{
      firebase.database().ref(`teachers`)
          .once('value', object => {
            teacherInfo = object.val()[teacherLabel];
          }).then(()=>{
            this.setState({teacherInfo,name, surname, indexNo, fetched: true});
      })
    })
      this.logout=this.logout.bind(this);
  }


  renderStudentInformation() {
    const {name, surname, indexNo} = this.state;

    return (
        <View style={styles.studentContainer}>
            <Text style={{fontSize: 20, textAlign: 'center', marginBottom: 20}}>Twoje dane</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.textboxItem}>Imię i nazwisko: </Text>
            <Text style={styles.textboxValue}>{name} {surname}</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.textboxItem}>Nr indeksu: </Text>
            <Text style={styles.textboxValue}>{indexNo}</Text>
          </View>
        </View>
    )
  }


  renderTeacherInformation() {
    const {teacherInfo} = this.state;

    return (
        <View style={styles.studentContainer}>
            <Text style={{fontSize: 20, textAlign: 'center', marginBottom: 20 }}>Informację o prowadzącym</Text>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.textboxItem}>Imię i nazwisko: </Text>
            <Text style={styles.textboxValue}>{teacherInfo.name + ' ' +teacherInfo.surname}</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.textboxItem}>Konsultacje: </Text>
            <Text style={styles.textboxValue}>{teacherInfo.consultation}</Text>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.textboxItem}>Pokoj: </Text>
            <Text style={styles.textboxValue}>{teacherInfo.room} (bud. D10)</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.textboxItem}>Email:</Text>
              <TouchableOpacity
                  onPress={() =>{Linking.openURL(`mailto:${teacherInfo.email}?subject=SendMail&body=Description`)}}
                  style={styles.textboxValue}
              >
                <Text>
                    {teacherInfo.email}
                </Text>
              </TouchableOpacity>
          </View>
        </View>
    )
  }

  logout() {
      const { navigation } = this.props;
    firebase.auth().signOut()
        .then(() => {
          Alert.alert('Wylogowano')
          navigation.navigate('AuthLoading');
        })
        .catch((err) => {
              Alert.alert('Wystąpił błąd poczas wylogowania. Spróbuj ponownie.');
              console.log(err);
            }
        )
  }

  renderLogout() {

    return (
        <View style={{alignItems: 'center', marginTop: 40}}>
          <Button
              onPress={() => this.logout()}
              title={"Wyloguj"}
              style={styles.textboxValue}
          />
        </View>
    )
  }


  render() {

    if(!this.state.fetched) return (
        <View style={styles.container}>
            <ActivityIndicator style={{ flex: 1, justifyContent: 'center'}}size={"large"}></ActivityIndicator>
        </View>
    )

    return (
        <View style={styles.container}>
          {this.renderStudentInformation()}
          {this.renderTeacherInformation()}
          {this.renderLogout()}

        </View>

    )
  }
}

InfoScreen.navigationOptions = {
  title: "Twoje informacje",
};
