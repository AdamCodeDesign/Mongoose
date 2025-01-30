/*  
    Zadanie z relacją one to one
    1. Stwórz schemat opisujący adres paczki z polami: name, surname, street, postalCode (validacja
       z sprawdzeniem czy jest znak '-'), city z enum tablicy miast, created będący datą. 
    2. Napisz drugi schemat opisujący paczkę z polami: payment jako Number z validacją wartości > 0,
       sender z type ObjectId z referencją do Address, recipient też z type ObjectId i ref: Address,
       parcelHistory jako tablicę obiektów opisujących historię przesyłki z polami: message i date.
       Schemat paczki kończy się polem created z domyślną aktualną datą rekordu.
    3. Skasuj wszystkie rekordy adresów i paczek w bazie
    4. Stwórz adres nadawcy i odbiorcy paczki, zapisz oba do bazy
    5. Stwórz paczkę i dodaj referencję do zapisanych w bazie adresów, zapisz paczkę w bazie
    6. Odczytaj paczkę z bazy, pamiętaj że w celu połaczenia danych z różnych kolekcji wywołaj
       populate i to dwa razy czyli .populate("sender").populate("recipient")
*/

import mongoose from "mongoose";

const url = "mongodb://127.0.0.1:27017/oneToOneTask";

mongoose.connect(url);

const cities = ["Chicago", "New York", "Boston", "Toronto"];

const Address = mongoose.model(
  "Address",
  new mongoose.Schema({
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
    street: {
      type: String,
      required: true,
      trim: true,
    },
    postalCode: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (code) {
          return code.indexOf("-") > 0;
        },
        message: 'PostalCode must have "-" sign',
      },
    },
    city: {
      type: String,
      required: true,
      trim: true,
      enum: cities,
    },
    created: {
      type: Date,
      default: Date.now,
    },
  })
);

const Parcel = mongoose.model(
  "Parcel",
  new mongoose.Schema({
    payment: {
      type: Number,
      validate: {
        validator: function (num) {
          return num > 0;
        },
        message: "Payment must be more than zero",
      },
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    parcelHistory: [
      { message: String, date: { type: Date, default: Date.now } },
    ],
    created: {
      type: Date,
      default: Date.now,
    },
  })
);

await Address.deleteMany({});
await Parcel.deleteMany({});

const senderAddress = new Address({
  name: "John",
  surname: "Wick",
  street: "Hide Str",
  postalCode: "12-G76",
  city: "Chicago",
});

const recipientAddress = new Address({
  name: "Jason",
  surname: "Bourne",
  street: "Long Str",
  postalCode: "67-7SG",
  city: "New York",
});

const senderAddressDb = await senderAddress.save();
const recipientAddressDb = await recipientAddress.save();

const parcel1 = new Parcel({
  payment: 120,
  sender: senderAddressDb._id,
  recipient: recipientAddressDb._id,
});

const parcel1Db = await parcel1.save();

const parcelsDB = await Parcel.find({})
  .populate("sender")
  .populate("recipient");

console.log("parcelsDB", JSON.stringify(parcelsDB, null, 4));
console.table(
  parcelsDB.map((p) => ({
    sender: `${p.sender.name} ${p.sender.surname}`,
    recipient: `${p.recipient.name} ${p.recipient.surname}`,
    payment: p.payment,
  }))
);
