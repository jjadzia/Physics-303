import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  Button,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { MonoText } from '../components/StyledText';
import firebase from "firebase";
import computerQuestions from "../components/react-native-quiz/App/data/computers";

export default function LearnScreen(props) {
  console.log(firebase.auth().currentUser);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>

        <Text style={styles.header}>
          {`Znajdź ćwiczenie, które będziesz wykonywać na zajęciach, przeczytaj skrypt, zawierający opis teoretyczny, oraz opis zwierający instrukcje wykonania ćwiczenia.\n\nMożesz sprawdzić swoja wiedze w quizie!`}
        </Text>
        {renderStatsBox()}
        {exercises.map((exercise)=> {return renderExerciseBox(exercise, props)})}
      </ScrollView>

    </View>
  );
}

LearnScreen.navigationOptions = {
  title: "Przygotuj się do zajęć",
};


function renderExerciseBox(exercise, props) {
  const { navigation } = props;
  return (
      <View key={exercise.name} style={styles.exerciseContainer}>
        <Text style={styles.exerciseHeader}>{exercise.name}</Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={()=>openLink(exercise.scriptURL)} style={styles.button}>
            <Text style={styles.buttonText}>
              SKRYPT
            </Text>
          </TouchableOpacity>
            <TouchableOpacity onPress={()=>openLink(exercise.exerciseURL)} style={styles.button}>
              <Text style={styles.buttonText}>
                OPIS
              </Text>
            </TouchableOpacity>
          <TouchableOpacity onPress={()=>navigation.navigate("Quiz", {
            title: "Computers",
            questions: computerQuestions,
            color: "#49475B"
          })} style={styles.button}>
            <Text style={styles.buttonText}>
              QUIZ
            </Text>
          </TouchableOpacity>
        </View>
      </View>

  );
}

function renderStatsBox() {

  return (
      <View style={styles.exerciseContainer}>
        <View style={styles.buttonsContainer}>
          <Text style={[styles.exerciseHeader, {width: 200}]}>Statystyka danych pomiarowych</Text>
          <TouchableOpacity onPress={()=>openLink('http://www.fis.agh.edu.pl/~pracownia_fizyczna/pomoce/OpracowanieDanychPomiarowych.pdf')} style={styles.button}>
            <Text style={styles.buttonText}>
              SKRYPT
            </Text>
          </TouchableOpacity>
        </View>
      </View>

  );
}

function openLink(link) {
  WebBrowser.openBrowserAsync(link);
}

const exercises = [{
    name: "71. Dyfrakcja na szczelinie pojedynczej i podwójnej",
    scriptURL: 'http://www.fis.agh.edu.pl/~pracownia_fizyczna/cwiczenia/71_opis.pdf',
    exerciseURL: 'http://www.fis.agh.edu.pl/~pracownia_fizyczna/cwiczenia/71_wykon.pdf',
    quizName: "difraction",
  }, {
    name: "11. Moduł Younga",
    scriptURL: 'http://www.fis.agh.edu.pl/~pracownia_fizyczna/cwiczenia/11_opis.pdf',
    exerciseURL: 'http://www.fis.agh.edu.pl/~pracownia_fizyczna/cwiczenia/11_wykon.pdf',
    quizName: "",
  }
]

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6e6ff',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 10,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#e6e6ff',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  exerciseContainer: {
    backgroundColor: '#ffeecc',
    borderColor: '#190033',
    borderWidth: 2,
    borderRadius: 15,
    padding: 20,
    marginVertical: 20,
  },
  buttonsContainer: {
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  button: {
    height: 30,
    marginTop: 20,
    paddingHorizontal: 10,
    backgroundColor: '#400080',
    borderRadius: 10,
    justifyContent: 'center',
  },
  exerciseHeader: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonText: {
    fontSize: 14,
    color: 'white',
    letterSpacing: 0.5,
  },
  header: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
    lineHeight: 25,
  },
});
