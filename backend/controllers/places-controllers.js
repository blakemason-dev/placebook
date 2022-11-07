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

const getPlaceById = (req, res, next) => {
    const placeId = req.params.pid;
    const place = DUMMY_PLACES.find(p => {
        return p.id === placeId;
    });

    if (!place) {
        return next(new HttpError('Could not find a place for the provided place id', 404));
    }

    res.json({ place: place });
}

const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.uid;
    const places = DUMMY_PLACES.filter(p => p.creator === userId);

    if (!places || places.length === 0) {
        return next(new HttpError('Could not find places for the provided user id', 404));
    }

    res.json({ places: places })
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
        image: 'https://dragonball.guru/wp-content/uploads/2021/03/majin-buu-happy.jpg',
        creator
    });

    // const createdPlace = {
    //     id: uuidv4(),
    //     title: title,
    //     description: description,
    //     location: coordinates,
    //     address: address,
    //     creator: creator,
    // }

    DUMMY_PLACES.push(createdPlace);

    res.status(201).json({place: createdPlace});
}

const updatePlace = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data', 422));
    }

    const { title, description, coordinates, address, creator } = req.body;
    const placeId = req.params.pid;

    const updatedPlace = { ...DUMMY_PLACES.find(p => p.id === placeId)}; // grab a copy
    const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);

    if (placeIndex < 0) {
        return next(new HttpError('Cannot update non-existant place', 404));
    }

    updatedPlace.title = title ? title : DUMMY_PLACES[placeIndex].title;
    updatedPlace.description = description ? description : DUMMY_PLACES[placeIndex].description;
    updatedPlace.coordinates = coordinates ? coordinates : DUMMY_PLACES[placeIndex].coordinates;
    updatedPlace.address = address ? address : DUMMY_PLACES[placeIndex].address;
    updatedPlace.creator = creator ? creator : DUMMY_PLACES[placeIndex].creator;

    DUMMY_PLACES[placeIndex] = updatedPlace;
    res.status(200).json({place: updatedPlace});
}

const deletePlace = (req, res, next) => {
    const placeId = req.params.pid;
    const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);

    if (placeIndex < 0) {
        return next(new HttpError('Cannot delete non-existant place', 404));
    }

    DUMMY_PLACES.splice(placeIndex, 1);
    res.status(200).json({message: "Place deleted " + placeId})
}

export { getPlaceById, getPlacesByUserId, createPlace, updatePlace, deletePlace };