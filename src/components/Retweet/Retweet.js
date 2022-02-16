import React,{useState,useEffect,forwardRef} from 'react';

import {Avatar} from '@material-ui/core'
import Reply from '../Reply/Reply'
import Moment from 'react-moment'

import FooterIcon from '../Post/FooterIcon';
import Like from '../Post/Like'
import RetweetModal from '../retweetmodal/RetweetModal'
import {useStateValue} from '../../contexts/StateContextProvider'
import Modal from '../../elements/Modal/Modal'
import Popover from '@material-ui/core/Popover'
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline'
import RepeatIcon from '@material-ui/icons/Repeat'
import PublishIcon from '@material-ui/icons/Publish'
import PlaceIcon from '@material-ui/icons/Place'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline' 
import EditIcon from '@material-ui/icons/Edit';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import './Retweet.css';
import { db } from '../../firebase/firebase'
import CloseIcon from '@material-ui/icons/Close'
import CodeIcon from '@material-ui/icons/Code'
import BlockIcon from '@material-ui/icons/Block'
import PostAddIcon from '@material-ui/icons/PostAdd'
import PersonAddDisabledIcon from '@material-ui/icons/PersonAddDisabled'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied'
import { Button, Dialog, DialogActions, DialogContent, TextareaAutosize, DialogTitle } from '@material-ui/core';
import {like, unlike, follow, unfollow, deletePost} from '../../server/serverActions'
import { collection, orderBy, query, onSnapshot,getDoc,addDoc,increment,updateDoc,  doc } from 'firebase/firestore';
import { useHistory } from "react-router-dom";
//import PersonRemoveAlt1Icon from '@material-ui/icons/PersonRemoveAlt1';


const Retweet = forwardRef(({
    altText,
    text,
    image,
    createdAt,
    senderId,
    postId,
    retweeterId,
    retweets,
    retweettext,
    timestamp,
    likes
}, ref) => {  

   console.log(senderId)
   console.log(retweeterId)
  const history = useHistory();

const [anchorEl, setAnchorEl] = useState(null)
const onClickExpand= (event) => setAnchorEl(event.currentTarget)
const handleClose = () => setAnchorEl(null)
const open = Boolean(anchorEl)
const popoverId = open ? 'post-popover' : undefined
const [isOpenModal, setIsOpenModal] = useState(false)
const [OpenModal, setOpenModal] = useState(false)

const [retweeted, setretweeted] = useState(false);

const [comments, setComments] = useState([]);

const [{user}] = useStateValue()
const [profile, setProfile] = useState({id:'',displayName:'', photoURL: '', verified: false, username: '', followers:[], following:[]})
const [ownProfile, setOwnProfile] = useState({})
const [isFollowing, setIsFollowing] = useState(false)

const [noctuaEditMessage, setNoctuaEditMessage] = useState("");
// start edit modal
const [openEditModal, setOpenEditModal] = React.useState(false);
const handleOpenEditModal = () => {
  setOpenEditModal(true);
  handleClose();
}
const handleCloseEditModal = () => {
  setOpenEditModal(false);
  handleClose();
}
const handleEdit = () => {
  editPost(postId)
  handleCloseEditModal()
}
// end edit modal
// start edit function 
const editPost = async (postId) => {  
  const docRef = doc(db, 'posts', postId)
  const payload = {
   retweettext: noctuaEditMessage
  }
  await updateDoc(docRef, payload)
}
// end edit function
useEffect(() => {
   const postsCollectionRef = collection(db, 'posts', postId,"comments")
   const q = query(postsCollectionRef, orderBy('createdAt', 'desc'))

   const unsub = onSnapshot(q, (snapshot) => {
       setComments(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})) )
   })
   return unsub
}, [db,postId])

useEffect(() => {
    onSnapshot(doc(db, "users", retweeterId), 
         snapshot=>{
            setOwnProfile({id:user.id, ...snapshot.data()}) 
     })
   console.log(ownProfile)
   
    onSnapshot(doc(db, "users", senderId), 
   snapshot=>{
   setProfile(snapshot.data())
})
console.log(senderId)
    

 }, [])



const callbackForModal = () => {}
     
    return (<>
   <Modal  
            open={isOpenModal} 
            onClose={()=>setIsOpenModal(false)}
            title=""
            callback = {callbackForModal}
            Icon = {CloseIcon}
            ButtonText=''
         >
            <Reply props={{
                  altText,
                  text,
                  image,
                  createdAt,
                  senderId,
                  postId,
                  
                  likes
               }}
               profile={profile}
               ownProfile ={ownProfile}
            />
         </Modal>
        

         <Modal  
            open={OpenModal} 
            onClose={()=>setOpenModal(false)}
            title=""
            callback = {callbackForModal}
            Icon = {CloseIcon}
            ButtonText=''
         >
             <RetweetModal props={{
                  altText,
                  text,
                  image,
                  createdAt,
                  senderId,
                  postId,
                  retweettext,
                  retweeterId,
                  likes
               }}
               profile={profile}
               ownProfile ={ownProfile}
            />
            
         </Modal>
       <div  className='retweet-section' ref={ref}>
       <div className="retweet" >
       <div className="retweet__avatar">
           <Avatar src={ownProfile.photoURL}  />
       </div>   
         <div className="retweet__body" >
             <div className="retweet__header">
                 <div className="retweet__HeaderText">
                     <h3>{ownProfile.displayName}{' '}
                         <span className='retweet__headerSpacial'>
                         {ownProfile.verified && <VerifiedUserIcon className='retweet__badge'/>} 
                             @{`${ownProfile.username}`}
                         </span>
                         <small className="retweet__headerDescription-moment">
                                 <Moment fromNow>{createdAt.toDate()}</Moment>
                              </small>
                         <div className="retweet__headerDescription" >
                     <p>{retweettext}</p>
                    
                 </div>
                     </h3>
                    
                     <div className="retweet__headerExpandIcon" aria-describedby={popoverId} variant="contained" onClick={onClickExpand }>
                       <MoreHorizIcon /> 
                     </div>

                     <Popover 
                        id={popoverId}
                              open={open}
                              anchorEl={anchorEl}
                              onClose={handleClose}

                        anchorOrigin={{
                           vertical: 'top',
                           horizontal: 'right',
                        }}
                        transformOrigin={{
                           vertical: 'top',
                           horizontal: 'right',
                        }}
                     >
                        <ul className="post__expandList">
                        {
                          retweeterId=== user.id?
                           <>
                              <li onClick={()=>deletePost(postId)}>
                                 <div className='delete'><DeleteOutlineIcon /></div><h3 className="delete">Delete</h3>
                              </li>
                              <li onClick={handleOpenEditModal}>
                                 <div><EditIcon /></div><h3>edit noctua</h3>
                              </li>
                              
                              <li>
                                 <div><PlaceIcon /></div><h3>Pin to your profile</h3>
                              </li>
                             
                             
                           </>
                           :
                           <>
                              <li>
                                 <div><SentimentVeryDissatisfiedIcon /></div><h3>Not interested in this noctua</h3>
                              </li>
                              {
                                 isFollowing?
                                    <li onClick={()=>unfollow(user.id, senderId)} >
                                       <div><PersonAddDisabledIcon /></div><h3>Unfollow {`@${profile.followingusername}`}</h3>
                                    </li>
                                 :  <li onClick={()=>follow(user.id, senderId)}>
                                       <div><PersonAddIcon /></div><h3>Follow {`@${profile.username}`}</h3>
                                    </li>
                              }
                              <li>
                                 <div><PostAddIcon /></div><h3>Add/remove from Lists</h3>
                              </li>
                              <li>
                                 <div><BlockIcon /></div><h3>Block {`@${profile.username}`}</h3>
                              </li>
                              <li>
                                 <div><CodeIcon /></div><h3>Embed Noctua</h3>
                              </li>
                           </>
                        }
                        </ul>
                     </Popover>
                     
                     {/* Start Edit Modal*/}
            <div>
                <Dialog open={openEditModal} onClose={handleCloseEditModal}>
                  <DialogTitle>Edit Post</DialogTitle>
                  <DialogContent>
                  <TextareaAutosize
                    aria-label="minimum height"
                    minRows={3}
                    placeholder="What's happing..."
                    style={{ width: 200 }}
                    onChange={e=> setNoctuaEditMessage(e.target.value)}
                  />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseEditModal}>Cancel</Button>
                    <Button onClick={handleEdit}>Edit</Button>
                  </DialogActions>
                </Dialog>
              </div>
            {/* End Edit Modal*/}
                </div>
                <div >
                </div>
          
         </div>
       
         </div>
         </div>

       <div className="postr"onClick={() =>
                history.push(`/post/${postId}/${senderId}/${retweeterId}`)} >
       <div className="postr__avatar">
           <Avatar src={profile.photoURL}  />
       </div>   
         <div className="postr__body" >
             <div className="postr__header">
                 <div className="postr__HeaderText">
                     <h3>{profile.displayName}{' '}
                         <span className='postr__headerSpacial'>
                         {profile.verified && <VerifiedUserIcon className='postr__badge'/>} 
                             @{`${profile.username}`}
                         </span>
                     </h3>
                    
                 </div>
                 
                 <div className="postr__headerDescription" >
                     <p>{text}</p>
                      <img src={image} alt={altText} onClick='' />
                 </div>
               
                </div>


               
                <div >
         
                </div>
          
         </div>
       
           
         </div>
         <div className="retweet__footer">
         <FooterIcon Icon={ChatBubbleOutlineIcon} onClick={()=>setIsOpenModal(true)} value={comments.length} />
                  <FooterIcon Icon={RepeatIcon} value={retweets} onClick={()=>setOpenModal(true)}/>
                     
                    <Like likes={likes}
                        unlikeAction = {()=>unlike(postId, user.id)}
                        likeAction = {()=>like(postId, user.id,senderId)} />
                    <FooterIcon  Icon={BookmarkBorderIcon}   />
                </div>
                
                </div>
                </>
    )
}
)
export default Retweet