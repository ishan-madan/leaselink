// import React from 'react'
import { Link } from 'react-router-dom'
import { Typography } from '@mui/material'

const Logo = () => {
  return (
    <div style={{
        display:"flex", 
        marginRight:"auto", 
        alignItems:"center", 
        gap:"15px"}}>
            <Link to={"/"}>
                <img src="/logo.png" alt="Logo" width={"30px"} height={"30px"} className="image-inverted"/>
            </Link>
            <Link to={"/"}>
                <Typography sx={{display:{md:"inline-block", sm:"none", xs:"none"}, mr:"auto", outline: "1px 1px solid red", fontWeight:"800", textShadow:"2px, 2px, 20px #000"}}>
                    <span style={{fontSize:"23px"}}>LEASE</span>LINK
                </Typography>
            </Link>
            
        </div>
  )
}

export default Logo