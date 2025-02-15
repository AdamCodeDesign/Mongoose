import * as fs from "fs";

function processPropsForTemplate(propsForTemplate, template) {
    if (!propsForTemplate) return template;

    for (let [key, value] of Object.entries(propsForTemplate)) {
        key = `{{${key}}}`;
        template = template.replaceAll(key, value);
    }
    return template;
}

export function render(path, response, propsForTemplate) {
    try {
        const data = fs.readFileSync(path, "utf-8");
        const modifiedTemplate = processPropsForTemplate(
            propsForTemplate,
            data,
        );
        response.write(modifiedTemplate);
    } catch (error) {
        response.writeHead(404);
        response.write("File not found");
    }
}

export function taskListHtml(tasks) {
    if (!tasks) return "Error: No tasks for template";

    let html = "";

    for (const task of tasks) {
        console.log(task.title);
        html += task.title + "<br>";
    }
    return html
}
