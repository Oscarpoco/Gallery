import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Alert, Platform } from 'react-native';

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
const HomeStackNavigator = ({ handleDeleteImage, allimages, handleShareImage, isModalVisible, setIsModalVisible, handleUpdateImage, newName, setNewName }) => (
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
          handleUpdateImage={handleUpdateImage}
          newName={newName}
          setNewName={setNewName}
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
  const [newName, setNewName] = useState('');



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
// END

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
    if (!picture) {
      Alert.alert('Error', 'No picture or location data available.');
      return;
    }

    const timestamp = new Date().toISOString();
    const filePath = pic.uri || picture.uri; 
    const name = `image_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.jpg`;
    const { latitude, longitude } = location.coords;

    try {
      const newImageId = await addImage(filePath, timestamp, latitude, longitude, name);
      const updatedImages = await getAllImages();
      setImages(updatedImages);

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

    // Ensure file path is valid
    if (!image.filePath) {
      throw new Error('Invalid file path');
    }

    // ENHANCED FILE CHECK WITH MORE ROBUST VERIFICATION
    let fileInfo;
    try {
      fileInfo = await FileSystem.getInfoAsync(image.filePath, { 
        size: true, 
        md5: false, 
        modificationTime: false 
      });
    } catch (fileCheckError) {
      throw new Error('Unable to access image file');
    }

    // Comprehensive file existence and size check
    if (!fileInfo.exists || fileInfo.size <= 0) {
      throw new Error('Image file is unavailable or empty');
    }

    // PLATFORM-SPECIFIC SHARING APPROACH
    const shareOptions = Platform.select({
      ios: {
        activityItemSources: [
          {
            placeholderItem: { type: 'url', content: image.filePath },
            item: {
              default: { type: 'url', content: image.filePath },
            },
            subject: {
              default: 'Check out this image',
            },
            linkMetadata: {
              originalUrl: image.filePath,
              url: image.filePath,
              title: image.name || 'Shared Image'
            }
          }
        ],
      },
      default: {
        mimeType: 'image/jpeg',
        dialogTitle: image.name || 'Share Image',
      }
    });

    // PERFORM SHARE WITH MULTIPLE FALLBACKS
    try {
      const result = await Share.shareAsync(image.filePath, shareOptions);
      
      // Optional: Log sharing result
      if (result.action === Share.sharedAction) {
        console.log('Image shared successfully');
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dialog was dismissed');
      }
    } catch (shareError) {
      // Additional fallback for sharing
      try {
        await Sharing.shareAsync(image.filePath, {
          mimeType: 'image/jpeg',
          dialogTitle: 'Share Image',
        });
      } catch (fallbackError) {
        throw new Error('Failed to share image through all methods');
      }
    }

  } catch (error) {
    // COMPREHENSIVE ERROR HANDLING
    console.error('Share Image Error:', error);
    
    Alert.alert(
      'Share Failed', 
      error.message || 'Unable to share image. Please try again.',
      [{ text: 'OK' }]
    );
  }
};

// UPDATE
const handleUpdateImage = async (imageId, newName) => {
  try {
    // Call the updateImage function to update the image's name in the database
    const changes = await updateImage(imageId, newName);

    // If any rows are updated, refresh the images list
    if (changes > 0) {
      const updatedImages = await getAllImages();
      setImages(updatedImages);
      console.log(`Image successfully updated. Rows affected: ${changes}`);
      Alert.alert('Success', `Image successfully updated.`, [{ text: 'OK' }]);
      setIsModalVisible(false)

    } else {
      console.log(`No image found to update with ID: ${imageId}`);
    }
  } catch (error) {
    Alert.alert(
      'Share Error', 
      error.message || 'Failed to share image',
      [{ text: 'OK' }]
    );
  }
};

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
              handleUpdateImage={handleUpdateImage}
              newName={newName}
              setNewName={setNewName}
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
