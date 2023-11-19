import React from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity, Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Ionicons from '@expo/vector-icons/Ionicons';

const MapScreen = ({ route, navigation }) => {
    const gym = route.params?.gym;

    const openGymWebsite = () => {
        const url = gym?.website;
        if (url) {
            Linking.openURL(url);
        }
    };

    const getDirections = () => {
        const lat = gym?.geometry.location.lat;
        const lng = gym?.geometry.location.lng;
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        Linking.openURL(url);
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: gym?.geometry.location.lat,
                    longitude: gym?.geometry.location.lng,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}>
                <Marker
                    coordinate={{
                        latitude: gym?.geometry.location.lat,
                        longitude: gym?.geometry.location.lng,
                    }}
                    title={gym?.name}
                    description={gym?.vicinity}
                />
            </MapView>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={getDirections}>
                    <Ionicons name="navigate-outline" size={30} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={openGymWebsite}>
                    <Ionicons name="globe-outline" size={30} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-outline" size={30} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        flexDirection: 'row',
        backgroundColor: 'transparent',
    },
    button: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 5,
    },
});

export default MapScreen;
