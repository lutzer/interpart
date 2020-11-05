// Import the dependencies for testing
const chai = require('chai')
const _ = require('lodash')
const assert = chai.assert
const chaiHttp = require('chai-http')
const { app, getDatabase, getSettings } = require('../app')
const { languages } = require('./../config')

// Configure chai
chai.use(chaiHttp)
chai.should()

function addSubmission(app, text, lang) {
    return chai.request(app)
        .post('/submissions/add')
        .send({
            'text': text,
            'language': lang
        })
}

describe('submissions', function () {

    beforeEach( async () => {
        // remove all submissions
        await getDatabase().unset('submissions').write()
    })

    it('should add a submission', async () => {
        var res = await chai.request(app).post('/submissions/add').send({
            'text': 'Hallo Welt.',
            'language': 'de'
        })
        assert(res.statusCode,200)
        assert.typeOf(res.body.data, 'Object')
        assert(res.body.data.text, 'Hallo Welt')
        assert(res.body.data.language, 'de')
             
    })

    it('should get an array of submissions', async () => {
        var res = await chai.request(app)
            .get('/submissions/list')
        assert(res.statusCode,200)
        assert.typeOf(res.body.data, 'Array')
    })

    it('should be able to retrieve an added submission', async () => {
        const randomString = Math.random().toString(36).substring(7)
        const randomLanguage = _.sample(languages)
        await addSubmission(app, randomString, randomLanguage)
        var res = await chai.request(app).get('/submissions/list')
        assert(res.body.data[0].text, randomString)
        assert(res.body.data[0].language, randomLanguage)
    })

    it('should create several translations for a submission', async () => {
        var res = await chai.request(app)
            .post('/submissions/add')
            .send({
                'text': 'Hallo Welt.',
                'language': 'de'
            })
        assert(res.statusCode,200)
        assert(res.body.data.translations, 'Array')
        assert.isNotEmpty(res.body.data.translations)
    })
})

describe('settings', function () {
    this.timeout(10000)

    beforeEach( async () => {
        // remove all submissions
        await getSettings().unset('settings').write()
    })

    it('should be able to retrieve settings', async () => {
        var res = await chai.request(app).get('/settings/')
        assert(res.statusCode,200)
        assert.typeOf(res.body.data, 'Object')
        assert.typeOf(res.body.data.greeting, 'Object')
        assert.typeOf(res.body.data.goodbye, 'Object')
        assert.typeOf(res.body.data.question, 'Object')
        assert.typeOf(res.body.data.languages, 'Array')
    })

    it('should be able to write to settings', (done) => {
        chai.request(app).post('/settings/')
            .send({})
            .end((err, res) => {
                assert(res.statusCode,200)
                assert.typeOf(res.body.data, 'Object')
                done()
            })
    })

    it('should be able to change greeting', async () => {
        const randomString = Math.random().toString(36).substring(7)
        var res = await chai.request(app).post('/settings/')
            .send({ greeting : { text: randomString, language: 'de' } })
        assert(res.statusCode,200)
        assert(res.body.data.greeting.text, randomString)
    })

    it('should be able to change goodbye', async () => {
        const randomString = Math.random().toString(36).substring(7)
        var res = await chai.request(app).post('/settings/')
            .send({ goodbye : { text: randomString, language: 'de' } })
        assert(res.statusCode,200)
        assert(res.body.data.goodbye.text, randomString)
    })

    it('should be able to change question', async () => {
        const randomString = Math.random().toString(36).substring(7)
        var res = await chai.request(app).post('/settings/')
            .send({ question : { text: randomString, language: 'de' } })
        assert(res.statusCode,200)
        assert(res.body.data.question.text, randomString)
    })

    it('should persist changes in settings db', async () => {
        const randomString = 'Hello'
        await chai.request(app).post('/settings/')
            .send({ question : { text: randomString, language: 'de' } })

        var res = await chai.request(app).get('/settings/')
        assert(res.statusCode,200)
        assert(res.body.data.question.text, randomString)
    })
})

describe('responses', function () {
    this.timeout(10000)

    const availableTranslations = ['en', 'de', 'es']

    before( async () => {
        // remove all submissions
        await getSettings().unset('settings').write()

        await chai.request(app).post('/settings/')
            .send({
                greeting : { text: 'Hi', language: 'en', 
                    translations : [ {language: 'de', text: 'test' }, {language: 'es', text: 'test' } ] },
                goodbye : { text: 'Bye', language: 'en',
                    translations : [ {language: 'de', text: 'test' }, {language: 'es', text: 'test' } ] },
                question : { text: 'What', language: 'en', 
                    translations : [ {language: 'de', text: 'test' }, {language: 'es', text: 'test' } ] },
            })
    })

    it('should retrieve greeting', async () => {

        var res = await chai.request(app).get('/response/greeting')
        assert(res.statusCode,200)
        assert(res.body.data.text, 'Hi')
    })

    it('should retrieve greeting in selected language', async () => {
        const randomLanguage = _.sample(availableTranslations)
        var res = await chai.request(app).get('/response/greeting?lang=' + randomLanguage)
        assert(res.statusCode,200)
        assert(res.body.data.language, randomLanguage)
    })

    it('should retrieve goodbye', async () => {
        var res = await chai.request(app).get('/response/goodbye')
        assert(res.statusCode,200)
        assert(res.body.data.text, 'Bye')
    })

    it('should retrieve goodbye in selected language', async () => {
        const randomLanguage = _.sample(availableTranslations)
        var res = await chai.request(app).get('/response/goodbye?lang=' + randomLanguage)
        assert(res.statusCode,200)
        assert(res.body.data.language, randomLanguage)
    })

    it('should retrieve questions', async () => {
        var res = await chai.request(app).get('/response/question')
        assert(res.statusCode,200)
        assert(res.body.data.text, 'What')
    })

    it('should retrieve questions in selected language', async () => {
        const randomLanguage = _.sample(availableTranslations)
        var res = await chai.request(app).get('/response/question?lang=' + randomLanguage)
        assert(res.statusCode,200)
        assert(res.body.data.language, randomLanguage)
    })
})

describe('translations', function () {
    it('should translate a response', async () => {
        const dataToTranslate = {
            text : 'Hallo',
            language: 'en'
        }
        var res = await chai.request(app).post('/translate')
            .send(dataToTranslate)

        assert(res.statusCode,200)
        assert.equal(res.body.data.translations.length, languages.length - 1)
        assert.isNotEmpty(res.body.data.translations[0].text)
    })
})