import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { useHistory } from 'react-router-dom'

function ResponseItem({ attribute = '', text = '', data = {} }) {
    let history = useHistory()

    function handleEditClick() {
        history.push('/edit/' + attribute)
    }

    return (
        <div>
            <h3>{ _.capitalize(attribute) }</h3>
            {text.length > 0 && <p>{text}</p>}
            <p>Text: {data.text}</p>
            <p>Language: {data.language}</p>
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