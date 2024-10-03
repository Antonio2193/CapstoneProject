import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import passport from 'passport';

import userRoute from './routes/userRoute.js';
import postRoute from './routes/postRoute.js';
import authenticationRouter from './routes/authenticationRoutes.js';
import libraryRoute from './routes/libraryRoute.js'; // Per la libreria generale (anime e manga)
import myLibraryRoute from './routes/myLibraryRoutes.js'; // Per la libreria personale dell'utente
import googleStrategy from './config/passport.config.js';
import authorization from './middleware/authorization.js';

const server = express();
const port = process.env.PORT || 5000;
passport.use('google', googleStrategy);

await mongoose
    .connect(process.env.MONGODB_CONNECTION)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.log(err);
    });

server.use(express.json()); // middleware per il body in JSON
server.use(cors()); // per connettere BE al FE
server.use(morgan('dev')); // middleware per loggare le richieste
server.use(helmet()); // sicurezza per il backend

server.use('/api/v1/users', authorization, userRoute);
server.use('/api/v1/blogPosts', authorization, postRoute);
server.use('/api/v1/auth', authenticationRouter);
server.use('/api/v1/library', authorization, libraryRoute); // Rotte per la libreria generale
server.use('/api/v1/library', authorization, myLibraryRoute); // Rotte per la libreria personale dell'utente

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
