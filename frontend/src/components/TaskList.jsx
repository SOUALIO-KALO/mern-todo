import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleTaskAsync, deleteTaskAsync } from "../store/tasksSlice";

function TaskList() {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.list);

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
          <span className="task-title">{task.title}</span>
          <div className="task-actions">
            <button
              onClick={() =>
                dispatch(
                  toggleTaskAsync({ id: task._id, completed: !task.completed })
                )
              }
              className="complete-button"
            >
              {task.completed ? "Undo" : "Complete"}
            </button>
            <button
              onClick={() => dispatch(deleteTaskAsync(task._id))}
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
