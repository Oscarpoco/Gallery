import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, FlatList, Image, Modal  } from 'react-native';

// ICONS
import Ionicons from 'react-native-vector-icons/Ionicons';

const images = [
    { id: '1', uri: require('../assets/cod.jpg') },
    { id: '2', uri: require('../assets/b.jpg') },
    { id: '3', uri: require('../assets/g.jpg') },
    { id: '4', uri: require('../assets/1.jpg') },
    { id: '5', uri: require('../assets/Gamers.jpg') },
    { id: '6', uri: require('../assets/Groot.jpg') },
    { id: '7', uri: require('../assets/her.jpg') },
    { id: '8', uri: require('../assets/me.jpg') },
    { id: '9', uri: require('../assets/my.jpg') },
    { id: '11', uri: require('../assets/P.jpg') },
    { id: '12', uri: require('../assets/PIC.jpg') },
    { id: '13', uri: require('../assets/pi.jpg') },
    { id: '14', uri: require('../assets/sp.jpg') },
    { id: '15', uri: require('../assets/n.jpg') },
    { id: '16', uri: require('../assets/e.jpg') },
    { id: '17', uri: require('../assets/col.jpg') },
    { id: '18', uri: require('../assets/cute.jpg') },
  ];

const HomeScreen = ({ navigation }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const filteredImages = images.filter(image => 
    image.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  const handleImagePress = (uri) => {
    setSelectedImage(uri);
    setIsModalVisible(true);
  };


  const renderItem = ({ item }) => (
    <TouchableOpacity style={viewMode === 'grid' ? styles.gridItem : styles.listItem} onPress={() => handleImagePress(item.uri)}>
      <Image source={item.uri} style={viewMode === 'grid' ? styles.gridImage : styles.listImage} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

        {/* SEARCH FUNCTION */}
        <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
            style={styles.searchInput}
            placeholder="Search by image ID"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#666"
            />
            {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
            ) : null}
      </View>

      {/* FlatList to display images in grid or list view */}
      <FlatList
        key={viewMode} 
        data={filteredImages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={viewMode === 'grid' ? 3 : 1}
        style={styles.imageList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No media found</Text>
          </View>
        }
      />

      {/* MODAL */}
      {/* Modal to display the selected image */}
      {selectedImage && (
        <Modal
          visible={isModalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContainer}>

            <View style={styles.modalHeader}>
                <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={30} color="#fff" />
                </TouchableOpacity>
            </View>

            <Image source={selectedImage} style={styles.fullImage} />

            <View style={styles.modalFooter}>

            </View>
          </View>
        </Modal>
      )}

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
  },

  imageList: 
  {
    flex: 1,
    width: '100%',
    paddingHorizontal: 5
  },

  gridItem: 
  {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
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
    width: '100%',
    height: 110,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  listImage: 
  {
    width: 300,
    height: 250,
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

  searchContainer: 
  {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '97%',
    marginTop: 10,
  },

  searchIcon: 
  {
    marginRight: 10,
  },

  searchInput: 
  {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },

  emptyContainer: 
  {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },

  emptyText: 
  {
    fontSize: 18,
    color: '#666',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 1)',
    // gap: 5
  },
  fullImage: {
    width: '100%',
    height: '83%',
    resizeMode: 'contain',
  },

  modalHeader:
  {
    height: '7%',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, .9)',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20
  },

  modalFooter:
  {
    height: '10%',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, .9)',
  },
});

export default HomeScreen;
