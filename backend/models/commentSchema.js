import { model, Schema } from "mongoose";

const commentSchema = new Schema({
    content: {
        type: String,
        minLength: 2,
        maxLength: 300,
        required: true,
        trim: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User' // Verifica che il nome del modello User sia esattamente "User"
    },
}, {
    collection: 'comments',
    timestamps: true
});

export default model('Comment', commentSchema);