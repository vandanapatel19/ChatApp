import React, {useRef, useEffect} from 'react'
import assets, { messagesDummyData  } from '../assets/assets'
import {formatMessageTime} from '../lib/utils.js'

const ChatContainer = ({selectedUser, setSelectedUser}) => {

  const scrollEnd = useRef()
  useEffect(()=>{
    if(scrollEnd.current){
      scrollEnd.current.scrollIntoView({behavior:'smooth'})
    }
  })

  return selectedUser ? (
          <div className='relative flex flex-col h-full overflow-hidden backdrop-blur-lg'>
         {/* header */}
          <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
            <img className='w-8 rounded-full' src={assets.profile_martin} alt="" />
            <p className='flex-1 text-lg text-white flex items-center gap-2' >Martin Johnson
              <span className='w-2 h-2 rounded-full bg-green-500'></span>
            </p>
            <img onClick={()=> setSelectedUser(null)} className='md:hidden max-w-7' src={assets.arrow_icon} alt="" />
            <img className='max-w-5' src={assets.help_icon} alt="" />
          </div>
          {/* chat area */}
          <div className="flex flex-col flex-1 overflow-y-auto p-3 pb-6">
            {messagesDummyData.map((message, index) => (
              <div key={index} className={`flex items-end gap-2 justify-end ${message.senderId !=='680f5116f10f3cd28382ed02' && 'flex-row-reverse'}`}>
                {message.image ? (
                  <img src={message.image} alt="" className='max-w-57.5 border border-gray-700 rounded-lg overflow-hidden mb-8' />
                ):(
                  <p className={`p-2 max-w-50 md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${message.senderId === '680f5116f10f3cd28382ed02' ? 'rounded-br-none' : 'rounded-bl-none'}`}>{message.text}</p>
                )}
                <div className="text-center text-xs">
                  <img src={message.senderId === '680f5116f10f3cd28382ed02' ? assets.avatar_icon : assets.profile_martin} alt="" className='w-7 rounded-full' />
                  <p className="text-gray-500">{formatMessageTime(message.createdAt)}</p>
                </div>
              </div>
            ))}
            <div ref={scrollEnd}></div>
          </div>

           {/* bottom area */}
           <div className='shrink-0 flex items-center gap-3 p-3'>
             <div className='flex items-center w-full bg-gray-100/12 px-3 rounded-full'>
            <input className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400' type="text" placeholder='Send a message' />
            <input type='file' id='image' accept='image/png, image/jpeg' hidden />
            <label htmlFor="image">
              <img className='w-5 mr-2 cursor-pointer' src={assets.gallery_icon} alt="" />
            </label>
            </div>
            <img src={assets.send_button} alt="" className='w-7 cursor-pointer' />
           </div>
         
          </div>
          
         ):
         ( 
          <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
            <img className='max-w-40' src={assets.linkup} alt="" />
            <p className="text-2xl font-medium text-white">Stay Connected</p>
          </div>
  )
}

export default ChatContainer
