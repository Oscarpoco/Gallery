import React, { useState, useRef } from 'react';
import { View, TextInput, Text, StyleSheet, Pressable, FlatList, Image, Modal } from 'react-native';

// ICONS
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import MapScreen from './Maps';
import { PinchGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';


const HomeScreen = ({ handleDeleteImage, allimages, handleShareImage, isModalVisible, setIsModalVisible, handleUpdateImage, newName, setNewName  }) => {


  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageInformation, setIsImageInformation] = useState(true);
  const [viewLocation, setViewLocation] = useState(false);
  const [isEditting, setIsEditting] = useState(false);
  const [scale, setScale] = useState(1);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [locationFilter, setLocationFilter] = useState('');
  const navigation = useNavigation();
  const pinchRef = useRef();

  // FILTER LOCATIONS
  const applyFilters = (images) => {
    return images.filter((image) => {
      const matchesSearch = (image.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (image.location || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesLocation = !locationFilter || 
                            (image.location || '').toLowerCase().includes(locationFilter.toLowerCase());
      
      const matchesDate = (!dateRange.start || new Date(image.date) >= dateRange.start) &&
                         (!dateRange.end || new Date(image.date) <= dateRange.end);
      
      return matchesSearch && matchesLocation && matchesDate;
    });
  };

  const filteredImages = applyFilters(allimages);

  // PINCH TO ZOOM
  const onPinchGestureEvent = ({ nativeEvent }) => {
    setScale(nativeEvent.scale);
  };

  const onPinchHandlerStateChange = ({ nativeEvent }) => {
    if (nativeEvent.state === State.END) {
      if (nativeEvent.scale < 1) {
        setScale(1);
      }
    }
  };

  // CLOSE DETAILS AFTER 7 SECONDS
  if(selectedImage && isImageInformation){
    setTimeout(() => {
      setIsImageInformation(false);
    }, 7000);
  };
  

  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  const handleImagePress = (imageItem) => {
    setSelectedImage(imageItem);
    setIsModalVisible(true);
    setViewLocation(false);
    setIsImageInformation(true);
  };


  const renderItem = ({ item }) => (
    <Pressable 
      style={viewMode === 'grid' ? styles.gridItem : styles.listItem} 
      onPress={() => handleImagePress(item)}
    >
      <PinchGestureHandler
        ref={pinchRef}
        onGestureEvent={onPinchGestureEvent}
        onHandlerStateChange={onPinchHandlerStateChange}
      >
        <Image 
          source={{ uri: item.filePath }} 
          style={[
            viewMode === 'grid' ? styles.gridImage : styles.listImage,
            { transform: [{ scale: scale }] }
          ]} 
        />
      </PinchGestureHandler>
    </Pressable>
  );

  return (

    <View  style={styles.container}>
      {/* SEARCH FUNCTION */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={25} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by image name"
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#666"
        />
        {searchQuery ? (
          <Pressable onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </Pressable>
        ) : 
          <Pressable onPress={() => toggleViewMode()}>
            <Ionicons name={ viewMode === 'grid' ? 'list' : 'grid'} size={25} color="#666" />
          </Pressable>
        }
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

            {viewLocation ? 
            <View style={styles.modalHeader}>
                <View style={styles.imageInfoHeader}>
                    <Text style={styles.imageInfoText}>{selectedImage.name}</Text>
                    <Pressable 
                    style={styles.closeButton} 
                    onPress={() => setViewLocation(false)}
                    >
                    <Ionicons name="close" size={30} color="#000" />
                    </Pressable>
                </View> 
            </View>

            : 

            <View style={styles.modalHeader}>
              {isImageInformation && (
                <View style={styles.imageInfoHeader}>
                  <Text style={styles.imageInfoText}>{selectedImage.name}</Text>
                  <Pressable 
                    style={styles.closeButton} 
                    onPress={() => setIsModalVisible(false)}
                  >
                    <Ionicons name="close" size={30} color="#000" />
                  </Pressable>
                </View>
              )}
            </View>

            }
            
            {viewLocation ? 

            <View style={styles.fullImageContainer}>
                <MapScreen selectedImage={selectedImage} setViewLocation={setViewLocation} setIsImageInformation={setIsImageInformation} />
            </View> 
            
            : 
            
            <Pressable 
              onPress={() => setIsImageInformation(!isImageInformation)}
              style={styles.fullImageContainer}
            >
              <Image 
                source={{ uri: selectedImage.filePath }} 
                style={styles.fullImage} 
              />
            </Pressable>}

            {isEditting && (
                    <Modal
                        visible={isEditting}
                        animationType="fade"
                        transparent={true}
                        onRequestClose={() => setIsEditting(false)}
                    >
                        <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <TextInput
                            style={styles.editInput}
                            placeholder={selectedImage.name || 'Enter new name'}
                            value={newName}
                            onChangeText={setNewName}
                            placeholderTextColor="#666"
                            />

                            <View style={styles.buttonContainer}>
                            <Pressable
                                style={styles.saveButton}
                                onPress={() => {
                                    handleUpdateImage(selectedImage.id, newName); 
                                setIsEditting(false);
                                }}
                            >
                                 <Text style={[styles.infoText, {color: 'rgba(255, 255, 255, 1)', letterSpacing: 2, fontSize: 16, textAlign: 'center', fontWeight: 600}]}>Accept</Text>
                            </Pressable>

                            <Pressable
                                style={styles.cancelButton}
                                onPress={() => setIsEditting(false)}
                            >
                                <Text style={[styles.cancelButtonText, {letterSpacing: 2}]}>Discard</Text>
                            </Pressable>
                            </View>
                        </View>
                        </View>
                    </Modal>
                )}


            {viewLocation ? 
            
                <View style={styles.modalFooter}>
                    <View style={styles.infoContainer}>
                        <View style={styles.infoRow}>
                        <View style={styles.locationCircle}>
                            <Ionicons name="location-sharp" size={15} color="red" />
                        </View>
                        <Text style={styles.infoText}>Latitude: {selectedImage.latitude}</Text>
                        </View>
                        <View style={styles.infoRow}>
                        <View style={styles.locationCircle}>
                            <Ionicons name="location-outline" size={15} color="green" />
                        </View>
                        <Text style={styles.infoText}>Longitude: {selectedImage.longitude}</Text>
                        </View>
                    </View>
                </View> 
                
                :
                
                <View style={styles.modalFooter}>
                    {isImageInformation && (
                        <View style={styles.imageInfoFooter}>
                        <Pressable onPress={() => handleShareImage(selectedImage.id)}>
                            <AntDesign name="sharealt" size={25} color="#000" />
                        </Pressable>

                        <Pressable onPress={() => handleDeleteImage(selectedImage.id)}>
                            <Ionicons name="trash" size={25} color="#000"/>
                        </Pressable>

                        <Pressable onPress={() => 
                            {
                                setViewLocation(true);
                                // setIsImageInformation(false);
                            }}>
                            <Ionicons name="location-sharp" size={25} color="red" />
                        </Pressable>

                        <Pressable onPress={() => {setIsEditting(true)}}>
                            <MaterialCommunityIcons name="image-edit-outline" size={25} color="#000" />
                        </Pressable>
                        </View>
                    )}
            </View>
                
                }
          </View>
        </Modal>
      )}

      {/* FLOATING BUTTON TO OPEN CAMERA */}
      <Pressable
        style={styles.floatingButton}
        onPress={() => navigation.navigate('Camera')} 
      >
        <Ionicons name="camera" color='#fff' size={24} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: 
  {
    flex: 1,
    flexDirection: 'column',
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
    flexDirection: 'column',
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',

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
    width: '100%',
    height: 250,
    borderRadius: 10
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
    paddingVertical: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '97%',
    marginTop: 10,
    borderRadius: 10
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
    letterSpacing: 1
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
    letterSpacing: 1
  },

  modalContainer: 
  {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 1)',
  },

  fullImageContainer: 
  {
    width: '100%',
    height: '83%',
  },

  fullImage: 
  {
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
  },

  infoContainer: 
  {
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7
  },
  infoText: 
  {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  infoRow: 
  {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    width: '100%',

  },

  locationCircle: {
    width: 20,
    height: 20,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 50
  },

//   EDITTING
modalOverlay: 
  {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: 
  {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  
  editInput: 
  {
    width: '100%',
    height: 48,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 24,
    backgroundColor: '#F8FAFC',
    fontWeight: '400',
  },
  
  buttonContainer: 
  {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 12,
  },
  
  saveButton: 
  {
    backgroundColor: '#3B82F6',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: '#3B82F6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  
  cancelButton: 
  {
    backgroundColor: '#FFF',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  
  cancelButtonText: 
  {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

});

export default HomeScreen;
