import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import Gyms from './Gyms';
import GymDetails from './GymDetails';
import Workout from './Workout';
import ExerciseDetails from './ExerciseDetails';
import MapScreen from './MapScreen';
import CalendarScreen from './CalendarScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function CalendarStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CalendarMain" component={CalendarScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function WorkoutStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="WorkoutList" component={Workout} options={{ headerShown: false }} />
      <Stack.Screen
        name="ExerciseDetails"
        component={ExerciseDetails}
        options={{ headerShown: false }} // Poistetaan otsikko ExerciseDetails-näytöltä
      />
    </Stack.Navigator>
  );
}

function GymsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="GymsList" component={Gyms} options={{ headerShown: false }} />
      <Stack.Screen name="GymDetails" component={GymDetails} />
      <Stack.Screen name="MapScreen" component={MapScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <View style={styles.container}>
      <PaperProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ color, size }) => {
                let iconName;
                if (route.name === 'Gyms') {
                  iconName = 'home-outline';
                } else if (route.name === 'Workout') {
                  iconName = 'barbell-outline';
                }
                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#4a90e2', // Aktiivisen välilehden väri
              tabBarInactiveTintColor: 'gray', // Ei-aktiivisen välilehden väri
              tabBarStyle: {
                backgroundColor: '#333333', // Tumma taustaväri alapalkille
                borderTopColor: '#333333', // Rajan väri yläpuolella
              },
            })}>
            <Tab.Screen
              name='Gyms'
              component={GymsStack}
              options={{ headerShown: false }}
            />
            <Tab.Screen
              name='Workout'
              component={WorkoutStack}
              options={{ headerShown: false }}
            />
            <Tab.Screen
              name='Calendar'
              component={CalendarStack}
              options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="calendar-outline" size={size} color={color} />
                )
              }}
            />

          </Tab.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a', // Tumma taustaväri
  },
});

