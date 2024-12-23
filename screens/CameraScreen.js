import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Animated,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';

export default function CameraScreen({ picture, setPicture, handleAddImage }) {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [viewImage, setViewImage] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [pic, setPic] = useState(null);
  const camera = useRef();
  const navigation = useNavigation();
  const captureScale = useRef(new Animated.Value(1)).current;

  // PERMISSIONS
  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <MaterialIcons name="camera-alt" size={64} color="#fff" style={styles.permissionIcon} />
        <Text style={styles.permissionText}>
          We need camera access to help you take amazing photos
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={styles.permissionButton}
        >
          <Text style={styles.permissionButtonText}>Enable Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // CAPTURING PICTURES
  const takePicture = async () => {
    try {
      if (!camera.current || isCapturing) return;

      setIsCapturing(true);
      
      // Animate capture button
      Animated.sequence([
        Animated.timing(captureScale, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(captureScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      const options = {
        quality: 1,
        base64: true,
        exif: true,
      };

      const file = await camera.current.takePictureAsync(options);
      setPicture(file);
      setPic(file);
      setViewImage(true);
    } catch (error) {
      console.error('Error capturing picture:', error);
      Alert.alert('Error', 'Failed to capture picture. Please try again.');
      Toast.show({
        text1: 'Error capturing picture',
        text2: error.message || 'Failed to capture picture. Please try again.',
        type: 'error',
        position: 'bottom'
      })
    } finally {
      setIsCapturing(false);
    }
  };
  // ENDS

  // FLIP CAMERA
  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  if (picture && viewImage) {
    return (
      <View style={styles.imagePreviewContainer}>
        <View style={styles.previewHeader}>
          <TouchableOpacity
            onPress={() => setViewImage(false)}
            style={styles.previewHeaderButton}
          >
            <MaterialIcons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <Image
          source={{ uri: 'data:image/jpg;base64,' + picture.base64 }}
          style={styles.previewImage}
        />

        <View style={styles.bottomContainer}>
          <TouchableOpacity
            onPress={() => setViewImage(false)}
            style={styles.actionButton}
          >
            <MaterialIcons name="refresh" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Retake</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => {
              handleAddImage(pic);
              setViewImage(false);
              navigation.navigate("Gallery");
            }}
            style={[styles.actionButton, styles.confirmButton]}
          >
            <MaterialIcons name="check" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Use Photo</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={camera}>
        <View style={styles.overlay}>
          <View style={styles.topControls}>
            <TouchableOpacity 
              style={styles.toggleButton}
              onPress={toggleCameraFacing}
            >
              <MaterialIcons name="flip-camera-ios" size={28} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <View style={styles.thumbnailContainer}>
              {picture && (
                <TouchableOpacity onPress={() => setViewImage(true)}>
                  <Image
                    source={{ uri: 'data:image/jpg;base64,' + picture.base64 }}
                    style={styles.thumbnail}
                  />
                </TouchableOpacity>
              )}
            </View>

            <Animated.View style={{ transform: [{ scale: captureScale }] }}>
              <TouchableOpacity
                onPress={takePicture}
                style={styles.captureButton}
                disabled={isCapturing}
              >
                <View style={styles.captureInner} />
              </TouchableOpacity>
            </Animated.View>

            <View style={styles.placeholderRight} />
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#1a1a1a',
  },
  permissionIcon: {
    marginBottom: 24,
  },
  permissionText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    elevation: 3,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  toggleButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 12,
    borderRadius: 24,
    elevation: 2,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
  },
  thumbnailContainer: {
    width: 48,
    height: 48,
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#fff',
  },
  placeholderRight: {
    width: 48,
  },
  imagePreviewContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  previewHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    padding: 20,
  },
  previewHeaderButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 12,
    borderRadius: 24,
    alignSelf: 'flex-start',
  },
  previewImage: {
    flex: 1,
    resizeMode: 'contain',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    paddingBottom: 40,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    gap: 8,
  },
  confirmButton: {
    backgroundColor: '#2196F3',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});