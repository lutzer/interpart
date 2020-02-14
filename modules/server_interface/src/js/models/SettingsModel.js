

class SettingsModel {

    constructor(data = {}) {
        this.data = Object.assign({},{
            greeting: {},
            question: {},
            goodbye: {},
            languages: [ 'de', 'en'],
            buttons : []
        }, data)
    }
    
}

export { SettingsModel }