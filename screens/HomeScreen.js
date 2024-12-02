import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';

// ICONS
import Ionicons from 'react-native-vector-icons/Ionicons';

const images = [
  { id: '1', uri: 'https://via.placeholder.com/150' },
  { id: '2', uri: 'https://via.placeholder.com/150' },
  { id: '3', uri: 'https://via.placeholder.com/150' },
  { id: '4', uri: 'https://via.placeholder.com/150' },
];

const HomeScreen = ({ navigation }) => {
  const [viewMode, setViewMode] = useState('grid');

  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  const renderItem = ({ item }) => (
    <View style={viewMode === 'grid' ? styles.gridItem : styles.listItem}>
      <Image source={{ uri: item.uri }} style={viewMode === 'grid' ? styles.gridImage : styles.listImage} />
    </View>
  );

  return (
    <View style={styles.container}>

      {/* FlatList to display images in grid or list view */}
      <FlatList
        key={viewMode} // Change the key based on viewMode
        data={images}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={viewMode === 'grid' ? 2 : 1}
        style={styles.imageList}
      />

      {/* Button to toggle between grid and list view */}
      {/* <TouchableOpacity style={styles.toggleButton} onPress={toggleViewMode}>
        <Text style={styles.buttonText}>
          Switch to {viewMode === 'grid' ? 'List' : 'Grid'} View
        </Text>
      </TouchableOpacity> */}

      {/* Floating button to open camera */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('Camera')} 
      >
        <Ionicons name="camera" color='#fff' size={24} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: 
  {
    flex: 1,
    justifyContent: 'flex-start', 
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingVertical: 20,
   
  },


  imageList: 
  {
    flex: 1,
    marginBottom: 10, 
    width: '100%',
  },

  gridItem: 
  {
    flex: 1,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  listItem: 
  {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },

  gridImage: 
  {
    width: 150,
    height: 150,
    borderRadius: 10,
  },

  listImage: 
  {
    width: 300,
    height: 250,
    borderRadius: 10,
    marginRight: 10,
  },

  toggleButton: 
  {
    backgroundColor: '#6200ea',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
  },

  buttonText: 
  {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  floatingButton: 
  {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#6200ea',
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
