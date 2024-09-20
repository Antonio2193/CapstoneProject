import GoogleStrategy from 'passport-google-oauth20';
import user from '../models/userSchema.js';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const googleStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK
}, async function (accessToken, refreshToken, profile, passportNext) {
    const {given_name: name, family_name: surname, email, sub: googleId ,picture: avatar} = profile._json;
    let utente = await user.findOne({ googleId });
    if (!utente) {
        const newUser = new user({
            googleId,
            name,
            surname,
            email, 
            avatar
        })
        utente = await newUser.save();
    }
    jwt.sign({ userId: utente.id }, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, jwtToken) => {
        if (err) return res.status(500).send();
        return passportNext(null, {jwtToken});
    })
})

export default googleStrategy
    