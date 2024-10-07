import { model, Schema } from 'mongoose';

const userLibrarySchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    animeId: {
        type: Schema.Types.ObjectId,
        ref: 'Anime',
    },
    mangaId: {
        type: Schema.Types.ObjectId,
        ref: 'Manga',
    },
    type: { 
        type: String, 
        enum: ['anime', 'manga'], 
        required: true 
    },
    isPrivate: { 
        type: Boolean, 
        default: false // Questo campo determina la privacy
    }
});

export default model('UserLibrary', userLibrarySchema);
