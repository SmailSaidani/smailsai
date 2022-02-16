import React, {useEffect, useState} from 'react';
import { collection, query,onSnapshot,doc,where } from 'firebase/firestore';
import { db } from "../../firebase/firebase";
import CancelIcon from '@material-ui/icons/Cancel'
import SearchIcon from "@material-ui/icons/Search";
import {useStateValue} from '../../contexts/StateContextProvider'
import Contact from './Contact'

const Mcontact= ({user1, selectUser,selectUser1, chat,users}) =>{
    const [{user}] = useStateValue()


    const [texts, setTexts] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const [focus, setFocus] = useState(false)
    const [isInputPressed, setIsInputPressed] = useState(false)
    const [contacts, setContacts] = useState([])

    

    const onInputPressed = () => {
        setFocus(true)
        setIsInputPressed(true)
    }

    const onChangeHandler = (texts) => {
        let matches = []
        if (texts.length>0) {
            matches = users.filter(user => {
                const regex = new RegExp(`${texts}`,'gi')
                return user.displayName.match(regex) })
            }
        console.log(matches)
        setSuggestions(matches)
        console.log(suggestions)
        setTexts(texts)
    }

    useEffect(()  => {
        const q = query(collection(db, 'users'),where("contactes","array-contains",user.id));
        const unsub = onSnapshot(q, (snapshot) => {
        setContacts(snapshot.docs.map(doc=>({id:doc.id,...doc.data()})))
          });
           return () => unsub(); 
    },[])

return (
    <div>
          <div className="wrapper">
                  <div className={`search-input ${isInputPressed ?'beingPressed':''}`}>
                     <input placeholder="Search" type="text" 
                             
                             onBlur = {()=> setIsInputPressed(false)}  
                             onChange={e => onChangeHandler(e.target.value)}
                             value={texts} 
                              onFocus = {onInputPressed}
                     />
                     <div className='icon'>
                         <SearchIcon/> 
                     </div>
                     {/*(focus && texts.length>0) && <CancelIcon onClick={()=>setTexts('')}/>*/}
                 </div> 
                     <div className=''>
                          {suggestions && suggestions.map((suggestion, i) => (
                             <Contact 
                                 key={i} 
                                 suggestion={suggestion} 
                                 selectUser={selectUser} 
                                 user1={user1}
                                 chat={chat} 
                                
                               /> ))
                           }
                     </div>
             </div>{/*serachfin */}

             {contacts && contacts.map((suggestion, i) => (
                 <Contact
                     key={i} 
                     suggestion={suggestion} 
                     selectUser={selectUser1} 
                     user1={user1}
                     chat={chat}
                  /> ))
                }
          </div> 
        
    
        )
}
export default Mcontact

