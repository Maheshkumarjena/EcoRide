import express from 'express';
import { Router } from 'express';
// import { getMapData } from '../controllers/map.controller.js';
import { authUser } from '../middlewares/auth.middleware.js';
import { getCoordinates } from '../controllers/map.controller.js';
import { getDistanceAndTime } from '../controllers/map.controller.js';
import {query} from 'express-validator';
import { getAutoCompleteSuggestions } from '../controllers/map.controller.js';


const router = Router();

router.get('/get-coordinates', query('address').isString().isLength({min:3}),authUser, getCoordinates);

router.get('/get-distance-time',query('origin').isString().isLength({min:3}),query('destination').isString().isLength({min:3}),authUser,getDistanceAndTime);


router.get('/get-suggestions',
    query('input').isString().isLength({ min: 3 }),
    authUser,
    getAutoCompleteSuggestions
);


export default router;