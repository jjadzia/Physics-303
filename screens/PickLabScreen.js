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

export default function PickLabScreen(props) {

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}>

                <Text style={styles.header}>
                    {`Znajdź ćwiczenie, które chcesz wykonać lub pomiary, do których chcesz wrócić`}
                </Text>
                <Text style={[styles.header, { textAlign: 'left', marginBottom: 0, marginTop: 20}]}>Ćwiczenia:</Text>
                {exercises.map((exercise)=> {return renderExerciseBox(exercise, props)})}
            </ScrollView>

        </View>
    );
}

PickLabScreen.navigationOptions = {
    title: "Przygotuj się do zajęć",
};


function renderExerciseBox(exercise, props) {

    return (
        <TouchableOpacity key={exercise.name} onPress={()=>props.navigation.navigate(exercise.exerciseScreen)} style={styles.exerciseContainer}>
            <Text style={[styles.exerciseHeader, {width: 200}]}>{exercise.name}</Text>
            <View style={styles.button}>

                <View style={styles.buttonsContainer}>
                        <Text style={styles.buttonText}>
                            WYBIERZ
                        </Text>
                </View>
            </View>
        </TouchableOpacity>


    );
}

const exercises = [{
    name: "0. Statystyka danych pomiarowych",
    exerciseScreen: 'FirstLab',
}, {
    name: "11. Moduł Younga",
    exerciseScreen: 'Young',
},{
    name: "13. Wspłczynnik lepkośoci",
    exerciseScreen: 'Viscosity',
}, {
    name: "71. Dyfrakcja na szczelinie pojedynczej i podwójnej",
    exerciseScreen: 'Diffraction',
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
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonsContainer: {
        justifyContent: 'space-around',
        flexDirection: 'row',
    },
    button: {
        height: 30,
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
