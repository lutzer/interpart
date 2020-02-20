import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { useHistory, useParams } from 'react-router-dom'
import config from '../config'
import { get } from '../utils'

const styles = {
    json: {
        background: '#eee',
        margin: '10px 0px',
        padding: '2px 10px'
    }
}

function SubmissionDetails() {
    let history = useHistory()
    let { id } = useParams()
    let [ data, setData ] = useState([])

    // load data
    useEffect(() => {
        get(config.apiAdress + '/submissions/' + id).then( (json) => {
            setData(json.data)
        })
    },[])

    let jsonString = JSON.stringify(data, null, 4)

    return (
        <div>
            <div>
                <button onClick={() => history.push('/submissions')}>Back</button>
            </div>
            <h2>Submission</h2>
            <div style={styles.json}>
                <pre id="json">
                    {jsonString}
                </pre>
            </div>
        </div>
    )
}

export { SubmissionDetails }