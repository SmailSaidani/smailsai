import {doc, updateDoc, arrayUnion, arrayRemove,deleteDoc,addDoc,collection,getDoc,increment} from 'firebase/firestore'
import { db,auth} from "../firebase/firebase";
export const follow = async (userId, followId) => {
   
    const userRef = doc(db,"users", userId )
    const followRef = doc(db,'users', followId)

    await updateDoc(userRef, {
        following:arrayUnion(followId)
    });

    await updateDoc (followRef, {
        followers:arrayUnion(userId)
    });

    
    const notifRef=collection(db,'notifications')
     
          const user=getDoc(doc(db,'users',userId)).then((userData) => { 
              console.log(userData.data())
              const sender=userData.data().displayName
              const username=userData.data().username
              const photoURL=userData.data().photoURL
              console.log(username)
              addDoc(notifRef,{
                  sender:sender,
                  photoURL:photoURL,
                  text:sender+" start to follow you ",
                  username:username,
                  user:followId,
                  createdAt:new Date(),
      
      
              })
          });   
          updateDoc(doc(db,'users',followId),{
            notifications: increment(1)

        })


}

export const unfollow =  async (userId, followId) => {
    const userRef = doc(db,'users',  userId)
    const followRef = doc(db, 'users', followId)

   await updateDoc(userRef,{
        following:arrayRemove(followId)
    });

    await updateDoc(followRef,{
        followers: arrayRemove(userId)
    });

}


export const deletePost = async (postId) => { 
    const docRef = doc(db, 'posts', postId)

    await deleteDoc(docRef)
    
    await updateDoc(docRef, {
        retweets: increment(-1)})

}

export const like = async (postId, userId,senderId) => {
    const postRef = doc(db,'posts', postId)
   await updateDoc(postRef, {
        likes: arrayUnion(userId)
    })
    
    const notifRef=collection(db,'notifications')
    await getDoc(postRef).then((postData) => {      
        const data = postData.data(); 
        const itretweet= data.itretweet
        const retweeter= data.retweeterId

    const user=getDoc(doc(db,'users',userId)).then((userData) => { 
        console.log(userData.data())
        const sender=userData.data().displayName
        const photoURL=userData.data().photoURL
        console.log(sender)
        if(itretweet){
            addDoc(notifRef,{
                itretweet:itretweet,
                  sender:sender,
                  photoURL:photoURL,
                  text:sender+" has liked your post",
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
                  text:sender+" has liked your post",
                  user:senderId,
                  postId:postId,
                  createdAt:new Date(),
      
      
              })
          }
    });
    updateDoc(doc(db,'users',senderId),{
        notifications: increment(1)
    
    })
})

}

export const unlike = async (postId, userId) => {
    const postRef = doc(db,'posts', postId)
   await updateDoc(postRef,{
        likes:arrayRemove(userId)
    })
}

export const likeComment = async (commentId, postId,userId) => {
    const postRef = doc(db, 'posts', postId,'comments',commentId)
   await updateDoc(postRef, {
        likes: arrayUnion(userId)
    })
}

export const unlikeComment = async (commentId, postId,userId) => {
    const postRef = doc(db, 'posts', postId,'comments',commentId)
   await updateDoc(postRef, {
        likes: arrayRemove(userId)
    })
}

export const editPost = async (postId) => { 
    const text = prompt("Entre your new Text") // à changer par la suite par un modal par exemple 
    const docRef = doc(db, 'posts', postId)
    const payload = {
        text: text
    }
    await updateDoc(docRef, payload)
  }

  export const deleteComment = async (commentId,postId) => { 
      console.log(commentId)
    const docRef = doc(db, 'posts', postId,'comments',commentId)
const docRef1 = doc(db, 'posts', postId)
    await deleteDoc(docRef)
    await updateDoc(docRef, {
        comments: increment(-1)})

}