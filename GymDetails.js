import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GymDetails = ({ route }) => {
    const { gym } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{gym.name}</Text>
            <Text>Address: {gym.vicinity}</Text>
            <Text>Rating: {gym.rating}</Text>
            {/* Lisää muita tietoja tähän tarvittaessa */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    // Lisää muita tyylejä tarvittaessa
});

export default GymDetails;
