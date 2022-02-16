import React, {useState} from 'react'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';import Popover from '@material-ui/core/Popover'
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied'

import './BarRightTrends.css'

const BarRightTrends = () => {
   const [anchorEl, setAnchorEl] = useState(null)
   const onClickExpand= (event) => setAnchorEl(event.currentTarget)
   const handleClose = () => setAnchorEl(null)
   const open = Boolean(anchorEl)
   const id = open ? 'post-popover' : undefined

    return (

           <div className="barRight__barRightContainer">
              <h2>Trends For You</h2>

              <ul className='barRight__trendsContainer'>
                 <li>
                    <div className='popular'>
                       <span>Trending in Algeria</span>         
                       <MoreHorizIcon  aria-describedby={id} variant="contained" onClick={onClickExpand } />
                        <Popover 
                           id={id}
                                 open={open}
                                 anchorEl={anchorEl}
                                 onClose={handleClose}

                           anchorOrigin={{
                              vertical: 'top',
                              horizontal: 'right',
                           }}
                           transformOrigin={{
                              vertical: 'top',
                              horizontal: 'right',
                           }}
                        >
                           <ul className="post__expandList">
                              <li>
                                 <div ><SentimentVeryDissatisfiedIcon /></div><h3 >This trend is spam</h3>
                              </li>
                              <li>
                                 <div><SentimentVeryDissatisfiedIcon /></div><h3>This trend is abusive or harmfull</h3>
                              </li>
                              <li>
                                 <div><SentimentVeryDissatisfiedIcon /></div><h3>This trend is a duplicate</h3>
                              </li>
                              <li>
                                 <div><SentimentVeryDissatisfiedIcon /></div><h3>This trend is low quality</h3>
                              </li>
                           </ul>
                        </Popover>

                    </div>
                    <div className='hashtag'>Trending in Algeria</div>
                    <div className='NoctuaNumber'>4012 Noctua</div>
                 </li>
                 <li>
                    <div className='popular'>
                       <span>Trending in Algeria</span>         
                       <MoreHorizIcon />
                    </div>
                    <div className='hashtag'>Trending in Algeria</div>
                    <div className='NoctuaNumber'>4099 Noctua</div>
                 </li>
                 <li>
                    <div className='popular'>
                       <span>Trending in Algeria</span>         
                       <MoreHorizIcon />
                    </div>
                    <div className='hashtag'>FIFAWorldCupU22</div>
                    <div className='NoctuaNumber'>4022 Noctua</div>
                 </li>
                 <li>
                    <div className='popular'>
                       <span>Trending in Algeria</span>         
                       <MoreHorizIcon />
                    </div>
                    <div className='hashtag'>MotoGPMandalika</div>
                    <div className='NoctuaNumber'>3088 Noctua</div>
                 </li>
              </ul>


           </div>


    )
}

export default BarRightTrends
