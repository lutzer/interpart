import React from 'react'
import ReactDOM from 'react-dom'
import { MainView } from './components/MainView'


const wrapper = document.getElementById('container')
wrapper ? ReactDOM.render(<MainView />, wrapper) : false
