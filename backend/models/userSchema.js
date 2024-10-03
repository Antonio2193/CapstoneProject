import { model, Schema } from 'mongoose';

const userSchema = new Schema({
    googleId: String,
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        select: false // Non viene mai selezionata la password
    },
    avatar: {
        type: String
    },
    verifiedAt: Date,
    verificationCode: String,
    myAnimeLibrary: [{ // Riferimento agli anime
        type: Schema.Types.ObjectId,
        ref: 'Anime'
    }],
    myMangaLibrary: [{ // Riferimento ai manga
        type: Schema.Types.ObjectId,
        ref: 'Manga'
    }]
}, { collection: "users", timestamps: true });

export default model('User', userSchema);
