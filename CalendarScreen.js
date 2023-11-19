import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import { REACT_APP_FIREBASE_API_KEY } from '@env';

// Firebase-konfiguraatio
const firebaseConfig = {
    apiKey: REACT_APP_FIREBASE_API_KEY,
    authDomain: "gymapp-75095.firebaseapp.com",
    projectId: "gymapp-75095",
    storageBucket: "gymapp-75095.appspot.com",
    messagingSenderId: "91051902482",
    appId: "1:91051902482:web:31416f31a8ef31be74facb",
    measurementId: "G-VDFEP3PDG8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const CalendarScreen = () => {
    const [markedDates, setMarkedDates] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [duration, setDuration] = useState('');
    const [description, setDescription] = useState('');
    const [selectedBodyPart, setSelectedBodyPart] = useState('Arms');

    useEffect(() => {
        // Lataa tallennetut harjoitukset kalenteriin
        const workoutsCol = collection(db, 'workouts');
        getDocs(workoutsCol).then((querySnapshot) => {
            let newMarkedDates = {};
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                newMarkedDates[data.date] = { selected: true, marked: true, selectedColor: 'green' };
            });
            setMarkedDates(newMarkedDates);
        });
    }, []);

    const [currentWorkoutDoc, setCurrentWorkoutDoc] = useState(null);

    const onDayPress = async (day) => {
        setSelectedDate(day.dateString);
        setModalVisible(true);

        const q = query(collection(db, 'workouts'), where('date', '==', day.dateString));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.docs.length > 0) {
            const workoutDoc = querySnapshot.docs[0];
            const workoutData = workoutDoc.data();
            setDuration(workoutData.duration);
            setDescription(workoutData.description);
            setSelectedBodyPart(workoutData.bodyPart);
            setCurrentWorkoutDoc(workoutDoc); // Tallenna viite dokumenttiin
        } else {
            setDuration('');
            setDescription('');
            setSelectedBodyPart('Arms');
            setCurrentWorkoutDoc(null); // Ei olemassa olevaa dokumenttia
        }
    };

    const saveWorkout = async () => {
        if (currentWorkoutDoc) {
            // Päivitä olemassa oleva dokumentti
            await updateDoc(currentWorkoutDoc.ref, {
                duration,
                description,
                bodyPart: selectedBodyPart
            });
        } else {
            // Luo uusi dokumentti
            await addDoc(collection(db, 'workouts'), {
                date: selectedDate,
                duration,
                description,
                bodyPart: selectedBodyPart
            });
        }

        setMarkedDates({
            ...markedDates,
            [selectedDate]: { selected: true, marked: true, selectedColor: 'green' }
        });
        setModalVisible(false);
    };


    const deleteWorkout = async () => {
        const q = query(collection(db, 'workouts'), where('date', '==', selectedDate));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            deleteDoc(doc.ref);
        });

        const newMarkedDates = { ...markedDates };
        delete newMarkedDates[selectedDate];
        setMarkedDates(newMarkedDates);
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <Calendar
                onDayPress={onDayPress}
                markedDates={markedDates}
                theme={{
                    backgroundColor: '#1a1a1a',
                    calendarBackground: '#1a1a1a',
                    textSectionTitleColor: '#b6c1cd',
                    textSectionTitleDisabledColor: '#d9e1e8',
                    selectedDayBackgroundColor: '#00adf5',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: '#00adf5',
                    dayTextColor: 'white',
                    textDisabledColor: '#555',
                    dotColor: '#00adf5',
                    selectedDotColor: '#ffffff',
                    arrowColor: 'orange',
                    disabledArrowColor: '#d9e1e8',
                    monthTextColor: 'white',
                    indicatorColor: 'blue',
                    textDayFontWeight: '300',
                    textMonthFontWeight: 'bold',
                    textDayHeaderFontWeight: '300',
                    textDayFontSize: 16,
                    textMonthFontSize: 16,
                    textDayHeaderFontSize: 16
                }}
            />

            {modalVisible && (
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardView}
                >
                    <ScrollView style={styles.scrollView}>
                        <View style={styles.detailsContainer}>
                            <Text style={styles.detailsTitle}>Add Workout Details</Text>

                            <Picker
                                selectedValue={selectedBodyPart}
                                style={styles.picker}
                                itemStyle={styles.pickerItem} 
                                onValueChange={(itemValue) => setSelectedBodyPart(itemValue)}
                            >
                                <Picker.Item label="Arms" value="Arms" />
                                <Picker.Item label="Legs" value="Legs" />
                                <Picker.Item label="Back" value="Back" />
                                <Picker.Item label="Chest" value="Chest" />
                                <Picker.Item label="Shoulders" value="Shoulders" />

                            </Picker>

                            <TextInput
                                style={styles.input}
                                onChangeText={setDuration}
                                value={duration}
                                placeholder="Duration (in minutes)"
                                keyboardType="numeric"
                                placeholderTextColor="#ccc" // Vaaleampi placeholder-teksti
                            />

                            <TextInput
                                style={styles.input}
                                onChangeText={setDescription}
                                value={description}
                                placeholder="Description"
                                multiline
                                placeholderTextColor="#ccc" // Vaaleampi placeholder-teksti
                            />

                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={saveWorkout}
                                >
                                    <Text style={styles.textStyle}>Save Workout</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.button, styles.buttonDelete]}
                                    onPress={deleteWorkout}
                                >
                                    <Text style={styles.textStyle}>Delete Workout</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({

    keyboardView: {
        flex: 1,
    },
    scrollView: {
        maxHeight: '125%', // Rajoittaa korkeutta
    },
    detailsContainer: {
        backgroundColor: "#333",
        borderRadius: 20,
        padding: 50,
        marginHorizontal: 10,
        marginTop: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    detailsTitle: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
    },
    buttonDelete: {
        backgroundColor: "red",
    },
    picker: {
        width: '100%',
        color: "white",
    },
    pickerItem: {
        color: "white", // Asettaa tekstin värin valkoiseksi
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20,
    },
    container: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: '#1a1a1a',
    },
    modalView: {
        margin: 20,
        backgroundColor: "#333", // Tumma taustaväri valikolle
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalTitle: {
        marginBottom: 15,
        textAlign: "center",
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        color: "white", // Valkoinen teksti
    },
    input: {
        height: 40,
        margin: 10,
        borderWidth: 1,
        borderColor: 'white', // Vaaleampi reunus
        padding: 10,
        width: 200,
        color: 'white', // Valkoinen teksti
        borderRadius: 10,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonClose: {
        backgroundColor: "green",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    }
});

export default CalendarScreen;
