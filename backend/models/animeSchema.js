import { model, Schema } from "mongoose";

const animeSchema = new Schema ({
    title:{
        type: String,
        required: true
    },
    cover: {
        type: String,
    },
    episodes : {
        type: String,
        required: true
    },
    producer : {
        type: String
    },
    startDate : {
        type: Date
    },
    endDate : {
        type: Date
    }
},
{collection: 'anime'
})

export default model('Anime', animeSchema)