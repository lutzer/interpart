/* eslint-disable no-useless-escape */
/*
 * @Author: Lutz Reiter - http://lu-re.de 
 * @Date: 2019-03-29 19:20:49 
 * @Last Modified by: Lutz Reiter - http://lu-re.de
 * @Last Modified time: 2020-02-14 13:48:47
 */

const _ = require('lodash')
const util = require('util')
const { exec } = require('child_process')
const he = require('he');

const asyncExec = util.promisify(exec)

function addslashes(str) {
    str = str.replace(/\\/g, '\\\\')
    str = str.replace(/\'/g, '\\\'')
    str = str.replace(/\"/g, '\\"')
    str = str.replace(/\0/g, '\\0')
    return str
}

function stripslashes(str) {
    str = str.replace(/\\'/g, '\'')
    str = str.replace(/\\"/g, '"')
    str = str.replace(/\\0/g, '\0')
    str = str.replace(/\\\\/g, '\\')
    return str
}

async function translate(text, language, translateTo = ['en','de']) {
    text = addslashes(text)
    language = addslashes(language)
    let result = await asyncExec(`interpart-translate --from "${language}" --to ${translateTo.join()} "${text}"`)
    let output = JSON.parse(result.stdout)
    if (_.has(output,'errors')) {
        throw output.errors
    }
    // decode
    output.translations.map( (ele) => {
        ele.text = he.decode(ele.text)
        return ele
    })
    return output.translations
}

module.exports = { addslashes, stripslashes, translate}
