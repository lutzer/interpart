/*
 * @Author: Lutz Reiter - http://lu-re.de 
 * @Date: 2019-03-29 19:20:39 
 * @Last Modified by: Lutz Reiter - http://lu-re.de
 * @Last Modified time: 2020-02-20 13:52:21
 */

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const express = require('express')
const bodyParser = require('body-parser')
const _ = require('lodash')

const { SubmissionModel } = require('./models/SubmissionModel') 
const { ResponseModel } = require('./models/ResponseModel') 
const config = require('./config')

function getSettings() {
    const adapter = new FileSync(config.settingsFile)
    const db = low(adapter)
    
    // set defaults
    db.defaults({ settings: {
        greeting: (new ResponseModel()).data,
        goodbye : (new ResponseModel()).data,
        question : (new ResponseModel()).data,
        languages : _.sortBy(config.languages),
        buttons: _.fill(Array(config.numberOfButtons), { language : 'de' })
    }}).write()

    return db
}

function getDatabase() {
    const adapter = new FileSync(config.databaseFile)
    const db = low(adapter)
    
    // set defaults
    db.defaults({ submissions: [] }).write()
    
    return db
}

function setupRoutes(app) {
    app.use(bodyParser.json())

    // use cors only in development mode
    if (process.env.__DEV__) {
        const cors = require('cors')
        app.use('/settings',cors())
        app.use('/translate',cors())
        app.use('/submissions',cors())
    }   

    app.get('/submissions/list', (req, res) => {
        const db = getDatabase()

        let data = db.get('submissions').value()

        let submissions = _.map(data, (entry) => new SubmissionModel(entry))

        if (_.has(req.query,'lang')) {
            let translations = _.map(submissions, (entry) => {
                return entry.getLanguage(req.query.lang)
            })

            res.send({ data: _._.compact(translations) })
        } else
            res.send({ data: _.map(submissions, (s) => s.data) })
    })

    app.get('/submissions/:id', (req, res) => {
        const db = getDatabase()
        let data = db.get('submissions').find({ id: req.params.id }).value()
        res.send({ data: data })
    })

    app.post('/submissions/add', async (req, res) => {
        const db = getDatabase()
        try {

            if (!SubmissionModel.validate(req.body))
                throw 'Validation failed'
            
            var submission = new SubmissionModel(req.body)
            await submission.translate()

            db.get('submissions').push(submission.data).write()

            res.send({ data: submission.data})
        } catch (err) {
            console.log(err)
            res.status(400).send({error: err})
        } 
    })

    app.get('/response/greeting', async (req, res) => {
        try {
            const greeting = new ResponseModel( getSettings().get('settings.greeting').value() )
            if (_.has(req.query,'lang')) {
                res.send({ data: greeting.getLanguage(req.query.lang) })
            } else
                res.send({ data: greeting.data })
        } catch (err) {
            console.log(err)
            res.status(400).send({error: err})
        }
    })

    app.get('/response/question', async (req, res) => {
        try {
            const question = new ResponseModel( getSettings().get('settings.question').value() )

            if (_.has(req.query,'lang')) {
                res.send({ data: question.getLanguage(req.query.lang) })
            } else
                res.send({ data: question.data })
        } catch (err) {
            console.log(err)
            res.status(400).send({error: err})
        }
    })

    app.get('/response/goodbye', async (req, res) => {
        try {
            const greeting = new ResponseModel( getSettings().get('settings.goodbye').value() )

            if (_.has(req.query,'lang')) {
                res.send({ data: greeting.getLanguage(req.query.lang) })
            } else
                res.send({ data: greeting.data })
        } catch (err) {
            console.log(err)
            res.status(400).send({error: err})
        }
    })

    app.post('/translate', async(req, res) => {
        try {
            if (!ResponseModel.validate(req.body))
                throw 'Validation failed'
            
            var response = new ResponseModel(req.body)
            await response.translate()

            res.send({ data: response.data})
        } catch (err) {
            console.log(err)
            res.status(400).send({error: err})
        } 
    })

    app.get('/settings', async (req, res) => {
        try {
            const settings = getSettings().get('settings').value()
            res.send({ data: settings })
        } catch (err) {
            console.log(err)
            res.status(400).send({error: err})
        }
    })

    app.post('/settings', async (req, res) => {
        try {
            const settingsDb = getSettings()
            var settings = settingsDb.get('settings').value()

            // check if greeting changed
            if (_.has(req.body,'greeting')) {
                const greeting = new ResponseModel(req.body.greeting)
                settings.greeting = greeting.data
            }

            // check if goodbye changed
            if (_.has(req.body,'goodbye')) {
                const goodbye = new ResponseModel(req.body.goodbye)
                settings.goodbye = goodbye.data
            }

            // check if question changed
            if (_.has(req.body,'question')) {
                const question = new ResponseModel(req.body.question)
                settings.question = question.data
            }

            // check if buttons were changed
            if (_.has(req.body, 'buttons') && _.isArray(req.body.buttons) ) {
                req.body.buttons.forEach( (ele,i) => {
                    if (ele)
                        settings.buttons[i] = ele
                })
            }

            // save to database
            settingsDb.set('settings', settings).write()
                
            res.send({ data: settings })
        } catch (err) {
            console.log(err)
            res.status(400).send({error: err})
        }        
    })

    // serve admin interface
    app.use('/',express.static('./www/'))

    
}

const app = express()
setupRoutes(app)


module.exports = { app, getDatabase, getSettings }