/*
 * @Author: Lutz Reiter - http://lu-re.de 
 * @Date: 2019-03-29 19:20:39 
 * @Last Modified by: Lutz Reiter - http://lu-re.de
 * @Last Modified time: 2020-02-12 02:15:13
 */

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const express = require('express')
const bodyParser = require('body-parser')

const { SubmissionModel } = require('./models/SubmissionModel') 
const { ResponseModel } = require('./models/ResponseModel') 
const _ = require('lodash')
const config = require('./config')

function getSettings() {
    const adapter = new FileSync(config.settingsFile)
    const db = low(adapter)
    
    // set defaults
    db.defaults({ settings: {
        greeting: (new ResponseModel()).data,
        goodbye : (new ResponseModel()).data,
        questions : [ (new ResponseModel()).data ],
        languages : [ "de" , "en"]
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

    app.post('/submissions/add', async (req, res) => {
        const db = getDatabase()
        try {

            if (!SubmissionModel.validate(req.body))
                throw "Validation failed"
            
            var submission = new SubmissionModel(req.body)
            await submission.translate();

            db.get('submissions').push(submission.data).write()

            res.send({ data: submission.data})
        } catch (err) {
            console.log(err)
            res.status(400).send({error: err})
        } 
    })

    app.get('/questions/list', async (req, res) => {
        try {
            const questionData = getSettings().get("settings.questions").value()
            const questions = _.map(questionData, (ele) => {
                let question = new ResponseModel(ele)
                return question
            })

            if (_.has(req.query,'lang')) {
                let translations = _.map(questions, (questions) => {
                    return questions.getLanguage(req.query.lang)
                })
                res.send({ data: _.compact(translations) })
            } else
                res.send({ data: _.map(questions, (q) => q.data) })
        } catch (err) {
            console.log(err)
            res.status(400).send({error: err})
        }
    })

    app.get('/questions/get/:id', async (req, res) => {
        try {
            const question = new ResponseModel( getSettings().get('settings.questions').find({ id : req.params.id }) );
            res.send({ data: question.data })
        } catch (err) {
            console.log(err)
            res.status(400).send({error: err})
        }
    })

    app.get('/response/greeting', async (req, res) => {
        try {
            const greeting = new ResponseModel( getSettings().get("settings.greeting").value() );
            if (_.has(req.query,'lang')) {
                res.send({ data: greeting.getLanguage(req.query.lang) })
            } else
                res.send({ data: greeting.data })
        } catch (err) {
            console.log(err)
            res.status(400).send({error: err})
        }
    })

    app.get('/response/goodbye', async (req, res) => {
        try {
            const greeting = new ResponseModel( getSettings().get("settings.goodbye").value() )

            if (_.has(req.query,'lang')) {
                res.send({ data: greeting.getLanguage(req.query.lang) })
            } else
                res.send({ data: greeting.data })
        } catch (err) {
            console.log(err)
            res.status(400).send({error: err})
        }
    })

    app.get('/settings/', async (req, res) => {
        try {
            const settings = getSettings().get('settings').value()
            res.send({ data: settings })
        } catch (err) {
            console.log(err)
            res.status(400).send({error: err})
        }
    })

    app.post('/settings/', async (req, res) => {
        try {
            const settingsDb = getSettings()
            var settings = settingsDb.get('settings').value()

            // check if greeting changed
            if (_.has(req.body,'greeting') && settings.greeting.text != req.body.greeting.text) {
                const greeting = new ResponseModel(req.body.greeting);
                await greeting.translate();
                settings.greeting = greeting.data;
            }

            // check if goodbye changed
            if (_.has(req.body,'goodbye') && settings.goodbye.text != req.body.goodbye.text) {
                const goodbye = new ResponseModel(req.body.goodbye);
                await goodbye.translate();
                settings.goodbye = goodbye.data;
            }

            // check if question changed
            if (_.has(req.body,'question') && settings.questions[0].text != req.body.question.text) {
                const question = new ResponseModel(req.body.question);
                await question.translate();
                settings.questions[0] = question.data;
            }

            // save to database
            settingsDb.set('settings', settings).write()
                
            res.send({ data: settings });
        } catch (err) {
            console.log(err)
            res.status(400).send({error: err})
        }        
    })

    app.use('/',express.static('www'))
}

const app = express()
setupRoutes(app)

//start server
app.listen(config.port, () => console.log(`Interpart Server listening on port ${config.port}!`))

module.exports = { app, getDatabase, getSettings };