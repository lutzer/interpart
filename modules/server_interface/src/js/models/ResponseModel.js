import { post } from '../utils'
import config from '../config'

class ResponseModel {

    constructor(data = {}) {
        this.data = Object.assign({},{
            text: '',
            language: '',
            translations: []
        },data)
    }
    
    translate() {
        return post(config.apiAdress + '/translate', this.data)
    }
}

export { ResponseModel }