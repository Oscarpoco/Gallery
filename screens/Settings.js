import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// HomeScreen Component
const Settings = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Gallery App</Text>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Gallery')} // Navigate to Gallery screen
      >
        <Text style={styles.buttonText}>Go to Gallery</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Profile')} // Navigate to Profile screen
      >
        <Text style={styles.buttonText}>Go to Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles for the HomeScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Light background color
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  button: {
    backgroundColor: '#6200ea',  // Button color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Settings;
