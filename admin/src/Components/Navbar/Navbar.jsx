import React from 'react'
import "./Navbar.css"
import navlogo from "../../assets/Shop.jpg"
import navProfile from "../../assets/profile.jpg"
const Navbar = () => {
  return (
    <div className='navbar'>
        <img src={navlogo} alt="SHOPPING" className="nav-logo" />
        <img src={navProfile}  className="nav-profile"alt="" />
    </div> 
  )
}

export default Navbar