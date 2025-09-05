import { NativeModules } from "react-native";
import InitModel from '../models/InitializeModel'

const { CameraPermissionHandler} = NativeModules;

class CameraPermissionManager extends InitModel  {    
    todo = async () => {

        const hasPermission = await CameraPermissionHandler.checkCameraPermission();
        if (hasPermission) {
            return true;
        } 

        const res = await CameraPermissionHandler.requestCameraPermission();
        return true;
        
    }
}

export default CameraPermissionManager;