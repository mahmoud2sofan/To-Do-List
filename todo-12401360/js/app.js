// File: js/app.js
// Student: Mahmoud Sofan (12401360)
// JavaScrip To-Do List App

const STUDENTID = "12401360";
const APIKEY = "nYs43u5f1oGK9";
const APIBASE = "https://portal.almasar101.com/assignment/api";

const taskFormm = document.getElementById("task-form");
const taskInpt = document.getElementById("task-input");
const stautsDiv = document.getElementById("status");
const taskLsit = document.getElementById("task-list");

function setStatus(msg, isErr = false) {
    stautsDiv.textContent = msg || "";
    stautsDiv.style.color = isErr ? "#d9363e" : "#666";
}

async function loadTasks() {
    setStatus("Loading tasks...");
    try {
        const res = await fetch(`${APIBASE}/get.php?stdid=${STUDENTID}&key=${APIKEY}`);
        const data = await res.json();
        taskLsit.innerHTML = "";
        if (data.tasks && data.tasks.length > 0) {
            data.tasks.forEach(task => addTaskToDOM(task));
        }
        setStatus("Tasks loaded.");
    } catch (err) {
        setStatus("Error loading tasks.", true);
    }
}

function addTaskToDOM(task) {
    const li = document.createElement("li");
    li.className = "task-item";

    const span = document.createElement("span");
    span.textContent = task.title;
    span.className = "task-title";

    const btn = document.createElement("button");
    btn.textContent = "Delete";
    btn.className = "task-delete";

    btn.addEventListener("click", async () => {
        if (!confirm("Delete this task?")) return;
        try {
            await fetch(`${APIBASE}/delete.php?stdid=${STUDENTID}&key=${APIKEY}&id=${task.id}`);
            li.remove();
            setStatus("Task deleted.");
        } catch (err) {
            setStatus("Error deleting task.", true);
        }
    });

    li.appendChild(span);
    li.appendChild(btn);
    taskLsit.appendChild(li);
}

if (taskFormm) {
    taskFormm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const title = taskInpt.value.trim();
        if (!title) {
            setStatus("Enter a task.", true);
            return;
        }
        setStatus("Adding task...");
        try {
            const res = await fetch(`${APIBASE}/add.php?stdid=${STUDENTID}&key=${APIKEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title })
            });
            const data = await res.json();
            if (data.task) {
                addTaskToDOM(data.task);
                taskInpt.value = "";
                setStatus("Task added.");
            }
        } catch (err) {
            setStatus("Error adding task.", true);
        }
    });
}

document.addEventListener("DOMContentLoaded", loadTasks);
