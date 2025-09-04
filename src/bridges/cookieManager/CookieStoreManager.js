import CallbackManager from "../callBackManager/CallbackManager";
import AsyncStorage from "@react-native-async-storage/async-storage";

class CookieStoreManager extends CallbackManager {
    _createResult = () => {
        if (this.param.cmd === 'save') {
            const session = {...this.param.param};
            const sessionString = JSON.stringify(session);
            return AsyncStorage.setItem('session', sessionString)
        .then(() => {
            return 'success in save';
        })
        .catch(() => {
            return 'failure in save';
        })
        } else if (this.param.cmd === 'remove') {
            return AsyncStorage.removeItem('session')
            .then(() => {
                return 'success';
            })
            .catch(() => {
                return 'failure';
            })  
        } else {
            return 'No shit';
        }
    }
}

export default CookieStoreManager;  

