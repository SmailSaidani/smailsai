import React, {useEffect, useState} from 'react'
//import {Button} from '@material-ui/core'
import SentimentSatisfiedOutlinedIcon from '@material-ui/icons/SentimentSatisfiedOutlined'
import InsertPhotoOutlinedIcon from '@material-ui/icons/InsertPhotoOutlined'
import GifOutlinedIcon from '@material-ui/icons/GifOutlined'
import SendIcon from '@material-ui/icons/Send'
//import CancelIcon from '@material-ui/icons/Cancel'
import CropIcon from '@material-ui/icons/Crop'
import ArrowBackOutlinedIcon from '@material-ui/icons/ArrowBackOutlined'
import Popover from '@material-ui/core/Popover'
import Picker from 'emoji-picker-react'

import StatusInput from '../StatusInput/StatusInput'
import CropPhoto from '../EditPhoto/CropPhotoB'
import AddALT from '../EditPhoto/AddALT'
import Modal from '../../elements/Modal/Modal'
import TabbarMenu from '../../elements/TabbarMenu/TabbarMenu'
import {generateAltText} from '../../helpers/generateAltText'
import postToCloudinary from '../../helpers/postToCloudinary'
import {getInfo} from '../../helpers/getImageDimension'
import {useStateValue} from '../../contexts/StateContextProvider'
import Spinner from '../../elements/Spinner/Spinner'
import {addDoc, Timestamp,setDoc,doc,collection} from "firebase/firestore";
import {db} from'../../firebase/firebase';

import './MessageForm.css'
const MessageForm = ({chat,user1,ch})=> {
    const [{user}] = useStateValue()
    const {displayName} = user
   
    const [text, setText] = useState('')
    const [altText, setAltText] = useState(generateAltText(displayName))
    const [anchorEl, setAnchorEl] = useState(null)
    const [src, setSrc] = useState(null)
    const [imageToSend, setImageToSend] = useState(null)
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [initialImageSize, setinitialImageSize] = useState({width: 0, height: 0})
    const [initialAspectRatio, setinitialAspectRatio] = useState(null)
    const [croppedImageResult, setCroppedImageResult ] = useState(null)
    const [isLoading, setIsloading] = useState(false) 

   const handleSubmit = (e)=> {
    e.preventDefault();
    setIsloading(true)
    const user2 = chat.uid;
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    if (text===''){
 //opload img
    if(imageToSend){
        //const docRef=doc(db, "messages", id, "chat")
        postToCloudinary(imageToSend).then(res => {
            const mid=String(Math.floor((Math.random() * 100000) + 1));
            const docRef=doc(db, "messages", id, "chat",mid)
            setDoc(docRef, {
               altText: altText,
               //text:text,
               from:user1,
               to:user2,
               createdAt: Timestamp.fromDate(new Date()),
               media: res,
               delid:mid,
               uid:mid,
               delid:id
           })
           });    
           setAltText('')
           setSrc(null)
           setIsloading(false) 
           setImageToSend(null)
   }else{
       setAltText('')
       setSrc(null)
       setIsloading(false)
       setImageToSend(null)
   };
  }else{
   if(imageToSend){
       //const mid=Math.floor((Math.random() * 100000) + 1);
       //const docRef=doc(db, "messages", id, "chat")
       postToCloudinary(imageToSend).then(res => {
        const mid=String(Math.floor((Math.random() * 100000) + 1));
        const docRef=doc(db, "messages", id, "chat",mid)
            setDoc(docRef, {
               altText: altText,
               text:text,
               from:user1,
               to:user2,
               createdAt: Timestamp.fromDate(new Date()),
               media:res,
               uid:mid,
               delid:id
           })
           });
           setText('')    
           setAltText('')
           setSrc(null)
           setIsloading(false) 
           setImageToSend(null)
    }else{
        const mid=String(Math.floor((Math.random() * 100000) + 1));
            const docRef=doc(db, "messages", id, "chat",mid)
            setDoc(docRef, {
                altText: altText,
                text:text,
                from:user1,
                to:user2,
                createdAt: Timestamp.fromDate(new Date()),
                media:'',
                uid:mid,
                delid:id
        
           });
        setText('')
        setAltText('')
        setSrc(null)
        setIsloading(false)
        setImageToSend(null)
    };
}
const mid=Math.floor((Math.random() * 100000) + 1);

    setDoc(doc(db, "lastMsg", id), {
        //altText: altText,
        text:text,
        from:user1,
        to:user2,
        createdAt: Timestamp.fromDate(new Date()),
        //media:'',
        unread: true,
    });
};

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

/*const changeSrc = () => {
    setSrc(URL.createObjectURL(croppedImageResult))
    setImageToSend(croppedImageResult)
}*/

/*const callbackforModal = () =>{
    changeSrc()
    if (altText.length === 0){
        setAltText(generateAltText(displayName))
    }
}*/


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
    let newMessage = text + emojiObject.emoji
    setText(newMessage)
}



  return (
      <>
            <Modal  open={isOpenModal} 
                    onClose={()=>setIsOpenModal(false)}
                    title="Edit Photo"
                   
                    Icon = {ArrowBackOutlinedIcon}
                    ButtonText='Save'
                    >
                    <TabbarMenu items={items}/>
             </Modal>

            <div className="chat__footer">
               {src && 
                 <div className='chat__footer-ImageBox'>
                     {/*<CancelIcon className='cancelIcon' onClick={()=>setSrc(null)}/>*/}
                     <img src={src} alt="new test"/>               
                     {/*<Button className='editImage' onClick={()=>setIsOpenModal(true)}>Edit</Button>*/}
                  </div>
               }

               <StatusInput Icon={InsertPhotoOutlinedIcon}
                           type="file"
                           accept="image/*"
                           name="image-upload"
                           id="input-image"
                           onChange={onSelectFile}
               />
               <GifOutlinedIcon />
               <form onSubmit={handleSubmit}>
                  <input type="text"
                     placeholder='Start a new message'
                     value={text}
                     onChange ={(e)=>setText(e.target.value)}
                  />
                  <div className="chat__footer-emowrapper">
                    <SentimentSatisfiedOutlinedIcon aria-describedby={id} type="button" onClick={onClickEmoticon} />
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
                           style={{
                              transform: 'translate(-2rem, -1rem)'
                           }}>
                           <Picker onEmojiClick={onEmojiClick} />
                     </Popover>

                  </div>
                  {
                     (src || text.length>0)?
                     isLoading?
                     <span className='spinnerSpan'><Spinner /></span>
                     :<SendIcon type='submit' className='readyBtn' onClick={handleSubmit}/>
                     :<SendIcon/> 
                  }
                </form>
            </div>
        </>
    )
}

export default MessageForm;
