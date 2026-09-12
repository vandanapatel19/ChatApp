import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext.jsx'
import { ChatContext } from '../../context/ChatContext.jsx'

const Sidebar = () => {

    const [input, setInput] = useState(false);
    const { logout, onlineUsers } = useContext(AuthContext);
    const navigate = useNavigate();
    const { getUsers, users, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages } = useContext(ChatContext)

    const filteredUsers = input ? users.filter((user) => user.fullName.toLowerCase().includes(input.toLowerCase())) : users;

    useEffect(() => {
        getUsers();
    }, [onlineUsers])

    return (
        <div className={`bg-[#8285B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${selectedUser ? "max-md:hidden" : " "}`}>
            <div className='pb-5'>
                <div className='flex justify-between items-center'>
                    <img src={assets.linkup} alt="logo" className='max-w-20' />
                    <p className='text-xl mr-100 font-serif '>LinkUp</p>
                    <div className='relative py-2 group'>
                        <img src={assets.menu_icon} alt="menu" className='max-h-5 cursor-pointer' />
                        <div className='absolute top-full right-0 z-20 ml-2 w-32 p-5 bg-[#282142] border border-gray-600 text-gray-100 rounded-md hidden group-hover:block'>
                            <p onClick={() => navigate('/profile')} className='cursor-pointer text-sm '>Edit Profile</p>
                            <hr className='my-2 border-t border-gray-500' />
                            <p onClick={logout} className='cursor-pointer text-sm'>Logout</p>
                        </div>
                    </div>
                </div>

                {/* Search-box */}
                <div className='flex items-center gap-2 h-12 mt-5 px-4 py-3 rounded-full bg-[#282142] '>
                    <img className='w-3' src={assets.search_icon} alt="" />
                    <input onChange={(e) => setInput(e.target.value)} className='bg-transparent border-none outline-none text-white text-xs placeholder:[#c8c8c8] flex-1' type="text" placeholder='Search User..' />
                </div>

                {/* User */}
                <div className='flex flex-col'>
                    {filteredUsers.map((user, index) =>
                        <div key={user._id} onClick={() => { setSelectedUser(user), setUnseenMessages(prev => ({ ...prev, [user._id]: '' })) }} className={`flex items-center relative p-2 pl-4 rounded cursor-pointer max-sm:text-sm  gap-2 ${selectedUser?._id === user._id && 'bg-[#282142]/50'}`}>
                            <img className='w-12 rounded-full' src={user?.profilePic || assets.avatar_icon} alt="" />
                            <div className='flex flex-col leading-5'>
                                <p>{user.fullName}</p>
                                {
                                    onlineUsers.includes(user._id)
                                        ? <span className='text-green-400 text-xs'>Online</span>
                                        : <span className='text-neutral-400 text-xs'>Offline</span>
                                }
                            </div>
                            {unseenMessages[user._id] && <p className='absolute right-0 h-5 w-5 rounded-full bg-violet-500/50 text-black text-center'>
                                {unseenMessages[user._id]}
                            </p>}
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}

export default Sidebar
