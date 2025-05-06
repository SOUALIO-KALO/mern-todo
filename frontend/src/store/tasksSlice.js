import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Action asynchrone pour charger les tâches
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/tasks`);
  return response.data;
});

// Action asynchrone pour ajouter une tâche
export const addTaskAsync = createAsyncThunk(
  "tasks/addTaskAsync",
  async (task, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/tasks`,
        task
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add task");
    }
  }
);

// Action asynchrone pour basculer l'état d'une tâche
export const toggleTaskAsync = createAsyncThunk(
  "tasks/toggleTaskAsync",
  async ({ id, completed }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/tasks/${id}`,
        { completed }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update task");
    }
  }
);

// Action asynchrone pour supprimer une tâche
export const deleteTaskAsync = createAsyncThunk(
  "tasks/deleteTaskAsync",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/tasks/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete task");
    }
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    list: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    toggleTask: {
      reducer: (state, action) => {
        const task = state.list.find((t) => t._id === action.payload.id);
        if (task) {
          task.completed = action.payload.completed;
        }
      },
      prepare: (id, completed) => ({
        payload: { id, completed },
      }),
    },
    deleteTask: {
      reducer: (state, action) => {
        state.list = state.list.filter((t) => t._id !== action.payload);
      },
      prepare: (id) => ({
        payload: id,
      }),
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchTasks
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch tasks";
      });

    // addTaskAsync
    builder
      .addCase(addTaskAsync.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
        // Mise à jour optimiste avec un _id temporaire
        state.list.push({
          ...action.meta.arg,
          _id: `temp-${Date.now()}`,
        });
      })
      .addCase(addTaskAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        // Supprimer la tâche temporaire
        state.list = state.list.filter((t) => !t._id.startsWith("temp-"));
        // Ajouter la tâche réelle
        state.list.push(action.payload);
      })
      .addCase(addTaskAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to add task";
        // Supprimer la tâche temporaire
        state.list = state.list.filter((t) => !t._id.startsWith("temp-"));
      });

    // toggleTaskAsync
    builder
      .addCase(toggleTaskAsync.pending, (state, action) => {
        const task = state.list.find((t) => t._id === action.meta.arg.id);
        if (task) {
          task.completed = action.meta.arg.completed;
        }
      })
      .addCase(toggleTaskAsync.fulfilled, (state, action) => {
        const index = state.list.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(toggleTaskAsync.rejected, (state, action) => {
        state.error = action.payload || "Failed to update task";
        // Revertir la mise à jour optimiste
        const task = state.list.find((t) => t._id === action.meta.arg.id);
        if (task) {
          task.completed = !action.meta.arg.completed;
        }
      });

    // deleteTaskAsync
    builder
      .addCase(deleteTaskAsync.pending, (state, action) => {
        state.list = state.list.filter((t) => t._id !== action.meta.arg);
      })
      .addCase(deleteTaskAsync.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(deleteTaskAsync.rejected, (state, action) => {
        state.error = action.payload || "Failed to delete task";
        // Re-fetch tasks to sync state
        state.isLoading = true;
      });
  },
});

export const { toggleTask, deleteTask, clearError } = tasksSlice.actions;
export default tasksSlice.reducer;
