import { v4 as uuidv4 } from 'uuid';
import { validationResult } from 'express-validator';

import { HttpError } from '../models/http-error.js';
import { User } from '../models/user.js';

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

const getUsers = async (req, res, next) => {
    let allUsers;
    try {
        allUsers = await User.find({}, '-password');
    } catch (err) {
        return next(new HttpError('Database failed to get all users', 500));
    }

    res.json({users: allUsers.map(u => u.toObject({ getters: true }))});
};

const signupUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid user data'));
    }

    const { name, email, password, places } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email })
    } catch (err) {
        return next(new HttpError('Signup failed, please try again later', 500));
    }

    if (existingUser) {
        return next(new HttpError('User exists already, please login instead', 422));
    }

    const newUser = new User({
        name,
        email,
        image: 'https://dragonball.guru/wp-content/uploads/2021/03/majin-buu-happy.jpg',
        password, // SERIOUS SECURITY ISSUE, NEEDS TO BE ENCRYPTED
        places
    });

    try {
        await newUser.save();
    } catch (err) {
        return next(new HttpError('Signing up user failed, please try again', 500));
    }

    res.status(201).json({ user: newUser.toObject({ getters: true }) })
};

const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email })
    } catch (err) {
        return next(new HttpError('Login failed, please try again later', 500));
    }

    if (!existingUser || existingUser.password !== password) {
        return next(new HttpError('Invalid credentials', 401));
    }

    res.status(200).json({ message: existingUser.email + ' logged in!'})
}


export { getUsers, signupUser, loginUser };