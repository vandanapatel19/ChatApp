import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Profile from './pages/Profile'

const App = () => {
  return (
    <div className='bg-[url("./src/assets/bgImage.jpeg")] bg-cover bg-center bg-no-repeat '>
      <Routes>
        <Route path ="/" element={<Home/>}/>
        <Route path ="/login" element={<Login/>}/>
        <Route path ="/profile" element={<Profile/>}/>
      </Routes>
      
    </div>
  )
}

export default App
