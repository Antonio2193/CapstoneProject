import { model, Schema } from "mongoose";

const  commentSchema = new Schema ({
    content: {
        type: String,
        minLenght: 2,
        maxLenght: 300,
        required: true,
        trim: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
    },
    author : {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
},
{collection: 'comments',
    timestamps: true
})

export default model('Comment', commentSchema)