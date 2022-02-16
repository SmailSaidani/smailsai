import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router'
import BarRightTrends from '../BarRightTrends/BarRightTrends'
import BarRightFollow from '../BarRightFollow/BarRightFollow'
import BarRightPhoto from '../BarRightPhoto/BarRightPhoto'
import SearchBarRight from '../../elements/SearchBarRight/SearchBarRight'



import {collection,query, where,onSnapshot,orderBy} from "firebase/firestore";
import { db} from "../../firebase/firebase";
import '../BarRight/BarRight.css'

const ProfileBarRight = () => {
   const {username} = useParams()
   const [posts, setPosts] = useState([])
   const [text, setText] = useState('')
   const [profile, setProfile] = useState(null)

    useEffect(() => {
      const q = query(collection(db,'users'), where('username', '==', username));
      onSnapshot(q, snapshot=>{
        setProfile(snapshot.docs.map(doc=>({
          id: doc.id,
          ...doc.data()
        }))[0])
      })
    }, [username])


    useEffect(() => {
        if(profile){
          const q = query(collection(db,'posts'), where('senderId', '==', profile.id), )
            onSnapshot(q,snapshot=> {
                setPosts(snapshot.docs.map(doc => doc.data()))
            }) 
        }
    }, [profile])


    return (
        <div className='barRight'>

           <SearchBarRight
               value={text} 
               onChange = {(e)=>setText(e.target.value)}
               onClick={()=>setText('')}           
               placeholder='Search Noctau' 
            />

            { posts.length>0 && <BarRightPhoto posts={posts}/>}

            <BarRightFollow />

            <BarRightTrends />
            
        </div>
    )
}

export default ProfileBarRight
