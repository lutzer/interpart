#!/usr/bin/env node

/*
 * @Author: Lutz Reiter - http://lu-re.de 
 * @Date: 2019-03-27 18:55:40 
 * @Last Modified by: Lutz Reiter - http://lu-re.de
 * @Last Modified time: 2020-11-12 22:55:04
 */

const _ = require('lodash')
const { Translate } = require('@google-cloud/translate').v2;
const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')

const optionDefinitions = [
    { 
        name: 'text', 
        type: String, 
        defaultOption: true,
        typeLabel: 'string',
        description: 'Text to translate'
    },
    { 
        name: 'from',
        type: String, 
        defaultValue: "de",
        typeLabel: 'string',
        description: 'Language to translate from'
    },
    {
        name: 'to',
        type: String, 
        defaultValue: "de,en,es,it",
        typeLabel: 'string',
        description: 'Languages to translate to (comma seperated)'
    },
    {
        name: 'help',
        alias: 'h',
        description: 'Display these usage informations'
    }
]


var options = {}

try {
    options = commandLineArgs(optionDefinitions)

    if (_.has(options,'help'))
        throw new Error('Show usage information')

    if (!_.has(options,'text'))
        throw new Error('No Text supplied')

    // split comma seperate language array
    options.to = options.to.split(',')

    //remove original language from array
    options.to = _.without(options.to, options.from)

} catch (err) {
    const usage = commandLineUsage([
        {
            header: 'Interpart Translator',
            content: 'Translates text in multiple other languages and generates json object'
        },
        {
            header: 'Options',
            optionList: optionDefinitions
        },
        {
            header: 'Example',
            content: [
              'interpart-translate "Hello World" --from en --to de',
            ]
        }
    ])
    console.log(usage)
    process.exit()
}

// if everything is ok run translator
run(options)

async function run(options) {
    const translate = new Translate();

    // modifiy text to exclude translation of text inside {}
    let text = options.text
    text = text.replace('{{','<span class="notranslate">')
    text = text.replace('}}','</span>')

    const requests = _.map(options.to, (language) => {
        return new Promise(function(resolve, reject) {
            translate.translate(text, { from : options.from, to: language })
                .then( (result) => {
                    let text = result[0]

                    // revert resulting string
                    text = text.replace('<span class="notranslate">','{{')
                    text = text.replace('</span>','}}')
                    resolve({ text: text, language: language })
                })
                .catch( (err) => reject(err))
        })
    })

    Promise.all(requests).then( (results) => {
        output({ original: { text: options.text ,language: options.from }, translations: results })
    }).catch( (err) => {
        output({ errors: err.errors })
    })
}

function output(json) {
    console.log(JSON.stringify(json))
} 



