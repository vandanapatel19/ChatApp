import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext.jsx';

const Login = () => {

  const [currState, setCurrState] = useState('Sign up');
  const [fullName, setFullName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [bio, setBio] = useState();
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const {login} = useContext(AuthContext);

  const onSubmitHandler =(e)=>{
      e.preventDefault();
      if(currState === 'Sign up' && !isDataSubmitted){
        setIsDataSubmitted(true);
        return;
      }
        login(currState === 'Sign up' ? 'signup': 'login', {fullName, email, password, bio})

  }

  return (
    <div className={`bg-cover bg-center backdrop-blur-2xl min-h-screen  grid-cols-1 relative md:grid-cols-2 flex items-center  justify-center sm:justify-evenly max-sm:flex-col gap-8 `}>
      {/* left */}
      <div className='flex flex-col items-center gap-5'>
        <img className='h-40' src={assets.linkup} alt="" />
        <p className='text-white text-5xl'>LinkUp</p>
        </div>

      {/* right */}
      <form onSubmit={onSubmitHandler} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col rounded-lg shadow-lg gap-3'>
        <h2 className='flex justify-between items-center text-xl'>
          {currState}
          {isDataSubmitted && <img className='h-5 cursor-pointer' onClick={()=>setIsDataSubmitted(false)} src={assets.arrow_icon} alt="" />
          }
        </h2>

        {currState == 'Sign up' && !isDataSubmitted && (
          <input onChange={(e)=>setFullName(e.target.value)} value={fullName || ""} className='h-10 w-full border border-gray-500 rounded-xs mt-4 pl-2' type="text" placeholder='Full Name' required />
        )}

        {!isDataSubmitted && (
          <>
            <input onChange={(e)=>setEmail(e.target.value)} value={email || ""} className='h-10 w-full border border-gray-500 rounded-xs mt-4 pl-2' type="email" placeholder='Email' required />
            <input onChange={(e)=>setPassword(e.target.value)} value={password || ""} className='h-10 w-full border border-gray-500 rounded-xs mt-4 pl-2' type="password" placeholder='Password' required />
          </>
        )}
        {currState == 'Sign up' && isDataSubmitted && (
          <textarea onChange={(e)=>setBio(e.target.value)} value={bio || ""} rows={4} className='w-full border border-gray-500 rounded-xs mt-4 pl-2' placeholder='provide a short bio...' required></textarea>
        )}
        <button  className='h-10 w-full border border-gray-500 rounded-xs bg-linear-to-r from-violet-400 to-violet-600 mt-4 pl-2'>{currState == 'Sign up' ? "Create Account" : "Login Now"}</button>

        <div className='flex items-center gap-2 mt-2 text-xs'>
          <input type="checkbox" />
          <p className='text-gray-300'>Agree to the terms of user & privacy policy</p>
        </div>

        {
          currState == "Sign up" ?
            (
              <p className='text-xs text-gray-400 ml-5' >Already have an account? <span className='text-violet-400 cursor-pointer font-bold' onClick={() => {setCurrState("Login"); setIsDataSubmitted(false)}}>Login here</span></p>
            ) :
            (
              <p className='text-xs ml-5'>Create an account <span className='text-violet-400 cursor-pointer font-bold' onClick={()=>setCurrState("Sign up")}>Sign up</span></p>

            )
        }

      </form>
    </div>
  )
}

export default Login
