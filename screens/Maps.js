import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import FastImage from 'react-native-fast-image';

const { width, height } = Dimensions.get('window');

const MapScreen = ({ selectedImage }) => {
  const { latitude, longitude, filePath } = selectedImage;

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        mapType="hybrid"
        showsUserLocation={true}
        showsCompass={true}
        rotateEnabled={true}
        pitchEnabled={true}
      >
        <Marker
          coordinate={{ latitude, longitude }}
          tracksViewChanges={false}
        >
          <View style={styles.markerContainer}>
            <Image 
              source={{ uri: filePath }}
              style={styles.markerImage}
              resizeMode="cover"
            />
          </View>
        </Marker>
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: width,
    height: height,
  },
  markerContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  markerImage: {
    width: '100%',
    height: '100%',
  }
});

export default MapScreen;