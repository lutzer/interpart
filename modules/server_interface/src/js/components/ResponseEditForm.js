import _ from 'lodash'
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { useHistory, useParams } from 'react-router-dom'

import { ResponseModel } from '../models/ResponseModel'

function ResponseModelDataFactory(data) {
    return (new ResponseModel(data)).data
}

function ResponseEditForm({ data = {}, languages = [], onSave = () => {}}) {
    let history = useHistory()
    let { attribute } = useParams()
    
    let [ inputData, setInputData ] = useState(ResponseModelDataFactory(data[attribute]))

    useEffect(() => {
        setInputData(ResponseModelDataFactory(data[attribute]))
    },[data])

    function handleDataChange(path, value) {
        let changedData = _.set(inputData, path, value)
        setInputData(ResponseModelDataFactory(changedData))
    }

    function handleTranslateClick() {
       
        let model = new ResponseModel(inputData)
        model.translate().then( (json) => {
            handleDataChange('translations', json.data.translations)
        })
    }


    const languageOptions = languages.map( (ele,index) => {
        return <option key={index} value={ele}>{ele}</option>
    })

    const translationInputs = inputData.translations.map( (ele, index) => {
        return(
            <li key={index}>
                <span>{ele.language}</span>
                <input type='text' maxLength='256'
                    value={ele.text}
                    onChange={(event) => handleDataChange(`translations[${index}].text`, event.target.value)}/>
            </li>
        )
    })

    return (
        <div>
            <div>
                <button onClick={() => history.push('/')}>Back</button>
            </div>
            <h2>{ _.capitalize(attribute) }</h2>
            <h3>Original Phrase</h3>
            <div>
                <input type='text' maxLength='256'
                    defaultValue={inputData.text}
                    onChange={(event) => handleDataChange('text', event.target.value)}></input>
                <select value={inputData.language} 
                    onChange={(event) => handleDataChange('language', event.target.value)}>
                    {languageOptions}
                </select>
                <button onClick={handleTranslateClick}>Translate</button>
            </div>
            <h3>Translations</h3>
            <ul>
                {translationInputs}
            </ul>
            <button onClick={() => onSave(attribute, inputData)}>Save</button>
        </div>
    )
}

ResponseEditForm.propTypes = {
    attribute: PropTypes.string,
    data: PropTypes.object,
    onChange: PropTypes.func,
    languages : PropTypes.array,
    onSave : PropTypes.func
}

export { ResponseEditForm }