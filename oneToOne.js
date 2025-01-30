import mongoose from "mongoose";

const url = "mongodb://127.0.0.1:27017/oneToOne";

mongoose.connect(url);

const TV = mongoose.model(
  "Tv",
  new mongoose.Schema({
    brand: String,
    model: String,
    size: Number,
  })
);

const Remote = mongoose.model(
  "Remote",
  new mongoose.Schema({
    brand: String,
    tv: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tv",
    },
  })
);

await TV.deleteMany({});
await Remote.deleteMany({});

const svd = new TV({
  brand: "SVD",
  model: "RLCD",
  size: 32,
});

const tvDB = await svd.save();
console.log(tvDB);

const svdRemote = new Remote({
  brand: "svd",
  tv: tvDB._id.toString(),
});
console.log(svdRemote);

const remoteControlDB = await svdRemote.save();

const remoteDB = await Remote.find({}).populate("tv");
console.log(remoteDB);

const remoteDB2 = await Remote.find({}).populate("tv", "-__v");
console.log(remoteDB2);

const remoteDB3 = await Remote.find({}).populate("tv", "-__v").select("-__v");
console.log(remoteDB3);