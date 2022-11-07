import express from 'express';
import { check } from 'express-validator';

import * as placesControllers from '../controllers/places-controllers.js';

const router = express.Router();

router.get('/user/:uid', placesControllers.getPlacesByUserId);

router.get('/:pid', placesControllers.getPlaceById);

router.post('/', 
    [
        check('title').not().isEmpty(),
        check('description').isLength({min: 5}),
        check('address').not().isEmpty()
    ], 
    placesControllers.createPlace
);

router.patch('/:pid',
    [
        check('title').not().isEmpty(),
        check('description').isLength({min: 5}),
    ], 
    placesControllers.updatePlace
);

router.delete('/:pid', placesControllers.deletePlace);

export { router as placesRouter };