import React from 'react'
import './FooterIcon.css'

const FooterIcone = ({Icon, value, onClick}) => {
    return (
        <div className="footerIcon_wrapper" onClick={onClick}>
            <Icon />
            <div className="footerIcon__counter">{value?value:''}</div>
        </div>
    )
}

export default FooterIcone
