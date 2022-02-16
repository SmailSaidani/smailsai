// import React from 'react'
// import {NavLink} from 'react-router-dom'
// import HomeIcon from '@material-ui/icons/Home'
// import PanoramaFishEyeIcon from '@material-ui/icons/PanoramaFishEye'
// import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone'
// import MailOutlineIcon from '@material-ui/icons/MailOutline'
// import PermIdentityIcon from '@material-ui/icons/PermIdentity'
// import {useParams} from 'react-router'
// import './BottomNav.css'

// const BottomNav = () => {
//   const {username} = useParams()
//   return (
//     <div className="bottomNav">
//        <nav>
//           <NavLink exact to='/' activeClassName='bottomNav__active'><HomeIcon /></NavLink>
//           <NavLink to='/search' activeClassName='bottomNav__active'><PanoramaFishEyeIcon /></NavLink>
//           <NavLink to='/notifications' activeClassName='bottomNav__active'><NotificationsNoneIcon /></NavLink>
//           <NavLink to='/messages' activeClassName='bottomNav__active'><MailOutlineIcon /></NavLink>
//           <NavLink to={`/profile/${username}`} activeClassName='bottomNav__active'><PermIdentityIcon/></NavLink>

//        </nav>
//     </div>
//   )
// }

// export default BottomNav
import React from 'react'
import {NavLink} from 'react-router-dom'
import HomeIcon from '@material-ui/icons/Home'
import PanoramaFishEyeIcon from '@material-ui/icons/PanoramaFishEye'
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone'
import MailOutlineIcon from '@material-ui/icons/MailOutline'
import PermIdentityIcon from '@material-ui/icons/PermIdentity'
import { useParams } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, onSnapshot, addDoc, Timestamp, orderBy, setDoc, doc,getDoc, updateDoc,getDocs, arrayUnion} from "firebase/firestore";
import {db,storage} from "../../firebase/firebase";



import './BottomNav.css'
import { useState } from 'react'

const BottomNav = () => {
  const [username, setUsername]=useState('')




  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      console.log(uid)
      getDoc(doc(db,'users',uid)).then((userData) => {
        const data = userData.data();
        setUsername(data.username)
        console.log(username)
    });
      
      // ...
    } 

  });
  console.log(username)
  const link= '/Profile/'+username
  console.log(link)

  return (
    <div className="bottomNav">
       <nav>
          <NavLink exact to='/' activeClassName='bottomNav__active'><HomeIcon /></NavLink>
          <NavLink to='/search' activeClassName='bottomNav__active'><PanoramaFishEyeIcon /></NavLink>
          <NavLink to='/notifications' activeClassName='bottomNav__active'><NotificationsNoneIcon /></NavLink>
          <NavLink to='/messages' activeClassName='bottomNav__active'><MailOutlineIcon /></NavLink>
          <NavLink to={link} activeClassName='bottomNav__active'><PermIdentityIcon/></NavLink>

       </nav>
    </div>
  )
}

export default BottomNav



