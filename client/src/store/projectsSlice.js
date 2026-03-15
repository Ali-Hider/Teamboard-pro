import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProjects, createProject, updateProject, deleteProject } from "../api/projects";

// Async thunks — each one calls the api layer and returns the result
export const fetchProjects = createAsyncThunk(
  "projects/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      const res = await getProjects(params);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch projects");
    }
  }
);

export const addProject = createAsyncThunk(
  "projects/add",
  async (data, { rejectWithValue }) => {
    try {
      const res = await createProject(data);
      return res.data.project;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create project");
    }
  }
);

export const editProject = createAsyncThunk(
  "projects/edit",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await updateProject(id, data);
      return res.data.project;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update project");
    }
  }
);

export const removeProject = createAsyncThunk(
  "projects/remove",
  async (id, { rejectWithValue }) => {
    try {
      await deleteProject(id);
      return id; // return the id so we know which one to remove from state
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete project");
    }
  }
);

const projectsSlice = createSlice({
  name: "projects",
  initialState: {
    items: [],          // the list of projects
    total: 0,
    totalPages: 0,
    page: 1,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.projects;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.page = action.payload.page;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add
      .addCase(addProject.fulfilled, (state, action) => {
        state.items.unshift(action.payload); // add to top of list
      })

      // Edit
      .addCase(editProject.fulfilled, (state, action) => {
        const index = state.items.findIndex(p => p._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
      })

      // Remove
      .addCase(removeProject.fulfilled, (state, action) => {
        state.items = state.items.filter(p => p._id !== action.payload);
      });
  },
});

export default projectsSlice.reducer;