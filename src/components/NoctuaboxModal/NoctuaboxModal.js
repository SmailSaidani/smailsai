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
import './NoctuaboxModal.css'

const NoctuaboxModal = ({ ownProfile}) => {
    
    const [{user}] = useStateValue()
    const [post,setPost]= useState();
 
    const [anchorEl, setAnchorEl] = useState(null)
    const [isLoading, setIsloading] = useState(false)

    const open = Boolean(anchorEl)
    const id = open ? 'post-popover' : undefined
    const onClickEmoticon = (event) => setAnchorEl(event.currentTarget)
    const handleClose = () => setAnchorEl(null)

  

    const [src, setSrc] = useState(null)
    const [imageToSend, setImageToSend] = useState(null)
    const [initialImageSize, setinitialImageSize] = useState({width: 0, height: 0})
    const [initialAspectRatio, setinitialAspectRatio] = useState(null)
    const [croppedImageResult, setCroppedImageResult ] = useState(null)
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [noctuaMessage, setNoctuaMessage] = useState('')
    const [altText, setAltText] = useState(generateAltText(ownProfile.displayName))
   

    const onEmojiClick = (event, emojiObject) => {
        let newMessage = noctuaMessage + emojiObject.emoji
        setNoctuaMessage(newMessage)
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
        if (altText.length === 0){
            setAltText(generateAltText(ownProfile.displayName))
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
            item: <AddALT image={croppedImageResult} altText={altText} setAltText={setAltText}/>
        }
    ]
    
    const sendNoctua = async (e) => {
        e.preventDefault()
        setIsloading(true)

            if (noctuaMessage===''){
                if (imageToSend) {
                    postToCloudinary(imageToSend).then(res => {
                     addDoc(collection(db, "posts"), {
                        retweets    : 0,
                        comments    : 0,
                        likes       : 0,
                        retweeter   : '', 
                        itretweet   :false,
                        retphotourl : '',
                        senderId    : user.id,
                        createdAt:new Date(),
                        image: res,
                        altText     : altText,
                        
                    });
                });
                    setAltText('')
                    setImageToSend(null)
                    setIsOpenModal(false)
                    setSrc(null)
                    setIsloading(false)
                }else{
                    window.alert("post is empty can't post")
                setAltText('')
                setImageToSend(null)
                setIsOpenModal(false)
                setSrc(null)
                setIsloading(false)
                }
            }else{
                if (imageToSend) {
                    postToCloudinary(imageToSend).then(res => {
                     addDoc(collection(db, "posts"), {
                        retweets    : 0,
                        comments    : 0,
                        likes       : 0,
                        retweeter   : '', 
                        itretweet   :false,
                        retphotourl : '',
                        senderId    : user.id,
                        createdAt:new Date(),
                        image: res,
                        altText     : altText,
                        text        : noctuaMessage,
                    });
                });
                setNoctuaMessage('')
                setAltText('')
                setImageToSend(null)
                setIsOpenModal(false)
                setSrc(null)
                setIsloading(false)
                }else{
                    addDoc(collection(db, "posts"), {
                        retweets    : 0,
                        comments    : 0,
                        likes       : 0,
                        retweeter   : '', 
                        itretweet   :false,
                        retphotourl : '',
                        senderId    : user.id,
                        createdAt:new Date(),
                       
                        text        : noctuaMessage,
                    });
                    setNoctuaMessage('')
                    setAltText('')
                    setImageToSend(null)
                    setIsOpenModal(false)
                    setSrc(null)
                    setIsloading(false)
                }
              

            }

            
        }

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
                  
                        <Avatar src={ownProfile.photoURL} />
                       
                    </TimelineSeparator>
                    
                    <TimelineContent>
                        <form onSubmit={sendNoctua}>
                            <div className='noctuaBox__input upped'>
                                <textarea rows='1' 
                                        placeholder = "What's happening"
                                        type        = 'text' 
                                        value       = {noctuaMessage}
                                        onChange    = {e=> setNoctuaMessage(e.target.value)}                            
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
<TimelineItem>
                 
                </TimelineItem>
                            <div className='noctuaBox__input-actions'>
                                <div className='noctuaBox__input-icons'>
                                <StatusInput Icon={ImageOutlinedIcon}
                                                type="file"
                                                accept="image/*"
                                                name="image-upload"
                                                id="image"
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
                                        <Button type='submit'className='noctuaBox__noctuaButton' onClick={sendNoctua}>Noctua</Button>
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

export default NoctuaboxModal