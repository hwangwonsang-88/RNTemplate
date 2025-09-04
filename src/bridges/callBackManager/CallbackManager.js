class CallbackManager {

    constructor(webview, msg, router) {

        const obj = JSON.parse(msg);

        this.webview = webview;
        this.callBackID = obj.id;
        this.param = obj.param;
        this.js = '';
        this.router = router;
    }

    evaluateJs = () => {
        this.js = '';
        this._createResult()
        .then(res => {
            const successMsg = this._createSuccessMsg(res);
            this.js = this._baseCallBackString(successMsg);
        })
        .catch(err => {
            this.js = this._createErrMsg(err);
        })
        .finally(() => {
            this.js = this.js + this._deleteCallBack();
            this.webview.injectJavaScript(this.js);
        })
    }

    _createResult = () => {
        /*
        ovveride 해야함
        RN webview에서 JS 실행 컨텍스트가 await이 아닌 관계로
        await이 아닌 then catch로 일단 작성 

        결과물을 문자열로 리턴해야함
        this.js로 리턴값을 저장해야함!!!
        */
    }

    _createErrMsg = (errMsg) => {
        return JSON.stringify({ error: errMsg });
    }

    _createSuccessMsg = (msg) => {
        return JSON.stringify({ result: msg });
    }

    _baseCallBackString = (result) => {
        // result는 이미 JSON.stringify된 문자열이므로 따옴표 제거
        return `window.nativeCallbacks['${this.callBackID}'](${result});`
    }

    _deleteCallBack = () => {
        return `delete window.nativeCallbacks['${this.callBackID}'];`;
    }
}

export default CallbackManager;

