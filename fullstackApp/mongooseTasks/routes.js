import * as url from "url";
import * as Task from "./models/taskModel.js";
import { TasksController } from "./controllers/tasksController.js";
import {
    serveStaticFile,
    getPostData,
    serveJsonObj,
} from "./util/serverHelper.js";
import * as HtmlRenderer from "./util/htmlRenderer.js";

const tasksController = new TasksController();

export async function handleRequest(req, res) {
    const path = new URL(req.url, `http://${req.headers.host}`).pathname;
    console.log("req.url", req.url);
    console.log("path", path);

    if (req.url === "/" && req.method === "GET") {
        const tasks = await Task.getAll();
        const props = {
            title: "Lista zadań",
            heading: "Lista zadań",
            tasksHtml: HtmlRenderer.taskListHtml(tasks),
        };

        HtmlRenderer.render("./static/index.html", res, props);
        res.end();
    } else if (req.url === "/api/tasks" && req.method === "GET") {
        const tasksData = await tasksController.getAll();
        serveJsonObj(res, tasksData);
    } else if (
        req.url.match(/\/api\/task\/([a-z0-9]+)/) &&
        req.method === "GET"
    ) {
        const id = req.url.split("/")[3];
        const taskData = await tasksController.getById(id);
        serveJsonObj(res, taskData);

    } else {
        serveStaticFile(req, res);
    }
}
