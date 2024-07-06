import { NextFunction, Request, Response } from "express";
import User from "../models/NewUser.js";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/src/resources/index.js";

//TODO: need to get incident id from the front end or the backend and then display and push the chats for that incident
// TODO: need to get incident index based on id or title and then use that instead of incidents[0]. CHEKC INCIDENT CONTROLLERS CLOSE INCIDENT METHOD
export const generateChatCompletion = async (req: Request, res:Response, next:NextFunction) => { 
    try {
        const { message, incidentId } = req.body;
        const user  = await User.findById(res.locals.jwtData.id);
        if (!user){
            return res.status(401).json({message: "User not registered or token malfunctioned"});
        }

        // find the incident index
        const incidentIndex = user.incidents.findIndex(incident => incident.id === incidentId);

        //exit method if issue is closed
        if (user.incidents[incidentIndex].closeDate){
            return res.status(403).json({message:"Incident is closed. Please reopen to continue chatting."});
        }

        // grab the chats of the user
        const chats = user.incidents[incidentIndex].chats.map(({role,content}) => ({role, content})) as ChatCompletionMessageParam[];
        chats.push({role:"user", content:message});
        user.incidents[incidentIndex].chats.push({role:"user", content:message});

        // send all the chats with the new message to the open ai API and get response from API
        const openai = new OpenAI({
            apiKey: process.env.OPEN_AI_SECRET || '',
            organization: process.env.OPENAI_ORGANIZATION_ID || '',
        });

        const completion = await openai.chat.completions.create({messages: [{role: "system",content: process.env.CHATGPT_SYS_PROMPT}, ... chats], model: process.env.OPENAI_MODEL});

        const outputMessage = completion.choices[0].message;
        // console.log(outputMessage);
        user.incidents[incidentIndex].chats.push(outputMessage);
        
        
        user.markModified('incidents');
        await user.save();

        console.log(user.incidents[incidentIndex].chats);
        return res.status(200).json({chats: user.incidents[incidentIndex].chats});
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Something went wrong (generateChatCompletion)"});
    }

}

export const fetchChats = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // get id
        const { incidentId } = req.params;

        const user  = await User.findById(res.locals.jwtData.id);
        if (!user){
            return res.status(401).json({message: "User not registered or token malfunctioned"});
        }

        // find the incident index
        const incidentIndex = user.incidents.findIndex(incident => incident.id === incidentId);

        // grab the chats of the user
        const chats = user.incidents[incidentIndex].chats;

        // return chats in res
        return res.status(200).json({chats});

    } catch (error) {
        console.log(error);
        return res.status(200).json({message:"ERROR in fetching chats", error});
    }

        

}