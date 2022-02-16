import React, {useState} from 'react'
import BarRightTrends from '../BarRightTrends/BarRightTrends'
import BarRightFollow from '../BarRightFollow/BarRightFollow'
import SearchBarRight from '../../elements/SearchBarRight/SearchBarRight'

import './BarRight.css'

const BarRight = () => {
   const [text, setText] = useState('')
    return (
        <div className='barRight'>

           <SearchBarRight 
               value={text} 
               onChange = {(e)=>setText(e.target.value)}
               onClick={()=>setText('')}           
               placeholder='Search Noctua' 
            />

            <BarRightTrends />
            
            <BarRightFollow />

        </div>
    )
}

export default BarRight
