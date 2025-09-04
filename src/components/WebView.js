import React, { useRef, useState, useEffect } from 'react';
import { Alert, StyleSheet, Platform, PermissionsAndroid, View, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import { BridgeFactory } from '../bridges/BridgeFactory'
import AppInfo from '../../app.json';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { useScreen } from '../context/ScreenContext';


const injectedJavaScript = `
console.log('🚀 injectedJavaScript 실행됨');
// 콜백 객체
if (!window.nativeCallbacks) {
    window.nativeCallbacks = {};
    console.log('✅ nativeCallbacks 초기화됨');
}

window.callNativeAsync = function(method, params) {
    return new Promise((resolve, reject) => {
        // 간단한 UUID 생성 함수 (문자로 시작)
        const generateUUID = () => {
            return 'cb_xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0;
                const v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        };
        const callbackId = generateUUID();
        console.log('📤 메시지 전송:', callbackId);

    window.nativeCallbacks[callbackId] = function(response) {
        const res = JSON.parse(response)
        if (res.error) {
            reject(new Error(res.error));
        } else {
            resolve(res.result);
        }
    }

    window.ReactNativeWebView.postMessage(JSON.stringify({
        type : method,
        param : params || {},
        id : callbackId
    })); 
    });
}

const origin = navigator.userAgent;
const originAgent = { agent : origin, type : 'userAgent' }
window.ReactNativeWebView.postMessage(JSON.stringify(originAgent));

true;
`;

const WebViewComponent = ({ startUrl, setUrl }) => {
    const webViewRef = useRef(null);
    const cameraRef = useRef(null);
    const [customUserAgent, setCustomUserAgent] = useState(null);
    const [showCamera, setShowCamera] = useState(false);
    const { setCurrentScreen } = useScreen();

    const takePhoto = async () => {
        try {
            if (!cameraRef.current) return;
            
            const photo = await cameraRef.current.takePhoto({
                qualityPrioritization: 'quality',
                flash: 'auto',
            });
            
            console.log('사진 촬영 완료:', photo.path);
            
            // 카메라 숨기기
            setShowCamera(false);
            
            // WebView에 결과 전달
            const result = {
                type: 'camera',
                action: 'photo',
                success: true,
                data: photo.path
            };
            
            webViewRef.current?.injectJavaScript(`
                window.ReactNativeWebView.postMessage(${JSON.stringify(result)});
            `);
        } catch (error) {
            console.error('Photo capture error:', error);
            Alert.alert('사진 촬영 실패', '사진을 촬영할 수 없습니다.');
            setShowCamera(false);
        }
    };

    const checkSyncBridge = (data) => {
        const target = JSON.parse(data);

        if (target.type === 'userAgent') {
            const originAgent = target.agent;
            const clientAgent = AppInfo.userAgent;
            const result = originAgent + clientAgent;
            setCustomUserAgent(result);
            return true;
        }

        return false;
    }
    
    const messageHandler =  (event) => {
        const bridgeData = event.nativeEvent.data;
    
        if (checkSyncBridge(bridgeData)) {
            // 임시 return 없는 bridge
            return;
        }
        
        const webview = webViewRef.current;
        const bridgeCls = BridgeFactory.create(bridgeData, webview, setCurrentScreen);
        bridgeCls.evaluateJs();
    };

    const downloadHandler = async (nativeEvent) => {
        const {url, filename, contentType} = nativeEvent;

        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);

            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                alert('다운로드 권한 없음');
                return;
            }
        }
            
        try {
            const {config, fs} = ReactNativeBlobUtil;
            const downloadDir = Platform.OS === 'ios' 
            ? fs.dirs.DocumentDir 
            : fs.dirs.DownloadDir;
            
            const configOptions = Platform.select({
                ios: {
                    fileCache: true,
                    path: `${downloadDir}/${filename}`,
                    appendExt: filename.split('.').pop(),
                },
                android: {
                    fileCache: true,
                    addAndroidDownloads: {
                        useDownloadManager: true,
                        notification: true,
                        mediaScannable: true,
                        title: filename,
                        path: `${downloadDir}/${filename}`,
                    },
                },
            });

            const response = await config(configOptions).fetch('GET', url);
            
            if (Platform.OS === 'ios') {
                Alert.alert('다운로드 완료', `파일이 저장되었습니다: ${response.path()}`);
            }
        } catch (error) {
            Alert.alert('다운로드 실패', error.message);
        }
    }

    const interceptor = (status) => {
        console.log('🌐 WebView 상태 변경:', status.url, status.loading);
    };

    const onError = (error) => {
        alert(`webview Error${error}`);
        console.log('❌ WebView 에러:', error);
    };
    
    return (
        <SafeAreaView style={styles.container}>
            <WebView
                ref={webViewRef}
                source={{ uri: startUrl }}
                style={styles.webview}
                onNavigationStateChange={interceptor}
                onError={onError}
                webviewDebuggingEnabled={true}
                onMessage={messageHandler}
                sharedCookiesEnabled={true}
                onLoadEnd={() => {
                    webViewRef.current?.injectJavaScript(injectedJavaScript);
                }}
                onShouldStartLoadWithRequest={(request)=> {
                    if (request.url.includes('download')||
                    request.url.match(/\.(pdf|doc|xls|xlsx)$/)) {
                        // 파일명 추출
                        const filename = request.url.split('/').pop() || 'download';
                        downloadHandler({
                            url: request.url,
                            filename: filename,
                            contentType: 'application/octet-stream'
                        });
                        return false;
                    } 
                    return true;
                }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                mixedContentMode="compatibility"
                allowsInlineMediaPlaybook={true}
                userAgent={customUserAgent}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default WebViewComponent;






