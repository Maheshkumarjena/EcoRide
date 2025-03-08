import { getAddressCoordinates } from "../services/map.service.js";
import { getDistanceTime } from "../services/map.service.js";
import { validationResult } from "express-validator";

export const getCoordinates = async (address) => { // res and next removed from parameter list.
    const errors = validationResult(address);
    if (!errors.isEmpty()) {
        return { errors: errors.array() }; // Return error object
    }

    console.log("request at get coordinates===========>", address);

    try {
        const coordinates = await getAddressCoordinates(address);
        if (coordinates) {
            return { coordinates }; // Return coordinates object
        } else {
            return { message: 'coordinates not found' }; // Return error object
        }
    } catch (error) {
        console.error("Error in getCoordinates:", error);
        return { message: 'Internal server error' }; // Return error object
    }
};

export const getDistanceAndTime = async (req, res, next) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { origin, destination } = req.query;
        const distanceTime = await getDistanceTime(origin, destination);
        res.status(200).json({ distanceTime });

    }
    catch (error) {
        console.error(err);
        res.status(404).json({ message: 'distance and time not found' });
    }

}


export const getAutoCompleteSuggestions = async (input) => {
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