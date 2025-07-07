import React, {useState} from 'react'
import { useRegister } from '../../hooks/useRegister'
import './Register.css'

const Register = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {register, error, isLoading} = useRegister();

    const registerUser = async (e) => {
        e.preventDefault();
        await register(email,password)
    }

  return (
    <div className="registerformwrapper">
        <form className="regform" onSubmit={registerUser}>
          <div className="fieldswrapper">
            <p className="title">Register</p>
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
            <button type='submit' disabled={isLoading}>Register</button>
            </div>
            {error && <div className="error">{error}</div>}
        </form>
    </div>
  )
}

export default Register