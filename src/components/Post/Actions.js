import { updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/firebase';






// export const editPost = async (id) => {  
//   const docRef = doc(db, 'posts', id)
//   const payload = {
//       text: 'noctuaEditMessage'
//   }
//   await updateDoc(docRef, payload)
// }

    
export const deletePost = async (id) => { 
    const docRef = doc(db, 'posts', id)
    
    await deleteDoc(docRef)
}