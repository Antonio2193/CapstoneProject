import GoogleStrategy from 'passport-google-oauth20';
import user from '../models/userSchema.js';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

// Strategia Google per Passport
const googleStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK
}, async function (accessToken, refreshToken, profile, passportNext) {
    const { given_name: name, family_name: surname, email, sub: googleId, picture: avatar } = profile._json;
    
    try {
        // Cerca l'utente nel database
        let utente = await user.findOne({ googleId });

        // Se l'utente non esiste, creane uno nuovo
        if (!utente) {
            const newUser = new user({
                googleId,
                name,
                surname,
                email, 
                avatar
            });
            utente = await newUser.save();
        }

        // Crea il token JWT con l'ID utente e l'avatar
        jwt.sign(
            { userId: utente.id, avatar: utente.avatar }, // Includi anche l'avatar
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, jwtToken) => {
                if (err) {
                    console.error("Errore nella creazione del token:", err);
                    return passportNext(err); // Passa l'errore a passportNext
                }
                // Passa l'utente e il token a passportNext
                return passportNext(null, { jwtToken, avatar: utente.avatar });
            }
        );
    } catch (error) {
        console.error("Errore durante l'autenticazione:", error);
        return passportNext(error); // Gestione dell'errore
    }
});

export default googleStrategy;
