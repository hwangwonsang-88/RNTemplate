
import AsyncStorage from "@react-native-async-storage/async-storage";

// session cookie 및 접속 url 등 내부의 모든 정보를 관리 -> 차후 기능에 따라 분배

export default class AppConfig {
    constructor(info) {
        this.startUrl = info.startUrl;
        this.session = null;
    }

    start = async () => {
        try {
            console.log('let do start 🙏')
            const session = await this._hasSession();
            if (session) {
            this.session = session;
            }
        } catch {
            console.log('AppConfig init error 💣');
        }
    }

    _hasSession = async () => {
        try {
            let signed = await this._getData('session');
            if (signed) {
                signed = JSON.parse(signed)
                console.log(`👍 at hasSigned`);
                console.log(signed)
            }
            return signed
        } catch (error) {
            throw error;
        }
    }

    saveSession = async (session) => {
        try {
            const jsonString = JSON.stringify(session);
            await this._storeData('signed',jsonString);
            this._setSigned(true);
            console.log(`👍 at saveData`);
        } catch (error) {
            throw error;
        }
    }

    _removeData = async (key) => {
        try {
            await AsyncStorage.removeItem(key);
            console.log(`👍 at removeData`);
        } catch {
            console.log(`💣 at removedata, ${key}`)
            throw new Error('removeData Error');
        }
    }

    _storeData = async (key, value) => {
        try {
            const json = JSON.stringify(value);
            await AsyncStorage.setItem(key, json);
            console.log(`👍 at storeData`);
        } catch {
            console.log(`💣 at storedata, ${key}`)
            throw new Error('storeData Error');
        }
    }

    _getData = async (key) => {
        try {
            const data = await AsyncStorage.getItem(key);
            return data;
        } catch {
            throw new Error('getData Error');
        }
    }
}