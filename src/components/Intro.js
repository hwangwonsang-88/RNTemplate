import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
  Image,
  Platform,
} from 'react-native';

import CameraPermissionManager from '../permissions/CameraPermissionManager'

const { width, height } = Dimensions.get('window');

const IntroView = ({ onSplashComplete }) => {
  const isDone = useRef(false);

  useEffect(() => {
    const reqPermissions = async () => {
      console.log('reqPermissions - START');

      const permissionManagers = [
        new CameraPermissionManager()
      ];

      console.log('Starting permission managers...');
      for (const manager of permissionManagers) {
        console.log('Starting manager:', manager.constructor.name);
        const result = await manager.start();
        console.log('Manager result:', result);
      }
      console.log('All permissions done');
      isDone.current = true;
    }
    
    const interval = setInterval(() => {
      if (isDone.current) {
        onSplashComplete();
        clearInterval(interval);
      }
    }, 2000);

    reqPermissions(); 
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <StatusBar 
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
        hidden={true}
      />
      <View style={styles.container}>
        <Image
          source={require('../../splash/cat.png')}
          style={styles.splashImage}
          resizeMode="contain"
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashImage: {
    width: width * 0.6,
    height: height * 0.3,
  },
});

export default IntroView;