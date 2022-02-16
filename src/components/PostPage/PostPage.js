import React,{useState,useEffect,forwardRef} from 'react';
import { useParams } from "react-router-dom";
import Post from '../Post/Post'


import RetweetModal from '../retweetmodal/RetweetModal'
import {Avatar} from '@material-ui/core'
import Reply from '../Reply/Reply'
import BarRight from "../BarRight/BarRight";

import Comment from '../Comment/Comment'
import FooterIcon from '../Post/FooterIcon';
import Like from '../Post/Like'
import {like, unlike, follow, unfollow, deletePost,editPost,retweet} from '../../server/serverActions'
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
import ArrowBackIcon from '@material-ui/icons/ArrowLeft';
import { useHistory } from "react-router-dom";
import '../Post/Post.css';
import { db } from '../../firebase/firebase'
import { doc,collection,updateDoc, deleteDoc,getDoc, query, orderBy,onSnapshot } from 'firebase/firestore';
import { Button, Dialog, DialogActions, DialogContent, TextareaAutosize, DialogTitle } from '@material-ui/core';
import FlipMove from 'react-flip-move'
import CloseIcon from '@material-ui/icons/Close'
import {useStateValue} from '../../contexts/StateContextProvider'



const PostPage = forwardRef(({
   
    
}, ref) => {  
    const [post, setPost] = useState([]);
    const { postId } = useParams();
    const { senderId } = useParams();
console.log(postId)
console.log(senderId)
    const history = useHistory();

const [anchorEl, setAnchorEl] = useState(null)
const onClickExpand= (event) => setAnchorEl(event.currentTarget)
const handleClose = () => setAnchorEl(null)
const open = Boolean(anchorEl)
const popoverId = open ? 'post-popover' : undefined
const [isOpenModal, setIsOpenModal] = useState(false)
const [OpenModal, setOpenModal] = useState(false)
const [Showreply, setShowreply] = useState(false);
const [profile, setProfile] = useState([])
// const {displayName, username,photoURL, verified} = profile
const [comments, setComments] = useState([]);
const [ownProfile, setOwnProfile] = useState(null)
const [{user}] = useStateValue()



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
      text: noctuaEditMessage
  }
  await updateDoc(docRef, payload)
}
// end edit function
useEffect(() => 
onSnapshot(doc(db,"posts",postId),(snapshot)=> {
    setPost(snapshot.data());
    
}),[db.postId]);
console.log(post.image);
const image=post.image
const altText=post.altText
const createdAt=post.createdAt
const text=post.text
const likes=post.likes
console.log(image);
console.log(altText);
console.log(createdAt);
console.log(text);
console.log(likes);
useEffect(() => {
  onSnapshot(doc(db, "users", user.id), 
     snapshot=>{
        setOwnProfile({id:user.id, ...snapshot.data()}) 
 })
 let mounted = true
 getDoc(doc(db,'users',senderId)).then((docSnap)=>{
    if(docSnap.exists){
    if (mounted) {
       setProfile(docSnap.data())
       
    }
 }
 })
 return () => mounted = false
}, [])

console.log(user.id)
console.log(ownProfile)

    console.log(post)
    useEffect(() => {
        const postsCollectionRef = collection(db, 'posts', postId,"comments")
        const q = query(postsCollectionRef, orderBy('createdAt', 'desc'))

        const unsub = onSnapshot(q, (snapshot) => {
            setComments(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})) )
        })
        return unsub
    }, [db,postId])
    console.log(comments)
    
   
const callbackForModal = () => {}
    return (
       

           <> 
           <div className='BarMiddle'>
           <div className='BarMiddle__header'>
        <div className='BarMiddle__header-ava'>
        
        </div>
        <div
              className="post__headerExpandIcon"
              onClick={() =>
                history.push(`/`)}
            >
              < ArrowBackIcon />
            </div>
         <h2>Home</h2>
        </div>

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
                  likes
               }}
               profile={profile}
               ownProfile ={ownProfile}
            />
            
         </Modal>
        <div className="post" ref={ref}>
        <div className="post__avatar">
            <Avatar src={profile.photoURL} />
        </div>   
          <div className="post__body" >
              <div className="post__header">
                  <div className="post__headerText">
                      <h3>{profile.displayName}{' '}
                          <span className='post__headerSpecial'>
                          {profile.verified && <VerifiedUserIcon className='post__badge'/>} 
                              @{`${profile.username}`}
                          </span>
                      </h3>
                      <div className="post__headerExpandIcon" aria-describedby={popoverId} variant="contained" onClick={onClickExpand }>
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
         { senderId === user.id && 
         <li onClick={handleOpenEditModal}> 
         
             <div><EditIcon/></div><h3>Edit post</h3>
            </li>
         }
            <li> 
             <div><PlaceIcon /></div><h3>Pin to your  profile</h3>
            </li>
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
                  
                  
                  <div className="post__headerDescription" >
                      <p>{post.text}</p>
                  </div>
                 <img src={post.image} alt={post.altText} onClick='' />
                 </div>
                 <div className="post__footer">
                     <FooterIcon  Icon={ChatBubbleOutlineIcon}value={comments.length} onClick={()=>setIsOpenModal(true)}  />
                     <FooterIcon  Icon={RepeatIcon} value={post.retweets} onClick={()=>setOpenModal(true)} />
                     <Like 
                        likes={post.likes}
                        unlikeAction = {()=>unlike(postId, user.id)}
                        likeAction = {()=>like(postId, user.id,senderId)}
                  />
                     <FooterIcon  Icon={PublishIcon}/>
                 </div>
                 <div >
          
                 </div>
           
          </div>
        
            
          </div>
         
        
          <FlipMove>
          {comments.map((comment) => (
        
        <Comment key={comment.id}
        commentId={comment.id}
        postId = {comment.post}
        commentAltText = {comment.commentAltText}
        replierId  = {comment.senderId }
        text = {comment.text}
        commentimage = {comment.commentimage}
        createdAt = {comment.createdAt}
        likes = {comment.likes}
/>
        ))}
          </FlipMove>
         
          
          </div>
          <BarRight/>
           </>

             )
            }
            )

export default PostPage