import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, FlatList, Image, Modal, Alert  } from 'react-native';

// ICONS
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const HomeScreen = ({ navigation, handleDeleteImage, allimages, handleShareImage, isModalVisible, setIsModalVisible  }) => {


  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageInformation, setIsImageInformation] = useState(true);

  const filteredImages = allimages.filter((image) => 
    (image.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );
  

  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  const handleImagePress = (imageItem) => {
    setSelectedImage(imageItem);
    setIsModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={viewMode === 'grid' ? styles.gridItem : styles.listItem} 
      onPress={() => handleImagePress(item)}
    >
      <Image 
        source={{ uri: item.filePath  }} 
        style={viewMode === 'grid' ? styles.gridImage : styles.listImage} 
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* SEARCH FUNCTION */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by image name"
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

      {/* FLATLIST TO DISPLAY IMAGES */}
      <FlatList
        key={viewMode} 
        data={filteredImages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={viewMode === 'grid' ? 3 : 1}
        style={styles.imageList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No media found</Text>
          </View>
        }
      />

      {/* MODAL */}
      {selectedImage && (
        <Modal
          visible={isModalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              {isImageInformation && (
                <View style={styles.imageInfoHeader}>
                  <Text style={styles.imageInfoText}>{selectedImage.name}</Text>
                  <TouchableOpacity 
                    style={styles.closeButton} 
                    onPress={() => setIsModalVisible(false)}
                  >
                    <Ionicons name="close" size={30} color="#000" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
            
            <TouchableOpacity 
              onPress={() => setIsImageInformation(!isImageInformation)}
              style={styles.fullImageContainer}
            >
              <Image 
                source={{ uri: selectedImage.filePath }} 
                style={styles.fullImage} 
              />
            </TouchableOpacity>

            <View style={styles.modalFooter}>
              {isImageInformation && (
                <View style={styles.imageInfoFooter}>
                  <TouchableOpacity onPress={() => handleShareImage(selectedImage.id)}>
                    <AntDesign name="sharealt" size={25} color="#000" />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleDeleteImage(selectedImage.id)}>
                    <Ionicons name="trash" size={25} color="#000" />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => {
                    // NAVIGATE TO LOCATION SCREEN
                    navigation.navigate('Location', { 
                      latitude: selectedImage.latitude, 
                      longitude: selectedImage.longitude 
                    });
                  }}>
                    <Ionicons name="location-sharp" size={25} color="red" />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => {
                    // NAVIGATE TO EDIT SCREEN
                    navigation.navigate('EditImage', { 
                      imageId: selectedImage.id,
                      currentName: selectedImage.name,
                      currentLatitude: selectedImage.latitude,
                      currentLongitude: selectedImage.longitude
                    });
                  }}>
                    <MaterialCommunityIcons name="image-edit-outline" size={25} color="#000" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Modal>
      )}

      {/* FLOATING BUTTON TO OPEN CAMERA */}
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
    height: 100,
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
    marginBottom: 10,
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
  fullImageContainer: {
    width: '100%',
    height: '83%',
  },

  fullImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },

  modalHeader:
  {
    height: '7%',
    width: '100%',
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },

  imageInfoHeader:
  {
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    flexDirection: 'row'
  },

  modalFooter:
  {
    height: '10%',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 1)',
  },

  imageInfoFooter:
  {
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 60,
    flexDirection: 'row'
  },

  imageInfoText:
  {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  }

});

export default HomeScreen;
