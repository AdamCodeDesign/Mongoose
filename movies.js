import mongoose from "mongoose";

const url = "mongodb://127.0.0.1:27017/movies";
mongoose.connect(url);

const movieSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, // dlaczego tutaj podaje _id a w pozostalych schema nie podaje?
    title: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        maxLength: 128,
    },
    premiere: {
        type: Date,
        default: Date.now,
    },
    director: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Person",
    },
    writers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Person",
        },
    ],
    actors: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Person",
        },
    ],
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    created: {
        type: Date,
        default: Date.now,
    },
});

const Movie = mongoose.model("Movie", movieSchema);

const personSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        maxLength: 16,
    },
    surname: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        maxLength: 32,
    },
    movieActor: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Movie",
        },
    ],
    movieDirector: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Movie",
        },
    ],
    movieWriter: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Movie",
        },
    ],
    created: {
        type: Date,
        default: Date.now,
    },
});

const Person = mongoose.model("Person", personSchema);

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        maxLength: 16,
    },
    surname: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        maxLength: 32,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        maxLength: 128,
        unique: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, //wyrazenie regularne ktore sprawdza czy mail jest wpisany poprawnie
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    created: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model("User", userSchema);

const reviewSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
    },
    body: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        maxLength: 2000,
    },
    score: {
        type: Number,
        validate: {
            validator: function (score) {
                return score >= 1 && score <= 10;
            },
            message: "Score must be between 1 and 10",
        },
    },
});
