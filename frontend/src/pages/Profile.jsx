import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext.jsx';

const Profile = () => {

  const { authUser, updateProfile } = useContext(AuthContext);
  const [selectedImg, setSelectedImg] = useState(null);
  const [name, setName] = useState(authUser?.fullName || "");
  const [bio, setBio] = useState(authUser?.bio || "");
  const navigate = useNavigate();


  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!selectedImg) {
      const isSuccess = await updateProfile({ fullName: name, bio });
      if (isSuccess) navigate('/');
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(selectedImg);
    reader.onload = async () => {
      const base64Image = reader.result;
      const isSuccess = await updateProfile({ profilePic: base64Image, fullName: name, bio });
      if (isSuccess) navigate('/');
      return;
    }
  }

  return (
    <div className='bg-cover bg-center min-h-screen flex items-center justify-center text-white '>

      <div className="flex items-center justify-between backdrop-blur-2xl w-5/6 max-w-2xl max-sm:flex-col-reverse border border-gray-600 rounded-lg">

        <form onSubmit={onSubmitHandler} className='flex flex-col gap-5 p-10 flex-1' >
          <h3 className='text-lg'>Profile details</h3>
          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
            <input onChange={(e) => setSelectedImg(e.target.files[0])} type="file" id='avatar' accept='.png, .jpeg, .jpg' hidden />
            <img src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon} alt="" className='h-12 w-12 rounded-full' />
            upload profile image
          </label>

          <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder='name' className='p-2 border border-gray-500 rounded-md focus: outline-none focus:ring-2 focus:ring-violet-500' />
          <textarea onChange={(e) => setBio(e.target.value)} value={bio} placeholder='bio' rows={4} className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' ></textarea>

          <button className='rounded-full bg-linear-to-r from-violet-500 to-violet-900 text-lg p-2 cursor-pointer'>Save</button>
        </form>
        <img className='max-w-44 aspect-square mx-10 max-sm:mt-10 rounded-full' src={authUser?.profilePic || assets.linkup} alt="" />

      </div>
    </div>
  )
}

export default Profile
