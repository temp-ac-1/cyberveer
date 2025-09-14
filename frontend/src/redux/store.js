import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice.js";
import categoriesSlice from "./categoriesSlice.js";
import quizzesReducer from "./quizzesSlice";
import lessonsReducer from "./lessonsSlice";
import progressReducer from "./progressSlice";
import subcategoriesReducer from "./subcategoriesSlice";
import blogReducer from "./blogSlice";

import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "cyberveer-root",
  version: 1,
  storage,
};

const rootReducer = combineReducers({
    auth: authSlice,
    category: categoriesSlice,
    subcategory: subcategoriesReducer,
    quizzes: quizzesReducer,
    lessons: lessonsReducer,
    progress: progressReducer,
    blogs: blogReducer,  
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
