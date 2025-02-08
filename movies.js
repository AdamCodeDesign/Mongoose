import mongoose from "mongoose";

const url = "mongodb://127.0.0.1:27017/movies";
mongoose.connect(url);

const movieSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
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

const Review = mongoose.model("Review", reviewSchema);

await Person.deleteMany({});
await Movie.deleteMany({});
await User.deleteMany({});
await Review.deleteMany({});

const scorsese = await Person.create({
    _id: new mongoose.Types.ObjectId(),
    name: "Martin",
    surname: "Scorsese",
});

const stone = await Person.create({
    _id: new mongoose.Types.ObjectId(),
    name: "Sharon",
    surname: "Stone",
});

const deNiro = await Person.create({
    _id: new mongoose.Types.ObjectId(),
    name: "Robert",
    surname: "De Niro",
});

const pesci = await Person.create({
    _id: new mongoose.Types.ObjectId(),
    name: "Joe",
    surname: "Pesci",
});

const pileggi = await Person.create({
    _id: new mongoose.Types.ObjectId(),
    name: "Nicholas",
    surname: "Pileggi",
});

const casino = await Movie.create({
    _id: new mongoose.Types.ObjectId(),
    title: "Casino",
    premiere: new Date(1995, 4, 3),
    director: scorsese,
    actors: [stone, deNiro, pesci],
});

// $addToSet działa jak new Set, czyli usuwa duplikaty, wiec jesli juz w bazie jest taki rekord to go nie doda
async function connectMovieToActor(movie, person) {
    await Movie.findByIdAndUpdate(movie._id, {
        $addToSet: { actors: person._id },
    });

    await Person.findByIdAndUpdate(person._id, {
        $addToSet: { movieActor: movie._id },
    });
}

async function connectMovieToWriter(movie, person) {
    await Movie.findByIdAndUpdate(movie._id, {
        $addToSet: { writers: person._id },
    });

    await Person.findByIdAndUpdate(person._id, {
        $addToSet: { movieWriter: movie._id },
    });
}

await connectMovieToActor(casino, stone);
await connectMovieToActor(casino, deNiro);
await connectMovieToActor(casino, pesci);
await connectMovieToWriter(casino, pileggi);
await connectMovieToWriter(casino, scorsese);

const user1 = await User.create({
    name: "Joanna",
    surname: "Leszczyk",
    email: "j.leszczyk@example.com",
});

const review1 = await Review.create({
    user: user1,
    movie: casino,
    body: "Best movie i have ever seen",
    score: 10,
});

const user2 = await User.create({
    name: "Jimmy",
    surname: "Walker",
    email: "j.walker@example.com",
});

const review2 = await Review.create({
    user: user2,
    movie: casino,
    body: "good movie",
    score: 7.5,
});

async function connectMovieToReview(movie, review) {
    await Movie.findByIdAndUpdate(movie._id, {
        $addToSet: {
            reviews: review._id,
        },
    });
    await Review.findOneAndUpdate({ _id: review._id }, { movie: movie._id });
}

await connectMovieToReview(casino, review1);
await connectMovieToReview(casino, review2);

const movieDb = await Movie.find({}).populate([
    { path: "director" },
    { path: "actors" },
    { path: "writers" },
    { path: "reviews", populate: { path: "user" } },
]);

console.log(JSON.stringify(movieDb, null, 4));

const expandedMovies = movieDb.map((movie) => ({
    _id: movie._id,
    title: movie.title,
    premiere: movie.premiere,
    director: movie.director
        ? {
              _id: movie.director._id,
              name: movie.director.name,
              surname: movie.director.surname,
          }
        : null,
    actors: movie.actors.map((actor) => ({
        _id: actor._id,
        name: actor.name,
        surname: actor.surname,
    })),
    writers: movie.writers.map((writer) => ({
        _id: writer._id,
        name: writer.name,
        surname: writer.surname,
    })),
    reviews: movie.reviews.map((review) => ({
        _id: review._id,
        user: review.user
            ? {
                  _id: review.user._id,
                  name: review.user.name,
                  surname: review.user.surname,
              }
            : null,
        body: review.body,
        score: review.score,
    })),
}));

//aktualizacja wpisów w movies expanded
const bulkOps = expandedMovies.map((movie) => ({
    updateOne: {
        filter: { title: movie.title }, // Szuka filmu po title
        update: { $set: movie }, // Aktualizuje dane
        upsert: true, // Jeśli brak filmu, dodaje nowy
    },
}));

await mongoose.connection.db.collection("moviesExpanded").bulkWrite(bulkOps); // szybsze dla duzych baz danych zamiast insertMany bo tylko aktualizuje
console.log("Filmy zaktualizowane w 'moviesExpanded'.");
