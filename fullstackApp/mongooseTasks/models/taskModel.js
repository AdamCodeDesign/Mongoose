import mongoose from "mongoose";

const url = "mongodb://127.0.0.1:27017/mongooseFullstackApp";

mongoose.connect(url);

const taskSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        maxLength: 256,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        maxLength: 10000,
    },
    status: {
        type: String,
        required: true,
        enum: ["Not started", "In progress", "On hold", "Completed"],
        default: "Not started",
    },
    created: {
        type: Date,
        default: Date.now,
    },
});

const Task = mongoose.model("Task", taskSchema);

// const task1 = await Task.create({
//     _id: new mongoose.Types.ObjectId(),
//     title: "task #1",
//     description: "zrob zadanie 1",
// });
