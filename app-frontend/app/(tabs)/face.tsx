import React, { useEffect, useState, useRef } from 'react';
     import { StyleSheet, Text, View } from 'react-native';
     import { Camera, Frame, useCameraDevice } from 'react-native-vision-camera';
     import { Face, FaceDetectionOptions } from 'react-native-vision-camera-face-detector';

     export default function FaceRecognition() {
       const [hasPermission, setHasPermission] = useState(false);
       const [faces, setFaces] = useState<Face[]>([]);
       const device = useCameraDevice('front');
       const faceDetectionOptions = useRef<FaceDetectionOptions>({
         performanceMode: 'fast',
         landmarkMode: 'all',
         contourMode: 'none',
         classificationMode: 'all',
         minFaceSize: 0.15,
         trackingEnabled: true,
         autoMode: false,
       }).current;

       useEffect(() => {
         (async () => {
           const status = await Camera.requestCameraPermission();
           setHasPermission(status === 'authorized');
           console.log({ status });
         })();
       }, []);

       const handleFacesDetection = (faces: Face[], frame: Frame) => {
         setFaces(faces);
         console.log('Faces detected:', faces.length, 'Frame:', frame.toString());
       };

       if (!hasPermission) {
         return <Text>No camera access.</Text>;
       }

       if (!device) {
         return <Text>No camera device available.</Text>;
       }

       return (
         <View style={styles.container}>
           <Camera
             style={styles.camera}
             device={device}
             isActive={true}
             faceDetectionCallback={handleFacesDetection}
             faceDetectionOptions={faceDetectionOptions}
             pixelFormat="yuv"
           />
           {faces.length > 0 && (
             <Text style={styles.faceText}>
               Detected {faces.length} face(s)
             </Text>
           )}
         </View>
       );
     }

     const styles = StyleSheet.create({
       container: {
         flex: 1,
         backgroundColor: '#000',
         justifyContent: 'center',
       },
       camera: {
         flex: 1,
         aspectRatio: 3 / 4,
       },
       faceText: {
         position: 'absolute',
         bottom: 20,
         left: 20,
         color: 'white',
         fontSize: 18,
       },
     });