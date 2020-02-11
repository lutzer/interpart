// Import the dependencies for testing
const chai = require('chai')
const _ = require('lodash')
const assert = chai.assert
const chaiHttp = require('chai-http')
const { app, getDatabase, getSettings } = require('./../app')
const { languages } = require('./../config')

// Configure chai
chai.use(chaiHttp);
chai.should();

function addSubmission(app, text, lang) {
    return chai.request(app)
    .post('/submissions/add')
    .send({
        'text': text,
        'language': lang
    })
}

describe("submissions", function () {

    beforeEach( async () => {
        // remove all submissions
        await getDatabase().unset('submissions').write()
    })

    it("should add a submission", (done) => {
        chai.request(app)
        .post('/submissions/add')
        .send({
            'text': 'Hallo Welt.',
            'language': 'de'
        })
        .end((err, res) => {
            assert(res.statusCode,200);
            assert.typeOf(res.body.data, "Object");
            assert(res.body.data.text, 'Hallo Welt')
            assert(res.body.data.language, 'de')
            done();
        });
    });

    it("should get an array of submissions", (done) => {
        chai.request(app)
        .get('/submissions/list')
        .end((err, res) => {
            // console.log(res);
            assert(res.statusCode,200);
            assert.typeOf(res.body.data, "Array");
            done();
        });
    });

    it("should be able to retrieve an added submission", async () => {
        const randomString = Math.random().toString(36).substring(7);
        const randomLanguage = _.sample(languages);
        await addSubmission(app, randomString, randomLanguage);

        chai.request(app).get('/submissions/list').end((err, res) => {
            assert(res.body.data[0].text, randomString);
            assert(res.body.data[0].language, randomLanguage);
        });
    })

    it("should create several translations for a submission", (done) => {
        chai.request(app)
        .post('/submissions/add')
        .send({
            'text': 'Hallo Welt.',
            'language': 'de'
        })
        .end((err, res) => {
            assert(res.statusCode,200);
            assert(res.body.data.translations, "Array");
            assert.isNotEmpty(res.body.data.translations)
            done();
        });
    });
})

describe("settings", function () {
    this.timeout(10000)

    beforeEach( async () => {
        // remove all submissions
        await getSettings().unset('settings').write()
    })

    it("should be able to retrieve settings", async () => {
        chai.request(app).get('/settings/').end((err, res) => {
            assert(res.statusCode,200);
            assert.typeOf(res.body.data, "Object");
            assert.typeOf(res.body.data.greeting, "Object");
            assert.typeOf(res.body.data.goodbye, "Object");
            assert.typeOf(res.body.data.questions, "Array");
            assert.typeOf(res.body.data.languages, "Array");
        });
    })

    it("should be able to write to settings", async () => {
        chai.request(app).post('/settings/')
        .send({})
        .end((err, res) => {
            assert(res.statusCode,200);
            assert.typeOf(res.body.data, "Object");
        });
    })

    it("should be able to change greeting", async () => {
        const randomString = Math.random().toString(36).substring(7);
        chai.request(app).post('/settings/')
        .send({ greeting : { text: randomString, language: 'de' } })
        .end((err, res) => {
            assert(res.statusCode,200);
            assert(res.body.data.greeting.text, randomString);
            assert.isNotEmpty(res.body.data.greeting.translations);
        });
    })

    it("should be able to change goodbye", async () => {
        const randomString = Math.random().toString(36).substring(7);
        chai.request(app).post('/settings/')
        .send({ goodbye : { text: randomString, language: 'de' } })
        .end((err, res) => {
            assert(res.statusCode,200);
            assert(res.body.data.goodbye.text, randomString);
            assert.isNotEmpty(res.body.data.goodbye.translations);
        });
    })

    it("should be able to change question", async () => {
        const randomString = Math.random().toString(36).substring(7);
        chai.request(app).post('/settings/')
        .send({ question : { text: randomString, language: 'de' } })
        .end((err, res) => {
            assert(res.statusCode,200);
            assert(res.body.data.questions[0].text, randomString);
            assert.isNotEmpty(res.body.data.questions[0].translations);
        });
    })

    it("should persist changes in settings db", async () => {
        const randomString = "Hello"
        await chai.request(app).post('/settings/')
        .send({ question : { text: randomString, language: 'de' } })

        chai.request(app).get('/settings/').end((err, res) => {
            assert(res.statusCode,200);
            assert(res.body.data.questions[0].text, randomString);
        });

    })
})

describe("responses", function () {
    this.timeout(10000);

    before( async () => {
        // remove all submissions
        await getSettings().unset('settings').write()

        await chai.request(app).post('/settings/')
            .send({
                greeting : { text: "Hi", language: 'en' },
                goodbye : { text: "Bye", language: 'en' },
                question : { text: "What", language: 'en' }
            })
    })

    it("should retrieve greeting", async () => {

        chai.request(app).get('/response/greeting').end((err, res) => {
            assert(res.statusCode,200);
            assert(res.body.data.text, "Hi");
        });
    })

    it("should retrieve greeting in selected language", async () => {
        const randomLanguage = _.sample(languages);
        chai.request(app).get('/response/greeting?lang=' + randomLanguage).end((err, res) => {
            assert(res.statusCode,200);
            assert(res.body.data.language, randomLanguage);
        });
    })

    it("should retrieve goodbye", async () => {
        chai.request(app).get('/response/goodbye').end((err, res) => {
            assert(res.statusCode,200);
            assert(res.body.data.text, "Bye");
        });
    })

    it("should retrieve goodbye in selected language", async () => {
        const randomLanguage = _.sample(languages);
        chai.request(app).get('/response/goodbye?lang=' + randomLanguage).end((err, res) => {
            assert(res.statusCode,200);
            assert(res.body.data.language, randomLanguage);
        });
    })

    it("should retrieve questions", async () => {
        chai.request(app).get('/questions/list').end((err, res) => {
            assert(res.statusCode,200);
            assert(res.body.data[0].text, "What");
        });
    })

    it("should retrieve questions in selected language", async () => {
        const randomLanguage = _.sample(languages);
        chai.request(app).get('/questions/list?lang=' + randomLanguage).end((err, res) => {
            assert(res.statusCode,200);
            assert(res.body.data[0].language, randomLanguage);
        });
    })
})