import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider, createTheme } from '@mui/material'
import {BrowserRouter} from "react-router-dom"
import { AuthProvider } from './context/AuthContext.tsx'
import axios from 'axios'
import {Toaster} from "react-hot-toast"


//set base backend URL and credential requirement
axios.defaults.baseURL = "http://localhost:5100/api/v1";
axios.defaults.withCredentials = true;

const theme = createTheme({
  typography:{
    fontFamily:"Roboto SLab, serif", 
    allVariants:{color:"white"},
  },
})


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Toaster position="top-center" />
            <App />
        </ThemeProvider>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
)
