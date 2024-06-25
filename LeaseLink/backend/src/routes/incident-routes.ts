import {Router} from "express";
import { closeIncident, createIncident, deleteIncident, getIncidents, reopenIncident } from "../controllers/incident-controller.js";
import { verifyToken } from "../utils/token-manager.js";


// Protected API
const incidentRoutes = Router();

// get incidents
incidentRoutes.get("/", verifyToken, getIncidents);

// create new incident
incidentRoutes.post("/create", verifyToken, createIncident);

// delete an incident
incidentRoutes.delete("/delete/:incidentId/", verifyToken, deleteIncident);

// close an incident
incidentRoutes.post("/close", verifyToken, closeIncident);

// reopen an incident
incidentRoutes.post("/reopen", verifyToken, reopenIncident);

export default incidentRoutes;