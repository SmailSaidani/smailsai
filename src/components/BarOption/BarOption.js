import React from 'react'
import {NavLink} from 'react-router-dom'
import './BarOption.css'
import {useStateValue} from '../../contexts/StateContextProvider'

const BarOption = ({active, text, Icon, onClick}) => {
    const [{user}] = useStateValue()

    const isHome = text === 'Home' 
    const isProfile = text === 'Profile'
    const redirect =  isHome ? '': (isProfile?`${text.toLowerCase()}/${user.username}`:text.toLowerCase())   

    return (
        <NavLink to={`/${redirect}`} exact={isHome} className='barOption' activeClassName='bar__active' onClick={onClick} >
           <Icon />
           <h2>{text}</h2>
        </NavLink>
    )
}

export default BarOption