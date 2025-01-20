/*  crud_challenge.js
    07.1 Mongoose - operacje CRUD - zadanie     c30ch28m07.1 
    Zadanie z CRUD w Mongoose
    1. Zrób schemat opisujący budynek z nastepującymi polami: obiekt address (z street, city, 
       postalCode z validacją z obowiązkowym znakiem '-', country), kolor budynku jako enum z tablicy
       kolorów, floorsNum - liczbowa ilość pięter z validacją z zakresu od 0 do max 50, created,
       residents - tablica mieszkańców z polami: name, surname i floorNum (validacja >= 0 i < 50)
    2. Stwórz kilka budynków z kilkoma mieszkańcami
    3. Skasuj jeden rekord z floorsNum o wartości 3. Skasuj wszystkie inne rekordy
    4. Zapisz pierwszy budynek z metodą save() przypisując zwracany obiekt z bazy do building1Db. 
       Zapisz tablicę 2 budynków z metodą insertMany(). Wyszukaj w bazie budynek po building1Db._id
       Wyszukaj jeden budynek z 3-ma piętrami używając findOne(), zmień kolor na "white" i zapisz.
       Zaktualizuj kolor budynku na "black" ze względu z building1Db._id z findOneAndUpdate()
       Skasuj budynek z findByIdAndDelete() używając building1Db._id
*/

import mongoose from "mongoose";

const url = "mongodb://127.0.0.1:27017/buildingSchema";

mongoose.connect(url);

const buildingSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  address: {
    street: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    postCode: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (code) {
          return code.indexOf("-") >= 2;
        },
        message: 'Postcode must have "-" sign',
      },
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
  },
  color: {
    type: String,
    required: true,
    trim: true,
    enum: ["red", "white", "green", "blue", "black"],
  },
  floorsNum: {
    type: Number,
    required: true,
    trim: true,
    min: 0,
    max: 50,
  },
  residents: [
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      surname: {
        type: String,
        required: true,
        trim: true,
      },
      floorNum: {
        type: Number,
        required: true,
        trim: true,
        validate: {
          validator: function (floor) {
            return floor >= 0 && floor < 50;
          },
          message: "Insert correct floor number",
        },
      },
    },
  ],
  created: {
    type: Date,
    default: Date.now,
  },
});

const Building = mongoose.model("Building", buildingSchema);

const building1 = new Building({
  _id: new mongoose.Types.ObjectId(),
  address: {
    street: "Braking Bad Str.",
    city: "Albuquerque",
    postCode: "ts-234",
    country: "USA",
  },
  color: "green",
  floorsNum: 40,
  residents: [
    { name: "Walter", surname: "White", floorNum: 18 },
    { name: "Mike", surname: "Black", floorNum: 33 },
    { name: "Wilma", surname: "Stone", floorNum: 27 },
    { name: "John", surname: "Wick", floorNum: 12 },
    { name: "Pitter", surname: "Jackson", floorNum: 42 },
  ],
});

const building2 = new Building({
  _id: new mongoose.Types.ObjectId(),
  address: {
    street: "Park Str.",
    city: "Chicago",
    postCode: "t5-2s4",
    country: "USA",
  },
  color: "blue",
  floorsNum: 3,
  residents: [
    { name: "George", surname: "Simps", floorNum: 18 },
    { name: "Mike", surname: "Tyson", floorNum: 33 },
    { name: "Luke", surname: "Stark", floorNum: 27 },
    { name: "Tommy", surname: "Wood", floorNum: 12 },
    { name: "Jack", surname: "Forest", floorNum: 42 },
  ],
});

const building3 = new Building({
  _id: new mongoose.Types.ObjectId(),
  address: {
    street: "Comedy Str.",
    city: "Boston",
    postCode: "rd-214",
    country: "USA",
  },
  color: "black",
  floorsNum: 45,
  residents: [
    { name: "Will", surname: "Smith", floorNum: 11 },
    { name: "Bob", surname: "Marley", floorNum: 33 },
    { name: "Tom", surname: "Cruise", floorNum: 23 },
    { name: "Jenifer", surname: "Anniston", floorNum: 43 },
    { name: "Penny", surname: "Dreadful", floorNum: 32 },
  ],
});

const building4 = new Building({
  _id: new mongoose.Types.ObjectId(),
  address: {
    street: "Melody Str.",
    city: "Miami",
    postCode: "dr-er4",
    country: "USA",
  },
  color: "red",
  floorsNum: 30,
  residents: [
    { name: "Lady", surname: "Gaga", floorNum: 18 },
    { name: "George", surname: "Michael", floorNum: 33 },
    { name: "Bob", surname: "Dylan", floorNum: 27 },
    { name: "Alan", surname: "Walker", floorNum: 12 },
    { name: "Hans", surname: "Zimmer", floorNum: 42 },
  ],
});

const buildingsArr = [building2, building3, building4];

try {
  await Building.deleteMany({});
} catch (error) {
  console.log(error.message);
} finally {
  await mongoose.disconnect();
}
