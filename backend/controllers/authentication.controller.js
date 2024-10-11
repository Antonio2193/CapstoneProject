import user from "../models/userSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import transport from "../services/mailService.js";


export const register = async (req, res) => {
    try {
        // Verifica che la mail non sia già registrata
        const utente = await user.findOne({ email: req.body.email });
        if (utente) return res.status(500).send("Email already exists");

        // Crea un nuovo utente
        const newUser = new user({
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 10),
            avatar: req.file ? req.file.path : "https://picsum.photos/40/",
            verifiedAt: new Date(),
        });

        const userCreated = await newUser.save();

        // Invia email di benvenuto
        await transport.sendMail({
            from: 'noreply@otakuworld.com', // indirizzo del mittente
            to: newUser.email, // indirizzo email del destinatario
            subject: "Benvenuto! Registrazione completata", // Oggetto della mail
            text: `Ciao ${newUser.name}, grazie per esserti registrato!`, // Corpo della mail in testo semplice
            html: `<b>Ciao ${newUser.name},</b><br>Grazie per esserti registrato su <i>OtakuWorld</i>!`, // Corpo della mail in HTML
        });

        // Risposta con l'utente creato
        res.status(201).send(userCreated);
    } catch (error) {
        console.log(error);
        res.status(500).send("Si è verificato un errore durante la registrazione.");
    }

}


export const login = async (req, res) => {
    //cercare la mail nel db
    const utente = await user.findOne({ email: req.body.email }).select("+password"); //la select mi fa prendere la password dal db
    // se non trova la mail 
    if (!utente) return res.status(401).send("Invalid email or password");
    // se trova la mail allora controllo la password
    if (!(await bcrypt.compare(req.body.password, utente.password))) {
        return res.status(401).send("Invalid email or password");
    }

    // se la password coincide allora genero il jwt e lo restituisco
    jwt.sign(
        { userId: utente.id, avatar: utente.avatar },
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
        (err, jwtToken) => {
            if (err) return res.status(500).send();
            return res.send({
                token: jwtToken
            });
        })

}

export const me = async(req,res) =>{
    return res.send(req.loggedUser)
}


export const callbackGoogle = async (req, res) =>{
    res.redirect(`http://localhost:3000?token=${req.user.jwtToken}&avatar=${req.user.avatar}`)
}