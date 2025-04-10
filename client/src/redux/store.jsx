import { configureStore } from "@reduxjs/toolkit";
import coordinateReducer from "./slice";

const store = configureStore({
  reducer: {
    coordinate: coordinateReducer,
  },
});

export default store;
