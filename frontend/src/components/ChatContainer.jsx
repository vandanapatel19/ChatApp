import React, { useRef, useEffect, useContext, useState } from 'react'
import assets from '../assets/assets'
import { formatMessageTime } from '../lib/utils.js'
import { ChatContext } from '../../context/ChatContext.jsx'
import { AuthContext } from '../../context/AuthContext.jsx'
import toast from 'react-hot-toast'

const ChatContainer = () => {

  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } = useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext)

  const scrollEnd = useRef();
  const [input, setInput] = useState('');

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if(input.trim() === "") return null;
    await sendMessage({text: input.trim()});
    setInput("")
  }

  const handleSendImage = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if(!file || !file.type.startsWith("image/")){
      toast.error("Select an image file")
      return;
    }
    const reader = new FileReader();
     reader.onloadend = async () => {
      await sendMessage({image: reader.result})
      e.target.value = ""
     }
     reader.readAsDataURL(file)
  }

  useEffect(()=>{
    if(selectedUser){
      getMessages(selectedUser._id)
    }
  },[selectedUser, getMessages])

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: 'smooth' })
    }
  },[messages])

  return selectedUser ? (
    <div className='relative flex flex-col h-full overflow-hidden backdrop-blur-lg'>
      
      {/* header */}
      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
        <img className='w-8 rounded-full' src={selectedUser.profilePic || assets.avatar_icon} alt="" />
        <p className='flex-1 text-lg text-white flex items-center gap-2' >{selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id)&&<span className='w-2 h-2 rounded-full bg-green-500'></span>}
        </p>
        <img onClick={() => setSelectedUser(null)} className='md:hidden max-w-7' src={assets.arrow_icon} alt="" />
        <img className='max-w-5' src={assets.help_icon} alt="" />
      </div>

      {/* chat area */}
      <div className="flex flex-col flex-1 overflow-y-auto p-3 pb-6">
        {messages.map((message, index) => (
          <div key={message._id || `${message.createdAt}-${index}`} className={`flex items-end gap-2 justify-end ${message.senderId !== authUser._id && 'flex-row-reverse'}`}>
            {message.image ? (
              <img src={message.image} alt="" className='max-w-57.5 border border-gray-700 rounded-lg overflow-hidden mb-8' />
            ) : (
              <p className={`p-2 max-w-50 md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${message.senderId === authUser._id ? 'rounded-br-none' : 'rounded-bl-none'}`}>{message.text}</p>
            )}
            <div className="text-center text-xs">
              <img src={message.senderId === authUser._id ? authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-7 rounded-full' />
              <p className="text-gray-500">{formatMessageTime(message.createdAt)}</p>
            </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

      {/* bottom area */}
      <div className='shrink-0 flex items-center gap-3 p-3'>
        <div className='flex items-center w-full bg-gray-100/12 px-3 rounded-full'>
          <input onChange={(e)=>setInput(e.target.value)} value={input} onKeyDown={(e)=>e.key === 'Enter' ? handleSendMessage(e) : null}  className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400' type="text" placeholder='Send a message' />
          <input onChange={handleSendImage} type='file' id='image' accept='image/png, image/jpeg' hidden />
          <label htmlFor="image">
            <img className='w-5 mr-2 cursor-pointer' src={assets.gallery_icon} alt="" />
          </label>
        </div>
        <img onClick={handleSendMessage} src={assets.send_button} alt="" className='w-7 cursor-pointer' />
      </div>

    </div>

  ) :
    (
      <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
        <img className='max-w-40' src={assets.linkup} alt="" />
        <p className="text-2xl font-medium text-white">Stay Connected</p>
      </div>
    )
}

export default ChatContainer
