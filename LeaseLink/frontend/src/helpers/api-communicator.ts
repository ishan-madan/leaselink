import axios from "axios"

export const loginUser = async (email:string, password:string) => {
    // send post request to backend with email and password data
    const res = await axios.post("/user/login", {email, password});

    if (res.status !== 200) {
        throw new Error("Unable to login");
    }
    const data = await res.data;
    
    return data;

}

export const checkAuthStatus = async () => {
    const res = await axios.get("/user/auth-status");
    if (res.status !== 200) {
        throw new Error("Unable to authenticate");
    }
    const data = await res.data;
    return data;
}


export const sendChatRequest = async (message:string) => {
    console.log("started chatRequest");
    const res = await axios.post("/chat/new", {message});
    console.log("axios ran");
    if (res.status !== 200) {
        throw new Error("Unable to send chat");
    }
    const data = await res.data;
    return data;
}