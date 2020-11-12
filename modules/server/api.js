const axios = require('axios');
const { response } = require('express');
const config = require('./config')
const { getSettings } = require('./app')
const _ = require('lodash')

const postSubmission = async function(model) {
  var token = ''
  //login
  try {
    const response = await axios.post(config.zebralog.api + '/users/login', {
      email: config.zebralog.user,
      password: config.zebralog.password
    })
    token = response.data.token
  } catch (err) {
    console.log(err)
    throw new Error("Could not authenticate with zebralog")
  }

  const settings = getSettings()

  // change shape of translations
  const translations = model.data.translations.reduce( (acc, val) => {
    acc[val.language] = val.text
    return acc
  }, {})
  
  //post data
  try {
    const response = await axios({
      method: 'POST',
      url: config.zebralog.api + '/messages',
      data: {
        bell_id: settings.get('settings.bellId').value(), 
        language: model.data.language,
        message: model.data.text, 
        translations: translations,
        tags: settings.get('settings.tags').value().split(' '), 
        location: settings.get('settings.location').value()
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      }
    })
  } catch (err) {
    const message = _.has(err, 'response.data.error.message') ? err.response.data.error.message : "Could not submit message to zebralog"
    console.log(err.response.data.error.message)
    throw new Error(message)
  }
}

module.exports = { postSubmission }