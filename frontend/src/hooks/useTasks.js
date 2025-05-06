import { useState, useEffect } from "react";
import axios from "axios";

export default function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/tasks`);
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch tasks");
      console.error("Fetch tasks error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async (title) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/tasks`,
        {
          title,
        }
      );
      setTasks((prevTasks) => [...prevTasks, response.data]);
      setError(null);
    } catch (err) {
      setError("Failed to add task");
      console.error("Add task error:", err);
    }
  };

  const toggleTask = async (id, completed) => {
    try {
      // Mise à jour optimiste
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id ? { ...task, completed: !completed } : task
        )
      );
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/tasks/${id}`,
        {
          completed: !completed,
        }
      );
      // Synchronisation avec la réponse du serveur
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === id ? response.data : task))
      );
      setError(null);
    } catch (err) {
      setError("Failed to update task");
      console.error("Toggle task error:", err);
      fetchTasks(); // Recharger en cas d'erreur
    }
  };

  const deleteTask = async (id) => {
    try {
      // Mise à jour optimiste
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
      await axios.delete(`${import.meta.env.VITE_API_URL}/tasks/${id}`);
      setError(null);
    } catch (err) {
      setError("Failed to delete task");
      console.error("Delete task error:", err);
      fetchTasks(); // Recharger en cas d'erreur
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return { tasks, addTask, toggleTask, deleteTask, isLoading, error };
}
