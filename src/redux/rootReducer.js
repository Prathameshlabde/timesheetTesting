import { combineReducers } from "redux";
import { routerReducer as router } from "react-router-redux";
import component from "./reducer/component";
import data from "./reducer/data";
import projects from "./reducer/projects";
import sprints from "./reducer/sprints";
import tasks from "./reducer/tasks";
import subTasks from "./reducer/subTasks";
import report from "./reducer/report";
import weekBar from "./reducer/weekBar";
import login from "./reducer/login";
import client from "./reducer/client";
import categories from "./reducer/categories";
import users from "./reducer/users";
export default combineReducers({
  router,
  component,
  data,
  projects,
  sprints,
  tasks,
  subTasks,
  report,
  weekBar,
  login,
  client,
  categories,
  users
});
