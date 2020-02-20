import React, { Component } from 'react'
import _ from 'lodash'

import { HashRouter as Router, Switch, Route, Link } from 'react-router-dom'

import { HeaderView } from './HeaderView'
import { ResponseItem } from './ResponseItem'
import { ResponseEditForm } from './ResponseEditForm'
import { BellButtonsForm } from './BellButtonsForm'
import { SettingsModel } from '../models/SettingsModel'
import { SubmissionList } from './SubmissionList'
import { SubmissionDetails } from './SubmissionDetails'

import { post, get } from '../utils'
import config from '../config'

function SettingsDataFactory(data) {
    return (new SettingsModel(data)).data
}

class MainView extends Component {
    constructor() {
        super()

        this.state = {
            data : SettingsDataFactory(),
            spinner : false
        }

        this.changes = {}
    }

    componentDidMount() {
        this.loadSettings()
    }

    saveSettings(attribute, data) {
        let changes = _.set({}, attribute, data)

        post(config.apiAdress + '/settings', changes)
            .then(json => {
                this.setState({ data: SettingsDataFactory(json.data) })
            }).catch(() => {
                alert('Error: No connection')
            })
    }

    loadSettings() {
        get(config.apiAdress + '/settings')
            .then(json => {
                this.setState({ data: SettingsDataFactory(json.data) })
            })
    }

    onFormChange(attribute, data) {
        var obj = {}
        obj[attribute] = data
        this.changes = Object.assign({}, this.changes, obj)
    }
    
    render() {
        var { data } = this.state
        return (
            <Router>
                <Switch>
                    <Route path='/submissions/:id'>
                        <div>
                            <HeaderView/>
                            <SubmissionDetails/>
                        </div>
                    </Route>
                    <Route path='/submissions'>
                        <div>
                            <HeaderView/>
                            <SubmissionList/>
                        </div>
                    </Route>
                    <Route path='/edit/:attribute'>
                        <div>
                            <HeaderView/>
                            <ResponseEditForm data={data} languages={data.languages}
                                onSave={(attribute, data) => this.saveSettings(attribute, data)}/>
                        </div>
                    </Route>
                    <Route path="/">
                        <div>
                            <HeaderView/>
                            <h2>Submissions</h2>
                            <Link to='submissions'><button>View Submissions</button></Link>
                            <h2>Responses</h2>
                            <ResponseItem 
                                attribute="greeting" 
                                text="First response after pressing a button. Ask for the name here."
                                data={data.greeting}/>
                            <ResponseItem
                                attribute="question" 
                                text="Question which is asked to the user. {{NAME}} will be replaced by the name asked for before."
                                data={data.question}/>
                            <ResponseItem 
                                attribute="goodbye" 
                                text="Goodbye to the user."
                                data={data.goodbye}/>
                            <h2>Buttons</h2>
                            <BellButtonsForm data={data.buttons} languages={data.languages}
                                onSave={(data) => this.saveSettings('buttons', data)}/>
                        </div>
                    </Route>
                </Switch>
            </Router>
        )
    }
}
    
export { MainView }
    