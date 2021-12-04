import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';

const screen = Dimensions.get('window');

const formatNumber = number => `0${number}`.slice(-2);

const getRemaining = (time) => {
    const mins = Math.floor(time / 60);
    const secs = time - mins *  60;
    return { mins: formatNumber(mins), secs: formatNumber(secs) };
};

function App() {
    // Normal Pomodoro period
    const [remainingSecs, setRemainingSecs] = useState(0);
    const [isActive, setIsActive] = useState(false);

    // Period of contemplation
    const [contemplateTime, setContemplateTime] = useState(0);
    const [isContemplating, setIsContemplating] = useState(false);
    const [question, setQuestion] = useState("");
 
    const { mins, secs } = getRemaining(remainingSecs);

    // Default 25 mins = 1500 seconds
    const pomoTime = 1500;
    // Default 5 mins = 300 seconds
    const thinkTime = 300;

    // Current set of questions
    const questionStrings = [
        "What are you going to do next?",
        "What are you getting out of this?",
        "Have you come to a good stopping point?",
        "Will you remember this after a break?",
        "What else do you have to do today?",
        "Is there another part that needs to get done first?"
    ]

    // Pick a random question to display during the contemplation phase.
    const selectQuestion = () => {
        setQuestion(questionStrings[Math.floor(Math.random()*questionStrings.length)]);
    };

    const toggle = () => {
        if (isActive === false && isContemplating === false) {
            setIsActive(true);
        // True Pomodoros don't allow pausing; reset counter on a stop
        } else if (isActive && remainingSecs <= pomoTime && isContemplating === false) {
            setIsActive(false);
            setRemainingSecs(0);
        // Reset counter if the contemplation period is stopped.
        } else if (isContemplating && remainingSecs <= thinkTime) {
            setIsContemplating(false);
            setRemainingSecs(0);
        } else {
            setIsActive(false);
            setIsContemplating(false);
        }
    };

    const pivot = () => {
        setRemainingSecs(0);
        setIsActive(false);
        setIsContemplating(false);
    };

    useEffect(() => {
        let interval = null;
        if (isActive && remainingSecs === pomoTime) {
            setIsActive(false);
            setIsContemplating(true);
            setRemainingSecs(0);
        } else if (isActive) {
            interval = setInterval(() => {
                setRemainingSecs(remainingSecs => remainingSecs + 1);
            }, 1000); 
        } else if (isContemplating) {
            // Chooses a single question for the contemplation period
            // Fixes a weird bug where this would be changed at random intervals
            if (question === "" ) {
                selectQuestion();
            }

            interval = setInterval(() => {
                setRemainingSecs(remainingSecs => remainingSecs + 1);
            }, 1000); 

            if (remainingSecs === thinkTime) {
                setIsContemplating(false);
                setIsActive(true);
                setRemainingSecs(0);
                setQuestion("");
            }
        } else if (isContemplating && remainingSecs !== 0) {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isActive, remainingSecs, isContemplating, question]);

    return (
        <View style={styles.container}>
            <StatusBar style='light-content' />
            { isContemplating ? <Text style={styles.questionText}>{question}</Text> : null }
            <Text style={styles.timerText}>{`${mins}:${secs}`}</Text>

            <View style={styles.buttonRow}>
                <TouchableOpacity onPress={toggle} style={styles.button}>
                    <Text style={styles.buttonText}>{!isActive && !isContemplating ? "Start" : "Stop"}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={pivot} style={[styles.button, styles.buttonPivot]}>
                    <Text style={[styles.buttonText, styles.buttonTextPivot]}>Pivot!</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#957463',
        alignItems: 'center',
        justifyContent: 'center',
    },

    buttonRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#957463',
      marginTop: 90,
    },

    button: {
        borderColor: '#453d3b',
        width: screen.width / 3.5,
        height: screen.width / 3.5,
        borderRadius: screen.width / 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
        marginRight: 10,
        borderWidth: 10,
    },

    buttonText: {
        fontSize: 30,
        color: '#b4c9de'
    },

    timerText: {
        color: '#baada7',
        fontSize: 90,
        marginBottom: 20,
    },

    questionText: {
        color: '#baada7',
        fontSize: 40,
        marginBottom: 100,
    },

    buttonPivot: {
        borderColor: '#453d3b',
    },

    buttonTextPivot: {
        color: '#b4c9de',
    }
});

export default App;