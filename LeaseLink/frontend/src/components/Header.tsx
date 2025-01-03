import { AppBar, Toolbar } from '@mui/material'
// import React from 'react'
import Logo from './shared/Logo'
import { useAuth } from '../context/AuthContext';
import NavigationLink from './shared/NavigationLink';

const Header = () => {
    const auth = useAuth();
  return (
    <AppBar sx={{bgcolor:"rgba(255,255,255,0.2)", position:"static", boxShadow:"none", mb:1}}>
        <Toolbar sx={{display:"flex"}}>
            <Logo />
            <div>
                {auth?.isLoggedIn ? (
                <>
                    <NavigationLink bg="#00fffc" to="/incidents" text="Incidents" textColor='black'/>
                    {/* <NavigationLink bg="#51538f" to="/" text="Logout" textColor='white' onClick={auth.logout} /> */}

                </>
                ) : (
                <>
                    <NavigationLink bg="#00fffc" to="/login" text="Login" textColor='black'/>
                    <NavigationLink bg="#51538f" to="/signup" text="Signup" textColor='white' />
                </>)
                }
            </div>
        </Toolbar>
    </AppBar>
  )
}

export default Header