import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, FlatList, Image, Modal  } from 'react-native';

// ICONS
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const images = [
    { id: '1', uri: require('../assets/cod.jpg'), location: 'Location 1', name: 'picture 1' },
    { id: '2', uri: require('../assets/b.jpg'), location: 'Location 2', name: 'picture 2' },
    { id: '3', uri: require('../assets/g.jpg'), location: 'Location 3', name: 'picture 3' },
    { id: '4', uri: require('../assets/1.jpg'), location: 'Location 4', name: 'picture 4' },
    { id: '5', uri: require('../assets/Gamers.jpg'), location: 'Location 5', name: 'picture 5' },
    { id: '6', uri: require('../assets/Groot.jpg'), location: 'Location 6', name: 'picture 6' },
    { id: '7', uri: require('../assets/her.jpg'), location: 'Location 7', name: 'picture 7' },
    { id: '8', uri: require('../assets/me.jpg'), location: 'Location 8', name: 'picture 8' },
    { id: '9', uri: require('../assets/my.jpg'), location: 'Location 9', name: 'picture 9' },
    { id: '11', uri: require('../assets/P.jpg'), location: 'Location 11', name: 'picture 11' },
    { id: '12', uri: require('../assets/PIC.jpg'), location: 'Location 12', name: 'picture 12' },
    { id: '13', uri: require('../assets/pi.jpg'), location: 'Location 13', name: 'picture 13' },
    { id: '14', uri: require('../assets/sp.jpg'), location: 'Location 14', name: 'picture 14' },
    { id: '15', uri: require('../assets/n.jpg'), location: 'Location 15', name: 'picture 15' },
    { id: '16', uri: require('../assets/e.jpg'), location: 'Location 16', name: 'picture 16' },
    { id: '17', uri: require('../assets/col.jpg'), location: 'Location 17', name: 'picture 17' },
    { id: '18', uri: require('../assets/cute.jpg'), location: 'Location 18', name: 'picture 18' },
  ];

const HomeScreen = ({ navigation }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageInformation, setIsImageInformation] = useState(true);

  const filteredImages = images.filter(image => 
    image.id.toLowerCase().includes(searchQuery.toLowerCase())
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
        source={item.uri} 
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
                  {/* <Text style={styles.imageInfoText}>{selectedImage.location}</Text> */}
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
                source={selectedImage.uri} 
                style={styles.fullImage} 
              />
            </TouchableOpacity>

            <View style={styles.modalFooter}>
              {isImageInformation && (
                <View style={styles.imageInfoFooter}>

                    <TouchableOpacity>
                        <AntDesign name="sharealt" size={25} color="#000" />
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <Ionicons name="trash" size={25} color="#000" />
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <Ionicons name="location-sharp" size={25} color="red" />
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <MaterialCommunityIcons name="image-edit-outline" size={25} color="#000" />
                    </TouchableOpacity>

                </View>
              )}
            </View>
          </View>
        </Modal>
      )}

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
