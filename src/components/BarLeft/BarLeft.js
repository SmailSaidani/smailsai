import React, {useState, useEffect} from 'react'
import {doc, updateDoc, onSnapshot, arrayUnion, arrayRemove,deleteDoc,addDoc,collection,getDoc,increment} from 'firebase/firestore'
import { db,auth} from "../../firebase/firebase";
import Modal from '../../elements/Modal/Modal'
import NoctuaboxModal from '../NoctuaboxModal/NoctuaboxModal';
import BarOption from '../BarOption/BarOption'
import BarAccount from '../BarAccount/BarAccount'
import HomeIcon from '@material-ui/icons/Home'
import SearchIcon from '@material-ui/icons/Search'
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone'
import MailOutlineIcon from '@material-ui/icons/MailOutline'
import {ReactComponent as Logo }  from '../../assets/Logo.svg'
import PermIdentityIcon from '@material-ui/icons/PermIdentity'
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import Badge from '@material-ui/core/Badge';
import CloseIcon from '@material-ui/icons/Close'
import {useStateValue} from '../../contexts/StateContextProvider'
import './BarLeft.css'




const BarLeft = () => {
    const [userid, setUid]=useState('')
    const [notifs, setNotifs]=useState()
  
    const [OpenModal, setOpenModal] = useState(false)
    const [ownProfile, setOwnProfile] = useState(null)
    const [{user}] = useStateValue()

    useEffect(() => 
    onSnapshot(doc(db,'users',user.id),(snapshot)=> {
        
        setOwnProfile(snapshot.data())
            setNotifs(snapshot.data().notifications)
    }),[db,user.id]);

    console.log(ownProfile)  


console.log(userid)  

const resetNotifs=()=>{

    updateDoc(doc(db,'users',user.id) ,{ 
        notifications:0
        
    });

}

    
    
    

const callbackForModal = () => {}
    return (
<>
<Modal  
            open={OpenModal} 
            onClose={()=>setOpenModal(false)}
            title=""
            callback = {callbackForModal}
            Icon = {CloseIcon}
            ButtonText=''
         >
             <NoctuaboxModal
               
            
               ownProfile ={ownProfile}
            />
            
         </Modal>  
        <div className='barleft'>
  


           <Logo className='barleft__noctuaIcon'/>
        
           <BarOption text='Home' Icon={HomeIcon} />
           <BarOption text='Explore' Icon={SearchIcon} />
           <Badge  color ="secondary" badgeContent={notifs} anchorOrigin={{
               vertical:'left',
               horizontal:'buttom'
            } }  overlap="circular" >
           <BarOption text='Notifications' Icon={NotificationsNoneIcon} onClick={()=>resetNotifs(null)} /> 
           </Badge>
        
           <BarOption text='Messages' Icon={MailOutlineIcon}/>      
           <BarOption text='Profile' Icon={PermIdentityIcon} />

           <button variant='outlined' className='barleft__noctua' onClick={()=>setOpenModal(true)} >
              <div dir="auto" className="css-901oao r-1awozwy r-jwli3a r-6koalj r-18u37iz r-16y2uox r-1qd0xha r-a023e6 r-vw2c0b r-1777fci r-eljoum r-dnmrzs r-bcqeeo r-q4m81j r-qvutc0"><svg viewBox="0 0 24 24" fill='#ffffff' className="r-jwli3a r-4qtqp9 r-yyyyoo r-1q142lx r-50lct3 r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1srniue"><g><path d="M8.8 7.2H5.6V3.9c0-.4-.3-.8-.8-.8s-.7.4-.7.8v3.3H.8c-.4 0-.8.3-.8.8s.3.8.8.8h3.3v3.3c0 .4.3.8.8.8s.8-.3.8-.8V8.7H9c.4 0 .8-.3.8-.8s-.5-.7-1-.7zm15-4.9v-.1h-.1c-.1 0-9.2 1.2-14.4 11.7-3.8 7.6-3.6 9.9-3.3 9.9.3.1 3.4-6.5 6.7-9.2 5.2-1.1 6.6-3.6 6.6-3.6s-1.5.2-2.1.2c-.8 0-1.4-.2-1.7-.3 1.3-1.2 2.4-1.5 3.5-1.7.9-.2 1.8-.4 3-1.2 2.2-1.6 1.9-5.5 1.8-5.7z"></path></g></svg><span className="css-901oao css-16my406 css-bfa6kz r-1qd0xha r-ad9z0x r-bcqeeo r-qvutc0"></span></div>
              <span>Noctua</span>
           </button>

           <BarAccount />
       
           
        </div>
        </>
    )
}

export default BarLeft