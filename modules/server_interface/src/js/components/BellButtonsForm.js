import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

function BellButtonsForm({ data = [], languages = [], onSave = () => {} }) {
    let [ inputData, setInputData ] = useState(data)

    useEffect(() => {
        setInputData(data)
    },[data])

    function handleDataChange(index, value) {
        let changed = _.set(inputData, `[${index}].language`,value)
        setInputData(_.clone(changed))
        onSave(changed)
    }

    const languageOptions = languages.map( (ele,index) => {
        return <option key={index} value={ele}>{ele}</option>
    })

    const buttonInputs = inputData.map( (ele, index) => {
        return(
            <li key={index}>
                <span>{index+1}</span>
                <select value={ele.language} 
                    onChange={(event) => handleDataChange(index, event.target.value)}>
                    {languageOptions}
                </select>
            </li>
        )
    })

    return (
        <div>
            <ul>
                {buttonInputs}
            </ul>
        </div>
    )
}

BellButtonsForm.propTypes = {
    data: PropTypes.array,
    languages: PropTypes.array,
    onSave: PropTypes.func
}

export { BellButtonsForm }