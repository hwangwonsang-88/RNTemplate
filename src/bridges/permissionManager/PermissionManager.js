import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import { Platform, Alert } from "react-native";
import InitializeModel from '../../models/InitializeModel';

class CameraPermissionManager extends InitializeModel {
    todo = async () => {
        const permission = Platform.select({
            android : PERMISSIONS.ANDROID.CAMERA,
            ios : PERMISSIONS.IOS.CAMERA
        });

        const permissionResult = await this._check(permission);

        if (permissionResult !== RESULTS.GRANTED) {
            await request(permission)
            return true;
        }

        return true;
    }

    _check = async (permission) => {
        const hasPermission = await check(permission);
        return hasPermission;
    }
}

export default CameraPermissionManager;