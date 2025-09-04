import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
  Image,
  Platform,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const IntroView = ({ onSplashComplete }) => {
  const isDone = useRef(false);

  useEffect(() => {
    const reqPermissions = async () => {

      const permissionManagers = [
      ];

      for (const manager of permissionManagers) {
        await manager.start();
      }
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