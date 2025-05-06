import React from "react";
import useTasks from "../hooks/useTasks";

function TaskList({ tasks }) {
  const { toggleTask, deleteTask } = useTasks();

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div
          key={task._id}
          className={`task ${task.completed ? "completed" : ""}`}
        >
          <input
            type="checkbox"
            checked={task.completed}
            disabled
            className="task-checkbox"
          />
          <p className="task-title">{task.title}</p>
          <div className="task-actions">
            <button
              onClick={() => toggleTask(task._id, task.completed)}
              className="complete-button"
            >
              {task.completed ? "Undo" : "Complete"}
            </button>
            <button
              onClick={() => deleteTask(task._id)}
              className="delete-button"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TaskList;
