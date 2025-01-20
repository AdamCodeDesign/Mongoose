/* 
    1. Napisz schemat opisujący fundację z wolontariuszami. Fundacja ma następujące pola:
       - name - String z walidacją gdzie w nazwie musi pojawić się słowo "Foundation"
       - address to obiekt z właściwościami street, city i country. miasto ma walidacje sprawdzającą
         czy jest jednym z kilku zapisanych w tablicy, użyj includes() na tablicy.
       - created - data dodania rekordu, domyślnie aktualny czas
       - volunteers - to tablica obiektów wolontariuszy. Każdy z obiektów posiada pola name,
                      surname, created oraz email (walidacja wymaga posiadania przez łańcuch @),
                      facebook (validacja wymaga aby adres zaczynał się z https://www.facebook.com)
       Pamiętaj aby do każdego pola dodać dokładny opis wymaganegu typu, czy jest required itd,
       do walidowanych pól dodaj również message mówiący jakie dane sa wymagane dla pola
    2. Napisz funkcję genRandVolunteer() która zwróci losowego wolontariusza jako obiekt
    3. Stwórz nową fundację o nazwie np: "Dev Foundation", podaj dowolny adres, a w tablicy zapisz
       minimum trzech wolontariuszy wykorzystując funkcję genRandVolunteer()
    4. Dokonaj validacji danych z użyciem validateSync(), pokaż zwrócone błędy dla nazwy fundacji
    5. Zrób walidację z wykorzystaniem metody validate() na instancji fundacji i pokaż ewentualne
       błędy w konsoli
    6. Skasuj wszystkie fundacje z bazy, zapisz utworzoną fundację do mongodb, w zwróconym
       rekordzie zmień miasto i zapisz ponownie rekord wykorzystując save()
*/

import mongoose from "mongoose";

const url = "mongodb://127.0.0.1:27017/foundationDB";
mongoose.connect(url);

const cities = ["Wrocław", "Kraków", "Wałbrzych"];

const foundationSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
    maxLength: 128,
    validate: {
      validator: function (text) {
        return text.indexOf("Foundation") >= 0;
      },
      message: "Name of foundation must includes Foundation",
    },
  },
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
      validate: {
        validator: function (city) {
          return cities.includes(city);
        },
        message: "City must be one of the cities in array:" + cities.join(","),
      },
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
  },
  created: {
    type: Date,
    default: Date.now,
  },
  volunteers: [
    {
      name: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 32,
      },
      surname: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 128,
      },
      email: {
        type: String,
        required: true,
        trim: true,
        validate: {
          validator: function (email) {
            return email.indexOf("@") > 0;
          },
          message: "Insert correct email, must includes @ sign",
        },
      },
      facebook: {
        type: String,
        required: false,
        trim: true,
        validate: {
          validator: function (facebook) {
            return facebook.indexOf("https://www.facebook.com") >= 0;
          },
          message:
            "Insert correct facebook account link, must start with https://www.facebook.com",
        },
      },
      created: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

function getRandomElFromArr(arr) {
  return arr[Math.floor(Math.random() * arr.length)].toLowerCase();
}

function genRandomVolunteer() {
  const namesArr = ["Adam", "Joanna", "Mike", "Jacob"];
  const surnameArr = ["White", "Kowalski", "Niemczyk", "Walker"];
  const name = getRandomElFromArr(namesArr);
  const surname = getRandomElFromArr(surnameArr);
  const userFullName = `${name}.${surname}`;

  return {
    name: name,
    surname: surname,
    email: userFullName + "@gmail.com",
    facebook: "https://www.facebook.com" + userFullName,
  };
}

const Foundation = mongoose.model("Fundation", foundationSchema);

const foundation1 = new Foundation({
  _id: new mongoose.Types.ObjectId(),
  name: "Dev Foundation",
  address: {
    street: "Kajdasza",
    city: "Dzyn",
    country: "Poland",
  },
  volunteers: [
    genRandomVolunteer(),
    genRandomVolunteer(),
    genRandomVolunteer(),
    genRandomVolunteer(),
  ],
});

const validationsErrors = foundation1.validateSync();
// console.log(validationsErrors);

if (validationsErrors && validationsErrors.errors["name"]) {
  console.log("error msg", validationsErrors.errors["name"].message);
  console.log("error path", validationsErrors.errors["name"].path);
  console.log("error value", validationsErrors.errors["name"].value);
}

try {
  foundation1.validate();
  await Foundation.deleteMany({}); // czyścimy baze danych zeby ja zaktualizowac

  const foundationDb = await foundation1.save(); //ponownie zapisujemy nowa fundacje
  foundationDb.address.city = "Wrocław"; //zminiamy miasto na Walbrzych
  await foundationDb.save(); // i ponownie zapisujemy

  console.log("Data saved");
} catch (error) {
  console.log(error);
} finally {
  await mongoose.disconnect();
}
