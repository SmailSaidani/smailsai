import React, {useState, useEffect} from 'react'
import {Avatar, Button } from '@material-ui/core'
import {useStateValue} from '../../contexts/StateContextProvider'
import { db,storage} from "../../firebase/firebase";
import { Timestamp, updateDoc, doc,onSnapshot,addDoc,collection} from "firebase/firestore";
import { getDownloadURL, ref, uploadString,uploadBytes } from "@firebase/storage";
import './NoctuaBox.css'

import Popover from '@material-ui/core/Popover'
import Picker from 'emoji-picker-react'

import StatusInput from '../StatusInput/StatusInput'
import TabbarMenu from '../../elements/TabbarMenu/TabbarMenu'
import postToCloudinary from '../../helpers/postToCloudinary'
import {getInfo} from '../../helpers/getImageDimension'
import {generateAltText} from '../../helpers/generateAltText'

import Modal from '../../elements/Modal/Modal'
import Spinner from '../../elements/Spinner/Spinner'
import CropPhoto from '../EditPhoto/CropPhotoB'
import AddALT from '../EditPhoto/AddALT'

import CancelIcon from '@material-ui/icons/Cancel'
import SentimentSatisfiedOutlinedIcon from '@material-ui/icons/SentimentSatisfiedOutlined'
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined'
import EqualizerOutlinedIcon from '@material-ui/icons/EqualizerOutlined'
import EventNoteSharpIcon from '@material-ui/icons/EventNoteSharp'
import GifOutlinedIcon from '@material-ui/icons/GifOutlined'
import CropIcon from '@material-ui/icons/Crop'
import ArrowBackOutlinedIcon from '@material-ui/icons/ArrowBackOutlined'

const NoctuaBox = () => {
    const [{user}] = useStateValue()
    const {displayName} = user
    const [profile, setProfile] = useState(null)
    const [noctuaMessage, setNoctuaMessage] = useState('')
    const [altText, setAltText] = useState(generateAltText(user.displayName))
    const [src, setSrc] = useState(null)
    const [imageToSend, setImageToSend] = useState(null)
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [initialImageSize, setinitialImageSize] = useState({width: 0, height: 0})
    const [initialAspectRatio, setinitialAspectRatio] = useState(null)
    const [croppedImageResult, setCroppedImageResult ] = useState(null)
    const [anchorEl, setAnchorEl] = useState(null)
    const [isLoading, setIsloading] = useState(false)


    useEffect(() => {
        onSnapshot(doc(db,'users', user.id),snapshot=>{
         setProfile(snapshot.data())
       })
    }, [])
    console.log(profile);
    
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
            setAltText(generateAltText(displayName))
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

    const open = Boolean(anchorEl)
    const id = open ? 'post-popover' : undefined
    const onClickEmoticon = (event) => setAnchorEl(event.currentTarget)
    const handleClose = () => setAnchorEl(null)

    const onEmojiClick = (event, emojiObject) => {
        let newMessage = noctuaMessage + emojiObject.emoji
        setNoctuaMessage(newMessage)
    }

    useEffect(() => {
        var textarea = document.querySelector('textarea')
        textarea.addEventListener('keydown', autosize)
                    
        function autosize(){
        var el = this
        setTimeout(function(){
            el.style.cssText = 'height:auto padding:0'
            el.style.cssText = 'height:' + el.scrollHeight + 'px'
        },0)
        }
        
    }, [])
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
                    setSrc(null)
                    setIsloading(false)
                }else{
                    window.alert("post is empty can't post")
                setAltText('')
                setImageToSend(null)
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

            <div className='noctuaBox'>
                <form onSubmit={sendNoctua}>
                    <div className='noctuaBox__wrapperInput' >
                        <div className="noctuaBox__ava">
                            <Avatar src={profile && profile.photoURL} />   
                        </div>

                        <div className='noctuaBox__input'>

                            <textarea rows='1' 
                                      placeholder="What's happening"
                                      type        = 'text' 
                                      value       = {noctuaMessage}
                                      onChange    = {e=> setNoctuaMessage(e.target.value)}                            
                            >
                            </textarea>

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
                                                name="image-upload"
                                                id="input-image"
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
                                            vertical: 'bottom',
                                            horizontal: 'center',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'center',
                                        }}

                                    style={{borderRadius: '2rem'}}
                                    >
                                        <Picker onEmojiClick={onEmojiClick} />
                                    </Popover>

                                   <StatusInput Icon={EventNoteSharpIcon} />
                                </div>
                    
                                {
                                    isLoading ?
                                    <Button className='noctuaBox__noctuaButton'><Spinner /></Button>
                                    :
                                    <Button type='submit'className='noctuaBox__noctuaButton' onClick={sendNoctua}>Noctua</Button>
                                }

                            </div>
                        </div>    
                    </div>
                </form>
            </div>
        </>
    )
}

export default NoctuaBox