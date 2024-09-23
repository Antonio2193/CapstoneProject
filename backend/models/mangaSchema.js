import { model, Schema } from "mongoose";

const mangaSchema = new Schema ({
    title:{
        type: String,
        required: true
    },
    cover: {
        type: String,
    },
    chapters : {
        type: String,
        required: true
    },
    volumes : {
        type: String,
        required: true
    },
    author : {
        type: String
    },
    startDate : {
        type: Date
    },
    endDate : {
        type: Date
    }
},
{collection: 'manga'
})

export default model('Manga', mangaSchema)