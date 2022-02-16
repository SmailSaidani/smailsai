import React, {useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import {Avatar} from '@material-ui/core'
import Popover from '@material-ui/core/Popover'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import CheckIcon from '@material-ui/icons/Check'
import './BarAccount.css'
import {useStateValue} from '../../contexts/StateContextProvider'
import { db} from "../../firebase/firebase";
import { onSnapshot, doc} from 'firebase/firestore'
const BarAccount = () => {
    const history = useHistory()
    const [{user}] = useStateValue()
    const [profile, setProfile] = useState(user)

    const [anchorEl, setAnchorEl] = useState(null)
    const onClickExpand= (event) => setAnchorEl(event.currentTarget)
    const handleClose = () => setAnchorEl(null)
    const open = Boolean(anchorEl)
    const id = open ? 'post-popover' : undefined

    const signout = () => {
        localStorage.clear()
        history.push('/')
        window.location.reload()
    }

    
    useEffect(() => {
        onSnapshot(doc(db,'users', user.id),snapshot=>{
         setProfile(snapshot.data())
       })

    }, [])


       return (
        <>
            <Popover 
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}

                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                style={{
                    transform:'translate(2rem, -1rem)'
                }}
            >
                <ul className="post__expandList">
        
                    <div className="user__item nocursor" >
                        <Avatar src={profile && profile.photoURL}/>
                        <div className="user__details">
                        <h2>{profile &&  profile.displayName}</h2>
                        <span>{`@${profile && profile.username}`}</span>
                        </div>
                        <CheckIcon />
                    </div>                              
                
                    <li onClick={signout} className='logoutBtn'>
                        <h3>Log out @{profile && profile.username}</h3>
                    </li>
                </ul>
            </Popover>

            <div className='barAccount__wrapper' aria-describedby={id} variant="contained" onClick={onClickExpand }>
                <div className="barAccount__ava">
                    <Avatar src={profile && profile.photoURL} />   
                </div>
                <div className='barAccount__userData' >
                <h2>{profile &&  profile.displayName}</h2>
                <h2>{profile && `@${profile.username}`}</h2>
                </div>
                <div className='barAccount__expandIcon'>
                    <ExpandMoreIcon />
                </div>
            </div>
        </>
    )
}

export default BarAccount
