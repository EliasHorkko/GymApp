import { REACT_APP_GOOGLE_API_KEY } from '@env';
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import StarRating from 'react-native-star-rating';


const Gyms = ({ navigation }) => {
    const [location, setLocation] = useState(null);
    const [gyms, setGyms] = useState([]);
    const [loading, setLoading] = useState(true);

    const getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.error('Permission to access location was denied');
            return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
    };

    const fetchGymDetails = async (placeId) => {
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,vicinity,geometry,website&key=${REACT_APP_GOOGLE_API_KEY}`;
        try {
            const response = await fetch(detailsUrl);
            const data = await response.json();
            return data.result; // Sisältää osoitteen ja sijainnin koordinaatit sekä verkkosivuston URL:n
        } catch (error) {
            console.error('Error fetching gym details:', error);
        }
    };


    const fetchNearbyGyms = async () => {
        setLoading(true); // Asetetaan latausindikaattori päälle

        if (!location) {
            setLoading(false); // Poistetaan latausindikaattori, jos sijaintia ei ole
            return;
        }

        const lat = location.coords.latitude;
        const lng = location.coords.longitude;
        const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=gym&key=${REACT_APP_GOOGLE_API_KEY}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            const gymDetailsPromises = data.results
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 10)
                .map(gym => fetchGymDetails(gym.place_id));

            const gymsWithDetails = await Promise.all(gymDetailsPromises);
            setGyms(gymsWithDetails);
        } catch (error) {
            console.error('Error fetching gyms:', error);
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        getLocation();
    }, []);

    useEffect(() => {
        if (location) {
            fetchNearbyGyms();
        }
    }, [location]);

    const handleGymPress = (gym) => {
        navigation.navigate('MapScreen', { gym: gym });
    };



    return (
        <View style={styles.container}>
            <Text style={styles.header}>Top 10 Gyms Nearby</Text>
            <FlatList
                data={gyms}
                keyExtractor={(item) => item.place_id} // Tämän pitäisi varmistaa, että jokaisella kuntosalilla on uniikki avain
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleGymPress(item)} style={styles.gymItem}>
                        <Text style={styles.gymName}>{item.name}</Text>
                        <Text style={styles.gymAddress}>{item.vicinity}</Text>
                        <View style={styles.starContainer}>
                            <StarRating
                                disabled={true}
                                maxStars={5}
                                rating={item.rating}
                                fullStarColor={'gold'}
                                starSize={15}
                            />
                        </View>
                    </TouchableOpacity>
                )}
            />

        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: '#1a1a1a', // Tumma taustaväri
    },
    header: {
        fontSize: 23,
        fontWeight: 'bold',
        padding: 20,
        backgroundColor: '#333333', // Tumma otsikon taustaväri
        color: '#ffffff', // Valkoinen tekstiväri
        textAlign: 'center',
    },
    gymItem: {
        marginHorizontal: 20,
        backgroundColor: '#2c2c2c', // Tumma elementin taustaväri
        margin: 12,
        borderRadius: 15,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    gymName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff', // Valkoinen tekstiväri
        textAlign: 'center',
    },
    gymAddress: {
        fontSize: 14,
        color: '#cccccc', // Vaalea tekstiväri
        textAlign: 'center',
    },
    starContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
});


export default Gyms;
