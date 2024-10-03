import { model, Schema } from 'mongoose';

const userLibrarySchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', required: true
    },
    animeId: {
        type: Schema.Types.ObjectId,
        ref: 'Anime'
    },
    mangaId: {
        type: Schema.Types.ObjectId,
        ref: 'Manga'
    },
    type: { type: String, enum: ['anime', 'manga'], required: true }, // Per distinguere tra anime e manga
});

export default model('UserLibrary', userLibrarySchema)