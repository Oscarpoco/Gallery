import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function CameraScreen({ picture, setPicture }) {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
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
    const options = {
      quality: 1,
      base64: true,
      exif: true,
    };

    const pic = await camera.current.takePictureAsync(options);
    setPicture(pic);
  };
//   ENDS

// FLIP CAMERA
  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }
//   ENDS

// UPLOAD
  const sendPic = () => {
    console.log('Sending picture...');
  };
//   ENDS

// SKIPPING ALL THE FUNCTIONS IF THERE'S A PICTURE
  if (picture) {
    return (
      <View style={styles.imagePreviewContainer}>
        <Image
          source={{ uri: 'data:image/jpg;base64,' + picture.base64 }}
          style={styles.previewImage}
        />
        <Pressable
          onPress={() => sendPic()}
          style={styles.sendButtonContainer}
        >
          <MaterialIcons name="send" size={30} color="white" />
        </Pressable>
        <TouchableOpacity
          onPress={() => setPicture(null)}
          style={styles.retakeButton}
        >
          <Text style={styles.retakeButtonText}>Retake</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={camera}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.toggleButton} onPress={toggleCameraFacing}>
            <MaterialIcons name="flip-camera-ios" size={24} color="white" />
            <Text style={styles.buttonText}>Flip</Text>
          </TouchableOpacity>

          <Pressable onPress={() => takePicture()} style={styles.captureButton}>
            <View style={styles.captureInner} />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 20,
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
  previewImage: {
    width: '100%',
    height: '100%',
  },
  sendButtonContainer: {
    position: 'absolute',
    bottom: 40,
    right: 30,
    backgroundColor: '#1E90FF',
    padding: 15,
    borderRadius: 50,
  },
  retakeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 8,
    zIndex: 20,
    position: 'absolute',
    bottom: 50,
    left: 30,
  },
  retakeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
