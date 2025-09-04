import CookieManager from "@react-native-cookies/cookies";

class RNCookieManager {

    constructor() {}

    setCookie = async (url,session) => {
        // session 없으면 실행안함
        if (!session) {
            console.log('🤔 no session info at set cookie');
            return;
        }

        // session.param 없으면 실행안함
        if (!session.param) {
            console.log('🤔 no session.param info at set cookie');
            return;
        }
           
        await CookieManager.set(url, {
            name : session.param.name,
            value : session.param.value,
            path : session.param.path,
            expires : session.param.expires,
            domain : session.param.domain
        });
    }

    _getCookie = async (url) => {
        return await CookieManager.get(url)
    }

    getSessionCookie = async (url, cookieName) => {
        const cookies = await this._getCookie(url);
        return cookies[cookieName];
    }
}


export default RNCookieManager;