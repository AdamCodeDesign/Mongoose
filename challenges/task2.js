/*
    1. Połącz się z bazą trainingdb z mongoose
    2. Stwórz schemat opisujący książkę z polami: title - String, published - Boolean,
       releaseDate - Date, author to obiekt z dwoma właściwościami typu String tzn name i surname,
       ratings - [ {rating, created - Date } ], editions - [String], created - Date, updated - Date
    3. Dodaj metodę getAverageRating() do modelu aby obliczyć średnią ocenę książki
    4. Napisz w modelu metodę getAuthor() która zwróci imię i nazwisko jako jeden łańcuch znaków
    5. Stwórz jedną instancję książki z modelem Book, jeśli książki o danyn tytule 
       nie ma w bazie to zapisz ją do mongodb. Pokaż średnią ocenę książki oraz jej autora
*/

import mongoose from "mongoose";

const url = "mongodb://127.0.0.1:27017/booksDb";

mongoose.connect(url);

const bookSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { type: String, required: true, trim: true },
  published: {
    type: Boolean,
    required: true,
    default: false,
  },
  releaseDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  author: {
    name: String,
    surname: String,
  },
  ratings: [
    {
      rating: { type: Number, required: true, min: 1, max: 10 },
      created: { type: Date, default: Date.now },
    },
  ],
  editions: [String],
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});

bookSchema.methods.getAverageRating = function () {
  if (!this.ratings) return null;

  let ratingsSum = 0;
  for (const r of this.ratings) ratingsSum += r.rating;
  this.averageRating = (ratingsSum / this.ratings.length).toFixed(2);
  return this.averageRating;
};

bookSchema.methods.getAuthor = function () {
  this.AuthorName = `${this.author.name} ${this.author.surname}`;
  return this.AuthorName;
};

const Book = mongoose.model("Book", bookSchema);
const GoT = new Book({
  _id: new mongoose.Types.ObjectId(),
  title: "Game of thrones - A Clash of Kings",
  published: true,
  releaseDate: new Date(1996, 8, 1),
  author: {
    name: "George R.R.",
    surname: "Martin",
  },
  ratings: [
    { rating: 8.5 },
    { rating: 8.9 },
    { rating: 9.5 },
    { rating: 9.1 },
    { rating: 8.1 },
  ],
  editions: ["1st Edition", "Special Edition", "Limited Edition"],
});

let bookFromDb = await Book.findOne({
  title: "Game of thrones - A Clash of Kings",
});

if (!bookFromDb) {
  bookFromDb = await GoT.save();
  if (bookFromDb) console.log("New book saved to db");
} else console.log("Book already exist in db");

console.log(bookFromDb.getAverageRating());
console.log(bookFromDb.getAuthor());
