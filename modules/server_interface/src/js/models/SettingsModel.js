

class SettingsModel {

    constructor(data = {}) {
        this.data = Object.assign({},{
            greeting: {},
            question: {},
            goodbye: {},
            languages: [ 'de', 'en'],
            buttons : [],
            skipName: false,
            sendToApi: false,
            bellId: '',
            tags: '',
            location : {}
        }, data)
    }
    
}

export { SettingsModel }