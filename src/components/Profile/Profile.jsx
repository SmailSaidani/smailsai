import React, {useState, useEffect} from 'react';
import {useHistory, useParams,useLocation} from 'react-router-dom';
import Posts from '../Posts/Posts';
import TabbarMenu from '../../elements/TabbarMenu/TabbarMenu';
import ProfileTheme from '../ProfileTheme/ProfileTheme';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ArrowBackOutlinedIcon from '@material-ui/icons/ArrowBackOutlined';
import Loader from '../../elements/Loader/Loader';
import Retweet from '../Retweet/Retweet.js';

import {collection,query, where,onSnapshot, orderBy} from "firebase/firestore";
import { db} from "../../firebase/firebase"
import '../BarMiddle/BarMiddle.css'

const BarMiddle = () => {
    const {username} = useParams()  
    const history = useHistory()    
    const [liked,setliked]=useState([])
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)
    const initProfile=useLocation().state
     
    const [profile, setProfile] = useState(initProfile)

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
      setLoading(true)

      if(profile){
        const q = query(collection(db,'posts'), orderBy('createdAt',"desc" ))
        onSnapshot(q,snapshot=> {
          setPosts(snapshot.docs.map(doc => ({id:doc.id, ...doc.data()})))
          setLoading(false)
        })
      }
    }, [profile])

    useEffect(() => {
      setLoading(true)

      if(profile){
        const q = query(collection(db,'posts'), where('likes', "array-contains" ,profile.id))
        onSnapshot(q,snapshot=> {
          setliked(snapshot.docs.map(doc => ({id:doc.id, ...doc.data()})))
          setLoading(false)
        })
      }
    }, [profile])
 
 

    
    const items = [
        {
            id: 0,
            title:'Noctua',
            item: <>
                    { loading && <div className="BarMiddle__loader"><Loader/></div> } 
                     <Posts posts={posts.filter(post=>post.senderId==profile.id)} />
                  </>
        },
        {
            id: 1,
            title: 'Noctua & replies',
            item: <>  { loading && <div className="BarMiddle__loader"><Loader/></div> }
               <Posts posts={posts.filter(post=>post.retweeterId==profile.id)} />
             </>
        },
        {
            id: 2,
            title: 'Media',
            item: <>
                    { loading && <div className="BarMiddle__loader"><Loader/></div> } 
                      <Posts  posts={posts.filter(post=>post.image!=null && post.senderId==profile.id)} />  
                  </>
        },       
        {
          id: 3,
          title: 'likes',
          item: <>
                  { loading && <div className="BarMiddle__loader"><Loader/></div> } 
                    <Posts  posts={liked} />  
                </>
      }         
    ]

    return (
        <div className='BarMiddle'>
           <div className="profile__header">
              <div className="profile__backArrow" onClick={()=>history.goBack()}>
                 <ArrowBackOutlinedIcon />
              </div>
              <div className='profil
              e__title'>
                <div className='profile__title_title'><h2>{profile && profile.displayName}</h2><CheckCircleIcon /></div>        
                <span>{posts.filter(post=>post.senderId==profile.id) && posts.filter(post=>post.senderId==profile.id).length } noctua</span> 
              </div>
           </div>

           <ProfileTheme profile={profile} />

           <TabbarMenu items={items}/>

        </div>
    )
}

export default BarMiddle
