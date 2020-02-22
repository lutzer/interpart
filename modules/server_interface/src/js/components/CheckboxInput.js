import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

function CheckboxInput({ label = '', domId = _.uniqueId('checkbox'), checked = false, onSave = () => {} }) {

    const style = {
        container: {
            margin: '10px',
            padding: '10px'
        }
    }

    function onChangeHandler(event) {
        onSave(event.target.checked)
    }

    return (
        <div style={style.container}>
            <input id={domId} type="checkbox" onChange={onChangeHandler} checked={checked}></input>
            <label htmlFor={domId}>{label}</label>
        </div>
    )
}

CheckboxInput.propTypes = {
    checked: PropTypes.bool,
    label: PropTypes.string,
    domId: PropTypes.string,
    onSave: PropTypes.func
}

export { CheckboxInput }