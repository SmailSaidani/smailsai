import React, {useState, useEffect} from 'react'
import {Avatar} from '@material-ui/core'

import {getDoc, doc} from "firebase/firestore";
import { db} from "../../firebase/firebase";
import {useStateValue} from '../../contexts/StateContextProvider'

const FollowingEquality = ({profile}) => {
    const [{user}] = useStateValue()
    const [myFollowing, setMyFollowing] = useState([])
    const [equality, setEquality] = useState([])

    const [user1, setUser1] = useState(null)
    const [user2, setUser2] = useState(null)
     
    useEffect(() => {
        console.log(user.id)
        getDoc(doc(db,'users', user.id)).then((docSnap) => {
          setMyFollowing(docSnap.data().following)           
        })
    }, [])
    console.log(myFollowing)

    useEffect(() => {
        if(profile&& profile.followers.length>0){
            setEquality(profile.followers.filter(item=> myFollowing.includes(item)))   
        }
    }, [myFollowing, profile])   
    console.log(equality)

    useEffect(() => {
        let equalityLength = equality.length
        if(equalityLength>0){
            if (equalityLength>1){
                getDoc(doc(db,'users',equality[1])).then((userData) => { 
                    console.log(userData.data())
                    setUser2(userData.data())
                    
                });
            }

            getDoc(doc(db,'users',equality[0])).then((userData) => { 
                console.log(userData.data())
                setUser1(userData.data())
                
            });

        }
    }, [equality])

    console.log(equality)

    return (
        <div className="followedInfo">
            {
                equality.length>0 ?
                <>
                    {user1 && <Avatar src={user1.photoURL}/>}
                    {(equality.length>1 && user2 ) && <Avatar src={user2.photoURL}/>}
                    <span>Followed by {`${user1 ? user1.displayName: ''} `} {(equality.length===2 && user2) ? `and ${user2.displayName}`: ''} {(equality.length>2 && user2)?`, ${user2.displayName}, and ${equality.length-2} others`:''} </span>
                </>
                :
                <span>Not followed by anyone you follow</span>      
            }
        </div>
    )
}

export default FollowingEquality