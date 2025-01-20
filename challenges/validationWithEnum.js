/*  
    Zadanie:
    1. Napisz schemat reprezentujący pociąg z polami:
       - name - String z validacją wymagającą aby w nazwie było słowo "Train"
       - trip to obiekt z dwoma właściwościami from i to, oba to łańcuchy
         znaków, dodaj do obu enum wskazujący na tablicę z kilkoma polskimi
         miastami
       - passengers to tablica obiektów opisujących pasażerów z polami
         name i surname 
       - created - data dodania rekordu
    2. Stwórz jeden pociąg z kilkoma pasażerami, zvaliduj dane i pokaż
       ewentualne błędy w konsoli. Skasuj wszystkie pociągi w bazie,
       dodaj nowy rekord do bazy
*/

import mongoose from "mongoose";
const url = "mongodb://127.0.0.1:27017/trainSchema";

mongoose.connect(url);

const cities = ["New York", "Washington", "Boston", "San Francisco"];

const trainSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
    trim: true,
    validate: {
        validator:function(name){
            return name.indexOf("Train") >=0
        }
    }
  },
  trip: {
    from: {
      type: String,
      required: true,
      trim: true,
      enum: cities,
    },
    to: {
      type: String,
      required: true,
      trim: true,
      enum: cities,
    },
  },
  passengers: [
    {
      name: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 32,
      },
      surname: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 32,
      },
    },
  ],
  created: {
    type: Date,
    default: Date.now,
  },
});

const Train = mongoose.model("Train", trainSchema);

const train1 = new Train({
  _id: new mongoose.Types.ObjectId(),
  name: "Speed Train",
  trip: { from: "Washington", to: "San Francisco" },
  passengers: [
    { name: "John", surname: "Smith" },
    { name: "Tom", surname: "Walker" },
    { name: "Bill", surname: "Pullman" },
    { name: "Jake", surname: "Strong" },
  ],
});


try {
  train1.validate();
  await Train.deleteMany({});
  const trainDB = await train1.save();

  console.log("Data saved");
} catch (error) {
  console.log(error);
} finally {
  await mongoose.disconnect();
}
