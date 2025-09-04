/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
  
import React, { useEffect, useRef, useState } from 'react';
import { StatusBar, useColorScheme, StyleSheet } from 'react-native';
import { View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import WebViewComponent from './src/components/WebView';
import IntroView from './src/components/Intro';
import AppConfig from './src/models/AppConfig';
import AppInfo from './app.json';
import RNCookieManager from './src/bridges/cookieManager/CookieManager';
import { ScreenProvider, useScreen } from './src/context/ScreenContext';
import CameraComponent from './src/components/Camera';

const AppContent = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const appConfigRef = useRef(null);
  const [isConfigReady, setConfigReady] = useState(false);
  const [url, setUrl] = useState(null);
  const { currentScreen, setCurrentScreen } = useScreen();

  // useEffect = lifecycle 때 실행되는것 해당 객체 초기화 때 1번만
  useEffect(() => {
    const startConfig = async () => {
      const appConfig = new AppConfig(AppInfo);
      const rnCookieManager = new RNCookieManager();
      setUrl(appConfig.startUrl)
      appConfigRef.current = appConfig;
      try {
        console.log('start Init🤖')
        await appConfigRef.current.start();
        await rnCookieManager.setCookie(appConfig.startUrl, appConfig.session);
        setConfigReady(true);
      } catch (error) {
        // 에러처리
        console.log('💥 에러 발생:', error);
        setConfigReady(true);
      }
    };
    startConfig();
  }, []);

  if (!isConfigReady || !url) {
    console.log('⏳ 로딩 중... isConfigReady:', isConfigReady, 'url:', url);
    return (<View>
      <Text>Not Ready Yet</Text>
    </View>);
  }

  console.log('🎯 WebView 렌더링 시작. URL:', url);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {/* WebView는 항상 렌더링하되, splash일 때는 숨김 처리 */}
        <View style={[
          styles.webViewContainer,
          currentScreen === 'main' ? styles.webViewVisible : styles.webViewHidden
        ]}>
          {currentScreen === 'main' && (
            <StatusBar 
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
              backgroundColor="transparent"
              translucent={false}
              hidden={false}
            />
          )}
          <WebViewComponent
            // handleSession={handleSession}
            startUrl={url}
            setUrl={setUrl}
          />
        </View>
        
        {/* splash 화면일 때만 IntroView 표시 */}
        {currentScreen === 'splash' && (
          <View style={styles.splashContainer}>
            <IntroView onSplashComplete={() => setCurrentScreen('main')} />
          </View>
        )}
        
        {/* 카메라 화면일 때만 CameraComponent 표시 */}
        {currentScreen === 'camera' && (
          <CameraComponent setScreen={setCurrentScreen} />
        )}
      </View>
    </SafeAreaProvider>
  );
}

const App = () => {
  return (
    <ScreenProvider>
      <AppContent />
    </ScreenProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webViewContainer: {
    flex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  webViewVisible: {
    opacity: 1,
    position: 'relative',
  },
  webViewHidden: {
    opacity: 0,
    position: 'absolute',
  },
  splashContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default App;
