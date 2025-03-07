import { CreateRide } from "../services/ride.service.js";
import { validationResult } from "express-validator";
import { getCoordinates } from "./map.controller";



export const createRide=(req,res)=>{
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }
    const destination = getCoordinates(req.body.destination);
    const startingPoint = getCoordinates(req.body.startingPoint);
    const {user,vehicleType,totalSeatsAvailable,startTime}=req.body;
    try{

        const ride=CreateRide({user,startingPoint,destination,vehicleType,totalSeatsAvailable,startTime});
        res.status(200).json({ride});
    }
    catch(error){
        res.status(404).json({message:'ride not created'});
    }

}