import * as Task from "../models/taskModel.js"

export class TasksController{
    constructor(){
        this.init()
    }

    async init(){
        //this.tasks = await Task.getAll()
    }

    async getAll(){
        return await Task.getAll()
    }
}