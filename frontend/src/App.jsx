import React, { useState } from "react";
import useTasks from "./hooks/useTasks";
import TaskList from "./components/TaskList";
import "./App.css";

function App() {
  const { tasks, addTask, isLoading, error } = useTasks();
  const [newTask, setNewTask] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    await addTask(newTask);
    setNewTask("");
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
        />
        <button type="submit">Add Task</button>
      </form>
      <TaskList tasks={tasks} />
    </div>
  );
}

export default App;
