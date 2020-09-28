import { baseConfig } from '../config/baseConfig'
class Api {
    static apiList = {
        test: {
            url: '/singlePoetry',
            method: 'get',
            model: ''
        }
    }
    getApiList() {
        return Api.apiList
    }
}


export default new Api()