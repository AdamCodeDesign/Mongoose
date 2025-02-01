import mongoose from "mongoose";

const url = "mongodb://127.0.0.1:27017/EmbeddingOneToOne";

mongoose.connect(url);

const cpu = new mongoose.Schema({
  brand: String,
  name: String,
  numCores: Number,
  speed: Number,
});

const CPU = mongoose.model("CPU", cpu);

const gpu = new mongoose.Schema({
  brand: String,
  name: String,
  ram: String,
});

const GPU = mongoose.model("GPU", gpu);

const motherBoard = new mongoose.Schema({
  brand: String,
  name: String,
});

const MTB = mongoose.model("MTB", motherBoard);

const ram = new mongoose.Schema({
  brand: String,
  name: String,
  size: Number,
});

const RAM = mongoose.model("RAM", ram);

const laptop = new mongoose.Schema({
  brand: String,
  name: String,
  cpu: cpu,
  gpu: gpu,
  motherBoard: motherBoard,
  ram: [ram, ram],
});

const Laptop = new mongoose.model("Laptop", laptop);

await Laptop.deleteMany({});

const cpu1 = new CPU({
  brand: "AMD",
  name: "Ryzen 5 5600",
  numCores: 6,
  speed: 3700,
});

const gpu1 = new GPU({
  brand: "AMD",
  name: "RX 6650XT",
  ram: "8Gb",
});

const motherBoard1 = new MTB({
  brand: "Asrock",
  name: "B450 Tomahawk II",
});

const ram1 = new RAM({
  brand: "Crucial",
  name: "DDR4",
  size: 8,
});

const laptop1 = new Laptop({
  brand: "Acer",
  name: "Predator",
  cpu: cpu1,
  gpu: gpu1,
  motherBoard: motherBoard1,
  ram: [ram1, ram1],
});

await laptop1.save();

const laptopDB = await Laptop.find({});

console.log(JSON.stringify(laptopDB, null, 4));
