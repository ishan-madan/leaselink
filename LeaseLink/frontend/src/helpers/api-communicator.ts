import axios from "axios"
import Incident from "../pages/Incident";

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


export const sendChatRequest = async (message:string, incidentId:string) => {
    // console.log("started chatRequest");
    const res = await axios.post("/chat/new", {message, incidentId});
    // console.log("axios ran");
    if (res.status !== 200) {
        throw new Error("Unable to send chat");
    }
    const data = await res.data;
    return data;
}

export const fetchChats = async(incidentId:string) => {
    const res = await axios.get(`/chat/fetchChats/${incidentId}`);
    if (res.status !== 200) {
        throw new Error("Unable to fetch chats");
    }
    const data = await res.data;
    return data;
}

export const createIncidentRequest = async(title:string) => {
    const res = await axios.post("/incident/create/", {title});
    if (res.status !== 200) {
        throw new Error("Unable to fetch chats");
    }

    const data = await res.data;
    return data;
}

export const deleteIncidentRequest = async (incidentId: string) => {
    try {
        const res = await axios.delete(`/incident/delete/${incidentId}`);

        if (res.status === 200) {
            return { success: true };
        } else {
            throw new Error('Failed to delete incident');
        }
    } catch (error) {
        console.error('Error deleting incident:', error);
        throw error;
    }
};

export const incidentCloseRequest = async (incidentId: string) => {
    try {
        console.log("closing");
        const res = await axios.post("/incident/close/", {incidentId});
        console.log("close axios ran");

        if (res.status === 200) {
            return { success: true };
        } else {
            throw new Error('Failed to close incident');
        }

    } catch (error) {
        console.error('Error deleting incident:', error);
        throw error;
    }
}

export const incidentReopenRequest = async (incidentId: string) => {
    try {
        console.log("reopening");
        const res = await axios.post("/incident/reopen/", {incidentId});
        console.log("reopen axios ran");

        if (res.status === 200) {
            return { success: true };
        } else {
            throw new Error('Failed to close incident');
        }

    } catch (error) {
        console.error('Error deleting incident:', error);
        throw error;
    }
}