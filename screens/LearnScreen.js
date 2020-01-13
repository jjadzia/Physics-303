import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import young from "../components/quiz/data/young";
import stats from "../components/quiz/data/stats";
import diffraction from "../components/quiz/data/diffraction";
import viscosity from "../components/quiz/data/viscosity";

export default function LearnScreen(props) {

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>

        <Text style={styles.header}>
          {`Znajdź ćwiczenie, które będziesz wykonywać na zajęciach, przeczytaj skrypt zawierający teorię oraz opis zwierający instrukcje wykonania ćwiczenia.\n\nMożesz sprawdzić swoją wiedzę w quizie!`}
        </Text>
        {renderStatsBox()}
        <Text style={[styles.header, { textAlign: 'left', marginBottom: 0, marginTop: 20}]}>Ćwiczenia:</Text>
        {exercises.map((exercise)=> {return renderExerciseBox(exercise, props)})}
        <View style={{height: 50}}/>
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
          {exercise.scriptURL ? <TouchableOpacity onPress={()=>openLink(exercise.scriptURL)} style={styles.button}>
            <Text style={styles.buttonText}>
              SKRYPT
            </Text>
          </TouchableOpacity> : null}
            <TouchableOpacity onPress={()=>openLink(exercise.exerciseURL)} style={styles.button}>
              <Text style={styles.buttonText}>
                OPIS
              </Text>
            </TouchableOpacity>
          <TouchableOpacity onPress={()=>navigation.navigate("Quiz", {
            title: "Computer",
            questions: exercise.quizName,
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
          <Text style={[styles.exerciseHeader, {width: 200}]}>Metody opracowania danych pomiarowych</Text>
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
    name: "0. Statystyka danych pomiarowych",
    exerciseURL: 'http://www.fis.agh.edu.pl/~pracownia_fizyczna/cwiczenia/00_wykon.pdf',
    quizName: stats,
  }, {
    name: "11. Moduł Younga",
    scriptURL: 'http://www.fis.agh.edu.pl/~pracownia_fizyczna/cwiczenia/11_opis.pdf',
    exerciseURL: 'http://www.fis.agh.edu.pl/~pracownia_fizyczna/cwiczenia/11_wykon.pdf',
    quizName: young,
  },{
  name: "13. Wspłczynnik lepkośoci",
    scriptURL: 'http://www.fis.agh.edu.pl/~pracownia_fizyczna/cwiczenia/13_opis.pdf',
    exerciseURL: 'http://www.fis.agh.edu.pl/~pracownia_fizyczna/cwiczenia/13_wykon.pdf',
    quizName: viscosity,
}, {
  name: "71. Dyfrakcja na szczelinie pojedynczej i podwójnej",
  scriptURL: 'http://www.fis.agh.edu.pl/~pracownia_fizyczna/cwiczenia/71_opis.pdf',
  exerciseURL: 'http://www.fis.agh.edu.pl/~pracownia_fizyczna/cwiczenia/71_wykon.pdf',
  quizName: diffraction,
}
]

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6e6ff',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  contentContainer: {
    paddingTop: 10,
  },
  exerciseContainer: {
    backgroundColor: '#ffeecc',
    borderColor: '#190033',
    borderWidth: 2,
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
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
