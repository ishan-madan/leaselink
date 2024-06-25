import { Avatar, Box, Button, IconButton, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { red } from '@mui/material/colors';
import ChatItem from '../components/chat/ChatItem';
import { IoMdSend } from 'react-icons/io';
import { fetchChats, sendChatRequest } from '../helpers/api-communicator';
import toast from "react-hot-toast";
import { useParams } from 'react-router-dom';

type Message = {
  role:"user"|"assistant",
  content:string;
}


const Chat = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const auth = useAuth();
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const { incidentId } = useParams<{ incidentId: string }>();

  const handleSubmit = async () => {
    const content = inputRef.current?.value as string;
    if (inputRef && inputRef.current){
      inputRef.current.value = "";
    }

    // if closeDate exists
    if (auth?.user?.incidents[auth?.user?.incidents.findIndex(incident => incident.id === incidentId)].closeDate){
      toast.error("Incident is closed. Please reopen or create a new incident", {id:"response"});
      return;
    }

    if (content.trim() != ""){
      toast.loading("Generating Response", {id:"response"});

      const newMessage:Message = {role:"user", content};
      setChatMessages((prev) => [...prev, newMessage]);

      const chatData = await sendChatRequest(content, incidentId ? incidentId : "a");

      setChatMessages([...chatData.chats]);
      toast.success("", {id:"response"});

    }
}


// Load initial chats on component mount
useEffect(() => {

  // refresh the page if the chats are not available
  if (auth?.user?.incidents.filter(incident => incident.id === incidentId).length == 0){
    window.location.reload();
  }
  
  const fetchInitialChats = async () => {
    try {
      // Fetch chats for the incidentId from your API
      const chatData = await fetchChats(incidentId ? incidentId : "a"); // Implement this function based on your API structure
      setChatMessages(chatData.chats); // Update state with fetched chat messages
    } catch (error) {
      console.error('Error fetching initial chats:', error);
      // Handle error appropriately, e.g., show a toast notification
      toast.error('Failed to fetch initial chats');
    }
  };

  fetchInitialChats();
}, [incidentId]);

useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  }
  

  return (
    <Box sx={{display:"flex", flex:1, width:"100%", height:"100%", mt:3, gap:3}}>
      <Box sx={{display:{md:"flex", xs:"none", sm:"none"}, flex:0.2, flexDirection:"colun"}}>
        <Box sx={{display:"flex", width:"100%", height:"60vh", bgcolor:"rgb(17, 29, 39)", borderRadius:5, flexDirection:"column", mx:3}}>
          
          <Avatar sx={{mx:"auto", my:2, bgcolor:"white", color:"black", fontWeight:700}}>
            {auth?.user?.name[0]}{auth?.user?.name.split(" ")[1][0]}
          </Avatar>

          <Typography sx={{ ml: "15px", mr: "15px", textAlign: "center", fontFamily: "work sans" }}>
            {auth?.user?.incidents
              .filter(incident => incident.id === incidentId) // Filter incidents to match incidentId
              .map((incident) => (
                <Typography key={incident.id} sx={{ ml: "15px", mr: "15px", textAlign: "center", fontFamily: "work sans" }}>
                  {incident.title}
                </Typography>
              ))}
          </Typography>


          <Button sx={{width:"200px", my:"auto", color:"white", fontWeight:700, borderRadius:3, mx:"auto", bgcolor:red[300], ":hover":{
            bgcolor:red.A400,
          }}}>
            Close Incident
          </Button>
        </Box>
      </Box>
      <Box sx={{display:"flex", flex:{md:0.8, xs:1, sm:1}, flexDirection:"column", px:3}}>
          <Typography sx={{textAlign:"center", fontSize:"40px", color:"white", fontFamily:"default", mb:2, mx:"auto", fontWeight:600}}>
            Chat with LeaseLink
          </Typography>
          <Box ref={chatContainerRef} sx={{width:"100%", height:"60vh", borderRadius:3, mx:"auto", display:"flex", flexDirection:"column", overflow:"scroll", overflowX:"hidden", overflowY:"auto", scrollBehavior:"smooth"}}>
            {chatMessages.map((chat, index) => <ChatItem content={chat.content} role={chat.role} key={index}/>)}
          </Box>

          <div style={{width:"97%", padding:"20px", borderRadius:8, backgroundColor:"rgb(17, 27, 39)", display:"flex", margin:"auto", marginTop:"14px"}}>
            <input ref={inputRef} type="text" onKeyDown={handleKeyDown} style={{width:"100%", backgroundColor:"transparent", padding:"10px", border:"none", outline:"none", color:"white", fontSize:"20px"}} />
            <IconButton onClick={handleSubmit} sx={{ml:"auto", color:"white"}}>
              <IoMdSend />
            </IconButton>
          </div>

          
      </Box>
    </Box>
  )
}

export default Chat