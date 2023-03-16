import React from "react";
import DashboardNew from "./Component/Dashboard";
import Login from "./Component/Login";
import Error404 from "./Component/Error404";
import PrivateRoute from "./PrivateRoute";
import { AuthProvider } from "./Context/AuthContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <Router forceRefresh>
      <AuthProvider>
        <div className="App">
          <Switch>
            <PrivateRoute exact path="/" component={DashboardNew} />
            <PrivateRoute exact path="/dashboard" component={DashboardNew} />
            <PrivateRoute exact path="/dashboard/*" component={DashboardNew} />
            <Route exact path="/login" component={Login} />
            <Route path="/*" component={Error404} />
          </Switch>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
