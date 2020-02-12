import React, { Component } from 'react'

import { HeaderView } from './HeaderView'
import { ResponseForm } from './ResponseForm'

const apiAdress = 'http://localhost:3030'

class MainView extends Component {
    constructor() {
        super()

        this.state = {
            data : {
                greeting: {},
                question: {},
                goodbye: {}
            }
        }
    }

    componentDidMount() {
        this.loadSettings()
    }

    loadSettings() {
        fetch(apiAdress + '/settings/')
            .then(response => response.json())
            .then(json => { 
                this.setState({ 
                    data: {
                        greeting: json.data.greeting,
                        question: json.data.questions[0],
                        goodbye: json.data.goodbye
                    }
                })
            })
    }

    saveSettings() {

    }
    
    render() {
        var { data } = this.state
        return (
            <div>
                <HeaderView/>
                <ResponseForm 
                    title="Greeting" 
                    text="First response after pressing a button. Ask for the name here."
                    data={data.greeting}/>
                <ResponseForm
                    title="Question" 
                    text="Question which is asked to the user. {{NAME}} will be replaced by the name if asked for."
                    data={data.question}/>
                <ResponseForm 
                    title="Goodbye" 
                    text="Goodbye to the user."
                    data={data.goodbye}/>
            </div>
        )
    }
}
    
export { MainView }
    