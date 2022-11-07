import { v4 as uuidv4 } from 'uuid';
import { validationResult } from 'express-validator';

import { HttpError } from "../models/http-error.js";
import { getCoordsForAddress } from '../util/location.js';
import { Place } from '../models/place.js';

const DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: "Big ol Building",
        location: {
            lat: 40.7484474,
            lng: -73.9871516
        },
        address: '20 W 34th St, New york, NY 10001',
        creator: 'u1'
    },
    {
        id: 'p2',
        title: 'The Great Pyramid of Giza',
        description: "Big ol Ancient Building",
        location: {
            lat: 29.975743052936597,
            lng: 31.13311750000001
        },
        address: 'Somewhere in the desert',
        creator: 'u1'
    }
]

const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid;
    
    let place;
    try {
        place = await Place.findById(placeId);
    } catch {
        return next(new HttpError('Could not find place', 500));
    }

    if (!place) {
        return next(new HttpError('Could not find a place for the provided place id', 404));
    }

    res.json({ place: place.toObject( { getters: true }) });
}

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    let places;
    try {
        places = await Place.find({ creator: userId });
    } catch (err) {
        return next(new HttpError('Fetching place(s) from database failed for provided user', 500));
    }

    if (!places || places.length === 0) {
        return next(new HttpError('Could not find place(s) for the provided user id', 404));
    }

    res.json({ places: places.map(p => p.toObject({ getters: true })) })
}

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data', 422));
    }

    const { title, description, address, creator } = req.body;

    let coordinates;
    try {
        coordinates = await getCoordsForAddress(address);
    } catch (error) {
        return next(error);
    }

    const createdPlace = new Place({
        title,
        description,
        address,
        location: coordinates,
        image: 'https://static.wikia.nocookie.net/dragonball/images/5/55/CellGamesArena.jpg',
        creator
    });

    try {
        await createdPlace.save();
    } catch (err) {
        return next(new HttpError('Creating place failed, please try again', 500));
    }

    res.status(201).json({place: createdPlace});
}

const updatePlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data', 422));
    }

    const { title, description } = req.body;
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId);
    } catch (err) {
        return next(new HttpError('Could not fetch place in database', 500));
    }

    place.title = title;
    place.description = description;

    try {
        await place.save();
    } catch (err) {
        return next(new HttpError('Could not update place in database', 500));
    }

    res.status(200).json({place: place.toObject({ getters: true })});
}

const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid;
    
    let place;
    try {
        place = await Place.findById(placeId);
    } catch (err) {
        return next(new HttpError('Database could not find place to delete', 500));
    }

    try {
       await place.remove();
    } catch (err) {
        return next(new HttpError('Database could not delete place', 500));
    }

    res.status(200).json({message: "Place deleted " + placeId})
}

export { getPlaceById, getPlacesByUserId, createPlace, updatePlace, deletePlace };