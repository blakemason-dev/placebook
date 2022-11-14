import express from 'express';
import { check } from 'express-validator';

import * as placesControllers from '../controllers/places-controllers.js';
import { fileUpload } from '../middleware/file-upload.js';
import { checkAuth } from '../middleware/check-auth.js';

const router = express.Router();

router.get('/user/:uid', placesControllers.getPlacesByUserId);

router.get('/:pid', placesControllers.getPlaceById);

router.use(checkAuth);

router.post(
    '/',
    fileUpload.single('image'),
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