import { v4 as uuidv4 } from 'uuid';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';

import { HttpError } from "../models/http-error.js";
import { getCoordsForAddress } from '../util/location.js';
import { Place } from '../models/place.js';
import { User } from '../models/user.js';


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

    let userWithPlaces;
    try {
        userWithPlaces = await User.findById(userId).populate('places');
    } catch (err) {
        return next(new HttpError('Fetching place(s) from database failed for provided user', 500));
    }

    if (!userWithPlaces || userWithPlaces.places.length === 0) {
        return next(new HttpError('Could not find place(s) for the provided user id', 404));
    }

    res.json({ places: userWithPlaces.places.map(p => p.toObject({ getters: true })) })
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

    let user;
    try {
        user = await User.findById(creator);
    } catch (err) {
        return next(new HttpError('Could not find user for provided id', 500));
    }

    if (!user) {
        return next(new HttpError('Provided user does not exist', 404));
    }

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await createdPlace.save({ session: session });
        user.places.push(createdPlace);
        await user.save({ session: session });
        await session.commitTransaction();
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
        place = await Place.findById(placeId).populate('creator');
    } catch (err) {
        return next(new HttpError('Database could not find place to delete', 500));
    }

    if (!place) {
        return next(new HttpError('Could not find place for this id', 404));
    }

    try {
        const sesh = await mongoose.startSession();
        sesh.startTransaction();
        await place.remove({ session: sesh });
        place.creator.places.pull(place);
        await place.creator.save({ session: sesh });
        await sesh.commitTransaction();
    } catch (err) {
        console.log(err);
        return next(new HttpError('Database could not delete place', 500));
    }

    res.status(200).json({message: "Place deleted " + placeId})
}

export { getPlaceById, getPlacesByUserId, createPlace, updatePlace, deletePlace };