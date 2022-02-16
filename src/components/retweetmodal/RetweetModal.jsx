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

import { db,storage,auth} from "../../firebase/firebase";
import { getDownloadURL, ref, uploadString,uploadBytes } from "@firebase/storage";
import { getDoc, addDoc,updateDoc,doc,collection,onSnapshot,increment} from "firebase/firestore";

import util from '../../helpers/timeDifference'
import {getInfo} from '../../helpers/getImageDimension'
import postToCloudinary from '../../helpers/postToCloudinary'
import {generateAltText} from '../../helpers/generateAltText'
import {convertTimestampToLocaleString} from '../../helpers/convertTimestampToLocaleString'
import {useStateValue} from '../../contexts/StateContextProvider'
import './RetweetModa.css'

const RetweetModal = ({props, profile, ownProfile}) => {
    const {displayName, username, photoURL, verified} = profile
    const {timestamp, text, image, altText, postId,senderId,retweettext,retweeterId} = props
    const date = convertTimestampToLocaleString(timestamp)
    const [{user}] = useStateValue()
    const [post,setPost]= useState();
    const [retweeterProfile,setretweeterProfile]= useState({});
    
    console.log(retweeterId)
    console.log(retweettext)
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
    const [OpenModal, setOpenModal] = useState(false)
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
    useEffect(() => {
       
       if(retweeterId){
        onSnapshot(doc(db, "users", user.id),
       snapshot=>{
       setretweeterProfile(snapshot.data())
    })
    console.log(retweeterId)
    console.log(retweeterProfile)   
}
     }, [])
     console.log(senderId)
     console.log(image)
     const retweet = async (e) => {  
        e.preventDefault()
        setIsloading(true)            
        const docRef = doc(db, 'posts',postId)    
            
             if(image && text  )  {   
             addDoc(collection(db, 'posts'), {     
             retweeterId:ownProfile.id,
             senderId:senderId, 
             image:image,   
             text:text,
             retweettext:commentMessage,             
             likes:0,                   
             comments:0,                              
             itretweet: true,                
             createdAt:new Date()                                                                                               
            } )   
        }else {
            if(image) {
            addDoc(collection(db, 'posts'), {     
                retweeterId:ownProfile.id,
                senderId:senderId,   
                image:image,
                retweettext:commentMessage,            
                likes:0,                   
                comments:0,                            
                itretweet: true,                
                createdAt:new Date()                                                                                               
               } )  
        } else {addDoc(collection(db, 'posts'), {     
            retweeterId:ownProfile.id,
            senderId:senderId,   
            text:text, 
            retweettext:commentMessage,            
            likes:0,                   
            comments:0,                            

            itretweet: true,                
            createdAt:new Date()                                                                                               
           } )  }
            
        }                            
                                
          const notifRef=collection(db,'notifications')
          await getDoc(docRef).then((postData) => {      
            const data = postData.data(); 
            const itretweet= data.itretweet
            const retweeter= data.retweeterId
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
                      text:sender+" has retweeted your post",
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
                      text:sender+" has retweeted your post",
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
          await updateDoc(docRef, {
            retweets: increment(1)})
            setOpenModal(false)
            setIsloading(false)
    }
    return (
        <>
            <Modal  open={OpenModal} 
                    onClose={()=>setOpenModal(false)}
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
                    {retweeterId ? 
                        <Avatar src={retweeterProfile.photoURL} />
                        :
                        <Avatar src={ownProfile.photoURL} />
                        }
                    </TimelineSeparator>
                    
                    <TimelineContent>
                        <form onSubmit={retweet}>
                            <div className='noctuaBox__input upped'>
                                <textarea rows='1' 
                                        placeholder = 'add your comment '
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
                                        <Button className='editImage' onClick={()=>setOpenModal(true)}>Edit</Button>
                                    </div>                        
                            }
<TimelineItem>
                    <TimelineSeparator> 
                        <Avatar src={photoURL} />
                    
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
                           
                        </div>
                    </TimelineContent>
                </TimelineItem>
                            <div className='noctuaBox__input-actions'>
                                <div className='noctuaBox__input-icons'>
                                    <StatusInput Icon={ImageOutlinedIcon} 
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
                                        <Button type='submit'className='noctuaBox__noctuaButton'onClick={retweet}>Noctua</Button>
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

export default RetweetModal