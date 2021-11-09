import React from "react";
import { Route, IndexRoute, Redirect } from "react-router";
import CoreLayout from "../components/coreLayout"; //corelayout
import NonLoggedLayout from "../components/coreLayout/loginLayout"; //login page
import {
  RULES_ROUTE,
  RULES_EDITOR_ROUTE,
  BUILD_PATH,
} from "../constants/app.constants";
import { isLoggedIn } from "../components/utils/CheckLoginDetails";

const defaultRoutes = [
  { to: BUILD_PATH + "login" },
  { to: BUILD_PATH + "dashboard" },
  { to: BUILD_PATH + "myEntries" },
  { to: BUILD_PATH + "users" },
  { to: BUILD_PATH + "clients" },
  { to: BUILD_PATH + "holidays" },
  { to: BUILD_PATH + "reports" },
  { to: BUILD_PATH + "requisition" },
  { to: BUILD_PATH + "leave" },
  { to: BUILD_PATH + "user-profile" },
  { to: BUILD_PATH + "projects" },
  { to: BUILD_PATH + "project-tasks" },
  { to: BUILD_PATH + "project-subtasks" },
  { to: BUILD_PATH + "project-categories" },
  { to: BUILD_PATH + "project-sprints" },
  { to: BUILD_PATH + "project-technologies" },
  { to: BUILD_PATH + "project-teams" },
  { to: BUILD_PATH + "user-entries-report" },
  { to: BUILD_PATH + "summary-report" },
  { to: BUILD_PATH + "task-report" },
  { to: BUILD_PATH + "review-entries-report" },
  { to: BUILD_PATH + "reference-number-report" },
  { to: BUILD_PATH + "custom-report" },
  { to: BUILD_PATH + "management-report" },
  { to: BUILD_PATH + "defaulter-list" },
  { to: BUILD_PATH + "team-report" },
  { to: BUILD_PATH + "custom-report-new" },
  { to: BUILD_PATH + "monthly-rolling-report" },
  { to: BUILD_PATH + "balance-leaves" },
  { to: BUILD_PATH + "apply-leave" },
  { to: BUILD_PATH + "leave-applications" },
  { to: BUILD_PATH + "approved-leave" },
  { to: BUILD_PATH + "unapproved-leave" },
  { to: BUILD_PATH + "leave-management" },
  { to: BUILD_PATH + "approved-leave-applications" },
  { to: BUILD_PATH + "unapproved-leave-applications" },
  { to: BUILD_PATH + "applied-leaves" },
];

function getRoutes() {
  let routes = defaultRoutes;
  if (window.global && window.global.routes) {
    routes = window.global.routes;
  }
  return routes.map((r, i) => <Route path={r.to} key={`route${i}`} />);
}

export default function (store) {
  const requireLogin = (nextState, replace, cb) => {
    if (!isLoggedIn(nextState, store)) {
      replace("/" + BUILD_PATH + "login");
    }

    cb();
  };

  // TODO: enable after developement
  const requireAdminPrivileges = (nextState, replace, cb) => {
    cb();
  };

  const getNextPathName = () => window.localStorage.nextPathname || "/";
  return (
    <Route path="/">
      <Route path={"/" + BUILD_PATH + "login"} component={NonLoggedLayout} />

      {/* Routes requiring login */}
      <Route onEnter={requireLogin} component={CoreLayout}>
        <Redirect from="loggedIn" to={getNextPathName()} />
        <IndexRoute />
        {getRoutes()}
        <Route onEnter={requireAdminPrivileges} path={RULES_ROUTE} />
        <Route
          onEnter={requireAdminPrivileges}
          path={RULES_EDITOR_ROUTE}
          layoutPath="rule-edit"
        />
      </Route>

      {/* Catch all route */}
      <Redirect path="*" to="/" component={NonLoggedLayout} />
    </Route>
  );
}
