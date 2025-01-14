import mongoose from "mongoose";

const url = "mongodb://127.0.0.1:27017/mongoosetest";
mongoose.connect(url);

// ponizej schemat ktory musi byc sztywny, szablonowy i jest to wymagane

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  firstName: String,
  lastName: String,
  address: {
    street: String,
    city: {
      type: String,
    },
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

//teraz na podstawie schemantu tworzymy model

const TestUser = mongoose.model("TestUser", userSchema);

const testUser1 = new TestUser({
  _id: new mongoose.Types.ObjectId(),
  firstName: "Adam",
  lastName: "Leszczyk",
  address: {
    street: "Kajdasza",
    city: "Wroclaw",
  },
});

await testUser1.save();

const userDb = await TestUser.findOne({});
console.log(userDb);

await mongoose.disconnect();
