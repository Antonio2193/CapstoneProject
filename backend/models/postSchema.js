import { model, Schema } from "mongoose";

const postSchema = new Schema ({
    category: {
        type: String,
        required: true
    },
   /*  title: {
        type: String,
        required: true
    }, */
    cover: {
        type: String,
    },
    content : {
        type: String,
        required: true
    },
    author : {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
},
{collection: 'posts'})

export default model('Post', postSchema)