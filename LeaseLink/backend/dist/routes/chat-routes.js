import { Router } from "express";
import { verifyToken } from "../utils/token-manager.js";
import { chatCompletionValidator, idValidator, validate } from "../utils/validators.js";
import { fetchChats, generateChatCompletion } from "../controllers/chat-controllers-new.js";
// Protected API
const chatRoutes = Router();
chatRoutes.post("/new", await validate(chatCompletionValidator), verifyToken, generateChatCompletion);
chatRoutes.get("/fetchChats/:incidentId/", await validate(idValidator), verifyToken, fetchChats);
export default chatRoutes;
//# sourceMappingURL=chat-routes.js.map