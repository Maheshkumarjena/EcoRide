import express, { query } from 'express';
import { Router } from 'express';
import { getMapData } from '../controllers/map.controller';
import { authUser } from '../middlewares/auth.middleware';
import { getCoordinates } from '../controllers/map.controller';
import { getDistanceTime } from '../services/map.service';
const router = Router();

router.get('/get-coordinates', query('address').isString().isLength({min:3}),authUser, getCoordinates);

router.get('/get-distance-time',query('origin').isString().isLength({min:3}),query('destination').isString().isLength({min:3}),authUser,getDistanceTime);


router.get('/get-suggestions',
    query('input').isString().isLength({ min: 3 }),
    authUser,
    getAutoCompleteSuggestions
);


export default router;