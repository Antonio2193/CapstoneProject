import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import passport from 'passport';

const server = express();
const port = process.env.PORT || 5000;


await mongoose
    .connect(process.env.MONGODB_CONNECTION)
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch((err) => {
        console.log(err)
    })



server.use(express.json()) // middleware che ci dice che tutti i body che inviama sono in json
server.use(cors()) // per connettere BE al FE
server.use(morgan('dev')) //middleware che mostra tutti i log delle richieste
server.use(helmet()) //middleware che ci da la sicurezza per il BE


server.listen(port, () => {
    console.log(`Server running on port ${port}`)
})