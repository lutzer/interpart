

class SettingsModel {

    constructor(data = {}) {
        this.data = Object.assign({},{
            greeting: {},
            question: {},
            goodbye: {},
            languages: [ 'de', 'en'],
            buttons : [],
            skipName: false
        }, data)
    }
    
}

export { SettingsModel }