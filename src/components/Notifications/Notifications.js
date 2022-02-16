import React, {useState, useEffect} from 'react'
import { db,auth} from "../../firebase/firebase";
import { getDoc, doc,query,collection,getDocs,orderBy,onSnapshot,where} from "firebase/firestore";
import {Avatar, Button} from '@material-ui/core'
import './Notifications.css'
import Moment from 'react-moment'

import {useStateValue} from '../../contexts/StateContextProvider'
import { useHistory } from "react-router-dom";

const BarMiddle = () => {
    const [{user}] = useStateValue()
    const [following, setFollowing] = useState([])
    const [notifications, setNotifications] = useState([])
    const user1=user.id
    const history = useHistory();

    console.log(user1)
    // useEffect(async() => {
    //     const not=[]
    //     const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'))
    //     const  querySnapshot =  await getDocs(q);
    //     querySnapshot.forEach((doc) => {
    //         const d=doc.data()
            
    //         if(user1==d.user){
    //             not.push(doc.data())
    //         }
    //     },   );
    //     console.log(not)
    //     setNotifications(not)
        
    // },[]
    // )
    useEffect(() => {
        const postsCollectionRef = collection(db, 'notifications')
        const q = query(postsCollectionRef, where("user","==",user1) ,orderBy('createdAt', 'desc'))

        const unsub = onSnapshot(q, (snapshot) => {
            setNotifications(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})) )
        })
        return unsub
    }, [])
    console.log(notifications)
    return (
        <div className='BarMiddle'>
            <div className="BarMiddle__header">
              
               
              <h2>Notification</h2>
                
                </div>
              <div className="user_infoo"  >
              {notifications.map(notification =>(
                ((notification.username) ?
                <div className="user_detailll" key={notification.id}  onClick={() =>
                     history.push(`/profile/${notification.username}`)}>
                         <div className="user_detaill">
                  
                   <Avatar src={notification.photoURL}  className="avatarr"  />
                   <br/>
                   <p>{notification.text}</p> 
                    <small  className="notif__headerDescription-moment">
                                 <Moment fromNow>{notification.createdAt.toDate()}</Moment>
                              </small>
                   </div>
                 </div>
:
                  ((notification.itretweet) ?
                 <div className="user_detailll" key={notification.id}  onClick={() =>
                    history.push(`/post/${notification.postId}/${notification.user}/${notification.retweeter}`)}>
                         <div className="user_detaill">
                  
                   <Avatar src={notification.photoURL}  className="avatarr"  />
                   <br/>
                   <p>{notification.text}</p>
                   <small  className="notif__headerDescription-moment">
                                 <Moment fromNow>{notification.createdAt.toDate()}</Moment>
                              </small>
                   </div>
                 </div>
               :
                    <div className="user_detailll" key={notification.id}  onClick={() =>
                        history.push(`/post/${notification.postId}/${notification.user}`)}>  
                          <div className="user_detaill">
                
                   <Avatar src={notification.photoURL}  className="avatarr"  />
                   <br/>
                   <p>{notification.text}</p>
                     <small  className="notif__headerDescription-moment">
                                 <Moment fromNow>{notification.createdAt.toDate()}</Moment>
                              </small>
                   </div>
                   </div>
                 )
                 )
                  
                
                  ))} 
         </div> 
        </div>
    )
}

export default BarMiddle