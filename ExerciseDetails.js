import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';

const ExerciseDetails = ({ route, navigation }) => {
    const { exercise } = route.params;

    // Funktio, joka muuttaa tekstin alkamaan isolla kirjaimella
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };


    return (
        <ScrollView style={styles.container}>
            {/* Lisätään ylimääräistä tilaa animaation yläpuolelle */}
            <View style={styles.imageContainer}>
                <Image source={{ uri: exercise.gifUrl }} style={styles.image} />
            </View>
            <Text style={styles.title}>{capitalizeFirstLetter(exercise.name)}</Text>

            <Text style={styles.details}>Sets: {exercise.sets || '3'}</Text>
            <Text style={styles.details}>Reps: {exercise.reps || '12'}</Text>

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>Return</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a', // Tumma taustaväri
    },
    imageContainer: {
        alignItems: 'center', // Keskittää kuvan
        marginVertical: 75, // Lisää tilaa ylä- ja alapuolelle
    },
    image: {
        width: '90%', // Pienennetään kuvan leveyttä
        height: 300,
        borderRadius: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white', // Vaalea tekstiväri
        marginBottom: 10,
        textAlign: 'center',
    },
    details: {
        fontSize: 16,
        color: 'white', // Vaalea tekstiväri
        marginBottom: 10,
        textAlign: 'center',
    },
    backButton: {
        backgroundColor: '#4a90e2',
        padding: 10,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 20,
    },
    backButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default ExerciseDetails;