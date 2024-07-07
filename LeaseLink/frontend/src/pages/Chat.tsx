import { Avatar, Box, Button, IconButton, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { green, red } from '@mui/material/colors';
import ChatItem from '../components/chat/ChatItem';
import { IoMdSend } from 'react-icons/io';
import { fetchChats, incidentCloseRequest, incidentReopenRequest, sendChatRequest } from '../helpers/api-communicator';
import toast from "react-hot-toast";
import { useParams } from 'react-router-dom';

type Message = {
  role:"user"|"assistant",
  content:string;
}


const Chat = () => {
  // VARIABLE DEFINITIONS
  // define HTML references
  const inputRef = useRef<HTMLInputElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // define auth
  const auth = useAuth();

  // define use states
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [buttonLoaded, setButtonLoaded] = useState<boolean>(false);
  const [buttonState, setButtonState] = useState<"open" | "closed">("open");

  // get incidentID from params
  const { incidentId } = useParams<{ incidentId: string }>();



  // CLICK HANDLERS

  // handles chat submission
  const handleSubmit = async () => {
    // grab input box content
    const content = inputRef.current?.value as string;

    // if input content exists, clear it
    if (inputRef && inputRef.current){
      inputRef.current.value = "";
    }

    // if closeDate exists, do not allow chat submission
    if (buttonState == "closed"){
      toast.error("Incident is closed. Please reopen or create a new incident", {id:"response"});
      return;
    }

    // if message has actual content (aka not just spaces), allow chat completion
    if (content.trim() != ""){
      toast.loading("Generating Response", {id:"response"});

      // add new message to chatMessages usestate
      const newMessage:Message = {role:"user", content};
      setChatMessages((prev) => [...prev, newMessage]);

      // get chat completion from backend
      const chatData = await sendChatRequest(content, incidentId ? incidentId : "a");

      // add chat completion to usestate
      setChatMessages([...chatData.chats]);
      toast.success("", {id:"response"});

    }
  }

  // handles close incident button
  const handleClose = async(id:string) => {
    // send api call to backend and refresh page to update button
    await incidentCloseRequest(id);
    window.location.reload();
  }

  // handles reopen incident button
  const handleReopen = async(id:string) => {
    // send api call to backend and refresh page to update button
    await incidentReopenRequest(id);
    window.location.reload();
  }

  // handle enter key press
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // if enter key is pressed, submit chat
    if (event.key === 'Enter') {
      handleSubmit();
    }
  }



  // USE EFFECTS

  // load all present chats into the page, run everytime incidentID changes
  useEffect(() => {
    // refresh the page if the incident is not yet in database (usually only for initial creation of incident)
    if (auth?.user?.incidents.filter(incident => incident.id === incidentId).length == 0){
      window.location.reload();
    }
    
    // fetch present chats from database
    const fetchInitialChats = async () => {
      try {
        // send api call to grab chats based on incident ID and set t chatMessages useState
        const chatData = await fetchChats(incidentId ? incidentId : "a");
        setChatMessages(chatData.chats);
      } catch (error) {
        console.error('Error fetching initial chats:', error);
        toast.error('Failed to fetch initial chats');
      }
    };

    fetchInitialChats();
  }, [incidentId]);

  // automatically scroll to the bottom of the chat box, run everytime a new chat is sent
  useEffect(() => {
    // is chat container exists
    if (chatContainerRef.current) {
      // set scroll to the last message in the chat container
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // start the button after inline 100ms delay (from HTML call). 
  // inline delay present in outer box to allow time for the database values to initialize so that the button loads correctly
  // IF YOU GET ERRORS LATER, PUT ASYNC IN FRONT OF PARENTHESIS
  const startButton = () => {
    // set button loaded to true so that the button can show up
    setButtonLoaded(true);
    
    // set button state based off of the value in the button to allow messages or not
    setTimeout(() => {
      if (buttonRef.current?.innerText.toLowerCase() == "close incident"){
        setButtonState("open");
      } else if (buttonRef.current?.innerText.toLowerCase() == "reopen incident"){
        setButtonState("closed");
      } else {
        startButton();
      }
      // console.log(buttonRef.current?.innerText);
    }, 100);
  }

  

  // OUTPUT
  return (
    // outer box, calls startButton to load in the button
    <Box onLoad={() => setTimeout(startButton, 100)} sx={{display:"flex", flex:1, width:"100%", height:"100%", mt:3, gap:3}}>
      {/* entire left panel box */}
      <Box sx={{display:{md:"flex", xs:"none", sm:"none"}, flex:0.2, flexDirection:"column"}}>
        {/* left info panel */}
        <Box sx={{display:"flex", width:"100%", height:"auto", bgcolor:"rgb(17, 29, 39)", borderRadius:5, flexDirection:"column", mx:3}}>
          {/* name avatar */}
          <Avatar sx={{mx:"auto", my:2, bgcolor:"white", color:"black", fontWeight:700}}>
            {auth?.user?.name[0]}{auth?.user?.name.split(" ")[1][0]}
          </Avatar>

          {/* incident title */}
          <Typography sx={{ ml: "15px", mr: "15px", textAlign: "center", fontFamily: "work sans" }}>
            {auth?.user?.incidents
              .filter(incident => incident.id === incidentId)
              .map((incident) => (
                <Typography key={incident.id} sx={{ ml: "15px", mr: "15px", textAlign: "center", fontFamily: "work sans" }}>
                  {/* TODO: Maybe later on, down the road, write a backend openAI call that can take this text and rewrite it 
                  so it flows better. I could just pass it in as a message with no incident to link it to and get the output
                  and then display it here  */}
                  Welcome to LeaseLink! Let's help with "{incident.title}"!
                </Typography>
              ))}
          </Typography>

          {/* button display logic: if button not loaded: display loading. 
          If button loaded -> if backend does not have close date: display Close button, otherwise: display reopen button 
          USED TRIPLE "!" SO IT WORKS WITH UNDEFINED*/}
          { buttonLoaded ? (
            !!!auth?.user?.incidents.filter(incident => incident.id === incidentId)[0].closeDate ? (
              <Button id="incidentButton" ref={buttonRef} sx={{
                width:"200px", 
                color:"white", 
                fontWeight:700, 
                borderRadius:3, 
                bgcolor:red[300], 
                margin: "30px",
                mx: "auto",
                ":hover":{bgcolor:red.A400,}
              }} onClick={() => handleClose(incidentId ? incidentId : "a")}>
                Close Incident
              </Button>
            ) : (
              <Button id="incidentButton" ref={buttonRef} sx={{
                width:"200px", 
                color:"white", 
                fontWeight:700, 
                borderRadius:3, 
                bgcolor:green[400], 
                margin: "30px",
                mx: "auto",
                ":hover":{bgcolor:green[300],}
              }} onClick={() => handleReopen(incidentId ? incidentId : "a")}>
                Reopen Incident
              </Button>
            )
          ) : (
            <Button sx={{
              width:"200px", 
              color:"#3b3b3b", 
              fontWeight:700, 
              borderRadius:3, 
              bgcolor:"#3b3b3b",
              margin: "30px",
              mx: "auto",
            }} disabled>
              Loading...
            </Button>
          )}
          
        </Box>
      </Box>
      {/* right panel */}
      <Box sx={{display:"flex", flex:{md:0.8, xs:1, sm:1}, flexDirection:"column", px:3}}>
        {/* chat panel title */}
        <Typography sx={{textAlign:"center", fontSize:"40px", color:"white", fontFamily:"default", mb:2, mx:"auto", fontWeight:600}}>
          Chat with LeaseLink
        </Typography>
        {/* chat container */}
        <Box ref={chatContainerRef} sx={{width:"100%", height:"60vh", borderRadius:3, mx:"auto", display:"flex", flexDirection:"column", overflow:"scroll", overflowX:"hidden", overflowY:"auto", scrollBehavior:"smooth"}}>
          {chatMessages.map((chat, index) => <ChatItem content={chat.content} role={chat.role} key={index}/>)}
        </Box>

        {/* input box container */}
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