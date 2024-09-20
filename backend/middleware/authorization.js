import jwt from "jsonwebtoken";
import user from "../models/userSchema.js";

export default async (req, res, next) => {
    // Verificare se c'è l'header Authorization e se è di tipo Bearer
    if (!req.headers.authorization) {
        return res.status(401).send("Unauthorized");
    }
    
    const parts = req.headers.authorization.split(' ');
    if (parts.length !== 2) {
        return res.status(401).send("Unauthorized");
    }
    
    if (parts[0] !== 'Bearer') {
        return res.status(401).send("Unauthorized");
    }

    const jwtToken = parts[1];

    // Verifica la firma del token
    jwt.verify(jwtToken, process.env.JWT_SECRET, async (err, payload) => {
        // Errore: probabilmente il token è stato manomesso o scaduto
        if (err) {
            return res.status(401).send("Unauthorized");
        }

        try {
            // Recuperiamo i dati dell'utente dal database escludendo il campo password
            const utente = await user.findById(payload.userId).select("-password"); // Escludi il campo password
            
            // L'utente potrebbe aver eliminato l'account nel frattempo
            if (!utente) {
                return res.status(401).send("Unauthorized");
            }

            // Aggiungiamo i dati dell'utente loggato all'oggetto req
            req.loggedUser = utente;
            console.log(utente);

            // Continua l'esecuzione del middleware successivo
            next();
        } catch (error) {
            // Gestisci eventuali errori di connessione al database
            return res.status(500).send("Server Error");
        }
    });
}