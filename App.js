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
    const [remainingSecs, setRemainingSecs] = useState(0);
    const[isActive, setisActive] = useState(false);
    const { mins, secs } = getRemaining(remainingSecs);

    const toggle = () => {
        setisActive(!isActive);
    };

    const reset = () => {
        setRemainingSecs(0);
        setisActive(false);
    }

    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                setRemainingSecs(remainingSecs => remainingSecs + 1);
            }, 1000);
        } else if (!isActive && remainingSecs !== 0) {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isActive, remainingSecs]);

    return (
        <View style={styles.container}>
            <StatusBar style='light-content' />
            <Text style={styles.timerText}>{`${mins}:${secs}`}</Text>

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
      flex: 2,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#957463',
    },

    button: {
        marginLeft: 10,
        marginRight: 10,
        borderWidth: 10,
        borderColor: '#453d3b',
        width: screen.width / 3.5,
        height: screen.width / 3.5,
        borderRadius: screen.width / 2,
        alignItems: 'center',
        justifyContent: 'center',
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

    buttonReset: {
        borderColor: '#453d3b',
    },

    buttonTextReset: {
        color: '#b4c9de',
    }
});

export default App;