import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Alert, DeviceEventEmitter } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import ReactNativeBlobUtil from 'react-native-blob-util';


const CameraComponent = ({setScreen, callBackManager}) => {
    const cameraRef = useRef(null);
    
    const device = useCameraDevice('back');
    const { hasPermission, requestPermission } = useCameraPermission();

     const takePhoto = async () => {
      try {
          const photo = await cameraRef.current.takePhoto();

          // 파일을 base64로 변환
          const base64 = await ReactNativeBlobUtil.fs.readFile(photo.path, 'base64');

          // 이벤트 발생 - CameraManager가 기다리는 Promise 완료
          DeviceEventEmitter.emit('cameraPhotoTaken', {
              base64: base64,
              path: photo.path
          });

          setScreen('main');
      } catch (error) {
          DeviceEventEmitter.emit('cameraCancelled');
      }
  };

  const closeCamera = () => {
      // 취소 이벤트 발생
      DeviceEventEmitter.emit('cameraCancelled');
      setScreen('main');
  };
    // 권한이 없으면 권한 요청 후 메인 화면으로 이동
    if (!hasPermission) {
        const requestAndReturn = async () => {
            await requestPermission();
            setScreen('main');
        };
        
        Alert.alert('권한 필요', '카메라 권한이 필요합니다.', [
            { text: '확인', onPress: requestAndReturn }
        ]);
        return null;
    }

    // 카메라 디바이스가 없으면 메인 화면으로 이동
    if (!device) {
        Alert.alert('카메라 오류', '카메라를 사용할 수 없습니다.', [
            { text: '확인', onPress: () => setScreen('main') }
        ]);
        return null;
    }

    return (
        <View style={styles.cameraContainer}>
            <Camera
                ref={cameraRef}
                style={styles.camera}
                device={device}
                isActive={true}
                photo={true}
            />
            <View style={styles.cameraControls}>
                <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
                    <Text style={styles.captureButtonText}>촬영</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeButton} onPress={closeCamera}>
                    <Text style={styles.closeButtonText}>닫기</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    cameraContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'black',
        zIndex: 999,
    },
    camera: {
        flex: 1,
    },
    cameraControls: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 50,
    },
    captureButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureButtonText: {
        color: 'black',
        fontWeight: 'bold',
    },
    closeButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    permissionContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    permissionText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 30,
    },
    permissionButton: {
        backgroundColor: 'white',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 10,
    },
    permissionButtonText: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CameraComponent;
