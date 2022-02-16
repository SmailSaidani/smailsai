import React  from 'react'
import FlipMove from 'react-flip-move'
import Post from '../Post/Post'
import Retweet from '../Retweet/Retweet'
const Posts = ({posts}) => {

    return (
        <>
        <FlipMove>
       
        {
            posts.map(post => (
                //itretweet==
                ( (post.itretweet) ?
                <Retweet key={post.id}
                retweeterId={post.retweeterId}
                postId = {post.id}
                altText = {post.altText}
                senderId = {post.senderId}
                username = {post.username}
                text = {post.text}
                avatar = {post.avatar}
                image = {post.image}
                createdAt = {post.createdAt}
                likes = {post.likes}
                retphotourl= {post.retphotourl}
                retweeter= {post.retweeter}
                retweets={post.retweets}
                retweettext={post.retweettext}
    /> 
            :
            <Post key={post.id}
                        postId = {post.id}
                        altText = {post.altText}
                        senderId = {post.senderId}
                        username = {post.username}
                        text = {post.text}
                        avatar = {post.avatar}
                        image = {post.image}
                        createdAt = {post.createdAt}
                        likes = {post.likes}
                        retweets={post.retweets}

            />
            
            )))
        }                   
        </FlipMove>
        </>
    )
}

export default Posts
