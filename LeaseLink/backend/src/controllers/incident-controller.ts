import { NextFunction, Request, Response } from "express";
import User from "../models/NewUser.js";
import IncidentReport from "../models/IncidentReport.js";

// TODO: get user for jwt.local.id token when integrated with front end
export const getIncidents = async(
    req: Request,
    res: Response, 
    next: NextFunction
) => {
    try {
        // get user
        const user = await User.findById(res.locals.jwtData.id);

        // Handle case where user is not found
        if (!user) {
            return { error: "User not registered or token malfunctioned" };
        }

        // get all incidents for user
        const incidents = user.incidents;

        return res.status(200).json({message:"Successfully retreived incidents", incidents});
    } catch (error) {
        console.log(error);
        return res.status(200).json({message: "ERROR", error});
    }
}

// TODO: get user from local data -> need to do verifyToken before this in the middleware in the routes
export const createIncident = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // get params
        const { title } = req.body;

        // get user
        const user = await User.findById(res.locals.jwtData.id);

        // Handle case where user is not found
        if (!user) {
            return { error: "User not registered or token malfunctioned" };
        }

        // check for existing incident
        const incidentIndex = user.incidents.findIndex(incident => incident.title === title);

        // handle case where incident does not exist (shoulnt happen if we pass in title of curently opened incident, but just in case)
        if (incidentIndex != -1){
            return res.status(409).json({message:"Incident with this name already exists"});
        }

        // create new incident object with params
        const newIncident = {
            title,
            address: user.address,
            openDate: Date.now(),
        };

        // push to incident array
        user.incidents.push(newIncident);

        const incidentId = user.incidents.slice(-1)[0].id;

        // save to database
        user.markModified("incidents");
        await user.save();


        // return status
        return res.status(200).json({incidentId});

    } catch (error) {
        console.log(error);
        return res.status(200).json({message:"ERROR", error})
    }
}

export const getIndcidentId = async(
    req: Request, 
    res: Response,
    next: NextFunction
) => {
    try {
        const { title } = req.body;

        // get user
        const user = await User.findById(res.locals.jwtData.id);

        const incidentIndex = user.incidents.findIndex(incident => incident.title === title);

        const incidentId = user.incidents[incidentIndex].id;

        return res.status(200).json({incidentId});
    } catch (error) {
        console.log(error);
        return res.status(200).json({message:"ERROR", error});
    }
}

// TODO: get user info from local token. Also, this should be connected to a button on the chat page for an incident
export const closeIncident = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // get params
        const { title } = req.body;

        // get user
        const user = await User.findById(res.locals.jwtData.id);

        // Handle case where user is not found
        if (!user) {
            return { error: "User not registered or token malfunctioned" };
        }

        // get specific incident being closed
        // TODO: USE THIS LINE FOR INDEX FINDING LATER ON
        const incidentIndex = user.incidents.findIndex(incident => incident.title === title);

        // handle case where incident does not exist (shoulnt happen if we pass in title of curently opened incident, but just in case)
        if (incidentIndex == -1){
            return res.status(404).json({message:"Incident does not exist"});
        }

        if (user.incidents[incidentIndex].closeDate){
            return res.status(403).json({message:"Incident is already closed"});
        }

        // add close date to incident
        user.incidents[incidentIndex].closeDate = new Date(Date.now());

        // save to datbase (this will also add the final elapsed time)
        user.markModified("incidents");
        await user.save();

        return res.status(200).json({message:"Incident successfully closed", incident: user.incidents[incidentIndex]})


    } catch (error) {
        console.log(error);
        return res.status(200).json({message:"ERROR", error});
    }
}

// TODO: get user info from local token. Also, this should be connected to a button on the chat page for an incident
export const reopenIncident = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // get params
        const { title } = req.body;

        // get user
        const user = await User.findById(res.locals.jwtData.id);

        // Handle case where user is not found
        if (!user) {
            return { error: "User not registered or token malfunctioned" };
        }

        // get specific incident being reopened
        // TODO: USE THIS LINE FOR INDEX FINDING LATER ON
        const incidentIndex = user.incidents.findIndex(incident => incident.title === title);

        // handle case where incident does not exist (shoulnt happen if we pass in title of curently opened incident, but just in case)
        if (incidentIndex == -1){
            return res.status(404).json({message:"Incident does not exist"});
        }

        if (!user.incidents[incidentIndex].closeDate){
            return res.status(403).json({message:"Incident is already open"});
        }

        // remove close date from incident
        user.incidents[incidentIndex].closeDate = undefined;

        // save to datbase
        user.markModified("incidents");
        await user.save();

        return res.status(200).json({message:"Incident successfully reopened", incident: user.incidents[incidentIndex]})

    } catch (error) {
        console.log(error);
        return res.status(200).json({message:"ERROR", error});
    }
}

export const deleteIncident = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // get params
        const { title } = req.params;

        // get user
        const user = await User.findById(res.locals.jwtData.id);

        // Handle case where user is not found
        if (!user) {
            return { error: "User not registered or token malfunctioned" };
        }

        // get specific incident being reopened
        const incidentIndex = user.incidents.findIndex(incident => incident.title === title);

        // handle case where incident does not exist (shoulnt happen if we pass in title of curently opened incident, but just in case)
        if (incidentIndex == -1){
            return res.status(404).json({message:"Incident does not exist"});
        }

        // splice out the incident to incident array
        const removedIncident = user.incidents.splice(incidentIndex, 1);

        // save to database
        user.markModified("incidents");
        await user.save();

        // return status
        return res.status(200).json({message:"Successfully deleted the incident", removedIncident, incidents: user.incidents});

    } catch (error) {
        console.log(error);
        return res.status(200).json({message:"ERROR", error})
    }
}