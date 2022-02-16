import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import StateContextProvider from './contexts/StateContextProvider'

ReactDOM.render(
    <StateContextProvider>
         <App/>
    </StateContextProvider>, 
document.querySelector('#root'))