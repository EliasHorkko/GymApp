import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import axios from 'axios';
import ExerciseDetails from './ExerciseDetails';
import { REACT_APP_RAPIDAPI_KEY } from '@env';


const bodyPartMappings = {
    'Arms': 'upper arms',
    'Legs': 'upper legs',
    'Back': 'back',
    'Chest': 'chest',
    'Shoulders': 'shoulders',
};

const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
        return text.substring(0, maxLength - 3) + '...';
    }
    return text;
};


const fetchExercises = async (bodyPart) => {
    try {
        const response = await axios.get(`https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}?limit=20`, {
            headers: {
                'X-RapidAPI-Key': REACT_APP_RAPIDAPI_KEY, 
                'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching exercises:', error);
        console.log(error.response.data);
    }
};

const Workout = ({ navigation }) => {
    const [exercises, setExercises] = useState([]);
    const [selectedBodyPart, setSelectedBodyPart] = useState('Arms'); // oletusarvo 'Arms'
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };


    useEffect(() => {
        const apiBodyPart = bodyPartMappings[selectedBodyPart];
        fetchExercises(apiBodyPart).then(data => {
            if (data) {
                setExercises(data);
            }
        });
    }, [selectedBodyPart]);

    const bodyParts = ['Arms', 'Legs', 'Back', 'Chest', 'Shoulders'];


    const openExerciseDetails = (exercise, index) => {
        navigation.navigate('ExerciseDetails', { exercise, exercises, currentIndex: index });
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.bodyPartContainer}>
                {bodyParts.map((part, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.bodyPartButton, selectedBodyPart === part && styles.selectedBodyPart]}
                        onPress={() => setSelectedBodyPart(part)}
                    >
                        <Text style={styles.buttonText}>{part}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.exercisesContainer}>
                {exercises && exercises.length > 0 && exercises.map((exercise, index) => (
                    <TouchableOpacity key={index} style={styles.exerciseButton} onPress={() => openExerciseDetails(exercise)}>
                        <Image source={{ uri: exercise.gifUrl }} style={styles.exerciseImage} />
                        <Text style={styles.exerciseText}>{capitalizeFirstLetter(truncateText(exercise.name, 25))}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#1a1a1a', // Tumma taustaväri
    },
    bodyPartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
        paddingTop: 50,
    },
    bodyPartButton: {
        backgroundColor: '#333333', // Tumma painikkeen taustaväri
        padding: 10,
        borderRadius: 20,
    },
    selectedBodyPart: {
        backgroundColor: '#4a90e2', // Valitun osan korostusväri
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    exercisesContainer: {
        alignItems: 'center',
    },
    exerciseButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333333', // Tumma painikkeen taustaväri
        padding: 10,
        borderRadius: 20,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: '100%',
    },
    exerciseImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    exerciseText: {
        fontSize: 16,
        color: 'white',
        flexShrink: 1, // Mahdollistaa tekstin kutistumisen, jos tila on rajoitettu
        marginRight: 10, // Lisää tilaa oikealle puolelle
    },

});


export default Workout;
