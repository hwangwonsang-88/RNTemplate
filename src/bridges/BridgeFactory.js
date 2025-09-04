import DeviceInfoManager from './deviceInfo/DeviceInfoManager'
import CookieStoreManager from './cookieManager/CookieStoreManager'
import CameraManager from './cameraManager/CameraManager'

export class BridgeFactory {
    static classMap = {
        'device' : DeviceInfoManager,
        'session' : CookieStoreManager,
        'camera' : CameraManager
    }
    
    static create(dataObj, webview, router) {
        const targetObj = JSON.parse(dataObj);
        const cls = this.classMap[targetObj.type.toLowerCase()];
        return new cls(webview, dataObj, router);
    }
}   