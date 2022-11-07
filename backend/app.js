import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import { placesRouter } from './routes/places-routes.js';
import { usersRouter } from './routes/users-routes.js';
import { HttpError } from './models/http-error.js';

const mongo_uri = 'mongodb+srv://blake:firstMongo@cluster0.ojqrl9n.mongodb.net/places?retryWrites=true&w=majority';

const app = express();

app.use(bodyParser.json());

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
