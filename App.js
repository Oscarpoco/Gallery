import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as Location from 'expo-location';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens
import HomeScreen from './screens/HomeScreen';
import CameraScreen from './screens/CameraScreen';
import Settings from './screens/Settings';

// Stack Navigators
const HomeStack = createStackNavigator();
const HomeStackNavigator = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen name="HomeMain" component={HomeScreen} options={{ title: 'Gallery' }} />
  </HomeStack.Navigator>
);

const SettingsStack = createStackNavigator();
const SettingsStackNavigator = () => (
  <SettingsStack.Navigator>
    <SettingsStack.Screen name="SettingsMain" component={Settings} options={{ title: 'Settings' }} />
  </SettingsStack.Navigator>
);

// Tab Navigator
const Tab = createBottomTabNavigator();

const App = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [picture, setPicture] = useState('');

  useEffect(() => {
    async function getCurrentLocation() {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        let locationResult = await Location.getCurrentPositionAsync({});
        setLocation(locationResult);
      } catch (error) {
        setErrorMsg('Error while fetching location');
        console.error(error);
      }
    }

    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (location) {
      console.log('Latitude:', location.coords.latitude);
      console.log('Longitude:', location.coords.longitude);
    }
  }, [location]);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: 55,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 5,
            backgroundColor: '#F0F0F0',
          },
          tabBarActiveTintColor: '#6200ea',
          tabBarInactiveTintColor: '#808080',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: 'bold',
          },
        }}
      >
        <Tab.Screen
          name="Gallery"
          component={HomeStackNavigator}
          options={{
            title: 'Gallery',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="images-outline" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Camera"
          children={() => <CameraScreen picture={picture} setPicture={setPicture} />}
          options={{
            title: 'Camera',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="camera" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsStackNavigator}
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
