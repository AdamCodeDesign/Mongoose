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
