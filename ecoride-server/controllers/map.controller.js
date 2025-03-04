import { getAddressCoordinates } from "../services/map.service";
import { getDistanceTime } from "../services/map.service";
import { validationResult } from "express-validator";

export const getCoordinates= async (req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {address} = req.query;

    try{
        const coordinates= await getAddressCoordinates(address);
        res.status(200).json({coordinates});
    }
    catch(error){
        res.status(404).json({message:'coordinates not found'});
    }
}

export const getDistanceTime= async (req,res,next)=>{
    try{

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }

        const {origin,destination}= req.query;
        const distanceTime= await getDistanceTime(origin,destination);
        res.status(200).json({distanceTime});

    }
    catch(error){
        console.error(err);
        res.status(404).json({message:'distance and time not found'});
    }

}


export const getAutoCompleteSuggestions = async (input)=>{
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { input } = req.query;

        const suggestions = await mapService.getAutoCompleteSuggestions(input);

        res.status(200).json(suggestions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}