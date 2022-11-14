import { v4 as uuidv4 } from 'uuid';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { HttpError } from '../models/http-error.js';
import { User } from '../models/user.js';

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

    const { name, email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email })
    } catch (err) {
        return next(new HttpError('Signup failed, please try again later', 500));
    }

    if (existingUser) {
        return next(new HttpError('User exists already, please login instead', 422));
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        return next(new HttpError('Could not create user, server error', 500));
    }

    const newUser = new User({
        name,
        email,
        image: req.file.path,
        password: hashedPassword,
        places: []
    });

    try {
        await newUser.save();
    } catch (err) {
        return next(new HttpError('Signing up user failed, please try again', 500));
    }

    let token;
    try {
        token = jwt.sign(
            { userId: newUser.id, email: newUser.email },
            'super-secret-do-not-share', 
            { expiresIn: '1h'}
        );
    } catch (err) {
        return next(new HttpError('Sign in failed', 500));
    }

    res.status(201).json({ 
        userId: newUser.id, 
        email: newUser.email,
        token: token,
    });
};

const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email })
    } catch (err) {
        return next(new HttpError('Login failed, please try again later', 500));
    }

    if (!existingUser) {
        return next(new HttpError('Invalid credentials', 403));
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
        return next(new HttpError('Could not login', 500));
    }

    if (!isValidPassword) {
        return next(new HttpError('Invalid credentials, could not login', 403));
    }

    let token;
    try {
        token = jwt.sign(
            { userId: existingUser.id, email: existingUser.email },
            'super-secret-do-not-share', 
            { expiresIn: '1h'}
        );
    } catch (err) {
        return next(new HttpError('Could not login, check credentials'));
    }

    res.status(200).json({ 
            userId: existingUser.id, 
            email: existingUser.email,
            token: token,
    });
}


export { getUsers, signupUser, loginUser };