import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { useHistory } from 'react-router-dom'

const style = {
    container: {
        borderBottom: '1px solid #eee',
        padding: '10px',
        margin: '10px'
    },
    language: {
        color: '#aaa'
    },
    text: {
        fontStyle: 'italic'
    }
}

function ResponseItem({ attribute = '', text = '', data = {} }) {
    let history = useHistory()

    function handleEditClick() {
        history.push('/edit/' + attribute)
    }

    return (
        <div style={style.container}>
            <h3>{ _.capitalize(attribute) }</h3>
            {text.length > 0 && <p>{text}</p>}
            <p>Text: <span  style={style.text}>{data.text}</span></p>
            <p style={style.language}>Language: {data.language}</p>
            <button onClick={handleEditClick}>Edit</button>
        </div>
    )
}

ResponseItem.propTypes = {
    attribute: PropTypes.string,
    text: PropTypes.string,
    data: PropTypes.object
}

export { ResponseItem }