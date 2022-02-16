import React, {useState,useEffect} from 'react'
import './SearchBarRight.css'
import SearchIcon from '@material-ui/icons/Search'
import CancelIcon from '@material-ui/icons/Cancel'
import { collection, getDocs,query,where } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { Link } from "react-router-dom";
import {Avatar, Button} from '@material-ui/core'
import {useStateValue} from '../../contexts/StateContextProvider'

const SearchBarRight = () => {
  const [{user}] = useStateValue()


const [users, setUsers] = useState([])
    const [text, setText] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const usersCollectionRef = query(collection(db, 'users'), where('uid', '!=' ,user.id))

    const getUsers = async () => {
        const data = await getDocs(usersCollectionRef);
        setUsers(data.docs.map((doc)=> ({ ...doc.data(), id: doc.id })))
        
    }
    const onChangeHandler = (text) => {
        let matches = []
        if (text.length>0) {
            matches = users.filter(user => {
                const regex = new RegExp(`${text}`,'gi')
                return user.displayName.match(regex)
            })
        }
        console.log(matches)
        setSuggestions(matches)
        setText(text)
    }
    useEffect(() => {
        getUsers()
    }, [])
    
    return (
        <div className="searchWidget__wrapper">
           
             <div className="searchWidget">
                 
                <input placeholder="Search Noctua" type="text" 
                    onChange={e => onChangeHandler(e.target.value)}
                    value={text}
                    
                    />
                    <SearchIcon className="searchWidget__SearchIcon" />
                    
{/*                   
                    <CancelIcon className="searchWidget__CancelIcon" /> */}
             </div>
               

                <div className='autocomp-box'>
                    {suggestions && suggestions.map((suggestion, i) => 
                    <Link   to={
                        {
                            pathname:"/profile/" + suggestion.username,
                            state:suggestion
                            
                            }} style={{color: 'inherit', textDecoration: 'none'}}>
                            <li className='list'  key={i}>
                        
                            <Avatar  src={suggestion.photoURL} className="BarMiddle__header-ava"/>   
                            
                            <h2>{suggestion.displayName}</h2>
                            
                            
                            </li>
                            

                    </Link>
                    )}
                </div>
                {/* <div className='icon'>
                    <CancelIcon className="searchWidget__CancelIcon" />
                </div> */}
            </div>

        
    );
}

/*
{filteredFreelance.map((item, key) => (
              <LinkToProfile
                key={key}
                to={
                  token
                    ? {
                        pathname: "/freelance/profile/" + item._id,
                        state: { freelance: item },
                      }
                    : {
                        pathname: "/login",
                        state: {
                          previousPath: "/freelance/profile/" + item._id,
                          freelance: item,
                        },
                      }
                }
              >
                <FreelanceCards item={item} />
              </LinkToProfile>
            ))}
*/


export default SearchBarRight
