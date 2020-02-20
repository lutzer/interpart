import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import config from '../config'
import { get } from '../utils'

const styles = {
    link: {
        background: '#eee',
        margin: '10px 0px',
        padding: '2px 10px'
    },
    text: {
        fontStyle: 'italic'
    },
    language: {
        color: '#aaa'
    },
}

function SubmissionList() {
    let history = useHistory()
    let [ data, setData ] = useState([])

    // load data
    useEffect(() => {
        get(config.apiAdress + '/submissions/list').then( (json) => {
            setData(json.data)
        })
    },[])

    const buttonInputs = data.map( (submission, index) => {
        return(
            <li style={styles.link} key={index}>
                <div>
                    <p>Created: {moment(submission.createdAt).format('lll')}</p>
                    <p>Author: {submission.author}</p>
                    <p>Question: <span style={styles.text}>{submission.question.text}</span></p>
                    <p>Answer: <span style={styles.text}>{submission.text}</span></p>
                    <p style={styles.language}>Language: {submission.language}</p>
                    <button onClick={() => history.push('/submissions/' + submission.id)}>Details</button>
                </div>
            </li>
        )
    })

    return (
        <div>
            <div>
                <button onClick={() => history.push('/')}>Back</button>
            </div>
            <h2>Submissions</h2>
            <ul>
                {buttonInputs}
            </ul>
        </div>
    )
}

export { SubmissionList }