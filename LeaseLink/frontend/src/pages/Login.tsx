import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import CustomizedInput from '../components/shared/CustomizedInput'
import { IoIosLogIn } from 'react-icons/io'
import toast from "react-hot-toast"
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const auth = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    try {
      toast.loading("Signing In...", {id:"login"});
      await auth?.login(email, password);
      toast.success("Logged In", {id:"login"});

      // AUTO NAVIGATES TO CHAT
      navigate('/incidents');

      
    } catch (error) {
      console.log(error);
      toast.error("An Error Occurred", {id:"login"});
    }
  }

  return <Box width={"100%"} height={"100%"} display={"flex"} flex={1}>
    {/* image on the left side, not there on small and XS screens */}
    <Box padding={8} mt={8} display={{md:"flex", sm:"none", xs:"none"}}>
      <img src="houseSmall.png" alt="Modern House" style={{width:"100%"}} />
    </Box>

    {/* Login form */}
    <Box 
      display={"flex"} 
      flex={{xs:1, md:0.5}} 
      justifyContent={"center"} 
      alignItems={"center"}
      padding={2} 
      ml={"auto"} 
      mt={16}
    >
      <form onSubmit={handleSubmit} style={{
        margin:"auto", 
        padding:"30px", 
        boxShadow:"10px 10px 20px #000", 
        borderRadius:"10px",
        border:"none"}}>
          <Box sx={{display:"flex", flexDirection: "column", justifyContent:"center"}}>
            <Typography variant='h4' textAlign={"center"} padding={2} fontWeight={600}>
              Login
            </Typography>
            <CustomizedInput type="email" name="email" label="Email"/>
            <CustomizedInput type="password" name="password" label="Password"/>
            <Button type="submit" sx={{
                px:2, 
                py:1, 
                mt:2, 
                transition: "ease-in-out .25s",
                width:"400px", 
                borderRadius:2, 
                bgcolor:"#00fffc", ":hover":{
                  bgcolor: "white",
                  color:"black",
                  transition: "ease-in-out .25s",
                  transform: "scale(1.02)"
                }
              }}
              endIcon={<IoIosLogIn/>}>
              Login
            </Button>
          </Box>
      </form>
    </Box>
  </Box>

}

export default Login