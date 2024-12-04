import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function CameraScreen({ picture, setPicture, handleAddImage, location }) {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [viewImage, setViewImage] = useState(false);
  const camera = useRef();

//   PERMISSIONS
  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={styles.permissionButton}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }
//   ENDS

//   CAPTURING PICTURES
const takePicture = async () => {
    try {
      if (!camera.current) {
        console.warn('Camera is not ready.');
        return;
      }
  
      const options = {
        quality: 1,
        base64: true,
        exif: true,
      };
  
      // CAPTURE THE PICTURE
      const pic = await camera.current.takePictureAsync(options);
      setPicture(pic);
      console.log('Picture captured successfully:', pic.uri);
  
      // SAVE THE PICTURE
      handleAddImage(pic);
  
    } catch (error) {
      console.error('Error capturing picture:', error);
    }
  };
  
  
//   ENDS

// FLIP CAMERA
  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }
//   ENDS



// SKIPPING ALL THE FUNCTIONS IF THERE'S A PICTURE
  if (picture && viewImage) {
    return (
      <View style={styles.imagePreviewContainer}>
        <Image
          source={{ uri: 'data:image/jpg;base64,' + picture.base64 }}
          style={styles.previewImage}
        />

        <View style={styles.bottomContainer}>
            <TouchableOpacity
            onPress={() => 
                {
                    setViewImage(false);
                }}
            style={styles.retakeButton}
            >
            <Text style={styles.retakeButtonText}>Retake</Text>
            </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={camera}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.toggleButton} onPress={toggleCameraFacing}>
            <MaterialIcons name="flip-camera-ios" size={24} color="white" />
          </TouchableOpacity>

          <Pressable onPress={() => takePicture()} style={styles.captureButton}>
            <View style={styles.captureInner} />
          </Pressable>

          <Pressable style={styles.smallReviewCont} onPress={()=> setViewImage(true)}>
            {picture && (
                <Image
                source={{ uri: 'data:image/jpg;base64,' + picture.base64 }}
                style={styles.smallReviewContImg}
                />
            )}
          </Pressable>
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
    padding: 20,
    backgroundColor: '#000',
  },
  permissionText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    position: 'absolute',
    top: 15,
    right: 10,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 5,
  },

  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#ddd',
  },
  captureInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF4500',
  },
  imagePreviewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  bottomContainer: {
    width: '100%',
    height: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  previewImage: {
    width: '100%',
    height: '90%',
  },
  retakeButton: {
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 8,
  },
  retakeButtonText: {
    color: '#fff',
    fontSize: 16,
  },

  smallReviewCont: {
    width: 100,
    height: 60,
    // borderRadius: 10,
    position: 'absolute',
    left: 10,
    bottom: 25,
    backgroundColor: 'rgba(0, 0, 0, .1)',
  },

  smallReviewContImg:
  {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  }
});
