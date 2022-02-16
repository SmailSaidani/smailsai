import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import TabbarMenu from '../../elements/TabbarMenu/TabbarMenu';
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import ArrowBackOutlinedIcon from '@material-ui/icons/ArrowBackOutlined'
import UserItemFollow from '../UserItem/UserItemFollow'
import {db} from "../../firebase/firebase";       
import{query,collection,where,onSnapshot,orderBy} from "firebase/firestore"                                                                                                                                                  // import {useStateValue} from '../../contexts/StateContextProvider'

const ProfileFollow = () => {
   const history = useHistory()
   const {username} = useParams()
   const [following, setFollowing] = useState([]) 
   const [followers, setFollowers] = useState([])

   const [profile, setProfile] = useState({})
   const [posts, setPosts] = useState([])

   useEffect(() => {
      if(username){
         const q = query(collection(db, "users"), where("username", "==", username));
       onSnapshot(q,snapshot=>{
         setProfile(snapshot.docs.map(doc=>({
            id: doc.id,
            ...doc.data()
         }))[0])
         })         
      }
   }, [])


   useEffect(() => {
   if(profile.id){
      const q = query(collection(db, "posts"), where("senderId", "==", profile.id),orderBy('timestamp', 'desc'));
       onSnapshot(q,snapshot=> {
      setPosts(snapshot.docs.map(doc => doc.data()))
      })          
   }
   }, [profile])


   useEffect(() => {
      if(profile.id){
         console.log(profile.displayName, profile.id)
         const q = query(collection(db, "users"), where('followers', 'array-contains', profile.id));
      
         onSnapshot(q,snapshot=> {
         setFollowing(snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()})))
         }) 

         const j = query(collection(db, "users"), where('following', 'array-contains', profile.id));
         onSnapshot(j,snapshot=> {
         setFollowers(snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()})))
         }) 
      }

   }, [profile])

   console.log(following)
   console.log(followers)


    const items = [
        {
            id: 0,
            title:'Followers',
            item: <ul>
                     {followers && followers.map(user=>{
                        return  <li key={user.id}> <UserItemFollow display={user}/></li>
                     })}
                  </ul>
        },
        {
            id: 1,
            title: 'Following',
            item: <ul>
                     {following && following.map(user=>{
                        return  <li key={user.id}> <UserItemFollow display={user}/></li>
                     })}
                  </ul>
        }
    ]

    return (
        <div className='BarMiddle'>
           <div className="profile__header forFollow">
              <div className="profile__backArrow" onClick={()=>history.goBack()}>
                 <ArrowBackOutlinedIcon />
              </div>
              <div className='profile__title'>
                <div className='profile__title_title'><h2>{profile.displayName}</h2><CheckCircleIcon /></div>        
                <span>{ posts.length>0 ?`${posts.length} noctua`: ''}</span>
              </div>
           </div>

           <TabbarMenu items={items}/>

        </div>
    )
}

export default ProfileFollow
