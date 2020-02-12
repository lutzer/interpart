import React from 'react'
import PropTypes from 'prop-types'

const style = {
    overlay: {
        position: 'fixed',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        background: '#000',
        opacity: 0.9
    },
    spinner: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        height: '30%',
        width: '50%',
        margin: '-40px 0 0 -40px',
    },
    text: {
        color: '#fff',
        'text-align': 'center',
        'position': 'absolute',
        bottom: '10%',
        width: '100%'
    }
}


function SpinnerOverlay({text = ''}) {
    
    return (
        <div style={style.overlay}>
            <div style={style.spinner}>
                <div className="lds-ripple"><div></div><div></div></div>
            </div>
            <div style={style.text}>{text}</div>
        </div>
    )
}

SpinnerOverlay.propTypes = {
    text: PropTypes.string
}

export { SpinnerOverlay }