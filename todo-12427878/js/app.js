"use strict";

/*
  File: js/app.js
  Student Name: Leen Mahmoud
  Student ID: 12427878
*/

const STD_ID = "12427878";
const API_KEY = "nYs43u5f1oGK9";
const API_BASE = "https://portal.almasar101.com/assignment/api";

const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const statusDiv = document.getElementById("status");

function setStatus(message, isError = false) {
    statusDiv.textContent = message || "";
    statusDiv.style.color = isError ? "#d9363e" : "#666";
}

async function loadTasks() {
    try {
        setStatus("Loading tasks...");
        const url = `${API_BASE}/get.php?stdid=${encodeURIComponent(STD_ID)}&key=${encodeURIComponent(API_KEY)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to load tasks");
        const data = await res.json();
        taskList.innerHTML = "";
        data.tasks.forEach(task => appendTaskToList(task));
        setStatus("");
    } catch (err) {
        console.error(err);
        setStatus(err.message, true);
    }
}

form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const title = input.value.trim();
    if (!title) return;

    try {
        setStatus("Adding task...");
        const url = `${API_BASE}/add.php?stdid=${encodeURIComponent(STD_ID)}&key=${encodeURIComponent(API_KEY)}`;
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title })
        });
        if (!res.ok) throw new Error("Failed to add task");
        const data = await res.json();

        if (data.success) {
            appendTaskToList(data.task);
            input.value = "";
            setStatus("Task added successfully.");
        } else {
            throw new Error(data.message || "Error adding task");
        }
    } catch (err) {
        console.error(err);
        setStatus(err.message, true);
    }
});

function appendTaskToList(task) {
    const li = document.createElement("li");
    li.className = "task-item";

    const span = document.createElement("span");
    span.className = "task-title";
    span.textContent = task.title;

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const delBtn = document.createElement("button");
    delBtn.className = "task-delete";
    delBtn.textContent = "Delete";

    delBtn.addEventListener("click", function () {
        deleteTask(task.id, li);
    });

    actions.appendChild(delBtn);
    li.appendChild(span);
    li.appendChild(actions);
    taskList.appendChild(li);
}

async function deleteTask(id, liElement) {
    if (!confirm("Delete this task?")) return;

    try {
        setStatus("Deleting task...");
        const url = `${API_BASE}/delete.php?stdid=${encodeURIComponent(STD_ID)}&key=${encodeURIComponent(API_KEY)}&id=${encodeURIComponent(id)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to delete task");
        const data = await res.json();

        if (data.success) {
            liElement.remove();
            setStatus("Task deleted.");
        } else {
            throw new Error(data.message || "Error deleting task");
        }
    } catch (err) {
        console.error(err);
        setStatus(err.message, true);
    }
}

document.addEventListener("DOMContentLoaded", loadTasks);
