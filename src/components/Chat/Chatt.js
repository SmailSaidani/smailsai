import React, {useState, useEffect} from 'react'
import {db} from "../../firebase/firebase";
import {collection, query, where, onSnapshot, orderBy, doc,getDoc, updateDoc,arrayUnion} from "firebase/firestore";
import {Avatar} from '@material-ui/core'
//import ArrowBackOutlined from '@material-ui/icons/ArrowBackOutlined';
import ArrowBackOutlinedIcon from '@material-ui/icons/ArrowLeft';

import Message from "./Message"
import MessageForm from "./MessageForm"
import {useStateValue} from '../../contexts/StateContextProvider'
import Mcontact from './Mcontact'
import './Chatt.css'
import { useHistory,Link } from "react-router-dom";

import VideocamOffOutlinedIcon from '@material-ui/icons/VideocamOffOutlined';
import Video from "./VideoChat/Video";
const Chatt = () => {
    const [{user}] = useStateValue()
    const [users,setUsers]= useState([]);
    const [chat, setChat] = useState("");
    const [msgs, setMsgs] = useState([]);
    const [usr, setUsr] = useState({})
    const [contactsid, setContactsID] = useState([])
    const [aplVideo,setaplVideo] =useState(false);

    const alVideo=()=>{setaplVideo(true)}

    const history = useHistory()
    const user1 = user.id
 
    useEffect(() => {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("uid", "not-in", [user1]));
        const unsub = onSnapshot(q, (querySnapshot) => {
          let users = [];
          querySnapshot.forEach((doc) => {
            users.push(doc.data());
          });
          setUsers(users);
        });
         return () => unsub();
    },);
    
    useEffect(()  => {
        const cid=[]
        const q = query(doc(db, 'users', user1));
        const unsub = onSnapshot(q, (querySnapshot) => {
            cid.push(querySnapshot.data().contactes[0])
            setContactsID(cid)
          });
           return () => unsub(); 
    },[])
   
    /* useEffect(()  => {
        const q = query(collection(db, 'users'),where("contactes","array-contains",user.id));
        const unsub = onSnapshot(q, (snapshot) => {
        setContacts(snapshot.docs.map(doc=>({id:doc.id,...doc.data()})))
          });
           return () => unsub(); 
    },[])*/

    getDoc(doc(db,'users',user1)).then((userData) => {
        const data = userData.data();
        setUsr(data)
    });

   const selectUser = async (user) =>{
        //const cnts=[]
        //const cid=[]
        //cid.push(user.uid)
        //setContactsID(cid)
        setChat(user);
        const user2 = user.uid
        //afficher les msg dans lordre asc
        const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
        
        if(!contactsid.includes(user.uid)){
            updateDoc(doc(db,'users',user1),{
              contactes:arrayUnion(user.uid)
            })
            updateDoc(doc(db,'users',user.uid),{
                contactes:arrayUnion(usr.uid)
            })           
        }
        //setContactsID([...contactsid, user.uid]);
        
        const msgsRef = collection(db, "messages", id, "chat");
        const q = query(msgsRef, orderBy("createdAt", "asc"));
        onSnapshot(q, querySnapshot => {
            let msgs = [];
            querySnapshot.forEach(doc =>{
                msgs.push(doc.data());
                console.log(doc.id)
            });
            setMsgs(msgs);
        });
        //get last message btwin logged in user and select user
        const docSnap = await getDoc(doc(db, "lastMsg", id));
        //if last msg exists and message is from selected user
        if (docSnap.data() && docSnap.data().from !== user1){
       // update last message doc, set unread to false
        await updateDoc(doc(db, "lastMsg", id), { unread: false});
        }; 
    };

    const selectUser1 = async (user) =>{
        setChat(user);
        const user2 = user.uid
        //afficher les msg dans lordre asc
        const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
        const msgsRef = collection(db, "messages", id, "chat");
        const q = query(msgsRef, orderBy("createdAt", "asc"));
        onSnapshot(q, querySnapshot => {
            let msgs = [];
            querySnapshot.forEach(doc =>{
                msgs.push(doc.data());
                console.log(doc.id)
            });
            setMsgs(msgs);
        });
        //get last message btwin logged in user and select user
        const docSnap = await getDoc(doc(db, "lastMsg", id));
        // if last msg exists and message is from selected user
        if (docSnap.data() && docSnap.data().from !== user1){
            //update last message doc, set unread to false
            await updateDoc(doc(db, "lastMsg", id), { unread: false});
        }; 
    };

 return (
      <div className="app__main">
        
           <div className="users_container">
                    <Mcontact 
                       selectUser1={selectUser1} 
                       selectUser={selectUser} 
                       user1={user1}
                       chat={chat}
                       users={users}
                    /> 
          </div> 

          <div className='BarMiddle'>
          
              <div className="messages_container">
                 {chat ? ( 
                     <> 
                        <div className="BarMiddle__header">
                         <ArrowBackOutlinedIcon onClick={() =>history.push('/contacte')}/>
                         {/*<Link exact to={'/'}><ArrowBackOutlinedIcon /></Link>*/}
                         <Avatar src={chat.photoURL} className="BarMiddle__header-ava"/>
                         <h2>{chat.displayName}</h2>
                         <VideocamOffOutlinedIcon className='video' onClick={alVideo}/>
                        </div>

                        {/*msgs[msg,msg,msg] */}
                        <div className=" messages">
                            {msgs.length ? msgs.map((msg, i) => (
                               <Message key={i} msg={msg} user1={user1} chat={chat}/>))
                                : 
                                null 
                             } 
                             <div className='videos'>
                        {aplVideo ?<Video/>:false}
                        </div>
                       </div>
                       <MessageForm
                        chat={chat}
                        user1={user1}
                        />
                     </>
                        ) :(
                        <div>
                            <ArrowBackOutlinedIcon onClick={() =>history.push('/contacte')}/>
                             <h3 className="no_conv">Select a user to start conversation</h3> </div>
                           )
                    }
             </div>
        </div>
      </div> 
    )
}
export default Chatt