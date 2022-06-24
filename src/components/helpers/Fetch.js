import { Task } from "./TaskClass";

// Data base connection
const dataBase = {
    domain: "stasks.metalevel.tech",
    port: "48004",
    uri: "api/tasks",
    protocol: "https",
    get fqdn() {
        // const url = `${this.protocol}://${this.domain}/${this.uri}:${this.port}`;
        const url = `/${this.uri}`;
        return url;
    }
}


// GET all tasks from DataBase
async function getTasksListFromDataBase(tasks = []) {
    const request = {
        url: `${dataBase.fqdn}`,
        init: { method: "GET" }
    };

    return fetch(request.url, request.init)
        .then(response => {
            if (response.ok) return response.json();
            throw new Error(`Network response was not ok: ${response.status}`);
        })
        .then(data => {
            data.forEach(taskData => {
                const task = new Task(taskData);

                task.state.isNewTask = false;
                task.state.isLocked = true;
                task.state.toSave = false;

                tasks.push(task);
            });

            return tasks;
        })
        .catch(error => { console.log(`Trouble at tasks list get: ${error}`); });
}

// DELETE existing task
async function removeSingleTaskFromDataBase(task) {
    const request = {
        url: `${dataBase.fqdn}/${task.data.id}`,
        init: { method: "DELETE" }
    };

    return fetch(request.url, request.init)
        .then(response => {
            if (response.ok) return response.json();
            throw new Error(`${response.status} This task doesn't exist in the DataBase.`);
        })
        .catch(error => { console.log(`Trouble at task delete: ${error}`); });
}


// POST new task, PUT existing task
async function saveSingleTaskToDataBase(task) {
    const request = {
        url: `${dataBase.fqdn}`,
        init: { headers: { "Content-Type": "application/json" } }
    };

    if (task.state.isNewTask) {
        delete task.data.id; // Let the DataBase generate the Id.
        request.init.method = "POST";
        request.init.body = JSON.stringify(task.data);
    } else {
        request.url += `/${task.data.id}` // Add the Id to the URL.
        request.init.method = "PUT";
        request.init.body = JSON.stringify(task.data);
    }

    const updatedTask = { ...task };

    return fetch(request.url, request.init)
        .then(response => {
            if (response.ok) return response.json();
            throw new Error(`Network response was not ok: ${response.status}`);
        })
        .then(data => {
            // This is temporal value to display, because we don't send the task 
            // back to the server, but we update the task in the state.
            // Normally we want the user to see the the placeholder message
            // and enter its own title. Probably we should dismiss tasks without title.
            data.title = data.title ? data.title : `id: ${data.id}`;

            updatedTask.data = data;
            updatedTask.state.toRemove = false;
            updatedTask.state.toSave = false;
            updatedTask.state.isNewTask = false;

            return updatedTask;
        })
        .catch(error => { console.log(`Trouble at task save: ${error}`); });
}

// GET single task from DataBase
async function getSingleTaskFromDataBase(task) {
    const request = {
        url: `${dataBase.fqdn}/${task.data.id}`,
        init: { method: "GET" }
    };

    return fetch(request.url, request.init)
        .then(response => {
            if (response.ok) return response.json();
            throw new Error(`Network response was not ok: ${response.status}`);
        })
        .catch(error => { console.log(`Trouble at task get: ${error}`); });
}


export {
    getTasksListFromDataBase as getTasksListDB,
    removeSingleTaskFromDataBase as removeTaskDB,
    saveSingleTaskToDataBase as saveTaskDB,
    getSingleTaskFromDataBase as getTaskDB
};