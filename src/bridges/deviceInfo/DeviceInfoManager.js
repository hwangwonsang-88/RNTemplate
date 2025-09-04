import DeviceInfo from 'react-native-device-info';
import CallbackManager from '../callBackManager/CallbackManager';

class DeviceInfoManager extends CallbackManager {

    _createResult = () => {
        const infoObj = {}; 
        return DeviceInfo.getUniqueId()
        .then(res => {
            infoObj['uuid'] = res;
            const system = DeviceInfo.getSystemName();     
            infoObj['system'] = system;

            const version = DeviceInfo.getSystemVersion();
            infoObj['system_version'] = version;

            return infoObj;
        })
        .catch(() => {
            return 'Device Info error';
        })
    }
}

export default DeviceInfoManager;