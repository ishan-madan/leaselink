import { Router } from "express";
import { closeIncident, createIncident, deleteIncident, getIncidents, reopenIncident } from "../controllers/incident-controller.js";
// Protected API
const incidentRoutes = Router();
// get incidents
incidentRoutes.get("/", getIncidents);
// create new incident
incidentRoutes.post("/create", createIncident);
// delete an incident
incidentRoutes.delete("/delete/:title/", deleteIncident);
// close an incident
incidentRoutes.post("/close", closeIncident);
// reopen an incident
incidentRoutes.post("/reopen", reopenIncident);
export default incidentRoutes;
//# sourceMappingURL=incident-routes.js.map