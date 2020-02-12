import React from 'react'
import PropTypes from 'prop-types'

function ResponseForm({ title = '', text = '', data = {} }) {
    return (
        <div>
            <h2>{ title }</h2>
            {text.length > 0 && <p>{text}</p>}
            <input type="text" maxLength="256" defaultValue={ data.text ? data.text : ''}></input>
        </div>
    )
}

ResponseForm.propTypes = {
    title: PropTypes.string,
    text: PropTypes.string,
    data: PropTypes.object
}

export { ResponseForm }