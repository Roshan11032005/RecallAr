import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraRef, setCameraRef] = useState(null);
  const [ws, setWs] = useState(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const websocket = new WebSocket('wss://2114-2402-e280-212e-e5-5982-15cb-9f5c-f4b1.ngrok-free.app/ws/face-match'); // Replace with your server IP
    websocket.onopen = () => {
      console.log('WebSocket connected');
    };
    websocket.onmessage = (event) => {
      const response = JSON.parse(event.data);
      if (response.error) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.error,
          visibilityTime: 3000,
        });
      } else {
        Toast.show({
          type: 'success',
          text1: 'Match Result',
          text2: `Person: ${response.name}`,
          visibilityTime: 3000,
        });
      }
    };
    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      Toast.show({
        type: 'error',
        text1: 'WebSocket Error',
        text2: 'Failed to connect to server',
        visibilityTime: 3000,
      });
    };
    websocket.onclose = () => {
      console.log('WebSocket closed');
    };
    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  // Capture photo and send to WebSocket
  const takePicture = async () => {
    if (cameraRef && ws && ws.readyState === WebSocket.OPEN) {
      try {
        const photo = await cameraRef.takePictureAsync({ base64: true });
        const payload = { image: photo.base64 };
        ws.send(JSON.stringify(payload));
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Capture Error',
          text2: 'Failed to capture or send image',
          visibilityTime: 3000,
        });
      }
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={(ref) => setCameraRef(ref)}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Capture</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
    justifyContent: 'space-between',
  },
  button: {
    flex: 0.4,
    alignSelf: 'flex-end',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 5,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});