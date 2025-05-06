import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, addTaskAsync } from "./store/tasksSlice";
import TaskList from "./components/TaskList";
import "./App.css";

function App() {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.tasks);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    await dispatch(addTaskAsync({ title: newTask }));
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
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          Add Task
        </button>
      </form>
      <TaskList />
    </div>
  );
}

export default App;
