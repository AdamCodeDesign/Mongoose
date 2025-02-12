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

function taskMaker(title, description) {
    return new Task({
        _id: new mongoose.Types.ObjectId(),
        title,
        description,
    });
}

const tasksArr = [
    taskMaker("task #1", "description to task #1"),
    taskMaker("task #2", "description to task #2"),
    taskMaker("task #3", "description to task #3"),
    taskMaker("task #4", "description to task #4"),
];

try {
    const tasksDb = await Task.find({});
    console.log("Num of tasks in db: ", tasksDb.length);

    if (tasksDb.length === 0) {
        await Task.insertMany(tasksArr)
            .then((result) => {
                console.log("Tasks saved to db, num of tasks: ", result.length);
            })
            .catch((err) =>
                console.error("Tasks NOT SAVED in db", err.message),
            );
    }
} catch (error) {
    console.log("error", error.message);
}

export async function getAll() {
    return await Task.find();
}

export async function getById(_id) {
    return await Task.find({ _id });
}

export async function deleteById(_id) {
    return await Task.deleteById({ _id });
}
