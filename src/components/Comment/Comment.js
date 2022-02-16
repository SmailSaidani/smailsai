import React,{useState,useEffect,forwardRef} from 'react';
import {Avatar} from '@material-ui/core'
import Moment from 'react-moment'

import FooterIcon from '../Comment/FooterIcone';
import Like from '../Comment/LikeComment'
import { unlikeComment,likeComment , follow, unfollow,editComment, deleteComment } from '../../server/serverActions';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline' 
import EditIcon from '@material-ui/icons/Edit';
import {convertTimestampToLocaleString} from '../../helpers/convertTimestampToLocaleString'
import { onSnapshot,doc,updateDoc} from "firebase/firestore";
import { db} from "../../firebase/firebase";
import {useStateValue} from '../../contexts/StateContextProvider'
import { Button, Dialog, DialogActions, DialogContent, TextareaAutosize, DialogTitle } from '@material-ui/core';
import './comment.css';




const Comment = forwardRef(({commentId,text,commentimage,commentAltText,postId,likes,createdAt,replierId},ref) => {  

   
 console.log(replierId)
    const [{user}] = useStateValue()
    const [profile, setProfile] = useState({id:'',displayName:'', photoURL: '', verified: false, username: '', followers:[], following:[]})
    const [ownProfile, setOwnProfile] = useState(null)
    const {displayName, username, photoURL, verified} = profile
    const [anchorEl, setAnchorEl] = useState(null)
    const onClickExpand= (event) => setAnchorEl(event.currentTarget)
    const handleClose = () => setAnchorEl(null)
    const [EditComment, setEditComment] = useState("");
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
   editComment(commentId, postId )
  handleCloseEditModal()
}
 const editComment = async (commentId,postId) => { 
   const text=EditComment
   const docRef = doc(db, 'posts', postId ,'comments',commentId)
   const payload = {
       text: text
   }
   await updateDoc(docRef, payload)
 }
    useEffect(() => {
        onSnapshot(doc(db, "users", user.id), 
           snapshot=>{
              setOwnProfile({id:user.id, ...snapshot.data()}) 
       })
       
        onSnapshot(doc(db, "users", replierId), 
       snapshot=>{
       setProfile(snapshot.data())
   })
        
     console.log(ownProfile);
     console.log(user.id);
     }, [])
     
  
    return (
     
< div className="comment" ref={ref} >
            <div className="comment__avatar">
                <Avatar src={photoURL}  />
            </div>   
              <div className="comment__body" >
                  
                  <div className="comment__header">
                      <div className="comment__HeaderText">
                          <h3>{displayName}{' '}
                              <span className='comment__headerSpacial'>
                              {verified && <VerifiedUserIcon className='post__badge'/>} 
                                  @{`${username}`}
                              </span>
                              <small className="retweet__headerDescription-moment">
                                 <Moment fromNow>{createdAt.toDate()}</Moment>
                              </small>
                          </h3>
                          
                      </div>
                         <div>
                <Dialog open={openEditModal} onClose={handleCloseEditModal}>
                  <DialogTitle>Edit Post</DialogTitle>
                  <DialogContent>
                  <TextareaAutosize
                    aria-label="minimum height"
                    minRows={3}
                    placeholder="What's happing..."
                    style={{ width: 200 }}
                    onChange={e=> setEditComment(e.target.value)}
                  />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseEditModal}>Cancel</Button>
                    <Button onClick={handleEdit}>Edit</Button>
                  </DialogActions>
                </Dialog>
              </div>
                      <div className="comment__headerDescription" >
                          <p>{text}</p>
                      </div>
                     <img src={commentimage} alt={commentAltText} onClick='' />
                     </div>
                     <div className="comment__footer">
                     <Like   likes={likes}
                         unlikeAction = {()=>unlikeComment(commentId, postId, user.id)}
                         likeAction = {()=>likeComment(commentId, postId, user.id)} />
                      
                         {replierId === user.id &&
                         <>
                         <FooterIcon  Icon={EditIcon} onClick={handleOpenEditModal}/>
                         <FooterIcon  Icon={DeleteOutlineIcon} onClick={() => deleteComment(commentId,postId)} />
                         </> }
                       
                         
                     </div>
                     <div >
              
                     </div>
               
              
                     </div>
                     </div>
        
    );
}
)
export default Comment;