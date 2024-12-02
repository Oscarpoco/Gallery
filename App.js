import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

// ICONS
import Ionicons from 'react-native-vector-icons/Ionicons';

// SCREENS 
import HomeScreen from './screens/HomeScreen';
import CameraScreen from './screens/CameraScreen';
import Settings from './screens/Settings';


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

// Bottom Tab Navigator
const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            marginBottom: 5,
            height: 55,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 5,
            borderWidth: 0,
            backgroundColor: '#F0F0F0',
            paddingVertical: 25,
            justifyContent: 'center',
            alignItems: 'center',
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
            tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
          }}
        />
        <Tab.Screen
          name="Camera"
          component={CameraScreen}
          options={{
            title: 'Camera',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="camera" color={color} size={size} />
            ),
            tabBarLabelStyle: { fontSize: 10, fontWeight: 'normal' },
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
            tabBarLabelStyle: { fontSize: 10, fontWeight: 'normal' },
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};



export default App;
