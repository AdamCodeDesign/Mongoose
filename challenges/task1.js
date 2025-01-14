/* 
    Zadanie:
    1. Połącz się z bazą trainingdb przy pomocy mongoose
    2. Stwórz schemat opisujący komputer z polami: 
       brand, name, cpu, gpu - wszystkie jako łańuch znaków
       ram - obiekt z właściwościami slot1 i slot2 oraz np wartością 8gb 
       created - data utworzenia rekordu
    3. Utwórz model na bazie schematu
    4. Stwórz nowy komputer z modelem Computer i zapisz go do bazy,
       pobierz pierwszy komputer z bazy i wyświetl go w konsoli 
*/

import mongoose from "mongoose";

const url = "mongodb://127.0.0.1:27017/computersDB";
mongoose.connect(url);

const computerSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  brand: String,
  name: String,
  cpu: String,
  gpu: String,
  ram: {
    slot1: String,
    slot2: String,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

const Computer = mongoose.model("Computer", computerSchema);

const computer1 = new Computer({
  _id: new mongoose.Types.ObjectId(),
  brand: "Apple",
  name: "MacBook Pro",
  cpu: "intel i7",
  gpu: "Radeon Pro 560X 4  GB",
  ram: {
    slot1: "DDR4 8gb",
    slot2: "DDR4 8gb",
  },
});
// await Computer.deleteOne({ brand: "Apple" });
await computer1.save();
await mongoose.disconnect();
