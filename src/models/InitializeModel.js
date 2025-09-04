class InitializeModel {

    todo = async () => {
        // override 해야함
        // 성공 true, 실패 false 반환 해야함
        // try catch로 해서 throw new Error(msg)
    }

    start = async () => {
       return await this.todo();
    }
}

export default InitializeModel;