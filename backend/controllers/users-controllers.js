import { v4 as uuidv4 } from 'uuid';
import { HttpError } from '../models/http-error.js';
import { validationResult } from 'express-validator';

const DUMMY_USERS = [
    {
        id: 'u1',
        name: 'darth vader',
        email: 'test@test.com',
        password: 'testers',
    },
    {
        id: 'u2',
        name: 'han solo',
        email: 'test@test.com',
        password: 'testers',
    }
]

const getUsers = (req, res, next) => {
    res.json({users: DUMMY_USERS});
};

const createUser = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError('Invalid user data'));
    }

    const { name, email, password } = req.body;

    const hasUser = DUMMY_USERS.find(u => u.email === email);
    if (hasUser) {
        return next(new HttpError('Could not add user, email already exists!', 401));
    }

    const newUser = {
        id: uuidv4(),
        name: name,
        email: email,
        password: password
    }

    DUMMY_USERS.push(newUser);

    res.status(201).json({ user: newUser })
};

const loginUser = (req, res, next) => {
    const { email, password } = req.body;

    const identifiedUser = DUMMY_USERS.find(u => u.email === email);
    if (!identifiedUser) {
        return next(new HttpError('Could not identify user', 401));
    }
    if (identifiedUser.password !== password) {
        return next(new HttpError('Invalid password', 401));
    }

    res.status(200).json({ message: req.body.id + ' logged in!'})
}


export { getUsers, createUser, loginUser };