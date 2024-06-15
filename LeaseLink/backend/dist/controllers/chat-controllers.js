import User from "../models/User.js";
import OpenAI from "openai";
export const generateChatCompletion = async (req, res, next) => {
    try {
        const message = req.body.message;
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).json({ message: "User not registered or token malfunctioned" });
        }
        // grab the chats of the user
        const chats = user.chats.map(({ role, content }) => ({ role, content }));
        chats.push({ role: "user", content: message });
        user.chats.push({ role: "user", content: message });
        // send all the chats with the new message to the open ai API and get response from API
        const openai = new OpenAI({
            apiKey: process.env.OPEN_AI_SECRET || '',
            organization: process.env.OPENAI_ORGANIZATION_ID || '',
        });
        const completion = await openai.chat.completions.create({ messages: [{ role: "system", content: "You are a helpful assistant designed to aid renters." }, ...chats], model: "gpt-3.5-turbo-0125" });
        const outputMessage = completion.choices[0].message;
        user.chats.push(outputMessage);
        // WHY IS THIS GIVING ME ERRORS
        user.markModified('chats');
        await user.save();
        return res.status(200).json({ chats: user.chats });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong (generateChatCompletion)" });
    }
};
// export const clearChats = async (req: Request, res:Response, next:NextFunction) => { 
//     try {
//         const user  = await User.findById(res.locals.jwtData.id);
//         if (!user){
//             return res.status(401).json({message: "User not registered or token malfunctioned"});
//         }
//         user.set('chats', []);
//         user.markModified('chats');
//         await user.save();
//         return res.status(200).json({chats: user.chats});
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({message: "Something went wrong (clearing chats)"});
//     }
// }
//# sourceMappingURL=chat-controllers.js.map