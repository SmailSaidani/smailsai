import React, {useEffect, useState} from 'react';
import { onSnapshot,doc } from 'firebase/firestore';
import { db } from "../../firebase/firebase";
import {Avatar} from '@material-ui/core'
import './Contact.css'

const Contact= ({user1, suggestion, selectUser,chat}) =>{
    const user2 = suggestion && suggestion.uid;
    const [data, setaData] = useState("");
   
    useEffect(() =>{
        const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
        let unsub = onSnapshot(doc(db, "lastMsg", id), (doc) =>{
            setaData(doc.data());
        });
        return () =>unsub();
    },[]);
  
 return (
    <div className='barRight'>
        <div className={`user_wrapper ${chat.displayName === suggestion.displayName && "selected_user"}`} onClick={() => selectUser(suggestion)} >
            <div className="user_info">
                <div className="user_detail">
                 <Avatar src={suggestion.photoURL}/>
                 <h2>{suggestion.displayName}</h2>
                 {data && data.from !== user1 && data && data.unread && (
                    <strong className="unread"> New </strong> 
                 )}
                </div>
                <div className={`user_status ${suggestion.verified ? "online": "offline"}`}></div>
           </div>
           {data && (
              <p className="truncate">
                 <strong>{data.from === user1 ? "Me:" : null}</strong>
                 {data.text}
             </p>)}
        </div>
    </div>
        )
}
export default Contact