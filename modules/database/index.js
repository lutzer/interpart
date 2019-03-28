const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const express = require('express')
const bodyParser = require('body-parser')

const { SubmissionModel } = require('./models/SubmissionModel') 
const { QuestionModel } = require('./models/QuestionModel') 
const _ = require('lodash')
const config = require('./config')

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
        const submissions = db.get('submissions')
        res.send(submissions)
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

    app.post('/questions/translate', async (req, res) => {
        try {

            if (!QuestionModel.validate(req.body))
                throw "Validation failed"

            var question = new QuestionModel(req.body)
            await question.translate()

            res.send({ data: question.data})
        } catch (err) {
            console.log(err)
            res.status(400).send({error: err})
        }
    })

    app.get('/questions/:language', async (req, res) => {
        try {
            var questions = _.map(require('./data/questions.json'), (data) => {
                let question = new QuestionModel(data)
                return question.data
            })
            res.send(questions)
        } catch (err) {
            res.status(400).send({error: err})
        }
    })
}

const app = express()
setupRoutes(app)

//start server
app.listen(config.port, () => console.log(`Example app listening on port ${config.port}!`))

//setup questions

