import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useLogin } from '../../hooks/useLogin'
import "./Login.css"

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {login, error, isLoading} = useLogin();

    const loginUser = async (e) => {
        e.preventDefault();
        await login(email,password)
    }

  return (
    <div className="loginformwrapper">
        <form className="logform" onSubmit={loginUser}>
          <div className="fieldswrapper">
            <p className="title">Log In</p>
              <div className="email">
              <label>Email</label>
              <span className="space"></span>
              <input type='email' placeholder='Enter Email' value = {email} onChange={(e) => setEmail(e.target.value)}/>  
            </div>
            <div className="password">
              <label>Password</label>
              <span className="space"></span>
              <input type='password' placeholder='Enter Password' value = {password} onChange={(e) => setPassword(e.target.value)} /> 
            </div>
            <br></br>
            <br></br>
            <button type='submit' disabled={isLoading}>Login</button>
            </div>
            {error && <div className="error">{error}</div>}
        </form>
    </div>
  )
}

export default Login