import React, { useRef, useEffect, useState } from "react";
import Moment from "react-moment";
import {db} from "../../firebase/firebase";
import { doc, updateDoc,deleteDoc} from "firebase/firestore";
import DeleteIcon from "@material-ui/icons/Delete";

const Message = ({ msg, user1,chat }) => {
  const [mid, setMid]=useState('')
  const scrollRef = useRef();
  useEffect(() => {
    scrollRef.current && scrollRef.current.scrollIntoView({ behavior: "smooth" });
    console.log(msg.uid)
    console.log(msg.delid)
    
  }, [msg]);



  const deleteMsg =  () => {
   deleteDoc(doc(db,"messages",msg.delid,"chat",msg.uid))
   updateDoc(doc(db,"lastMsg",msg.delid),{
    text:"last message has been delited"
  })}

 return (
    <div className={`message_wrapper ${msg.from === user1 ? "own" : ""}`} ref={scrollRef}>
      <DeleteIcon  onClick={() => deleteMsg()}/>
      <p className={msg.from === user1 ? "me" : "friend"}>
        {msg.media ? <img src={msg.media} alt={msg.altText} /> : null}
        {msg.text}
        <br />
        <small>
          <Moment fromNow>{msg.createdAt.toDate()}</Moment>
        </small>
      </p>
    </div>
  );
};
export default Message;