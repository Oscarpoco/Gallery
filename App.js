import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Alert } from 'react-native';

// SQLITE FUNCTIONS
import {
  initializeDatabase,
  addImage,
  getImageById,
  updateImage,
  deleteImage,
  getAllImages,
} from './database/sql.js';

// Screens
import HomeScreen from './screens/HomeScreen';
import CameraScreen from './screens/CameraScreen';
import Settings from './screens/Settings';

// Stack Navigators
const HomeStack = createStackNavigator();
const HomeStackNavigator = ({ handleDeleteImage, allimages, handleShareImage, isModalVisible, setIsModalVisible }) => (
  <HomeStack.Navigator>
    <HomeStack.Screen
      name="HomeMain"
      options={{ title: 'Gallery' }}
      children={() => (
        <HomeScreen
          handleDeleteImage={handleDeleteImage}
          allimages={allimages}
          handleShareImage={handleShareImage}
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
        />
      )}
    />
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
  const [allimages, setImages] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);


  // GET LOCATION
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
    if (location && picture) {
      console.log('Latitude:', location.coords.latitude);
      console.log('Longitude:', location.coords.longitude);
    }
  }, [location, picture]);

  // INITIALIZE DATABASE
  useEffect(() => {
    const setupDatabase = async () => {
      try {
        const initialized = await initializeDatabase();
        if (initialized) {
          console.log('DATABASE INITIALIZED SUCCESSFULLY!');
          const storedImages = await getAllImages();
          setImages(storedImages);
        }
      } catch (error) {
        Alert.alert('Database Error', error.message || 'Failed to initialize database', [
          { text: 'OK' },
        ]);
      }
    };

    setupDatabase();
  }, []);

  // ADD MEDIA
  const handleAddImage = async () => {
    if (!picture || !location) {
      Alert.alert('Error', 'No picture or location data available.');
      return;
    }

    const timestamp = new Date().toISOString();
    const filePath = picture.uri;
    const name = `image_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.jpg`;
    const { latitude, longitude } = location.coords;

    try {
      const newImageId = await addImage(filePath, timestamp, latitude, longitude, name);
      const updatedImages = await getAllImages();
      setImages(updatedImages);
      setPicture(null);

      Alert.alert('Success', `Image added successfully with ID: ${newImageId}`, [{ text: 'OK' }]);
    } catch (error) {
      Alert.alert('Add Image Error', error.message || 'Failed to add image', [{ text: 'OK' }]);
    }
  };

  // DELETE IMAGE
  const handleDeleteImage = async (imageId) => {
    try {
      Alert.alert('Confirm Deletion', 'Are you sure you want to delete this image?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteImage(imageId);
            const updatedImages = await getAllImages();
            setImages(updatedImages);
            Alert.alert('Success', 'Image deleted successfully', [{ text: 'OK' }]);
            setIsModalVisible(false);
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Deletion Error', error.message || 'Failed to delete image', [{ text: 'OK' }]);
    }
  };
  // END

  // SHARE IMAGE
const handleShareImage = async (imageId) => {
  try {
    // FETCH IMAGE DETAILS
    const image = await getImageById(imageId);
    
    if (!image) {
      throw new Error('Image not found');
    }

    // CHECK IF FILE EXISTS
    const fileExists = await FileSystem.getInfoAsync(image.filePath);
    
    if (!fileExists.exists) {
      throw new Error('Image file no longer exists');
    }

    // SHARE OPTIONS
    const shareOptions = {
      mimeType: 'image/jpeg',
      dialogTitle: 'Share Image',
      UTI: 'image/jpeg',
    };

    // PERFORM SHARE
    await Share.shareAsync(image.filePath, shareOptions);
  } catch (error) {
    // HANDLE SHARING ERRORS
    Alert.alert(
      'Share Error', 
      error.message || 'Failed to share image',
      [{ text: 'OK' }]
    );
  }
};
// ENDS

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
          tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' },
        }}
      >
        <Tab.Screen
          name="Gallery"
          children={() => (
            <HomeStackNavigator
              handleDeleteImage={handleDeleteImage}
              allimages={allimages}
              handleShareImage={handleShareImage}
              isModalVisible={isModalVisible}
              setIsModalVisible={setIsModalVisible}
            />
          )}
          options={{
            title: 'Gallery',
            tabBarIcon: ({ color, size }) => <Ionicons name="images-outline" color={color} size={size || 24} />,
          }}
        />

        <Tab.Screen
          name="Camera"
          children={() => (
            <CameraScreen
              picture={picture}
              setPicture={setPicture}
              handleAddImage={handleAddImage}
              location={location}
            />
          )}
          options={{
            title: 'Camera',
            tabBarIcon: ({ color, size }) => <Ionicons name="camera" color={color} size={size || 24} />,
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsStackNavigator}
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => <Ionicons name="settings" color={color} size={size || 24} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
