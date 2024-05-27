import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./CSS/LoginSignup.css";
import { ShopContext } from '../Context/ShopContext';

const LoginSignup = () => {
  const{fetchCartData}= useContext(ShopContext)
  const [state, setState] = useState("Login")
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",

  })
  const navigate = useNavigate()
  const login = async () => {
    console.log("Login", formData);
    let responseData;
    await fetch('http://localhost:4000/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'content-Type': 'application/json'
      },
      body: JSON.stringify(formData),
    }).then((res) => res.json())
      .then((data) => responseData = data)
    if (responseData.success) { //If its true our user and password is corrected
      localStorage.setItem('auth-token', responseData.token)
      navigate('/');
    }
    else{
      alert(responseData.errors);
    }
    console.log("responseData",responseData)
    fetchCartData()
  }
  const signup = async () => {
    console.log("Login", formData);
    let responseData;
    await fetch('http://localhost:4000/signup', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'content-Type': 'application/json'
      },
      body: JSON.stringify(formData),
    }).then((res) => res.json())
      .then((data) => responseData = data)
    if (responseData.success) { //If its true our user and password is corrected
      localStorage.setItem('auth-token', responseData.token)
      navigate('/');
    }
    else{
      alert(responseData.errors);
    }
    console.log("responseData",responseData)
  }
  const changeHandler = (e) => {
    console.log(e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  return (
    <div className='loginsingup'>
      <div className="loginsigup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state === "Sign Up" ? <input name="username" value={formData.username} type="text" onChange={(e) => changeHandler(e)} placeholder='Your Name' /> : <></>}
          <input name="email" value={formData.email} onChange={(e) => changeHandler(e)} type="email" placeholder='Email Address' />
          <input name="password" value={formData.password} onChange={(e) => changeHandler(e)} type="password" placeholder='Password' />
        </div>
        <button onClick={() => { state === 'Login' ? login() : signup() }}>Continue</button>
        {state === "Sign Up" ? <p className="loginsignup-login">Already have an account? <span onClick={() => { setState("Login") }}>Login here</span></p>
          : <p className="loginsignup-login">Create an account <span onClick={() => { setState("Sign Up") }}>Click here</span></p>}
        <div className="loginsignup-agree">
          <input type="checkbox" name='' id='' />
          <p>By continuing, i agree to the terms of use & privacy policy.</p>
        </div>
      </div>
    </div>
  )
}

export default LoginSignup