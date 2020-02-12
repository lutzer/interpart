import React, { Component } from 'react'

import { HeaderView } from './HeaderView'
import { ResponseForm } from './ResponseForm'
import { SpinnerOverlay } from './SpinnerOverlay'

const apiAdress = 'http://localhost:3030'

function post(adress, data) {
    return fetch(adress, 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
}

function get(address) {
    return fetch(address)
        .then(response => response.json())
}

class MainView extends Component {
    constructor() {
        super()

        this.state = {
            data : {
                greeting: {},
                question: {},
                goodbye: {},
                languages: [ 'de', 'en']
            },
            spinner : false
        }

        this.changes = {}
    }

    componentDidMount() {
        this.loadSettings()
    }

    loadSettings() {
        get(apiAdress + '/settings/')
            .then(json => {
                this.setState({ data: json.data })
            })
    }

    saveSettings() {
        this.setState({ spinner: "Saving Settings ..." })
        post(apiAdress + '/settings/', this.changes)
            .then(() => {
                this.setState({ spinner: false })
                alert('Settings saved')
            })
            .catch(() => {
                this.setState({ spinner: false })
                alert('Error: No connection')
            })
    }

    onFormChange(attribute, data) {
        var obj = {}
        obj[attribute] = data
        this.changes = Object.assign({}, this.changes, obj)
    }
    
    render() {
        var { data, spinner } = this.state
        return (
            <div>
                {spinner && <SpinnerOverlay text={spinner}/>}
                <HeaderView/>
                <ResponseForm 
                    title="Greeting" 
                    text="First response after pressing a button. Ask for the name here."
                    data={data.greeting}
                    languages={data.languages}
                    onChange={ (data) => this.onFormChange('greeting', data)}/>
                <ResponseForm
                    title="Question" 
                    text="Question which is asked to the user. {{NAME}} will be replaced by the name if asked for."
                    data={data.question}
                    languages={data.languages}
                    onChange={ (data) => this.onFormChange('question', data)}/>
                <ResponseForm 
                    title="Goodbye" 
                    text="Goodbye to the user."
                    data={data.goodbye}
                    languages={data.languages}
                    onChange={ (data) => this.onFormChange('goodbye', data)}/>
                <button onClick={() => this.saveSettings()}>Save Settings</button>
            </div>
        )
    }
}
    
export { MainView }
    