// Import the dependencies for testing
const chai = require('chai')
const _ = require('lodash')
const assert = chai.assert
const chaiHttp = require('chai-http')
const { app, getDatabase, getSettings } = require('../app')
const config = require('./../config')
const { postSubmission } = require('../api')
const { SubmissionModel } = require('../models/SubmissionModel')

// Configure chai
chai.use(chaiHttp)
chai.should()

const connect = () => {
  return chai.request(app)
} 

describe('zebralog api connection', function () {
  it('should authenticate with api', async () => {
    var res = await chai.request(config.zebralog.api).post('/users/login').send({
        'email': config.zebralog.user,
        'password': config.zebralog.password
    })
    assert(res.statusCode,200)
  })

  it('should be able to post a submission', async () => {
    var res = await chai.request(config.zebralog.api).post('/users/login').send({
        'email': config.zebralog.user,
        'password': config.zebralog.password
    })
    assert(res.statusCode,200)
    const token = res.body.token
    res = await chai.request(config.zebralog.api).post('/messages')
      .set("Authorization", `Bearer ${token}`)
      .send({
        bell_id: "0", 
        language: "en",
        message: "test", 
        translations: {"de": "tesde", "en": "testen", "fr": "testfr" },
        tags: ["tag1", "tag3", "tag5"], 
        location: {"lat": 42.239823, "lng": 9.23232}
      })
    assert(res.statusCode,200)
  })

  it('postSubmission() should be able to post a submission', async () => {
    const submission = new SubmissionModel({
      'text': 'Hallo Zebralog.',
      'language': 'de'
    })
    await postSubmission(submission)
  })

  it('postSubmission() should be able to post a submission with different translations', async () => {
    const submission = new SubmissionModel({
      'text': 'Hallo Zebralog.',
      'language': 'de'
    })
    await submission.translate()
    await postSubmission(submission)
  })
})