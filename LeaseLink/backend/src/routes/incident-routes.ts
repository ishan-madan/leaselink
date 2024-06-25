import {Router} from "express";
import { closeIncident, createIncident, deleteIncident, getIncidents, getIndcidentId, reopenIncident } from "../controllers/incident-controller.js";
import { verifyToken } from "../utils/token-manager.js";


// Protected API
const incidentRoutes = Router();

// get incidents
incidentRoutes.get("/", verifyToken, getIncidents);

// create new incident
incidentRoutes.post("/create", verifyToken, createIncident);

// delete an incident
incidentRoutes.delete("/delete/:title/", verifyToken, deleteIncident);

// close an incident
incidentRoutes.post("/close", verifyToken, closeIncident);

// reopen an incident
incidentRoutes.post("/reopen", verifyToken, reopenIncident);

// get an incident Id
incidentRoutes.post("/getIncidentId", verifyToken, getIndcidentId);

export default incidentRoutes;