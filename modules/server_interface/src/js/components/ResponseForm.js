import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

function ResponseForm({ title = '', text = '', data = {}, languages = [], onChange = () => {} }) {
    const [dataText, setDataText] = useState('')
    const [dataLang, setDataLang] = useState('')

    useEffect(() => {
        if (data.text) setDataText(data.text)
        if (data.language) setDataLang(data.language)
    }, [data])

    function handleInputChange(event) {
        setDataText(event.target.value)
        onChange({ text: event.target.value, language: dataLang })
    }

    function handleSelectChange(event) {
        setDataLang(event.target.value)
        onChange({ text: dataText, language: event.target.value })
    }

    function handleRevertClick() {
        setDataText(data.text ? data.text : '')
        setDataLang(data.language ? data.language : '')
        onChange(undefined)
    }

    const languageFields = languages.map( (ele,index) => {
        return <option key={index} value={ele}>{ele}</option>
    })

    return (
        <div>
            <h2>{ title }</h2>
            {text.length > 0 && <p>{text}</p>}
            <input type="text" maxLength="256" 
                onChange={handleInputChange} 
                value={dataText}/>
            <select value={dataLang}
                onChange={handleSelectChange}>
                {languageFields}
            </select>
            <button onClick={handleRevertClick}>Revert</button>
        </div>
    )
}

ResponseForm.propTypes = {
    title: PropTypes.string,
    text: PropTypes.string,
    data: PropTypes.object,
    onChange: PropTypes.func,
    languages : PropTypes.array
}

export { ResponseForm }