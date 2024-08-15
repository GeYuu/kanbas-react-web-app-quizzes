import { configureStore } from "@reduxjs/toolkit";
import modulesReducer from "./Courses/Modules/reducer";
import assignmentsReducer from "./Courses/Assignments/reducer"; 
import accountReducer from "./Account/reducer";
import quizzesReducer from "./Courses/Quiz/reducer";
const store = configureStore({
  reducer: {
    modulesReducer, 
    assignments: assignmentsReducer, 
    accountReducer,
    quizzes: quizzesReducer,

  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
