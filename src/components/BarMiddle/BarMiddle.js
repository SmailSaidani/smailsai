import React, {useState, useEffect} from 'react'
import NoctuaBox from '../NoctuaBox/NoctuaBox'
import Posts from '../Posts/Posts'
import Retweet from '../Retweet/Retweet'

import { db} from "../../firebase/firebase";
import { getDoc,getDocs, doc,orderBy,collection,query,onSnapshot} from "firebase/firestore";
import {Avatar} from '@material-ui/core'
import Loader from '../../elements/Loader/Loader'
import './BarMiddle.css'

import {useStateValue} from '../../contexts/StateContextProvider'

const BarMiddle = () => {
    const [{user}] = useStateValue()
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)
    const [profile, setProfile] = useState(null)
    const [following, setFollowing] = useState([])


  
    useEffect(() => {
      let mounted = true
      getDoc(doc(db,'users', user.id)).then((docSnap)=>{
         if(docSnap.exists){
         if (mounted) {
            setProfile(docSnap.data())
            //setFollowing(docSnap.data() && docSnap.data().following)
         }
      }
      })
      return () => mounted = false
    }, [])

    

    useEffect(() => {
        const postsCollectionRef = collection(db, 'posts')
        const q = query(postsCollectionRef,orderBy('createdAt', 'desc'))

        const unsub = onSnapshot(q, (snapshot) => {
            setPosts(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})) )
        })
        return unsub
    }, [])
    console.log(posts)

   
 
    return (
        <div className='BarMiddle'>
           <div className="BarMiddle__header">
              <div className="BarMiddle__header-ava">
                 <Avatar src={profile && profile.photoURL}/>
              </div>
              <h2>Home</h2>          
           </div>
           
           <NoctuaBox/>

           { loading && <div className="BarMiddle__loader"><Loader/></div> }

           <Posts posts={posts} />  
            
        </div>
    )
}

export default BarMiddle
