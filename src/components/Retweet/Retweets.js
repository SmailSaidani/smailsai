import React  from 'react'
import FlipMove from 'react-flip-move'
import Retweet from '../Retweet/Retweet'

const Retweets = ({retweets}) => {

    return (
        <>
        <FlipMove>
        {
            retweets.map(retweet => (
                <Retweet key={retweet.id}
                        postId = {retweet.id}
                        altText = {retweet.altText}
                        senderId = {retweet.senderId}
                        username = {retweet.username}
                        text = {retweet.text}
                        avatar = {retweet.avatar}
                        image = {retweet.image}
                        timestamp = {retweet.timestamp}
                        likes = {retweet.likes}
                        retphotourl= {retweet.retphotourl}
                        itretweet= {retweet.itretweet}
                         retweeter= {retweet.retweeter}
            />
            ))
        }           
        </FlipMove>
        </>
    )
}

export default Retweets
