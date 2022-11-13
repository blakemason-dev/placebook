import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

import { placesRouter } from './routes/places-routes.js';
import { usersRouter } from './routes/users-routes.js';
import { HttpError } from './models/http-error.js';

const mongo_uri = 'mongodb+srv://blake:firstMongo@cluster0.ojqrl9n.mongodb.net/placebook?retryWrites=true&w=majority';

const app = express();

app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
});

app.use('/', (req, res, next) => {
    console.log(req.method, req.originalUrl);
    next();
});

app.use('/api/places', placesRouter);
app.use('/api/users', usersRouter);

app.use((req, res, next) => {
    next(new HttpError('Could not find this route', 404));

});

app.use((error, req, res, next) => {
    if (req.file) {
        fs.unlink(req.file.path, (err) => {
            console.log(err);
        });
    }
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message: error.message || 'An unknown error occurred!'});
});

mongoose
    .connect(mongo_uri)
    .then(() => {
        app.listen(5000);
    })
    .catch(err => {
        console.log(err);
    });
