import { model, Schema } from "mongoose";

const postSchema = new Schema({
    category: {
        type: String,
        required: true
    },
    cover: {
        type: String,
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    likes: {
        count: { type: Number, default: 0 }, // Conteggio dei like
        userIds: { type: [Schema.Types.ObjectId], default: [] } // Array di ID utenti che hanno messo like
    }
},
{ 
    collection: 'posts',
    timestamps: true  // Aggiunto per tracciare createdAt e updatedAt
});

export default model('Post', postSchema);
