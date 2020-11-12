import React, { useState, useEffect } from 'react'

const style = {
  container: {
      borderBottom: '1px solid #eee',
      padding: '10px',
      margin: '10px'
  },
  text: {
      fontStyle: 'italic'
  },
  number: {
    width: '200px',
    margin: '5px 0'
  },
  label: {
    display: 'block',
    height: '30px'
  }
}

const LocationInput = ({location, onChange}) => {
  const [val, setVal] = useState(location)

  useEffect(() => {
    setVal(location)
  },[location])

  useEffect(() => {
    onChange()
  },[val])

  return(
    <div style={style.container}>
      <label style={style.label}>Latitude</label>
      <input style={style.number} type="number" defaultValue={val.lat}/>
      <label style={style.label}>Longitude</label>
      <input style={style.number} type="number" defaultValue={val.lng}/>
    </div>
  )
}

export { LocationInput }