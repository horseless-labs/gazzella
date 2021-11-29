import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
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
 
    const { mins, secs } = getRemaining(remainingSecs);

    // Single string for contemplation.
    // TODO: Add an array of them and introduce the capacity for randomizaton.
    const contemplateString = "What are you going to do next?";

    const showText = () => {
        return contemplateString;
    };

    const toggle = () => {
        setIsActive(!isActive);
    };

    const reset = () => {
        setRemainingSecs(0);
        setIsActive(false);
        setIsContemplating(false);
    };

    useEffect(() => {
        let interval = null;
        if (isActive && remainingSecs === 5) {
            setIsActive(false);
            setIsContemplating(true);
        } else if (isActive) {
            interval = setInterval(() => {
                setRemainingSecs(remainingSecs => remainingSecs + 1);
            }, 1000); 
        } else if (!isActive && remainingSecs !== 0) {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isActive, remainingSecs, isContemplating]);

    return (
        <View style={styles.container}>
            <StatusBar style='light-content' />
            {/* <Text style={styles.timerText}>{isContemplating ? showText() : `${mins}:${secs}`}</Text> */}
            { isContemplating ?
                <Text style={styles.questionText}>{showText()}</Text> :
                <Text style={styles.timerText}>{`${mins}:${secs}`}</Text>}

            <View style={styles.buttonRow}>
                <TouchableOpacity onPress={toggle} style={styles.button}>
                    <Text style={styles.buttonText}>{isActive ? 'Pause' : 'Start'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={reset} style={[styles.button, styles.buttonReset]}>
                    <Text style={[styles.buttonText, styles.buttonTextReset]}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={reset} style={[styles.button, styles.buttonReset]}>
                    <Text style={[styles.buttonText, styles.buttonTextReset]}>Pivot!</Text>
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

    buttonReset: {
        borderColor: '#453d3b',
    },

    buttonTextReset: {
        color: '#b4c9de',
    }
});

export default App;