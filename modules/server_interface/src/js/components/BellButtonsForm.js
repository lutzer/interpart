import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

const styles = {
    link: {
        background: '#eee',
        margin: '2px',
        height: '35px'
    },
    label: {
        float: 'left',
        lineHeight: '35px',
        marginLeft: '5px'
    },
    select: {
        lineHeight: '35px',
        float: 'right',
        marginRight: '5px'
    }
}

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
            <li style={styles.link} key={index}>
                <div style={styles.label}>Button {index}</div>
                <div style={styles.select}>
                    <select value={ele.language} 
                        onChange={(event) => handleDataChange(index, event.target.value)}>
                        {languageOptions}
                    </select>
                </div>
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