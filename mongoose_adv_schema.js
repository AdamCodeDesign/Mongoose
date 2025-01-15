//zaawansowwany schemat

import mongoose from "mongoose";

const url = "mongodb://127.0.0.1:27017/mongooseAdvSchema";
mongoose.connect(url);

const gameSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
    maxLength: 128,
  },
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
  ratings: [
    // oceny gry przez uzytkownikow
    {
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
      },
      created: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  platforms: {
    type: [String], //['pc', 'psx' itd]
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});

gameSchema.methods.getAverageRating = function () {
  if (!this.ratings) return null;

  let ratingsSum = 0;
  for (const r of this.ratings) ratingsSum += r.rating;

  this.averageRating = (ratingsSum / this.ratings.length).toFixed(2);
  return this.averageRating;
};

const Game = mongoose.model("Game", gameSchema);

const driver = new Game({
  _id: new mongoose.Types.ObjectId(),
  title: "Driver",
  published: true,
  releaseDate: new Date(1999, 5, 25),
  ratings: [{ rating: 8.3 }, { rating: 7.2 }, { rating: 7.9 }, { rating: 8.0 }],
  platforms: ["PSX", "PC", "IOS", "MAC"],
});

let driverFromDb = await Game.findOne({ title: "Driver" });

if (!driverFromDb) {
  driverFromDb = await driver.save();
  if (driverFromDb) console.log("New game saved to db");
}

console.log(driverFromDb.getAverageRating());
