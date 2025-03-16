// File: postsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const postsSlice = createSlice({
  name: 'posts',
  initialState: { posts: [] }, // Initial state
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload; // Set posts list
    },
    addPost: (state, action) => {
      state.posts.push(action.payload); // Add a new post
    },
    removePost: (state, action) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload); // Remove post by ID
    },
  },
});

export const { setPosts, addPost, removePost } = postsSlice.actions; // Export actions
export default postsSlice.reducer; // Export reducer
