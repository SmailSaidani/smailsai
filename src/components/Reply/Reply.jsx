import React, {useState, useEffect} from 'react'
import {Avatar, Button} from '@material-ui/core'
import { Timeline } from '@material-ui/lab'
import TimelineItem from '@material-ui/lab/TimelineItem'
import TimelineSeparator from '@material-ui/lab/TimelineSeparator'
import TimelineConnector from '@material-ui/lab/TimelineConnector'
import TimelineContent from '@material-ui/lab/TimelineContent'
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser'

import Popover from '@material-ui/core/Popover'
import Picker from 'emoji-picker-react'
import Spinner from '../../elements/Spinner/Spinner'
import StatusInput from '../StatusInput/StatusInput'
import Modal from '../../elements/Modal/Modal'
import TabbarMenu from '../../elements/TabbarMenu/TabbarMenu'
import CropPhoto from '../EditPhoto/CropPhotoB'
import AddALT from '../EditPhoto/AddALT'

import CancelIcon from '@material-ui/icons/Cancel'
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined'
import SentimentSatisfiedOutlinedIcon from '@material-ui/icons/SentimentSatisfiedOutlined'
import EqualizerOutlinedIcon from '@material-ui/icons/EqualizerOutlined'
import EventNoteSharpIcon from '@material-ui/icons/EventNoteSharp'
import GifOutlinedIcon from '@material-ui/icons/GifOutlined'
import ArrowBackOutlinedIcon from '@material-ui/icons/ArrowBackOutlined'
import CropIcon from '@material-ui/icons/Crop'

import { db,storage} from "../../firebase/firebase";
import { getDownloadURL, ref,  uploadBytes } from "@firebase/storage";
import { increment, addDoc,updateDoc,getDoc,doc,collection,onSnapshot} from "firebase/firestore";

import util from '../../helpers/timeDifference'
import {getInfo} from '../../helpers/getImageDimension'
import postToCloudinary from '../../helpers/postToCloudinary'
import {generateAltText} from '../../helpers/generateAltText'
import {convertTimestampToLocaleString} from '../../helpers/convertTimestampToLocaleString'

import './Reply.css'

const Reply = ({props, profile, ownProfile}) => {
    const {displayName, username, photoURL, verified} = profile
    const {timestamp, text, image, altText, postId,senderId} = props
    const date = convertTimestampToLocaleString(timestamp)
    const [post,setPost]= useState();

    const [anchorEl, setAnchorEl] = useState(null)
    const [isLoading, setIsloading] = useState(false)

    const open = Boolean(anchorEl)
    const id = open ? 'post-popover' : undefined
    const onClickEmoticon = (event) => setAnchorEl(event.currentTarget)
    const handleClose = () => setAnchorEl(null)

    const [commentMessage, setCommentMessage] = useState('')
    const onChangeComment = (e) => setCommentMessage(e.target.value)

    const [src, setSrc] = useState(null)
    const [imageToSend, setImageToSend] = useState(null)
    const [initialImageSize, setinitialImageSize] = useState({width: 0, height: 0})
    const [initialAspectRatio, setinitialAspectRatio] = useState(null)
    const [croppedImageResult, setCroppedImageResult ] = useState(null)
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [commentAltText, setCommentAltText] = useState(generateAltText(ownProfile.displayName))

    const onEmojiClick = (event, emojiObject) => {
        let newComment = commentMessage + emojiObject.emoji
        setCommentMessage(newComment)
    }

    const onSelectFile = e => {
        const fileReader = new FileReader()
        fileReader.onloadend = () => {
            setSrc(fileReader.result)
            setImageToSend(fileReader.result)
        }   
        fileReader.readAsDataURL(e.target.files[0])
        getInfo(e).then(res=> {
            setinitialImageSize({width: res.width, height: res.height})
        })
    }

    useEffect(() => {
        setinitialAspectRatio(initialImageSize.width/initialImageSize.height)
    }, [initialImageSize])

    const changeSrc = () => {
        setSrc(URL.createObjectURL(croppedImageResult))
        setImageToSend(croppedImageResult)
    }

    const callbackforModal = () =>{
        changeSrc()
        if (commentAltText.length === 0){
            setCommentAltText(generateAltText(displayName))
        }
    }

    const items = [
        {
            id: 0,
            title:'',
            icon: <CropIcon />,
            item: <CropPhoto 
                    image={src} 
                    setCroppedImageResult ={setCroppedImageResult} 
                    initialAspectRatio    = {initialAspectRatio}
            />
        },
        {
            id: 1,
            title: 'ALT',
            icon: '',
            item: <AddALT image={croppedImageResult} altText={commentAltText} setCommentAltText={setCommentAltText}/>
        }
    ]
    useEffect(() => 
    onSnapshot(doc(db,"posts",postId),(snapshot)=> {
        setPost(snapshot.data());
    }),[db]);
    const sendComment = async(e) => {
        e.preventDefault()
        setIsloading(true)

                    if (commentMessage===''){
                        if (imageToSend) {
                            postToCloudinary(imageToSend).then(res => {
                             addDoc(collection(db, "posts",postId,"comments"), {
                                likes           : [],
                                senderId        : ownProfile.id,
                                post            : postId,
                                createdAt       : new Date(),
                                commentimage    : res,
                            });
                        });
                     
                    setCommentAltText('')
                    setSrc(null)
                    setImageToSend(null)
                    setIsOpenModal(false)
                    setIsloading(false)
                        }else{
                            window.alert("comment is empty can't post")
                           
                            setCommentAltText('')
                            setSrc(null)
                            setIsOpenModal(false)
                            setImageToSend(null)
                            setIsloading(false)
                        }
                    }else{
                        if (imageToSend) {
                            postToCloudinary(imageToSend).then(res => {
                                addDoc(collection(db, "posts",postId,"comments"), {
                                text            : commentMessage,
                                likes           : [],
                                senderId        : ownProfile.id,
                                post            : postId,
                                createdAt       : new Date(),
                                commentimage    : res,
                            });
                        });
                        setCommentMessage('')
                        setCommentAltText('')
                        setSrc(null)
                        setImageToSend(null)
                        setIsOpenModal(false)
                        setIsloading(false)
                        }else{
                            addDoc(collection(db, "posts",postId,"comments"),{
                                text            : commentMessage,
                                likes           : [],
                                senderId        : ownProfile.id,
                                post            : postId,
                                createdAt       : new Date(),
                            });
                            setCommentMessage('')
                            setCommentAltText('')
                            setSrc(null)
                            setImageToSend(null)
                            setIsOpenModal(false)
                            setIsloading(false)
                        }
                      
                    }      
                    const postRef = doc(db,'posts', postId)  
                    const notifRef=collection(db,'notifications')
                    await getDoc(postRef).then((postData) => {      
                        const data = postData.data(); 
                        const itretweet= data.itretweet
                        const retweeter= data.retweeterId
                    console.log(ownProfile.id)
                    const user=getDoc(doc(db,'users',ownProfile.id)).then((userData) => { 
                        console.log(userData.data())
                        const sender=userData.data().displayName
                        const photoURL=userData.data().photoURL
                        console.log(sender)
                        if(itretweet){
                            addDoc(notifRef,{
                                itretweet:itretweet,
                                  sender:sender,
                                  photoURL:photoURL,
                                  text:sender+" has relpied to  your post",
                                  user:senderId,
                                  retweeter:retweeter,
                                  postId:postId,
                                  createdAt:new Date(),
                      
                      
                              })
                          }else{
                            addDoc(notifRef,{
                                itretweet:itretweet,
                                  sender:sender,
                                  photoURL:photoURL,
                                  text:sender+" has relpied to  your post",
                                  user:senderId,
                                  postId:postId,
                                  createdAt:new Date(),
                      
                      
                              })
                          }
                    });
                })
                updateDoc(doc(db,'users',senderId),{
                    notifications: increment(1)
        
                })
    }

    // const sendComment = async(e) => {
    //     e.preventDefault()
    //     setIsloading(true)
    //     const docRef = await addDoc(collection(db, "posts",postId,"comments"), {
            
    //                 text            : commentMessage,
    //                 likes           : [],
    //                 senderId        : ownProfile.id,
    //                 post            : postId,
    //                 createdAt       :new Date(),
    //         });
    //         const imageRef = ref(storage, posts/comments/${docRef.id}/image);

    //         if (imageToSend) {
    //           await uploadBytes(imageRef, imageToSend, "data_url").then(async () => {
    //             const downloadURL = await getDownloadURL(imageRef);
    //             await updateDoc(doc(db, "posts",postId,'comments', docRef.id), {
    //               commentimage: downloadURL,
    //               commentAltText  : commentAltText,
    //             });
    //           });
    //         }
    //                 setCommentMessage('')
    //                 setCommentAltText('')
    //                 setSrc(null)
    //                 setIsOpenModal(false)
    //                 setIsloading(false)
           
    // }

    return (
        <>
            <Modal  open={isOpenModal} 
                    onClose={()=>setIsOpenModal(false)}
                    title="Edit Photo"
                    callback = {callbackforModal}
                    Icon = {ArrowBackOutlinedIcon}
                    ButtonText='Save'
                    >
                    <TabbarMenu items={items}/>
            </Modal>

            <div className="reply">
                <Timeline>
                <TimelineItem>
                    <TimelineSeparator> 
                        <Avatar src={photoURL} />
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                        <div className="post__body upped">
                            <div className="post__header">
                                <div className="post__headerText">
                                    <h3>{displayName} {' '}
                                        <span className='post__headerSpecial'> 
                                            {verified && <VerifiedUserIcon className='post__badge'/>} 
                                            {`@${username} . ${timestamp && util.timeDiff(date)}`}
                                        </span>
                                    </h3>
                                </div>

                                <div className="post__headerDescription"> <p> {text} </p></div>
                            </div>
                            { image && <img src={image} alt={altText}/> }
                            <span className='replyingTo'>Replying to <p>{`@${username}`}</p></span>
                        </div>
                    </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                    <TimelineSeparator>
                    <Avatar src={ownProfile.photoURL} />
                    </TimelineSeparator>
                    <TimelineContent>
                        <form onSubmit={sendComment}>
                            <div className='noctuaBox__input upped'>
                                <textarea rows='1' 
                                        placeholder = 'noctua your reply'
                                        type        = 'text' 
                                        value       = {commentMessage}
                                        onChange    = {onChangeComment}                            
                                >
                                </textarea>
                            </div> 

                            {
                                src &&
                                    <div className='noctuaBox__input-image'>
                                        <CancelIcon className='cancelIcon' onClick={()=>setSrc(null)}/>
                                        <img src={src} alt="new test"/>               
                                        <Button className='editImage' onClick={()=>setIsOpenModal(true)}>Edit</Button>
                                    </div>                        
                            }

                            <div className='noctuaBox__input-actions'>
                                <div className='noctuaBox__input-icons'>
                                    <StatusInput Icon={ImageOutlinedIcon} 
                                        type="file"
                                        accept="image/*"
                                        name="comment-image-upload"
                                        id="comment-image-upload"
                                        onChange={onSelectFile}
                                    />
                                    <StatusInput Icon={GifOutlinedIcon}/>
                                    <StatusInput Icon={EqualizerOutlinedIcon} />
                                    <StatusInput Icon={SentimentSatisfiedOutlinedIcon} 
                                                 aria-describedby={id} type="button" onClick={onClickEmoticon} 
                                    />

                                    <Popover 
                                        id={id}
                                        open={open}
                                        anchorEl={anchorEl}
                                        onClose={handleClose}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'center',
                                        }}
                                        transformOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'center',
                                        }}
                                        style={{borderRadius: '2rem'}}
                                    >
                                        <Picker onEmojiClick={onEmojiClick} />
                                    </Popover>

                                    <StatusInput Icon={EventNoteSharpIcon} />
                                </div>
                        
                                    {
                                        isLoading ? <Button className='noctuaBox__noctuaButton'><Spinner /></Button>
                                        :
                                        <Button type='submit'className='noctuaBox__noctuaButton'onClick={sendComment}>Reply</Button>
                                    }

                                </div>
                        </form>
                    </TimelineContent>
                </TimelineItem>
                </Timeline>
            </div>
        </>
    )
}

export default Reply