import React, { useState, useEffect } from 'react'

const style = {
  container: {
      borderBottom: '1px solid #eee',
      padding: '10px',
      margin: '10px'
  },
  text: {
      fontStyle: 'italic'
  }
}

const TextInput = ({text, onChange}) => {

  return(
    <div style={style.container}>
      <input type="test" defaultValue={text} onChange={(e) => onChange(e.target.value)}/>
    </div>
  )
}

export { TextInput }