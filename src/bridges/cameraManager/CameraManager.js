import CallbackManager from "../callBackManager/CallbackManager";
import { DeviceEventEmitter } from "react-native";

class CameraManager extends CallbackManager {
    _createResult = () => {
        return new Promise((resolve, reject) => {
            console.log('📷 카메라 화면으로 전환');
            
            this.router('camera');

            const subscription = DeviceEventEmitter.addListener('cameraPhotoTaken', (result) => {
                console.log('📸 사진 촬영 완료, base64 받음');
                subscription.remove();
                resolve(result.base64);
            });

            const cancelSubscription = DeviceEventEmitter.addListener('cameraCancelled', () => {
                console.log('❌ 카메라 취소됨');
                cancelSubscription.remove();
                subscription.remove();
                reject('Camera cancelled');
            });
        });
    }
}

export default CameraManager;